"""
Provider-agnostic structured-output LLM clients.

The rest of the pipeline only depends on `LLMClient.generate_structured`.
Choose a provider/model with a spec string such as:

    gemini/gemini-3.8-flash
    deepseek/deepseek-chat
    groq/<model-name>

To add a provider that speaks the OpenAI protocol, add one entry to PROVIDERS.
To add a provider with its own protocol (e.g. Claude), write another adapter
class and branch on it in `make_client`.
"""

import json
import logging
import os
from typing import Protocol, TypeVar

from google import genai
from openai import AsyncOpenAI
from pydantic import BaseModel, ValidationError

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)

DEFAULT_PROVIDER = "gemini"

# Seconds to wait for one model reply before giving up on that request.
REQUEST_TIMEOUT_SECONDS = float(os.getenv("LLM_TIMEOUT_SECONDS", "120.0"))

# key_env: conventional env var name (overridable with --api-key-env)
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


def _mark_all_required(node):
    """
    Marks every property as required, recursively, in a JSON Schema dict.

    Pydantic omits fields that have defaults from "required", and models
    without strict schema enforcement (DeepSeek, Groq...) then tend to skip
    them (e.g. an empty surface_mapping). Gemini's strict mode always fills
    them, so this makes the prompt-based path behave the same. Pydantic
    validation itself is unchanged.
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
    """Native Gemini adapter (strict response_schema enforcement).

    Strict mode makes invalid output rare, but an empty or invalid reply is
    retried up to `retries` extra times (same request; Gemini has no
    conversational correction step here).
    """

    def __init__(self, model: str, api_key: str, retries: int = 1):
        self.model = model
        self.retries = retries
        # google-genai takes its HTTP timeout in milliseconds.
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
                logger.info(
                    "Gemini token usage: %d total (%d prompt, %d completion).",
                    usage.total_token_count,
                    usage.prompt_token_count,
                    usage.candidates_token_count,
                )

            try:
                if not response.text:
                    raise ValueError("Gemini API returned an empty response.")
                return schema.model_validate_json(response.text)
            except ValueError as exc:  # ValidationError is a ValueError
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
    """
    Adapter for any OpenAI-protocol endpoint (DeepSeek, Groq, OpenAI, Ollama...).

    These providers only guarantee "some JSON", so the schema is placed in the
    prompt and the reply is validated with Pydantic. On a validation failure the
    error is fed back to the model for up to `retries` extra attempts.
    """

    def __init__(self, model: str, api_key: str, base_url: str, retries: int = 2):
        self.model = model
        self.retries = retries
        # The SDK already retries connection errors, 429 and 5xx with backoff
        # (max_retries=2); the timeout stops one request hanging the run.
        self.client = AsyncOpenAI(
            api_key=api_key, base_url=base_url, timeout=REQUEST_TIMEOUT_SECONDS
        )

    async def generate_structured(self, prompt: str, schema: type[T]) -> T:
        schema_dict = schema.model_json_schema()
        _mark_all_required(schema_dict)
        schema_json = json.dumps(schema_dict, ensure_ascii=False)
        # JSON mode on these APIs requires the word "JSON" in the prompt.
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


def make_client(model_spec: str, api_key_env: str | None = None) -> LLMClient:
    """
    Builds an LLMClient from a 'provider/model' spec.

    `api_key_env` overrides which environment variable holds the key; by
    default the provider's conventional variable is used. Call load_dotenv()
    before this so values from .env are visible.
    """
    provider, sep, model = model_spec.partition("/")
    if not sep:
        # Backwards compatibility with the old bare "--model gemini-3.8-flash".
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
        raise ValueError(f"{env_name} is not set in the environment or .env file.")

    if "base_url" in entry:
        return OpenAICompatClient(model, api_key, entry["base_url"])
    return GeminiClient(model, api_key)
