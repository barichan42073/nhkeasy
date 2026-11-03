"""Tests for llm.py adapters using fake SDK clients (no network)."""
import asyncio
import math
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import httpx
import openai
import pytest
from google.genai import errors as genai_errors
from pydantic import BaseModel

import llm


class Out(BaseModel):
    x: int


def _gemini(texts):
    client = llm.GeminiClient.__new__(llm.GeminiClient)
    client.model, client.retries = "m", 1
    responses = [SimpleNamespace(text=t, usage_metadata=None) for t in texts]
    client.client = MagicMock()
    client.client.aio.models.generate_content = AsyncMock(side_effect=responses)
    return client


def test_gemini_valid_first_time():
    c = _gemini(['{"x": 1}'])
    assert asyncio.run(c.generate_structured("p", Out)).x == 1


def test_gemini_retries_once_on_invalid_output():
    c = _gemini(['{"x": "nope"}', '{"x": 2}'])
    assert asyncio.run(c.generate_structured("p", Out)).x == 2
    assert c.client.aio.models.generate_content.await_count == 2


def test_gemini_gives_up_after_retries():
    c = _gemini(["", ""])
    with pytest.raises(ValueError):
        asyncio.run(c.generate_structured("p", Out))


def test_openai_compat_client_has_timeout(monkeypatch):
    captured = {}
    monkeypatch.setattr(llm, "AsyncOpenAI", lambda **kw: captured.update(kw) or MagicMock())
    llm.OpenAICompatClient("m", "k", "https://example.invalid")
    assert captured["timeout"] == llm.REQUEST_TIMEOUT_SECONDS
    assert captured["max_retries"] == llm.SDK_MAX_RETRIES


def test_gemini_client_has_timeout(monkeypatch):
    captured = {}
    monkeypatch.setattr(
        llm.genai, "Client", lambda **kw: captured.update(kw) or MagicMock()
    )
    llm.GeminiClient("m", "k")
    assert captured["http_options"]["timeout"] == int(llm.REQUEST_TIMEOUT_SECONDS * 1000)
    retry = captured["http_options"]["retry_options"]
    assert retry["attempts"] == llm.SDK_MAX_RETRIES + 1
    assert 429 in retry["http_status_codes"] and 503 in retry["http_status_codes"]


def test_web_builder_finds_templates_from_any_directory(tmp_path, monkeypatch):
    import web_builder

    monkeypatch.chdir(tmp_path)
    assert web_builder._jinja_env.get_template("article.html") is not None


# --- model chains and fallback -------------------------------------------

class _Fake:
    """Fake client. `outcomes` is a list consumed one per call (last repeats);
    each item is a result or an exception to raise."""

    def __init__(self, result=None, exc=None, model="fake", outcomes=None, preflight_exc=None):
        self.outcomes = outcomes or [exc if exc else result]
        self.model, self.preflight_exc = model, preflight_exc
        self.calls = 0

    async def generate_structured(self, prompt, schema):
        outcome = self.outcomes[min(self.calls, len(self.outcomes) - 1)]
        self.calls += 1
        if isinstance(outcome, BaseException):
            raise outcome
        return outcome

    async def preflight(self):
        if self.preflight_exc:
            raise self.preflight_exc


@pytest.fixture
def no_llm_keys(monkeypatch):
    for name in ("GEMINI_API_KEY", "DEEPSEEK_API_KEY", "GROQ_API_KEY"):
        monkeypatch.delenv(name, raising=False)
    monkeypatch.setattr(llm.genai, "Client", lambda **kw: MagicMock())
    monkeypatch.setattr(llm, "AsyncOpenAI", lambda **kw: MagicMock())
    return monkeypatch


def test_parse_model_chain():
    assert llm.parse_model_chain(" gemini/a , deepseek/b,, ") == ["gemini/a", "deepseek/b"]
    assert llm.parse_model_chain("groq/openai/gpt-oss-120b") == ["groq/openai/gpt-oss-120b"]
    assert llm.parse_model_chain("") == []


def test_fallback_uses_next_client_on_provider_error():
    first, second = _Fake(exc=ValueError("bad json")), _Fake(result=Out(x=3))
    out = asyncio.run(llm.FallbackClient([first, second]).generate_structured("p", Out))
    assert out.x == 3 and first.calls == 1 and second.calls == 1


def test_fallback_does_not_hide_programming_errors():
    first, second = _Fake(exc=TypeError("bug")), _Fake(result=Out(x=3))
    with pytest.raises(TypeError):
        asyncio.run(llm.FallbackClient([first, second]).generate_structured("p", Out))
    assert second.calls == 0


