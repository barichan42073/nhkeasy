# nhkeasy — Handoff Update (2026-11-03)

Follows on from `llm_handover.md` (2026-11-02). Covers hardening of the LLM
fallback layer in `llm.py`, the DeepSeek model switch, the merge to `main`,
and the first full run on the SSH server.

## 1. What changed in `llm.py`

The code now has one layer per kind of failure:

| Layer | Handles | Setting |
|---|---|---|
| SDK | Transport errors: connection, 408/429/5xx | Gemini `retry_options` (3 attempts, 2–30s backoff); OpenAI-compatible `max_retries=2` (`SDK_MAX_RETRIES`) |
| Adapter | Invalid model output only (validation errors) | Gemini 1 retry; OpenAI-compatible 2 retries, with error feedback |
| Deadline | Caps the SDK and adapter retries together | `LLM_PROVIDER_BUDGET_SECONDS`, default 300s per provider per article |
| `FallbackClient` | Moves to the next provider; circuit breaker | `BREAKER_FAILURE_THRESHOLD=2`, `LLM_BREAKER_COOLDOWN_SECONDS=300` |
| `preflight()` | One check per model at startup, no tokens used | Called in `pipeline.main()` |

**Error classes.** `llm.classify(exc)` returns one of:
- **CONTENT:** bad output, or a 400/422. Affects only that article and never trips the breaker.
- **TRANSIENT:** a timeout, connection error, 5xx or per-minute 429. Two in a row pause the provider for 5 minutes, then it gets one test call.
- **QUOTA:** a 429 that mentions a per-day limit, DeepSeek's 402 (out of balance), or OpenAI's `insufficient_quota`. The provider is skipped for the rest of the run.
- **PERMANENT:** a 401, 403 or 404. Also skipped for the rest of the run.

When the breaker opens it logs once, at WARNING for a transient pause and at ERROR for the rest of the run. If every provider is paused, the one whose pause ends soonest gets a test call. If every provider is out for the whole run, the article fails straight away.

**All providers failed.** This raises `AllProvidersFailed`, an `ExceptionGroup`. It contains every error, each tagged with a note `provider: <spec>`, plus a `ProviderSkipped` entry for any provider whose breaker was open. `pipeline.py`'s `except Exception` still catches it and logs the full tree.

**Startup check (`await llm.preflight(client)`):**
- **Gemini:** calls `models.get`. A 404 raises `ModelNotFoundError` and stops the run.
- **OpenAI-compatible providers:** `models.list` checks the key. A model that isn't listed only produces a warning, because providers still accept aliases they no longer list (`deepseek-chat` was an example).
- **401/403:** the model is dropped from the chain with a warning. `LLMConfigError` is raised if nothing usable is left.
- **Anything else** (timeout, 5xx, quota): the model is kept, with a warning.

**Other changes:**
- Each client has a `.spec` (for example `gemini/gemini-3.8-flash`), which the log lines use.
- The OpenAI-compatible usage log now includes reasoning tokens (`completion_tokens_details.reasoning_tokens`).
- An empty Gemini reply now logs why, using the block reason or `finish_reason`.
- `PROVIDERS` entries can carry `extra_body`, extra request fields sent with every completion call.

## 2. DeepSeek model switch

- `deepseek-chat` is a retired alias. It still works, and is routed to V4 Flash in non-thinking mode, but DeepSeek no longer lists it.
- The defaults now use **`deepseek/deepseek-flash`**: `DEFAULT_FALLBACK_CHAIN` and the help text in `config.py`.
- `deepseek-flash` has **thinking on by default** (high effort). That made the fallback very slow, so the DeepSeek entry in `PROVIDERS` now sends `extra_body={"thinking": {"type": "disabled"}}`. Groq requests are unchanged.

| deepseek-flash, one article | Completion tokens | Reasoning tokens | Time |
|---|---|---|---|
| Thinking on (default) | 13,423 | — | ~54s |
| Thinking off | ~1,600 | 0 | ~5s (one run took 31s because DeepSeek was under load) |

## 3. Verified

- `tests/test_llm.py`: 54 passing locally.
- Local live runs:
  - deepseek-flash completed cleanly.
  - A real 503 from DeepSeek was retried by the SDK and the run succeeded.
  - Gemini completed with the new `retry_options` accepted.
- `feature/multiplellms` was merged to `main` and pushed. The server pulled `main`.
- Full server run (`--days-back 1`, Gemini only): 4 articles completed. EPUB to Kindle, HTML, slowed audio, Anki sync, the combined MP3 email and the rsync to `/var/www/html` all worked.

## 4. Repo and server housekeeping (done)

- Removed `avlib/avlib/slowrecord.py.backup`. It had come back in the merge, so it was removed again with `git rm`.
- Removed `pylibs/my_anki/gemini-code-*.py`.
- There are no `*.bak` files left.
- Server: ran `pip install -r requirements.txt`, which installed `openai`. The server venv is Python 3.12.3; `llm.py` needs 3.11 or newer.
- Added `pytest.ini` and pinned the new dependencies in `requirements.txt` (see section 5).

## 5. Open items

1. **Paragraph/sentence mismatch.** The warning `Paragraph count (N) mismatch with analysis sentences (M)` appears on every article (4/7, 3/7, 6/8, 4/5). The analysis count is always at least the paragraph count, which suggests the HTML builder pairs paragraphs with the analysis's sentences. Not yet investigated.
2. **`--days-back 1` gave 3 days.** The server log said "considering up to 3 days back". Something is overriding the flag: possibly `config.py`, `fetch_rss.py` or `.env`. History stopped any duplicates.
3. **`nhkeasier_to_epub.py`.** Its standalone CLI path still calls Gemini directly, bypassing `llm.py`. Left as is.

### Resolved since first draft (2026-11-05)
- **pytest import path:** `pytest.ini` (`[pytest]` / `pythonpath = .`) is now at the repo root, so a bare `pytest` works on both machines.
- **Pinned dependencies:** `requirements.txt` now pins `openai==3.41.0` plus its dependencies `httpx2==2.16.0`, `httpcore2==2.16.0`, `jiter==0.18.0` and `truststore==0.10.5`.
- **DeepSeek on the server:** `DEEPSEEK_API_KEY` is now in the server `.env`, so the server runs the full Gemini → DeepSeek chain. The next run's startup log should say `LLM chain ready: gemini/gemini-3.8-flash, deepseek/deepseek-flash`.
- **rsync:** in `run_and_publish.sh`, the publish step now excludes `feed/`, `staging/`, `smartreader/`, `vocabulary/`, `epubs/`, `audio/`, `combined_slowed.mp3` and `*.apkg`. Only `index.html`, `styles.css`, `html_output/` and `slow_audio/` (normally empty) are published.
- **`/var/www/html` cleaned:** the old files from the first run have been removed. Only `html_output/`, `index.html` and `styles.css` are left.

## 6. Useful commands

```bash
# Rerun one article without touching history/Anki
python3 pipeline.py --reprocess --max-articles 1 --days-back 5 --no-kindle --no-audio

# Force a specific provider (bypasses the default chain)
python3 pipeline.py ... --model deepseek/deepseek-flash

# Tests
pytest tests/test_llm.py -q
```

Environment variables: `LLM_TIMEOUT_SECONDS` (120), `LLM_PROVIDER_BUDGET_SECONDS` (300),
`LLM_BREAKER_COOLDOWN_SECONDS` (300), and the API keys `GEMINI_API_KEY`, `DEEPSEEK_API_KEY`, `GROQ_API_KEY`.
