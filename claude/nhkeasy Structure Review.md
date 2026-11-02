# nhkeasy: Structure Review, Pros, Cons and Improvements

*An assessment of the project's structure and where it has got to. First written 2 November 2026 (12:30); updated the same afternoon (about 14:10) after the state, feed, logging, email, template-path and model-adapter fixes, a 105-test pass and a full run started from `/tmp`. Fixed items are marked **Done**; items re-checked against the current code are noted as such. Effort estimates are rough.*

## Verdict

For a personal pipeline, the project is in good shape, and better than it was this morning. It has a sound separation between decisions and I/O, caching that makes reruns cheap, per-article error isolation, a swappable model layer (Gemini default, DeepSeek and Groq working) and 105 passing tests. The biggest flaw at the start of the day, history and vocabulary being recorded at the wrong moment, is fixed: history is saved per article, an EPUB counts as done only after it is sent, and new words are recorded only after a successful Anki import. Templates and the stylesheet are found from any folder.

What remains is mostly about robustness and learning value: corrupt state files still reset to empty, one data path still depends on the working directory, a model still does some work Sudachi and the `jlpt/` data could do, and cards and pages carry little context from the article.

## Structure at a glance

| Layer | Modules | Role |
| --- | --- | --- |
| Orchestration | `pipeline.py` (about 270 lines) | Logging set-up, then the stages in order |
| Configuration | `config.py`, `.env` | Flags, paths, secrets |
| Model layer | `llm.py`, `analysis_runner.py`, `article_schema.py` | Provider adapters, prompt, output schema |
| Pure logic | `anki_pipeline.py`, `html_pipeline.py`, `audio_pipeline.py` | Decisions with no disk or network work |
| I/O shells | `anki_runner.py`, `html_runner.py`, `audio_runner.py`, `epub_runner.py`, `article_fetch_runner.py` | Files, network, processes |
| Fetch and EPUB | `nhkeasier_to_epub.py`, `send_to_kindle.py`, `fetch_rss.py` | Article download, EPUB build, email, feed |
| Rendering | `web_builder.py`, `templates/`, `styles.css`, `index_template.html` | Interactive article pages and index |
| Audio | `slowrecord.py` (in `avlib/avlib/`) | Whisper, sentence splitting, time-stretching |
| State | `article_manager.py` | History and vocabulary in JSON files |
| Anki | `anki_generator.py`, `pylibs/my_anki/anki_sync_lib.py` | Package building and sync |
| Unused by the pipeline | `vocab_extractor.py`, older root scripts | Candidates for removal |

## What works well

1. **A clear core / shell split.** The pure modules can be tested with almost no mocking, which shows the split is real.
2. **One readable orchestrator.** `pipeline.py` has one step per stage and now owns logging set-up (`setup_logging`, `--verbose` works).
3. **Caching.** Staged article HTML and saved analysis JSON make reruns and tests cheap.
4. **Per-article error isolation.** One failing article is logged and the rest still run; the remaining `sys.exit` calls below `main()` have been removed from helpers.
5. **State recorded at the right moment.** History is saved after each article; EPUBs are marked done only after a successful send; new words are recorded only after a successful import (or package build with `--no-anki-import`).
6. **Atomic saves.** History and the master vocabulary are written to a temporary file and then swapped in.
7. **A typed, symmetric model boundary.** Pydantic validates replies; both adapters retry invalid output and share one 120 s request timeout; Gemini's AFC (unused) is off.
8. **Location-independent assets.** Templates and `styles.css` are found next to the code, verified by a run from `/tmp`.
9. **No import-time side effects in the mail module.** `send_to_kindle.py` no longer loads `.env` or configures logging when imported; inline variables now beat `.env`.
10. **Flags for partial runs** (`--no-audio`, `--no-kindle`, `--reprocess`, `--no-anki-import`, `--keep-md`, `--verbose`), with the dead ones removed.
11. **Tests.** 105 pass across ten files, including the model adapters, pipeline history, HTML pipeline, email types and EPUB cleanup.
12. **Outputs that fit the purpose.** Read (page, EPUB), listen (slowed audio) and review (Anki) are all covered.

## Weaknesses

1. **Flat layout and path hacks.** About 25 modules sit in the project root, vendored folders (`avlib`, `pylibs`) are added with `sys.path.insert`, and there is no installable package.
2. **Naming and docstring drift.** Some pure modules' docstrings still say their I/O happens 'in pipeline.py' when it happens in the runners. `html_pipeline.py` calls `web_builder.py`, which loads templates and uses Sudachi, so it is less pure than its docstring says.
3. **Shared mutable accumulators.** Lists such as `generated_slow_files` are passed around and mutated, and `kindle_sent_count` is a one-item list used as a counter.
4. **Mixed output channels.** `slowrecord.py` and `anki_sync_lib.py` still use `print`; everything else uses `logging`.
5. **Remaining import-time work.** `config.py` calls `load_dotenv()` at import and its constructor creates ten directories; `sudachi.py` loads its data at import. Harmless in practice, awkward in tests.
6. **Blocking calls inside async functions.** Audio download, Whisper and ffmpeg run synchronously inside `async def`. Harmless while articles run one at a time.
7. **JSON files as the datastore.** Fine at this scale, but no locking, so two overlapping runs could overwrite each other.
8. **Test gaps.** Still no tests for `analysis_runner.py`, the `web_builder.py` vocabulary matcher, `slowrecord.py`, the config flag matrix, or the remaining `nhkeasier_to_epub` branches (Gemini fallback, missing prompt).