def test_fallback_raises_group_of_all_errors_when_all_fail():
    clients = [_Fake(exc=ValueError("one"), model="a"), _Fake(exc=ValueError("two"), model="b")]
    with pytest.RaisesGroup(ValueError, ValueError) as info:
        asyncio.run(llm.FallbackClient(clients).generate_structured("p", Out))
    assert isinstance(info.value, llm.AllProvidersFailed)
    one, two = info.value.exceptions
    assert str(one) == "one" and one.__notes__ == ["provider: a"]
    assert str(two) == "two" and two.__notes__ == ["provider: b"]


def test_chain_builds_fallback_client(no_llm_keys):
    no_llm_keys.setenv("GEMINI_API_KEY", "g")
    no_llm_keys.setenv("DEEPSEEK_API_KEY", "d")
    client = llm.make_fallback_client(llm.parse_model_chain("gemini/a,deepseek/b"))
    assert isinstance(client, llm.FallbackClient)
    assert [c.model for c in client.clients] == ["a", "b"]
    assert [c.spec for c in client.clients] == ["gemini/a", "deepseek/b"]


def test_single_spec_returns_plain_client(no_llm_keys):
    no_llm_keys.setenv("DEEPSEEK_API_KEY", "d")
    client = llm.make_fallback_client(["deepseek/b"])
    assert isinstance(client, llm.OpenAICompatClient)


def test_chain_skips_model_with_missing_key(no_llm_keys):
    no_llm_keys.setenv("GEMINI_API_KEY", "g")
    client = llm.make_fallback_client(["gemini/a", "deepseek/b"])
    assert isinstance(client, llm.GeminiClient)


def test_chain_with_no_usable_keys_fails_early(no_llm_keys):
    with pytest.raises(llm.MissingAPIKeyError):
        llm.make_fallback_client(["gemini/a", "deepseek/b"])


def test_invalid_spec_in_chain_still_raises(no_llm_keys):
    no_llm_keys.setenv("GEMINI_API_KEY", "g")
    with pytest.raises(ValueError, match="Invalid model spec"):
        llm.make_fallback_client(["gemini/a", "nope/b"])


def test_api_key_env_rejected_for_chain(no_llm_keys):
    with pytest.raises(ValueError, match="single model spec"):
        llm.make_fallback_client(["gemini/a", "deepseek/b"], api_key_env="X")


def test_gemini_logs_thinking_tokens(caplog):
    c = _gemini(['{"x": 1}'])
    usage = SimpleNamespace(
        total_token_count=3238, prompt_token_count=360,
        candidates_token_count=1886, thoughts_token_count=992,
    )
    c.client.aio.models.generate_content = AsyncMock(
        return_value=SimpleNamespace(text='{"x": 1}', usage_metadata=usage)
    )
    with caplog.at_level("INFO", logger="llm"):
        asyncio.run(c.generate_structured("p", Out))
    assert "992 thinking" in caplog.text


# --- error classification -------------------------------------------------

_REQ = httpx.Request("POST", "https://example.invalid")


def _oai(cls, status, message="err"):
    return cls(message, response=httpx.Response(status, request=_REQ), body=None)


def _gem(code, message="err", status="X"):
    cls = genai_errors.ServerError if code >= 500 else genai_errors.ClientError
    return cls(code, {"error": {"code": code, "message": message, "status": status}})


F = llm.Failure


@pytest.mark.parametrize(
    "exc, expected",
    [
        (TimeoutError("deadline"), F.TRANSIENT),
        (httpx.ConnectError("refused"), F.TRANSIENT),
        (openai.APIConnectionError(request=_REQ), F.TRANSIENT),
        (openai.APITimeoutError(request=_REQ), F.TRANSIENT),
        (_oai(openai.InternalServerError, 503), F.TRANSIENT),
        (_oai(openai.RateLimitError, 429, "Rate limit reached: requests per minute"), F.TRANSIENT),
        (_oai(openai.RateLimitError, 429, "Rate limit reached on tokens per day (TPD)"), F.QUOTA),
        (_oai(openai.APIStatusError, 402, "Insufficient Balance"), F.QUOTA),
        (_oai(openai.AuthenticationError, 401), F.PERMANENT),
        (_oai(openai.PermissionDeniedError, 403), F.PERMANENT),
        (_oai(openai.NotFoundError, 404), F.PERMANENT),
        (_oai(openai.BadRequestError, 400, "context length exceeded"), F.CONTENT),
        (_gem(503, "overloaded", "UNAVAILABLE"), F.TRANSIENT),
        (_gem(429, "Resource exhausted", "RESOURCE_EXHAUSTED"), F.TRANSIENT),
        (
            _gem(
                429,
                "Quota exceeded: GenerateRequestsPerDayPerProjectPerModel-FreeTier",
                "RESOURCE_EXHAUSTED",
            ),
            F.QUOTA,
        ),
        (_gem(404, "model not found", "NOT_FOUND"), F.PERMANENT),
        (_gem(400, "bad request", "INVALID_ARGUMENT"), F.CONTENT),
        (ValueError("bad json"), F.CONTENT),
    ],
)
def test_classify(exc, expected):
    assert llm.classify(exc) is expected


