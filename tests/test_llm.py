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
