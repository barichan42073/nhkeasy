"""
Provider-agnostic structured-output LLM clients with built-in fallback support.

The rest of the pipeline only depends on `LLMClient.generate_structured`.
Choose a provider/model with a spec string such as:

    gemini/gemini-3.8-flash
    deepseek/deepseek-chat
    groq/<model-name>

or a comma-separated chain tried in order until one succeeds:

    gemini/gemini-3.8-flash,deepseek/deepseek-chat
"""

import copy
import json
import logging
import os
from typing import Protocol, TypeVar

import httpx
import openai
from google import genai
from google.genai import errors as genai_errors
from openai import AsyncOpenAI
from pydantic import BaseModel, ValidationError

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)

DEFAULT_PROVIDER = "gemini"

# Seconds to wait for one model reply before giving up on that request.
REQUEST_TIMEOUT_SECONDS = float(os.getenv("LLM_TIMEOUT_SECONDS", "120.0"))

# Default fallback chain: Gemini first, falling back to DeepSeek
DEFAULT_FALLBACK_CHAIN = [
    "gemini/gemini-3.8-flash",
    "deepseek/deepseek-chat",
]

# Errors that mean "this provider couldn't produce a valid answer", so the
# next provider in the chain should be tried. Anything else (TypeError,
# KeyError, AttributeError...) is treated as a bug and propagates immediately.
#   openai.APIError      - DeepSeek/Groq HTTP, connection and timeout errors
#   genai_errors.APIError - Gemini HTTP errors (4xx/5xx, quota)
#   httpx.HTTPError      - transport errors/timeouts the SDKs don't wrap
#   TimeoutError         - asyncio timeouts
#   ValueError           - invalid/empty model output (includes ValidationError)
FALLBACK_ERRORS: tuple[type[BaseException], ...] = (
    openai.APIError,
    genai_errors.APIError,
    httpx.HTTPError,
    TimeoutError,
    ValueError,
)

# key_env: conventional env var name
# base_url: present only for OpenAI-compatible providers
PROVIDERS: dict[str, dict[str, str]] = {
    "gemini": {"key_env": "GEMINI_API_KEY"},
    "deepseek": {
        "key_env": "DEEPSEEK_API_KEY",
        "base_url": "https://api.deepseek.com",
    },
    "groq": {
        "key_env": "GROQ_API_KEY",
        "base_url": "https://api.groq.com/openai/v1",
    },
}


class MissingAPIKeyError(ValueError):
    """Raised when a provider's API key env var is not set."""


def _mark_all_required(node):
    """
    Marks every property as required, recursively, in a JSON Schema dict.
    """
    if isinstance(node, dict):
        props = node.get("properties")
        if isinstance(props, dict):
            node["required"] = list(props)
        for value in node.values():
            _mark_all_required(value)
    elif isinstance(node, list):
        for value in node:
            _mark_all_required(value)


class LLMClient(Protocol):
    """Anything that can turn a prompt into a validated Pydantic object."""

    async def generate_structured(self, prompt: str, schema: type[T]) -> T: ...


class GeminiClient:
    """Native Gemini adapter (strict response_schema enforcement)."""

    def __init__(self, model: str, api_key: str, retries: int = 1):
        self.model = model
        self.retries = retries
        self.client = genai.Client(
            api_key=api_key,
            http_options={"timeout": int(REQUEST_TIMEOUT_SECONDS * 1000)},
        )

    async def generate_structured(self, prompt: str, schema: type[T]) -> T:
        for attempt in range(self.retries + 1):
            logger.info("Calling Gemini model '%s'...", self.model)
            response = await self.client.aio.models.generate_content(
                model=self.model,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": schema,
                },
            )

            usage = getattr(response, "usage_metadata", None)
            if usage:
                # Thinking models bill internal reasoning as thoughts_token_count,
                # which is part of the total but not of the completion count.
                logger.info(
                    "Gemini token usage: %d total (%d prompt, %d completion, "
                    "%d thinking).",
                    usage.total_token_count or 0,
                    usage.prompt_token_count or 0,
                    usage.candidates_token_count or 0,
                    getattr(usage, "thoughts_token_count", None) or 0,
                )

            try:
                if not response.text:
                    raise ValueError("Gemini API returned an empty response.")
                return schema.model_validate_json(response.text)
            except ValueError as exc:
                if attempt == self.retries:
                    logger.error("Gemini output still invalid after retries.")
                    raise
                logger.warning(
                    "Invalid Gemini output (attempt %d/%d), retrying: %s",
                    attempt + 1,
                    self.retries + 1,
                    exc,
                )

        raise RuntimeError("unreachable")  # pragma: no cover


