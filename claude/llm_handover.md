## LLM provider layer — handover (2026-11-02)

### Current state
- `llm.py` is the only LLM entry point for the pipeline. Interface:
  `LLMClient.generate_structured(prompt, schema) -> PydanticModel`.
- Adapters: `GeminiClient` (native SDK, server-side `response_schema`) and
  `OpenAICompatClient` (DeepSeek, Groq; `json_object` mode + Pydantic
  validation with error-feedback retries).
- Model specs are `<provider>/<model>`; providers: gemini, deepseek, groq.
  Keys come from `GEMINI_API_KEY`, `DEEPSEEK_API_KEY`, `GROQ_API_KEY` (.env).

### Fallback chains
- `--model` accepts a comma-separated chain, tried in order per request:
  `--model gemini/gemini-3.8-flash,deepseek/deepseek-chat`
- Default `--model` = `llm.DEFAULT_FALLBACK_CHAIN`
  (gemini/gemini-3.8-flash, then deepseek/deepseek-chat).
- `pipeline.py` builds the client once at startup via
  `llm.make_fallback_client(llm.parse_model_chain(config.model_name), ...)`.
- Falls back only on `FALLBACK_ERRORS`: openai.APIError, genai APIError,
  httpx.HTTPError, TimeoutError, ValueError (incl. Pydantic ValidationError).
  Code bugs (TypeError etc.) propagate.
- Models with a missing API key are skipped with a warning; startup fails
  only if no model in the chain is usable. Invalid specs fail fast.
- `--api-key-env` only works with a single model, not a chain.
- Verified live: 3.8-flash happy path; `gemini/no-such-model` → 404 →
  DeepSeek completed the article.

### Models
- `gemini-2.5-flash` is retired; all defaults now use `gemini-3.8-flash`.
- Tested working: gemini/gemini-3.8-flash, deepseek/deepseek-chat,
  groq/openai/gpt-oss-120b.
- Gemini usage log shows thinking tokens separately
  (`... completion, N thinking`); they count toward total/billing.

### nhkeasier_to_epub.py (left as-is for now)
- Pipeline path (`epub_runner.py`) always passes `analysis=`, so no LLM call
  happens here and `model_name` is unused.
- Standalone CLI path (`python nhkeasier_to_epub.py <url> out.epub`) still
  makes its own direct Gemini call (bare model name, free-form Markdown,
  bypasses llm.py). Candidate to delete or route through llm.py later.

### Testing
- `tests/test_llm.py` covers adapters, chain parsing, fallback behaviour,
  key handling and thinking-token logging (all passing).
- `--reprocess --max-articles 1 --days-back 5 --no-kindle --no-audio`
  reruns one article without touching history or Anki.

### Open items
- Retry layers are uneven: the OpenAI SDK retries transport errors itself
  (×3 validation attempts → up to 9 calls, 120s timeout each); Gemini
  doesn't retry 429/503 before falling back. Consider explicit SDK
  `max_retries` and an overall per-call deadline.
- No circuit breaker: a down/quota-exhausted primary is retried on every
  article. Consider a cooldown after failure.
- Only the last error is raised when all providers fail (consider
  ExceptionGroup).
- Undecided: should 404 (bad model name) / 401/403 (auth) stop the run
  instead of falling back silently?
- Recurring warning `Paragraph count (N) mismatch with analysis sentences
  (M)` seen with both providers — HTML builder vs analysis split; not yet
  investigated.
- Delete `*.bak` files in repo root and tests/ after committing.
- Sync changes to the SSH server checkout if it's separate.
