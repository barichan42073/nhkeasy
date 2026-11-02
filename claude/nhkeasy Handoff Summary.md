# nhkeasy: Handoff Summary

*Multi-LLM refactor and follow-on fixes. First written 2 November 2026; updated at 12:30 after the EPUB/Gemini fix, a passing test run and commit `05beba2`, again at about 13:20 after the logging/email clean-up and `.txt` payload cleanup, at about 14:00 after fixing items 2 and 4 to 7 and the small items from item 10, and at about 13:45 (server time) after anchoring the page templates, adding the Gemini timeout and turning off Gemini's AFC. Use it to continue the work in a new chat.*

## 1. Goal

**What the project is for.** nhkeasy turns NHK Easy News articles (data source: nhkeasier.com) into learning material for non-native Japanese learners: EPUBs for a Kindle, interactive reader pages with furigana and hover dictionary, slowed repeated-sentence audio for a phone, and Anki flashcards.

**What the refactor set out to do.** Choose the AI model from the command line, with nothing in the core pipeline tied to Gemini. Providers: Gemini, DeepSeek and Groq (Claude deferred), API keys from `.env`.

**Priorities:** (a) easy model switching, (b) minimal time chasing bugs after the refactor, (c) no slower, (d) model choice kept out of core code. If one provider had to be sacrificed for simplicity, it would be Claude.

## 2. Decisions and why

### Model abstraction

| Decision | Why |
| --- | --- |
| Hand-rolled `llm.py` (about 220 lines): an `LLMClient` protocol with one method, `generate_structured(prompt, schema)`; a Gemini adapter (async, strict schema) and one OpenAI-compatible adapter for DeepSeek and Groq | Lighter than LiteLLM or Instructor, keeps Gemini's strict schema mode, gives control of retries and token logging |
| Claude dropped for now | Needs forced tool use (a third adapter of about 25 lines); can be added later without touching anything else |
| Keep Pydantic (msgspec rejected) | Schema generation, validation and staged-JSON round trip; Gemini takes Pydantic models directly |
| `--model provider/model`, split on the first slash (so `groq/openai/gpt-oss-120b` works); default `gemini/gemini-3.8-flash` (keep Gemini as default); bare name = Gemini with a warning; `--api-key-env NAME` picks the key variable | One easy flag, backward compatible |
| Client built once at the start of `main()` | A bad spec or missing key fails before any fetching or emailing |
| `load_dotenv()` once when `config.py` is imported, without `override` | Dataclass defaults read the environment at import. As of 2 Nov `send_to_kindle.py` no longer loads `.env` on import (only in its own `__main__`), so exported or inline variables now beat `.env` (e.g. `GEMINI_API_KEY= python3 pipeline.py` really blanks the key) |
| Non-Gemini path: JSON mode plus the schema in the prompt, Pydantic validation, up to two retries feeding the validation error back; every field marked required in the schema text | These providers only guarantee 'some JSON'; Groq skipped `surface_mapping` without the required-fields tweak (still inconsistent) |
| Provider-independent `build_analysis_prompt`, asking for headwords in the article's own kanji | Only the transport differs per provider |
| JLPT level lowercased by a Pydantic validator | Providers disagree (`N3` vs `n3`) |

### EPUB step no longer needs Gemini (2 November)

| Decision | Why |
| --- | --- |
| In `nhkeasier_to_epub.process_article_to_epub`, the `GEMINI_API_KEY` check and `load_system_prompt` now run only in the no-analysis fallback branch. `load_system_prompt` raises `FileNotFoundError` instead of `sys.exit(1)` | The pipeline always passes an analysis, so EPUBs were needlessly tied to Gemini. A missing `prompt_nhkeasier.md` would have raised `SystemExit`, which bypasses per-article error handling and kills the whole run |

Verified: sandbox test of all three branches; a real DeepSeek run with `GEMINI_API_KEY` commented out of `.env` and not exported built the EPUB, page and index.

### Logging, email and temporary files (2 November, afternoon)