## Major flaws, ranked

| # | Flaw | Why it matters | Suggested fix | Effort |
| --- | --- | --- | --- | --- |
| 1 | **Done (2 Nov): state recorded at the wrong moment.** | History is now saved after each article; an EPUB is marked done only after a successful send (or build with `--no-kindle`); new words are recorded only after a successful import | — | — |
| 2 | **Corrupt state files fail open to empty** (re-checked in current code) | `ensure_unique_vocab_file` overwrites a corrupt `unique_vocab.json` with `{}`; `load_processed_history` and `load_unique_vocab` return empty on bad JSON. Either would regenerate every card or resend every EPUB | Move the bad file aside as `.corrupt` and stop with a clear error | Small |
| 3 | **One 'processed' flag for many outputs** | EPUB, page, audio and Anki share one bit, so partial reruns need hand-edited files and `--reprocess` has to disable Anki. A failed Kindle send now reruns the whole article | Per-article, per-output status, ideally in SQLite (which also adds locking) | Medium |
| 4 | **A model doing work a deterministic tool could do** | `surface_mapping` is filled unevenly by providers (Groq often empty), and JLPT levels changed between runs of one model | Use Sudachi for dictionary forms and reading checks, and the `jlpt/` data for levels; keep the model for translation and word choice | Medium |
| 5 | **Learning-content gaps** | Cards carry word, reading, meaning and JLPT level only: no example sentence, no audio, no article context. `occurrence_count` is stored but unused | See 'Learner-value improvements' | Medium |
| 6 | **Remaining hardcoded or working-directory paths** (re-checked) | `sudachi.py` opens `jlpt_data.json` from the working directory (and the file does not exist); `config.py` defaults the Anki collection to `/home/nev/pyprojects/...` when `ANKI_LOCAL_DATA` is unset; ffmpeg is pointed at `/usr/bin/ffmpeg`. Templates, CSS and the email fallback are **Done** | Anchor data paths on the file location; require `ANKI_LOCAL_DATA` or default under `~/.local/share/nhkeasy` | Small |
| 7 | **Everything runs sequentially** | Analysis (4 to 19 s) and audio (about 15 to 20 s) run one article after another. Not a problem at about four articles a day | Run model calls concurrently with a small limit and move blocking calls to threads, if run time matters | Small to medium |
| 8 | **`SystemExit` for recoverable problems** | Mostly fixed (`slowrecord.py`, `anki_runner.py`, `nhkeasier_to_epub.load_system_prompt`). Left on purpose: the missing-articles-file exit in `pipeline.py` and the audio preflight | Leave as is; both are top-level start-up checks | — |

## Findings from the remaining files

Status as of 2 November, afternoon.

1. **Done:** the EPUB step no longer depends on Gemini.
2. **Done:** `requirements.txt` includes `openai`.
3. **Done:** `send_to_kindle.py` has no import-time side effects; `--verbose` wired up.
4. **Done:** the combined MP3 is sent as `audio/mpeg` with its own subject; no hardcoded recipient fallback.
5. **Done:** a failed or empty feed keeps the old `articles.json`. The 3-day minimum is kept on purpose.
6. **Done:** index dates come from `published`. Pages already in `manifest.json` keep processing-time dates until regenerated.
7. **Open: dictionary lookup is desktop-only.** Needs the `D` key and mouse hover; no on-screen hint, no touch. The page's audio player streams the original NHK MP3, not the slowed audio. Medium.
8. **Open: Anki cards are thin and cluttered.** The front shows only the word; the back repeats it three times before reading and meaning; no sentence or audio. Small to medium.
9. **Done:** one vocabulary source for Anki (the analysis `side_vocab`), no per-article cap, daily 12 shared round-robin. `vocab_extractor.py` is now unused and can be deleted after a few runs.
10. **Open: level data not wired in.** `sudachi.py` loads a `jlpt_data.json` that does not exist, so the lookup silently returns nothing. Medium.
11. **Done:** one stylesheet (root `styles.css`, anchored to the code); `templates/styles.css` deleted.
12. **Done:** adapter symmetry. Gemini retries once on invalid output; both clients have a 120 s timeout; Gemini AFC is off. Rate-limit backoff is left to the SDKs (the OpenAI SDK retries 429/5xx).
13. **Done:** duplicate log lines moved to DEBUG.
14. **Mostly done: clutter.** Audio scraps, `*.backup`, `PLAN.md` and `templates/styles.css` are gone. Still in the root: old logs (`audio_test.log`, `kindle_send.log`), `delete_rss_files.sh`, and the older scripts (`build_epub.py`, `extract_article.py`, `generate_epub.py`, `jinja_render.py`, `main_jinja.py`, `main_smartreader.py`, `test_fetch.py`). Confirm none are used, then move to `old/` or delete.
15. **New, harmless: paragraph/sentence count warning.** NHK groups several sentences per paragraph, so 'Paragraph count (N) mismatch with analysis sentences (M)' appears on every article. `_sync_sentence_translations` only logs it; lower it to DEBUG or remove the check. Small.
16. **New: `claude/` folder in the repo.** It now holds copies of the project docs. Commit it or add it to `.gitignore`.