class OpenAICompatClient:
    """Adapter for any OpenAI-protocol endpoint (DeepSeek, Groq, OpenAI...)."""

    def __init__(self, model: str, api_key: str, base_url: str, retries: int = 2):
        self.model = model
        self.retries = retries
        self.client = AsyncOpenAI(
            api_key=api_key, base_url=base_url, timeout=REQUEST_TIMEOUT_SECONDS
        )

    async def generate_structured(self, prompt: str, schema: type[T]) -> T:
        # Deepcopy prevents permanent mutation of the shared Pydantic schema cache
        schema_dict = copy.deepcopy(schema.model_json_schema())
        _mark_all_required(schema_dict)
        schema_json = json.dumps(schema_dict, ensure_ascii=False)
        messages = [
            {
                "role": "user",
                "content": (
                    f"{prompt}\n\n"
                    "Respond with a single JSON object that conforms to this "
                    f"JSON Schema:\n{schema_json}"
                ),
            }
        ]

        for attempt in range(self.retries + 1):
            logger.info(
                "Calling model '%s' (attempt %d/%d)...",
                self.model,
                attempt + 1,
                self.retries + 1,
            )
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                response_format={"type": "json_object"},
            )

            usage = getattr(response, "usage", None)
            if usage:
                logger.info(
                    "Token usage: %d total (%d prompt, %d completion).",
                    usage.total_tokens,
                    usage.prompt_tokens,
                    usage.completion_tokens,
                )

            text = response.choices[0].message.content or ""
            try:
                return schema.model_validate_json(text)
            except ValidationError as exc:
                if attempt == self.retries:
                    logger.error("Model output still invalid after retries.")
                    raise
                logger.warning("Invalid model output, retrying: %s", exc)
                messages += [
                    {"role": "assistant", "content": text},
                    {
                        "role": "user",
                        "content": (
                            f"That JSON failed validation:\n{exc}\n"
                            "Return the corrected JSON object only."
                        ),
                    },
                ]

        raise RuntimeError("unreachable")  # pragma: no cover


class FallbackClient:
    """Wraps multiple LLMClient instances and tries them in sequence."""

    def __init__(self, clients: list[LLMClient]):
        if not clients:
            raise ValueError("FallbackClient requires at least one client.")
        self.clients = clients

    async def generate_structured(self, prompt: str, schema: type[T]) -> T:
        total_clients = len(self.clients)
        for index, client in enumerate(self.clients):
            try:
                logger.info(
                    "Attempting generation with client %d/%d (%s '%s')...",
                    index + 1,
                    total_clients,
                    client.__class__.__name__,
                    getattr(client, "model", "?"),
                )
                return await client.generate_structured(prompt, schema)
            except FALLBACK_ERRORS as exc:
                # Only provider/output failures fall through to the next
                # client; programming errors propagate immediately.
                if index == total_clients - 1:
                    logger.error("All fallback clients failed. Raising final exception.")
                    raise
                logger.warning(
                    "Client %d/%d failed with %s: %s. Falling back to next client...",
                    index + 1,
                    total_clients,
                    type(exc).__name__,
                    exc,
                )

        raise RuntimeError("unreachable")  # pragma: no cover


def make_client(model_spec: str, api_key_env: str | None = None) -> LLMClient:
    provider, sep, model = model_spec.partition("/")
    if not sep:
        logger.warning(
            "Model spec '%s' has no provider prefix; assuming '%s/'.",
            model_spec,
            DEFAULT_PROVIDER,
        )
        provider, model = DEFAULT_PROVIDER, model_spec

    if provider not in PROVIDERS or not model:
        raise ValueError(
            f"Invalid model spec '{model_spec}'. Use <provider>/<model> "
            f"where provider is one of: {', '.join(PROVIDERS)}."
        )

    entry = PROVIDERS[provider]
    env_name = api_key_env or entry["key_env"]
    api_key = os.getenv(env_name)
    if not api_key:
        raise MissingAPIKeyError(
            f"{env_name} is not set in the environment or .env file."
        )

    if "base_url" in entry:
        return OpenAICompatClient(model, api_key, entry["base_url"])
    return GeminiClient(model, api_key)


def parse_model_chain(chain: str) -> list[str]:
    """
    Splits a comma-separated model chain such as
    "gemini/gemini-3.8-flash, deepseek/deepseek-chat" into a list of specs,
    in order. Whitespace and empty entries are ignored.
    """
    return [spec.strip() for spec in chain.split(",") if spec.strip()]


def make_fallback_client(
    model_specs: list[str] | None = None, api_key_env: str | None = None
) -> LLMClient:
    """
    Builds a FallbackClient using a specified list of models, or defaults
    to Gemini first, followed by DeepSeek.

    Specs whose API key is missing are skipped with a warning, so a missing
    backup key never breaks the primary. Invalid specs still raise.

    `api_key_env` overrides the key env var and is only allowed with a single
    spec, since one key cannot be valid for several providers.
    """
    specs = model_specs or DEFAULT_FALLBACK_CHAIN

    if api_key_env and len(specs) > 1:
        raise ValueError(
            "api_key_env can only be used with a single model spec; "
            f"got {len(specs)} specs. Set each provider's own key env var instead."
        )

    clients: list[LLMClient] = []
    missing: list[str] = []
    for spec in specs:
        try:
            clients.append(make_client(spec, api_key_env))
        except MissingAPIKeyError as exc:
            missing.append(f"{spec} ({exc})")
            logger.warning("Skipping '%s' in fallback chain: %s", spec, exc)

    if not clients:
        raise MissingAPIKeyError(
            "No usable model in fallback chain; missing API keys for: "
            + "; ".join(missing)
        )
    if len(clients) == 1:
        return clients[0]
    return FallbackClient(clients)