| Decision | Why |
| --- | --- |
| `pipeline.setup_logging(verbose)` called right after `parse_arguments()`: same format as before, stdout, `force=True`; `--verbose` switches to DEBUG, keeps httpx/httpcore/urllib3/openai/google_genai/asyncio at INFO, and lifts `nhkeasier_to_epub` back to DEBUG (epub_runner sets it to WARNING at import) | Logging used to be configured only as a side effect of importing `send_to_kindle.py`; `--verbose` did nothing |
| `send_to_kindle.py` has no import-time side effects: `load_dotenv` and `basicConfig` moved into its `__main__` block | Standalone use still works; importing it no longer changes global state |
| New `send_to_kindle.send_file_by_email(path, recipient, subject)`; attachment type from the extension (`.epub` → `application/epub+zip`, `.mp3` → `audio/mpeg`, else `mimetypes`, else `application/octet-stream`). `send_epub_to_kindle` is now a thin wrapper (KINDLE_EMAIL fallback, subject 'NHK Easy Article') | The combined MP3 was attached as an EPUB |
| `audio_runner.deliver_combined_audio` calls `send_file_by_email(..., subject="NHK Easy slowed audio")` | Correct type and subject for the audio email |
| `process_article_to_epub` deletes the `.txt` text payload together with the `.md` after a successful conversion, unless `--keep-md`; a failed conversion leaves both for inspection; a failed delete only logs a warning | The `.txt` copies piled up in `epubs/`; nothing else reads them (checked by search) |

Tests: `tests/test_send_to_kindle.py` gained four tests (EPUB type, MP3 type and subject, empty recipient, import leaves root logging alone); `tests/test_audio_runner.py` delivery tests now assert `send_file_by_email`; new `tests/test_nhkeasier_to_epub.py` (three tests: cleanup, `--keep-md`, failure keeps files).

### State, feed, Anki and small fixes (2 November, about 14:00)