## Improvement roadmap

**Quick wins (an hour or less each)**

- Keep corrupt state files (`.corrupt`) and stop, instead of resetting them to empty.
- Anchor `jlpt_data.json` (or the `jlpt/` folder) to the code location, and make the Anki collection path come from config only.
- Lower the paragraph-count warning to DEBUG.
- Delete `vocab_extractor.py` and the older root scripts once confirmed unused.
- Switch `slowrecord.py` and `anki_sync_lib.py` from `print` to `logging`; add an end-of-run summary (articles, emails, tokens, words added).
- Note the non-Python requirements: ffmpeg with rubberband, Calibre's `ebook-convert`, the Playwright browser.

**Medium**

- Tests: a fake `LLMClient` for `analysis_runner`, the `web_builder.py` matcher, a config flag matrix, the remaining `nhkeasier_to_epub` branches, and a golden-file test on one staged article.
- A per-output status store (SQLite).
- Deterministic linking and reading checks with Sudachi; levels from `jlpt/`.
- A package layout (`src/nhkeasy/` with an entry point) to remove the `sys.path` hacks.
- Replace pydub's dependence on `audioop` before moving to Python 3.13.
- An optional fallback provider through the `LLMClient` seam.

**Larger**

- Concurrency for model and audio steps, and a `--dry-run` showing what would be generated and sent.
- Progress tracking on the index page, only if wanted.

## Learner-value improvements

- **Context on every card.** Add an example sentence from the article, and optionally the matching audio clip, since the pipeline already cuts audio sentence by sentence.
- **Use the occurrence data.** Prefer new words and bring back words that keep appearing, using `occurrence_count` and first-seen dates.
- **Control difficulty.** Filter or tag by level using a real word list, with a learner-level setting.
- **Grammar notes.** One or two per article; needs a schema field and a template slot.
- **Sentence audio on the page.** Tap a sentence to hear it at 1.0x, 0.8x or 0.7x.
- **Touch-friendly dictionary.** Tap instead of `D` plus hover, with an on-screen hint.
- **Output checks.** Warn when a model returns fewer than 10 vocabulary items, an empty mapping, or readings that disagree with Sudachi.
- Katakana readings copied as hiragana (シート → しーと) and kana-only words not linkable on the page: **accepted as is**.

## Risks and cautions

- **Content and terms.** The pipeline copies NHK article text and audio into EPUBs, pages and emails. Fine for personal study, but check NHK's and nhkeasier.com's terms before publishing or sharing outputs. The official-NHK fetch path works around NHK's consent page with session cookies and a curl user agent; the normal flow uses nhkeasier.com and does not need it, so check it is consistent with NHK's terms or remove it.
- **Secrets.** Keys live in `.env`, which `.gitignore` covers. A Gemini key exposed on 2 November has been replaced; never paste keys into chats or command lines.
- **Model drift.** Model names and behaviour change. Gemini stays the default; pin versions where possible and keep a sample article as a regression test.
- **Tool versions.** ffmpeg filters, the `anki` package, genanki and pydub (Python 3.13 drops `audioop`) behave differently across versions.
- **Uncommitted work.** Most of the 2 November changes are not yet committed on `feature/multiplellms`.

## Basis of this review

**Reviewed (first pass 2 Nov):** `pipeline.py`, `config.py`, `llm.py`, `analysis_runner.py`, `article_schema.py`, `web_builder.py`, `html_pipeline.py`, `html_runner.py`, `anki_runner.py`, `anki_pipeline.py`, `anki_generator.py`, `anki_sync_lib.py`, `article_manager.py`, `vocab_extractor.py`, `audio_runner.py`, `audio_pipeline.py`, `slowrecord.py`, `epub_runner.py`, `article_fetch_runner.py`, `fetch_rss.py`, `utils.py`, `send_to_kindle.py`, `sudachi.py`, `nhkeasier_to_epub.py`, `prompt_nhkeasier.md` (opening), `templates/article.html`, the `nhkeasy_*` Anki templates, `requirements.txt`, `.gitignore`, the run logs and the test files.

**Re-checked this afternoon:** `web_builder.py`, `llm.py`, `html_runner.py`, `config.py`, `article_manager.py`, `pipeline.py`, `sudachi.py`, `requirements.txt`, `tests/test_llm.py`, the project-root listing, and the 2 November test and pipeline run output. Other 'Done' items are taken from the Handoff Summary and the passing tests rather than a fresh read.

**Not reviewed:** `templates/smartreader_index.html`, `index_template.html`, the other Anki templates, the `jlpt/` data, the insides of `avlib/` beyond `slowrecord.py` and `pylibs/` beyond `anki_sync_lib.py`, and the older scripts at the project root.