# --- circuit breaker --------------------------------------------------------


class _Clock:
    def __init__(self):
        self.t = 1000.0

    def __call__(self):
        return self.t


def _run(client):
    return asyncio.run(client.generate_structured("p", Out))


def test_transient_failures_open_breaker_then_probe_after_cooldown():
    clock = _Clock()
    first = _Fake(exc=openai.APIConnectionError(request=_REQ), model="a")
    second = _Fake(result=Out(x=1), model="b")
    fc = llm.FallbackClient([first, second], clock=clock)

    _run(fc), _run(fc)  # two transient failures -> breaker opens
    assert first.calls == 2
    _run(fc)
    assert first.calls == 2 and second.calls == 3  # skipped during cooldown

    clock.t += llm.BREAKER_COOLDOWN_SECONDS + 1
    _run(fc)
    assert first.calls == 3  # probed after cooldown, failed again
    _run(fc)
    assert first.calls == 3  # reopened straight away


def test_success_resets_transient_count():
    clock = _Clock()
    err = openai.APIConnectionError(request=_REQ)
    first = _Fake(outcomes=[err, Out(x=1), err, Out(x=2)], model="a")
    fc = llm.FallbackClient([first, _Fake(result=Out(x=9))], clock=clock)
    assert [_run(fc).x for _ in range(4)] == [9, 1, 9, 2]
    assert first.calls == 4  # never benched


def test_daily_quota_benches_provider_for_the_run():
    clock = _Clock()
    quota = _gem(429, "GenerateRequestsPerDayPerProjectPerModel-FreeTier", "RESOURCE_EXHAUSTED")
    first = _Fake(exc=quota, model="a")
    fc = llm.FallbackClient([first, _Fake(result=Out(x=1))], clock=clock)
    _run(fc)
    clock.t += 10 * llm.BREAKER_COOLDOWN_SECONDS
    _run(fc)
    assert first.calls == 1


def test_content_failures_never_trip_breaker():
    first = _Fake(exc=ValueError("bad json"), model="a")
    fc = llm.FallbackClient([first, _Fake(result=Out(x=1))], clock=_Clock())
    for _ in range(5):
        _run(fc)
    assert first.calls == 5


def test_all_benched_for_run_fails_without_calling():
    first = _Fake(exc=_oai(openai.AuthenticationError, 401), model="a")
    second = _Fake(exc=_oai(openai.NotFoundError, 404), model="b")
    fc = llm.FallbackClient([first, second], clock=_Clock())
    with pytest.RaisesGroup(openai.AuthenticationError, openai.NotFoundError):
        _run(fc)
    with pytest.RaisesGroup(llm.ProviderSkipped, llm.ProviderSkipped):
        _run(fc)
    assert first.calls == 1 and second.calls == 1


def test_all_cooling_down_probes_one_provider():
    err = openai.APIConnectionError(request=_REQ)
    first, second = _Fake(exc=err, model="a"), _Fake(exc=err, model="b")
    fc = llm.FallbackClient([first, second], clock=_Clock())
    for _ in range(2):
        with pytest.RaisesGroup(openai.APIConnectionError, openai.APIConnectionError):
            _run(fc)
    with pytest.RaisesGroup(openai.APIConnectionError, llm.ProviderSkipped):
        _run(fc)
    assert (first.calls, second.calls) == (3, 2)


# --- per-provider deadline ----------------------------------------------------


def _slow_openai_client(delay, text='{"x": "nope"}'):
    c = llm.OpenAICompatClient.__new__(llm.OpenAICompatClient)
    c.model, c.retries, c.extra_body = "m", 2, None
    calls = []

    async def create(**kwargs):
        calls.append(kwargs)
        await asyncio.sleep(delay)
        return SimpleNamespace(
            usage=None, choices=[SimpleNamespace(message=SimpleNamespace(content=text))]
        )

    c.client = MagicMock()
    c.client.chat.completions.create = create
    return c, calls


def test_openai_compat_budget_covers_validation_retries(monkeypatch):
    monkeypatch.setattr(llm, "PROVIDER_BUDGET_SECONDS", 0.1)
    c, calls = _slow_openai_client(0.06)
    with pytest.raises(TimeoutError):
        asyncio.run(c.generate_structured("p", Out))
    assert len(calls) == 2  # second attempt cut off by the budget


def test_gemini_budget(monkeypatch):
    monkeypatch.setattr(llm, "PROVIDER_BUDGET_SECONDS", 0.05)
    c = _gemini([])

    async def slow(**kwargs):
        await asyncio.sleep(5)

    c.client.aio.models.generate_content = slow
    with pytest.raises(TimeoutError):
        asyncio.run(c.generate_structured("p", Out))


