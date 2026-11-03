"""
Provider-agnostic structured-output LLM clients with built-in fallback support.

The rest of the pipeline only depends on `LLMClient.generate_structured`.
Choose a provider/model with a spec string such as:

    gemini/gemini-3.8-flash
    deepseek/deepseek-flash
    groq/<model-name>

or a comma-separated chain tried in order until one succeeds:

    gemini/gemini-3.8-flash,deepseek/deepseek-flash

Failure handling, from the inside out:
  1. The SDK retries transport errors (connection, 408/429/5xx) a few times.
  2. The adapter retries invalid model output (validation errors) only.
  3. Each adapter call has a hard per-provider deadline covering 1 and 2.
  4. FallbackClient moves to the next provider, and benches providers that
     keep failing (circuit breaker) so a dead primary isn't retried on every
     article.
  5. `preflight()` runs once at startup: a model Gemini reports as 404 stops
     the run (OpenAI-compatible providers only warn if a model is unlisted),
     rejected credentials drop that model from the chain.
"""

import asyncio
import copy
import json
import logging
import math
import os
import re
import time
from dataclasses import dataclass
from enum import Enum, auto
from typing import Callable, Protocol, TypeVar

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

# Hard ceiling on one provider's handling of one article, covering SDK
# transport retries and validation retries together.
PROVIDER_BUDGET_SECONDS = float(os.getenv("LLM_PROVIDER_BUDGET_SECONDS", "300.0"))

# SDK-level transport retries (on top of the first attempt).
SDK_MAX_RETRIES = 2

# Circuit breaker: after this many consecutive transient failures a provider
# is skipped for BREAKER_COOLDOWN_SECONDS. Quota/auth/not-found failures
# bench it for the rest of the run.
BREAKER_FAILURE_THRESHOLD = 2
BREAKER_COOLDOWN_SECONDS = float(os.getenv("LLM_BREAKER_COOLDOWN_SECONDS", "300.0"))

PREFLIGHT_TIMEOUT_SECONDS = 30.0

# Default fallback chain: Gemini first, falling back to DeepSeek
DEFAULT_FALLBACK_CHAIN = [
    "gemini/gemini-3.8-flash",
    "deepseek/deepseek-flash",
]

# Errors that mean "this provider couldn't produce a valid answer", so the
# next provider in the chain should be tried. Anything else (TypeError,
# KeyError, AttributeError...) is treated as a bug and propagates immediately.
#   openai.APIError      - DeepSeek/Groq HTTP, connection and timeout errors
#   genai_errors.APIError - Gemini HTTP errors (4xx/5xx, quota)
#   httpx.HTTPError      - transport errors/timeouts the SDKs don't wrap
#   TimeoutError         - asyncio timeouts, including the provider deadline
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
# extra_body: provider-specific request fields sent with every completion
PROVIDERS: dict[str, dict] = {
    "gemini": {"key_env": "GEMINI_API_KEY"},
    "deepseek": {
        "key_env": "DEEPSEEK_API_KEY",
        "base_url": "https://api.deepseek.com",
        # deepseek-flash thinks by default (high effort): ~10x the completion
        # tokens and ~1 min per article. The old deepseek-chat alias was the
        # non-thinking mode, and structured output validates fine without it.
        "extra_body": {"thinking": {"type": "disabled"}},
    },
    "groq": {
        "key_env": "GROQ_API_KEY",
        "base_url": "https://api.groq.com/openai/v1",
    },
}


class MissingAPIKeyError(ValueError):
    """Raised when a provider's API key env var is not set."""


class LLMConfigError(Exception):
    """A configuration problem that should stop the run (not a fallback case)."""


class ModelNotFoundError(LLMConfigError):
    """The provider doesn't know the requested model (usually a typo)."""


class ProviderSkipped(Exception):
    """Recorded when a provider was not tried because its breaker is open."""


class AllProvidersFailed(ExceptionGroup):
    """Every provider in the chain failed or was skipped for one request."""


