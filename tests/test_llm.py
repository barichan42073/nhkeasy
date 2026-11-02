"""Tests for llm.py adapters using fake SDK clients (no network)."""
import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
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


def test_gemini_client_has_timeout(monkeypatch):
    captured = {}
    monkeypatch.setattr(
        llm.genai, "Client", lambda **kw: captured.update(kw) or MagicMock()
    )
    llm.GeminiClient("m", "k")
    assert captured["http_options"]["timeout"] == int(llm.REQUEST_TIMEOUT_SECONDS * 1000)


def test_web_builder_finds_templates_from_any_directory(tmp_path, monkeypatch):
    import web_builder

    monkeypatch.chdir(tmp_path)
    assert web_builder._jinja_env.get_template("article.html") is not None


# --- model chains and fallback -------------------------------------------

class _Fake:
    def __init__(self, result=None, exc=None, model="fake"):
        self.result, self.exc, self.model = result, exc, model
        self.calls = 0

    async def generate_structured(self, prompt, schema):
        self.calls += 1
        if self.exc:
            raise self.exc
        return self.result


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


def test_fallback_raises_last_error_when_all_fail():
    clients = [_Fake(exc=ValueError("one")), _Fake(exc=ValueError("two"))]
    with pytest.raises(ValueError, match="two"):
        asyncio.run(llm.FallbackClient(clients).generate_structured("p", Out))


def test_chain_builds_fallback_client(no_llm_keys):
    no_llm_keys.setenv("GEMINI_API_KEY", "g")
    no_llm_keys.setenv("DEEPSEEK_API_KEY", "d")
    client = llm.make_fallback_client(llm.parse_model_chain("gemini/a,deepseek/b"))
    assert isinstance(client, llm.FallbackClient)
    assert [c.model for c in client.clients] == ["a", "b"]


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