def test_gemini_empty_response_reports_finish_reason():
    c = _gemini([])
    empty = SimpleNamespace(
        text=None, usage_metadata=None, prompt_feedback=None,
        candidates=[SimpleNamespace(finish_reason="MAX_TOKENS")],
    )
    c.client.aio.models.generate_content = AsyncMock(return_value=empty)
    with pytest.raises(ValueError, match="finish_reason=MAX_TOKENS"):
        asyncio.run(c.generate_structured("p", Out))


# --- preflight ------------------------------------------------------------------


def _openai_listing(ids):
    async def models():
        for model_id in ids:
            yield SimpleNamespace(id=model_id)

    c = llm.OpenAICompatClient.__new__(llm.OpenAICompatClient)
    c.model, c.retries = "deepseek-chat", 2
    c.client = MagicMock()
    c.client.models.list = lambda: models()
    return c


def test_openai_preflight_accepts_listed_model():
    asyncio.run(_openai_listing(["deepseek-chat", "deepseek-reasoner"]).preflight())


def test_openai_preflight_only_warns_on_unlisted_model(caplog):
    # Providers accept aliases they don't list, so this must not stop the run.
    with caplog.at_level("WARNING", logger="llm"):
        asyncio.run(_openai_listing(["deepseek-flash"]).preflight())
    assert "'deepseek-chat' is not in the provider's model list" in caplog.text


def test_gemini_preflight_404_is_model_not_found():
    c = _gemini([])
    c.client.aio.models.get = AsyncMock(side_effect=_gem(404, "not found", "NOT_FOUND"))
    with pytest.raises(llm.ModelNotFoundError):
        asyncio.run(c.preflight())


def test_preflight_drops_rejected_credentials():
    bad = _Fake(model="a", preflight_exc=_oai(openai.AuthenticationError, 401))
    good = _Fake(model="b")
    fc = llm.FallbackClient([bad, good])
    asyncio.run(llm.preflight(fc))
    assert fc.clients == [good] and len(fc.health) == 1


def test_preflight_keeps_model_on_transient_error():
    flaky = _Fake(model="a", preflight_exc=openai.APIConnectionError(request=_REQ))
    fc = llm.FallbackClient([flaky, _Fake(model="b")])
    asyncio.run(llm.preflight(fc))
    assert len(fc.clients) == 2


def test_preflight_unknown_model_stops_run():
    typo = _Fake(model="a", preflight_exc=llm.ModelNotFoundError("no such model"))
    with pytest.raises(llm.ModelNotFoundError):
        asyncio.run(llm.preflight(llm.FallbackClient([typo, _Fake(model="b")])))


def test_preflight_nothing_usable_stops_run():
    denied = _oai(openai.PermissionDeniedError, 403)
    with pytest.raises(llm.LLMConfigError):
        asyncio.run(llm.preflight(_Fake(model="a", preflight_exc=denied)))


def test_midrun_404_falls_back_and_benches_model():
    missing = _Fake(exc=_gem(404, "model not found", "NOT_FOUND"), model="a")
    backup = _Fake(result=Out(x=7), model="b")
    fc = llm.FallbackClient([missing, backup], clock=_Clock())
    assert _run(fc).x == 7 and _run(fc).x == 7
    assert missing.calls == 1


def test_deepseek_disables_thinking_and_groq_sends_nothing_extra(no_llm_keys):
    no_llm_keys.setenv("DEEPSEEK_API_KEY", "d")
    no_llm_keys.setenv("GROQ_API_KEY", "q")
    assert llm.make_client("deepseek/deepseek-flash").extra_body == {
        "thinking": {"type": "disabled"}
    }
    assert llm.make_client("groq/openai/gpt-oss-120b").extra_body is None


def test_openai_compat_sends_extra_body_and_logs_reasoning(caplog):
    c, calls = _slow_openai_client(0, text='{"x": 1}')
    c.extra_body = {"thinking": {"type": "disabled"}}
    usage = SimpleNamespace(
        total_tokens=100, prompt_tokens=40, completion_tokens=60,
        completion_tokens_details=SimpleNamespace(reasoning_tokens=25),
    )

    async def create(**kwargs):
        calls.append(kwargs)
        return SimpleNamespace(
            usage=usage, choices=[SimpleNamespace(message=SimpleNamespace(content='{"x": 1}'))]
        )

    c.client.chat.completions.create = create
    with caplog.at_level("INFO", logger="llm"):
        assert asyncio.run(c.generate_structured("p", Out)).x == 1
    assert calls[0]["extra_body"] == {"thinking": {"type": "disabled"}}
    assert "25 reasoning" in caplog.text