# --- error classification ---------------------------------------------------


class Failure(Enum):
    CONTENT = auto()  # bad output / request-specific 4xx: this article only
    TRANSIENT = auto()  # timeouts, connection errors, 5xx, per-minute 429
    QUOTA = auto()  # daily quota or balance exhausted: won't recover this run
    PERMANENT = auto()  # 401/403/404: config problem, same for every article


# Daily-quota wording: Gemini quota ids ("...PerDay..."), Groq ("tokens per
# day (TPD)"), OpenAI ("insufficient_quota").
_DAILY_QUOTA_RE = re.compile(r"per\s*day|insufficient_quota", re.IGNORECASE)


def _status_code(exc: BaseException) -> int | None:
    # openai.APIStatusError -> .status_code; genai APIError -> .code;
    # httpx.HTTPStatusError -> .response.status_code
    for code in (
        getattr(exc, "status_code", None),
        getattr(exc, "code", None),
        getattr(getattr(exc, "response", None), "status_code", None),
    ):
        if isinstance(code, int) and not isinstance(code, bool):
            return code
    return None


def classify(exc: BaseException) -> Failure:
    """Sorts a provider failure into the kind of response it deserves."""
    if isinstance(exc, (TimeoutError, httpx.TransportError, openai.APIConnectionError)):
        return Failure.TRANSIENT

    status = _status_code(exc)
    if status is not None:
        if status in (401, 403, 404):
            return Failure.PERMANENT
        if status == 402:  # DeepSeek: insufficient balance
            return Failure.QUOTA
        if status == 429:
            return Failure.QUOTA if _DAILY_QUOTA_RE.search(str(exc)) else Failure.TRANSIENT
        if status == 408 or status >= 500:
            return Failure.TRANSIENT
        # 400/422 etc.: most likely about this particular request.
        return Failure.CONTENT

    if isinstance(exc, (openai.APIError, genai_errors.APIError, httpx.HTTPError)):
        return Failure.TRANSIENT
    return Failure.CONTENT


# --- adapters ----------------------------------------------------------------


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


def _remaining(deadline: float, model: str) -> float:
    remaining = deadline - time.monotonic()
    if remaining <= 0:
        raise TimeoutError(
            f"'{model}' exceeded its {PROVIDER_BUDGET_SECONDS:.0f}s budget for this request."
        )
    return remaining


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
            http_options={
                "timeout": int(REQUEST_TIMEOUT_SECONDS * 1000),
                # Transport retries; without this the SDK doesn't retry
                # 429/503 at all.
                "retry_options": {
                    "attempts": SDK_MAX_RETRIES + 1,
                    "initial_delay": 2.0,
                    "max_delay": 30.0,
                    "http_status_codes": [408, 429, 500, 502, 503, 504],
                },
            },
        )

    async def preflight(self) -> None:
        try:
            async with asyncio.timeout(PREFLIGHT_TIMEOUT_SECONDS):
                await self.client.aio.models.get(model=self.model)
        except genai_errors.APIError as exc:
            if _status_code(exc) == 404:
                raise ModelNotFoundError(
                    f"Gemini has no model '{self.model}'."
                ) from exc
            raise

    async def generate_structured(self, prompt: str, schema: type[T]) -> T:
        deadline = time.monotonic() + PROVIDER_BUDGET_SECONDS
        for attempt in range(self.retries + 1):
            logger.info("Calling Gemini model '%s'...", self.model)
            async with asyncio.timeout(_remaining(deadline, self.model)):
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
                    raise ValueError(
                        "Gemini API returned an empty response "
                        f"({_gemini_empty_reason(response)})."
                    )
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


def _gemini_empty_reason(response) -> str:
    """Explains an empty Gemini reply: safety block, token limit, etc."""
    feedback = getattr(response, "prompt_feedback", None)
    block = getattr(feedback, "block_reason", None)
    if block:
        return f"prompt blocked: {block}"
    candidates = getattr(response, "candidates", None) or []
    if candidates:
        return f"finish_reason={getattr(candidates[0], 'finish_reason', None)}"
    return "no candidates"