| Decision | Why |
| --- | --- |
| **Audio recipient:** no hardcoded fallback; if `COMBINED_MP3_EMAIL` is unset, an error is logged and the MP3 is not sent | The fallback went to a different address from `.env` |
| **History timing:** `pipeline._save_history_if_changed` saves processed history after every article (and once more at the end); `--reprocess` still never writes it. `epub_runner` marks an article done only after a successful Kindle send, or after the EPUB is built when `--no-kindle` | A crash no longer re-sends EPUBs; a failed send is retried on the next run (the whole article reruns) |
| **Master vocabulary after import:** new words are recorded in `unique_vocab.json` only after a successful AnkiWeb import; with `--no-anki-import`, once the package is built. If an import was wanted but failed (including missing AnkiWeb credentials), new words are not recorded and the `.apkg` is kept. Recurrence counts for known words are always saved | A failed import no longer leaves words "known" but missing from Anki. Side effect: with no AnkiWeb credentials and import on, the same words come back each day; use `--no-anki-import` in that case |
| **One vocabulary source for Anki:** `anki_pipeline.build_article_vocab_items(article, analysis)` takes the analysis `side_vocab` (the page's list). No per-article cap (chosen 2 Nov: keep current behaviour); known words are dropped and the daily 12 shared round-robin in the daily step. The page step no longer adds to the pool; `vocab_extractor.py` is now unused by the pipeline | The old "3 per article" cap from the Markdown table never took effect |
| **Feed fetch:** `fetch_rss.save_feed_data` returns `False` and keeps the existing `articles.json` on an HTTP error status, a failed download or an empty feed; a feed that parses with a minor error but has entries is used with a warning. The 3-day minimum is kept on purpose (articles.json is a cache; the pipeline applies `--days-back`) | A failed fetch could overwrite the feed with an empty list |
| **Index dates:** `html_pipeline.article_publication_date` parses `published` (RFC 822 or ISO), falling back to the run time | `date_parsed` never existed, so every page was dated by processing time. Pages already in `manifest.json` keep their old dates |
| **Dead options removed:** `--html-template`, `--html-output-dir`, `html_template_path`, `rss_fetcher_dir` | Parsed but never used |
| **One stylesheet:** `html_runner` copies the root `styles.css`, found next to the code rather than in the working directory | The root file was the one in use and has the article-header styles; `templates/styles.css` was an older copy (deleted 2 Nov) |
| **Logs:** "Eligible for processing" (filter) and "Updated processed history" (each save) moved to DEBUG; INFO now shows "Processing '<title>'" per article and one "Recorded N newly processed article(s)" line | Removes the duplicates |
| **Model adapters:** Gemini retries once on an empty or invalid reply; the OpenAI-compatible client has a 120 s request timeout (the SDK already retries 429/5xx with backoff) | Symmetry and no hanging runs |

New tests: `test_pipeline_history.py` (6), `test_llm.py` (4 at the time), `test_html_pipeline.py` (4), plus additions to the Anki, audio, feed and HTML runner tests.

### Templates, Gemini timeout and AFC (2 November, about 13:45)

| Decision | Why |
| --- | --- |
| `web_builder.py` loads Jinja templates from `templates/` next to the file (`Path(__file__).resolve().parent / "templates"`), not the working directory | Same fix as the stylesheet; the pipeline now runs from any folder |
| `GeminiClient` passes `http_options={"timeout": ...}` built from `REQUEST_TIMEOUT_SECONDS` (google-genai counts milliseconds, so 120 s = 120000) | Both adapters share one 120 s timeout; a stuck Gemini call can no longer hang the run |
| Gemini request config sets `"automatic_function_calling": {"disable": True}` | The pipeline gives Gemini no tools, so AFC did nothing except log `AFC is enabled with max remote calls: 10` on every call |

New tests in `tests/test_llm.py`: the Gemini client gets the timeout; `article.html` is found after changing to a temporary folder. Verified on the server: 105 passed, and a full one-article run started from `/tmp` built the EPUB, page, index, audio and Anki package. The AFC change went in after that run.

### Linking vocabulary on the page

Deterministic fallback in `web_builder.py`: exact match; vocab word = ruby text plus kana after it (集 → 集まる); kana before it only if the text before the tag ends with it (酒 → お酒); unique matches only, so ambiguous words (出: 出る / 出す) stay unlinked. Known limit: 通り can link to 通る.

### Audio crash

Root cause: `loudnorm` aborts ffmpeg's MP3 encoder on digital silence, triggered by a Whisper-invented outro ('ご視聴ありがとうございました', -inf dBFS). Fix in `slowrecord.py`: raise instead of `sys.exit`; only `rubberband` per clip; drop clips quieter than -50 dBFS (untested threshold, level is printed); one `loudnorm` pass on the combined file with a plain-export fallback; failing inputs kept in `/tmp/slowrecord_failures/`.

### Flags and email

- `--no-audio`: no audio at all (no slowed MP3, no combined MP3, no audio email).
- `--no-kindle`: no EPUB email only; the combined MP3 is still emailed.
- `--reprocess`: ignore processed history and do not update it; implies `--no-anki`.
- `--verbose`: DEBUG logging (now wired up).
- `--keep-md`: keeps both the `.md` and the `.txt` payload beside the EPUB.
- `--no-anki-import`: words are recorded as known once the package is built; otherwise only after a successful import.

### Anki

- `sys.exit` in `_setup_anki_manager` replaced by an error log and skipping the AnkiWeb import.
- Words already in `unique_vocab.json` are removed before the package is built; `occurrence_count` still increments.
- The 12-word daily cap is shared round-robin across articles.

## 3. Current state

**Repo.** Branch `feature/multiplellms` in `/home/nev/nhkeasy`. Last known commit `05beba2` (check `git status`). **Uncommitted as of the last check:** the 13:00 changes (logging, email type, `.txt` cleanup), the 14:00 changes to `pipeline.py`, `config.py`, `audio_runner.py`, `epub_runner.py`, `anki_runner.py`, `anki_pipeline.py`, `article_manager.py`, `fetch_rss.py`, `html_pipeline.py`, `html_runner.py`, `llm.py` and their tests, plus three new test files; and the 13:45 changes to `web_builder.py`, `llm.py` and `tests/test_llm.py`.

**Tests.** 105 passed on the server on 2 November after the template and timeout changes. One harmless warning (pydub imports the deprecated `audioop`, removed in Python 3.13).

**Verified on real runs (one article each, rough numbers):**

| Provider | Analysis time | Tokens (prompt / completion) | Notes |
| --- | --- | --- | --- |
| Gemini `gemini-3.8-flash` | 13 to 19 s | about 340 to 376 / 1,300 | Fills every field; 14 mappings |
| Groq `openai/gpt-oss-120b` | about 4 to 5 s | about 1,125 / 1,700 to 2,550 | `surface_mapping` empty in 2 of 3 runs; sentence count varied 6 to 7 |
| DeepSeek `deepseek-chat` | about 4 to 5 s | about 1,060 to 1,110 / 980 to 1,450 | Fewest tokens; readings correct; 8 to 9 mappings |

- Page linking, audio, Anki and email all worked on the 2 November runs: history saved per article, new words recorded only after a successful AnkiWeb import, combined MP3 emailed.
- Harmless warning on every provider: 'Paragraph count (N) mismatch with analysis sentences (M)'. NHK groups several sentences per paragraph; `_sync_sentence_translations` only logs it and changes nothing. Could be lowered to DEBUG.

**Pending on your machine.**
- Commit the uncommitted work.
- Confirm on the next Gemini run that the `AFC is enabled` line is gone.
- The 1 November test run marked 11 words as known in `unique_vocab.json`. Either import `epubs/nhkeasy_20261101.apkg` into Anki, or restore `vocabulary/unique_vocab.json.bak` and `feed/processed_history.json.bak` and delete the package.
- Old `.txt` payloads already in `~/.local/share/nhkeasy/epubs/` are not removed by the new code; delete them by hand if wanted.

**Environment.** Ubuntu server over SSH, `.venv`, ffmpeg 6.1.1, Python 3.12. Templates and CSS are now found from any folder (run from `/tmp` verified); `sudachi.py` still looks for `jlpt_data.json` in the working directory (see section 8). Data and outputs live in `~/.local/share/nhkeasy`.

## 4. Constraints

- No slower than before, and no regressions in code not asked to change.
- Pydantic stays; schema in `article_schema.py`.
- Claude as a provider is deferred, not rejected. Gemini stays the default model.
- JLPT levels from models are guesses (they changed between runs); readings were correct in every sample checked.
- `.env` holds `GEMINI_API_KEY`, `DEEPSEEK_API_KEY`, `GROQ_API_KEY` (also used by Whisper), the Kindle and MP3 addresses, SMTP settings and the AnkiWeb credentials. Never paste its contents (or any key) into a chat.
- The assistant reaches `/home/nev/nhkeasy` through the linked-computer bridge: list, copy files in, write files back. It cannot run commands on the server, so you run tests and pipeline commands and paste the output. `~/.local/share/nhkeasy` is out of reach unless that folder is linked too.

## 5. Open questions and next steps

In rough order of importance:

1. Decide what to do with the 11 test-run words (import the `.apkg` or restore the backups).
2. **Done (2 Nov):** audio recipient fallback removed.
3. **Done (2 Nov):** `send_to_kindle.py` import side effects, `--verbose`, MP3 attachment type.
4. **Done (2 Nov):** history saved per article; marked done only after a successful send.
5. **Done (2 Nov):** master vocabulary recorded only after a successful import (or package build with `--no-anki-import`).
6. **Done (2 Nov):** failed or empty feed keeps the old `articles.json`; 3-day minimum kept on purpose.
7. **Done (2 Nov):** index dates from `published`. Old manifest entries keep processing-time dates until those pages are regenerated.
8. Choose the default model after a few days of real runs (Gemini stays default for now; Groq fastest; DeepSeek fewest tokens and cleanest so far).
9. Tests still missing for `analysis_runner.py`, the `web_builder.py` matcher, `slowrecord.py`, and the remaining `nhkeasier_to_epub` branches (Gemini fallback, missing prompt). (`llm.py` adapters, template loading and pipeline history now have tests.)
10. Smaller items:
    - **Done (2 Nov):** dead options removed; one stylesheet (root, anchored to the code); one Anki vocabulary source, no per-article cap; duplicate log lines; Gemini retry and OpenAI timeout.
    - **Done (2 Nov, 13:45):** `web_builder.py` templates anchored to the code; Gemini request timeout; Gemini AFC turned off.
    - Still open: `vocab_extractor.py` is unused and can be removed after a few runs; `jlpt_data.json` path in `sudachi.py` (see section 8).
    - Katakana readings copied as hiragana (シート → しーと); kana-only vocabulary cannot be linked on the page. Accepted as is.
    - Clutter in the project root: unused files deleted by hand on 2 Nov, including `templates/styles.css`, the `.mp3`/`.wav` scraps and `PLAN.md`. Old log files (`log*.txt`, `audio_test.log`, `kindle_send.log`) are still there.
11. Act on the structure review document.

## 6. Handy commands

```
# normal run (today's articles only, Gemini)
python3 pipeline.py

# pick a model, widen the date window
python3 pipeline.py --model groq/openai/gpt-oss-120b --days-back 3
python3 pipeline.py --model deepseek/deepseek-chat

# iterate on EPUB formatting (no audio, no Anki, history untouched; add --keep-md to keep .md/.txt)
python3 pipeline.py --max-articles 1 --days-back 4 --no-audio --no-kindle --reprocess

# debug logging
python3 pipeline.py --verbose --max-articles 1 --days-back 4 --no-audio --no-kindle --reprocess

# audio to yourself without emailing the Kindle
python3 pipeline.py --no-kindle

# build the Anki package but do not import it
python3 pipeline.py --no-anki-import

# test without a Gemini key (inline values now beat .env)
GEMINI_API_KEY= python3 pipeline.py --model deepseek/deepseek-chat --max-articles 1 --days-back 4 --no-audio --no-kindle --reprocess

# check the pipeline runs from outside the project folder
cd /tmp && python3 ~/nhkeasy/pipeline.py --max-articles 1 --no-kindle

# tests
python3 -m pytest tests -q
```

Pitfalls: `--days-back` defaults to 0 (today only), which is why a run can report 'No new articles'. Starting from the project folder is no longer needed for templates or CSS, but stays the safe choice until the `jlpt_data.json` path is fixed.

## 7. Files the next chat should look at

| File | Why |
| --- | --- |
| This handoff, 'What the Project Does', 'Structure Review' | Context, decisions, improvement list |
| `pipeline.py`, `config.py` | Orchestration, logging setup and every flag |
| `llm.py`, `analysis_runner.py`, `article_schema.py` | Model layer and schema |
| `nhkeasier_to_epub.py`, `epub_runner.py`, `send_to_kindle.py` | Fetching, EPUB build, email |
| `web_builder.py`, `html_pipeline.py`, `html_runner.py`, `templates/article.html` | Pages and vocabulary linking |
| `anki_runner.py`, `anki_pipeline.py`, `anki_generator.py`, `pylibs/my_anki/anki_sync_lib.py` | Anki package and sync |
| `article_manager.py`, `fetch_rss.py` | History, master vocabulary, feed |
| `audio_runner.py`, `audio_pipeline.py`, `avlib/avlib/slowrecord.py` | Audio |
| `tests/` (ten files, 105 tests) | Behaviour the code must keep |

If the computer is linked to the new chat, these can be read straight from `/home/nev/nhkeasy`. Do not add `.env` or any file holding keys.

## 8. Notes on less-central files

- **Fetching (`nhkeasier_to_epub.py`).** nhkeasier.com pages are fetched with httpx; official NHK pages use a cookie-authenticated flow with Playwright as the last resort. The EPUB is Markdown built from the analysis (sentences in groups of three with an English block, then a vocabulary table), converted by Calibre's `ebook-convert`. A `.txt` copy of the text payload is written beside each EPUB and, since 2 Nov, removed with the `.md` after a successful conversion (kept with `--keep-md` or on failure).
- **Page (`templates/article.html`).** Dictionary mode needs the `D` key and mouse hover (no touch, no on-screen hint). The audio player streams the original NHK MP3, not the slowed audio, though the variable is named `slow_audio_path`. Article HTML is inserted unescaped.
- **Anki cards.** One card type; the front shows only the word; the back repeats the word (heading, Kanji row, ID row), then reading, meaning and JLPT level. No example sentence or audio.
- **JLPT data.** `jlpt/` holds Yomitan-style term-meta files, but `sudachi.py` loads `jlpt_data.json` from the working directory, which does not exist, so that lookup silently returns nothing.
- **`--only-slowrecord`** only affects history marking; other steps ignore it.
- **Still unread:** `templates/smartreader_index.html`, the other Anki templates, the insides of `jlpt/` and `pylibs/` beyond `anki_sync_lib.py`, the older root scripts.