class OpenAICompatClient:
    """Adapter for any OpenAI-protocol endpoint (DeepSeek, Groq, OpenAI...)."""

    def __init__(
        self,
        model: str,
        api_key: str,
        base_url: str,
        retries: int = 2,
        extra_body: dict | None = None,
    ):
        self.model = model
        self.retries = retries
        self.extra_body = extra_body
        self.client = AsyncOpenAI(
            api_key=api_key,
            base_url=base_url,
            timeout=REQUEST_TIMEOUT_SECONDS,
            max_retries=SDK_MAX_RETRIES,
        )

    async def preflight(self) -> None:
        # /models listing works on DeepSeek and Groq and costs no tokens. It
        # checks the key, but it can't prove a model name wrong: providers
        # keep accepting aliases they no longer list (e.g. deepseek-chat).
        # So an unlisted model only warns; a real 404 mid-run still benches it.
        async with asyncio.timeout(PREFLIGHT_TIMEOUT_SECONDS):
            known = [m.id async for m in self.client.models.list()]
        if self.model not in known:
            logger.warning(
                "'%s' is not in the provider's model list (it may be an "
                "unlisted or retired alias). Listed models: %s",
                self.model,
                ", ".join(sorted(known)) or "(none)",
            )

    async def generate_structured(self, prompt: str, schema: type[T]) -> T:
        deadline = time.monotonic() + PROVIDER_BUDGET_SECONDS
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
            async with asyncio.timeout(_remaining(deadline, self.model)):
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    response_format={"type": "json_object"},
                    extra_body=self.extra_body,
                )

            usage = getattr(response, "usage", None)
            if usage:
                details = getattr(usage, "completion_tokens_details", None)
                reasoning = getattr(details, "reasoning_tokens", None) or 0
                logger.info(
                    "Token usage: %d total (%d prompt, %d completion, "
                    "%d reasoning).",
                    usage.total_tokens,
                    usage.prompt_tokens,
                    usage.completion_tokens,
                    reasoning,
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


# --- fallback chain with circuit breaker -------------------------------------


@dataclass
class _Health:
    failures: int = 0  # consecutive transient failures
    open_until: float = 0.0  # monotonic time; math.inf = benched for the run
    reason: str = ""


def _label(client) -> str:
    return getattr(client, "spec", None) or getattr(client, "model", None) or "?"


class FallbackClient:
    """Wraps multiple LLMClient instances and tries them in sequence."""

    def __init__(
        self,
        clients: list[LLMClient],
        clock: Callable[[], float] = time.monotonic,
    ):
        if not clients:
            raise ValueError("FallbackClient requires at least one client.")
        self.clock = clock
        self.set_clients(clients)

    def set_clients(self, clients: list[LLMClient]) -> None:
        self.clients = list(clients)
        self.health = [_Health() for _ in self.clients]

    def _available(self, now: float) -> set[int]:
        ready = {i for i, h in enumerate(self.health) if h.open_until <= now}
        if ready:
            return ready
        # Everything is benched. Probe the provider whose cooldown ends
        # soonest, unless all are benched for the whole run.
        cooling = [i for i, h in enumerate(self.health) if h.open_until != math.inf]
        if cooling:
            return {min(cooling, key=lambda i: self.health[i].open_until)}
        return set()

    def _record_success(self, index: int) -> None:
        health = self.health[index]
        if health.failures or health.open_until:
            logger.info("'%s' is working again.", _label(self.clients[index]))
        self.health[index] = _Health()

    def _record_failure(self, index: int, exc: BaseException) -> None:
        kind = classify(exc)
        health = self.health[index]
        label = _label(self.clients[index])
        if kind is Failure.CONTENT:
            return
        if kind in (Failure.QUOTA, Failure.PERMANENT):
            health.open_until = math.inf
            health.reason = f"{kind.name.lower()}: {type(exc).__name__}"
            logger.error(
                "Disabling '%s' for the rest of this run (%s): %s",
                label, kind.name.lower(), exc,
            )
            return
        health.failures += 1
        if health.failures >= BREAKER_FAILURE_THRESHOLD:
            health.open_until = self.clock() + BREAKER_COOLDOWN_SECONDS
            health.reason = f"{health.failures} consecutive transient failures"
            logger.warning(
                "Pausing '%s' for %.0fs after %d consecutive transient failures.",
                label, BREAKER_COOLDOWN_SECONDS, health.failures,
            )

    async def generate_structured(self, prompt: str, schema: type[T]) -> T:
        total_clients = len(self.clients)
        available = self._available(self.clock())
        errors: list[Exception] = []

        for index, client in enumerate(self.clients):
            label = _label(client)
            if index not in available:
                reason = self.health[index].reason
                logger.debug("Skipping '%s' (circuit open: %s).", label, reason)
                errors.append(ProviderSkipped(f"'{label}' skipped: circuit open ({reason})"))
                continue

            logger.info(
                "Attempting generation with client %d/%d (%s '%s')...",
                index + 1, total_clients, client.__class__.__name__, label,
            )
            try:
                result = await client.generate_structured(prompt, schema)
            except FALLBACK_ERRORS as exc:
                # Only provider/output failures fall through to the next
                # client; programming errors propagate immediately.
                self._record_failure(index, exc)
                exc.add_note(f"provider: {label}")
                errors.append(exc)
                logger.warning(
                    "Client %d/%d ('%s') failed with %s: %s",
                    index + 1, total_clients, label, type(exc).__name__, exc,
                )
                continue

            self._record_success(index)
            return result

        logger.error("All fallback clients failed.")
        raise AllProvidersFailed(
            f"All {total_clients} providers failed for this request", errors
        )


# --- construction and startup checks -----------------------------------------


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

    client: LLMClient
    if "base_url" in entry:
        client = OpenAICompatClient(
            model, api_key, entry["base_url"], extra_body=entry.get("extra_body")
        )
    else:
        client = GeminiClient(model, api_key)
    client.spec = f"{provider}/{model}"
    return client


def parse_model_chain(chain: str) -> list[str]:
    """
    Splits a comma-separated model chain such as
    "gemini/gemini-3.8-flash, deepseek/deepseek-flash" into a list of specs,
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


async def preflight(client: LLMClient) -> None:
    """
    Checks every model in the chain once at startup, without spending tokens.

    - Unknown model (404 / not listed): raises ModelNotFoundError. Almost
      always a typo in --model, so the run should stop.
    - Credentials rejected (401/403): drops that model with a warning, like a
      missing key. Raises LLMConfigError if nothing usable is left.
    - Anything else (timeout, 5xx, quota): logs a warning and keeps the model;
      the circuit breaker handles it if it persists.
    """
    is_chain = isinstance(client, FallbackClient)
    candidates = client.clients if is_chain else [client]
    usable: list[LLMClient] = []
    rejected: list[str] = []

    for candidate in candidates:
        label = _label(candidate)
        check = getattr(candidate, "preflight", None)
        if check is None:
            usable.append(candidate)
            continue
        try:
            await check()
        except FALLBACK_ERRORS as exc:
            if classify(exc) is Failure.PERMANENT:
                logger.warning("Dropping '%s' from the chain: rejected at startup (%s).", label, exc)
                rejected.append(f"{label} ({exc})")
                continue
            logger.warning("Preflight for '%s' was inconclusive (%s); keeping it.", label, exc)
        usable.append(candidate)

    if not usable:
        raise LLMConfigError(
            "No usable model after startup checks: " + "; ".join(rejected)
        )
    if is_chain and len(usable) != len(candidates):
        client.set_clients(usable)
    logger.info("LLM chain ready: %s", ", ".join(_label(c) for c in usable))
