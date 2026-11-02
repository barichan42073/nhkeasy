# nhkeasy: What the Project Does

*A plain-language summary for anyone picking the project up. First written 2 November 2026 during the multi-LLM refactor; updated the same afternoon (about 14:30) to match the current code: state saved per article, words recorded after a successful Anki import, one vocabulary source, the EPUB step free of Gemini, and templates found from any folder. The few modules not yet read are listed at the end.*

## Purpose

nhkeasy builds study material from NHK Easy News (articles from nhkeasier.com) for non-native learners of Japanese. Each time it runs, it fetches the new articles and produces, for each one, something to read, something to listen to and something to review. It is a personal automation pipeline run from the command line, not a web service.

## What a learner gets

| Output | What it is | Where it ends up |
| --- | --- | --- |
| EPUB | The article as an ebook, built from the AI analysis: sentences in groups of three, each followed by its English translation, then a vocabulary table, converted with Calibre's ebook-convert | `epubs/`, and optionally emailed to a Kindle |
| Interactive article page | The NHK text with furigana. Words that match the vocabulary list are linked: press the D key to switch on dictionary mode, then hover to see reading, meaning and JLPT level (mouse and keyboard only). Sentence-by-sentence English translations with furigana added, plus a player for the original NHK audio (not the slowed version) | `html_output/` |
| Index page | A front page for the day: a lead article, a grid of the next three, and older articles grouped by publication date, driven by a `manifest.json` | `index.html` |
| Slowed practice audio | NHK's audio cut sentence by sentence. Each sentence plays at normal speed, then 0.8x, then 0.7x, with a half-second pause. All articles from the run are joined into one MP3 and emailed (as `audio/mpeg`, subject 'NHK Easy slowed audio'), to listen to on a phone | `combined_slowed.mp3` |
| Anki deck | A daily package named `nhkeasy_<date>.apkg` in the deck NHKeasynews, with up to 12 new words per day (word, reading, meaning, JLPT level). It can be imported into Anki and synced to AnkiWeb | `epubs/` (or `--anki-output-dir`), then Anki |

## How a run works

1. **Start-up.** Read the command-line flags and `.env`, set up logging (`--verbose` for DEBUG), and build the chosen AI client. A missing key fails here, before anything is fetched or emailed.
2. **Fetch the feed.** `fetch_rss.py` refreshes `articles.json` from the nhkeasier.com feed, always keeping at least the last 3 days whatever `--days-back` says. If the download fails or the feed is empty, the existing `articles.json` is kept.
3. **Checks.** Confirm the audio prerequisites and make sure the master vocabulary file is valid.
4. **Choose articles.** Keep those not in the processed history and published since the cutoff (`--days-back`; 0 means today only), then apply `--max-articles`.
5. **For each article, one at a time** (a failure is logged and the next article still runs):
   - Fetch and stage the article HTML. The page is fetched with httpx (Playwright is the fallback) and cached on disk; the cached copy is never refreshed.
   - Run the AI analysis and save it as JSON, which `--use-staged-analysis` can reuse.
   - Build the EPUB and, unless `--no-kindle`, email it to the Kindle. The article counts as done only after the email succeeds (or once the EPUB is built, with `--no-kindle`), so a failed send is retried next run.
   - Build the interactive HTML page.
   - Audio: download NHK's MP3, transcribe it with Groq Whisper, split it into sentences (a sentence splitter plus pause detection), and build the repeated, slowed version.
   - Save the processed history (skipped with `--reprocess`), so a crash later in the run does not resend EPUBs.
6. **After all articles.**
   - Write the index page and manifest, and copy `styles.css` beside them.
   - Anki: take each article's vocabulary list (the same list the page uses), drop words already in the master vocabulary, pick up to 12 spread round-robin across articles, and write the `.apkg`. Unless `--no-anki-import`, import it and sync to AnkiWeb. New words are added to the master vocabulary only after a successful import (or, with `--no-anki-import`, once the package is built); if the import fails, they are not recorded and the package is kept for another try.
   - Combine the slowed audio into one MP3 and email it to `COMBINED_MP3_EMAIL`; if that address is unset, an error is logged and nothing is sent.
   - Save the processed history once more.

## AI models

- **One request per article.** The reply is a structured object with the Japanese and English titles, a short kicker, sentence-by-sentence translations, 10 to 15 vocabulary items (word, hiragana reading, contextual meaning, JLPT level), and a mapping from the kanji stems inside ruby tags to dictionary forms.
- **Provider choice.** `--model provider/model` selects Gemini (the default, `gemini/gemini-3.8-flash`), DeepSeek or Groq; Claude can be added later as a third adapter. Gemini uses its native strict-schema mode and retries once on an empty or invalid reply. DeepSeek and Groq use an OpenAI-compatible adapter: JSON mode, the schema placed in the prompt, validation, and up to two retries that feed the error back. Both adapters stop a request after 120 seconds.
- **Audio transcription is separate.** Whisper always runs on Groq and needs `GROQ_API_KEY`, whichever model analyses the text.
- **Caveats.** JLPT levels are the model's estimate and can differ between runs. Results are cached per article. The EPUB step needs `GEMINI_API_KEY` and `prompt_nhkeasier.md` only in its fallback path, when no analysis is supplied; the normal pipeline always supplies one.

## Configuration

| Flag | Effect |
| --- | --- |
| `--days-back N` | Articles from the last N days; 0 (the default) means today only |
| `--max-articles N` | Process at most N articles |
| `--model provider/model` | Model for analysis; default `gemini/gemini-3.8-flash` |
| `--api-key-env NAME` | Environment variable that holds the key |
| `--use-staged-analysis` | Reuse a saved analysis instead of calling the model |
| `--reprocess` | Ignore and do not update the processed history; implies `--no-anki` |
| `--no-audio` | Skip all audio, including the combined MP3 and its email |
| `--no-kindle` | Do not email EPUBs (the combined MP3 is still emailed) |
| `--no-anki`, `--no-anki-import` | Skip Anki entirely, or build the package but do not import it |
| `--keep-md` | Keep the EPUB's `.md` source and `.txt` text copy (normally deleted after a successful build) |
| `--keep-slow-mp3` | Keep the per-article slowed MP3s after combining |
| `--verbose` | DEBUG logging |
| `--anki-output-dir`, `--only-slowrecord`, `--generate-html`, `--feed-source` | Other options |

| `.env` variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY`, `DEEPSEEK_API_KEY`, `GROQ_API_KEY` | Model keys (the Groq key is also used for Whisper) |
| `KINDLE_EMAIL` | Address for EPUBs |
| `COMBINED_MP3_EMAIL` | Address for the combined audio (no fallback) |
| `ANKIWEB_USER`, `ANKIWEB_PASS` | AnkiWeb login for importing |
| `ANKI_LOCAL_DATA` | Path to the local Anki collection used for syncing (falls back to a hardcoded path if unset) |

Email delivery also reads `SMTP_SERVER`, `SMTP_PORT` (default 587; 465 uses SSL), `SMTP_USERNAME` (or `SMTP_USER`), `SMTP_PASSWORD` and, optionally, `SENDER_EMAIL`. `.env` is loaded once, when `config.py` is imported, without override, so variables set in the shell or inline on the command line win over `.env`.

## Where files live

Everything is under `~/.local/share/nhkeasy/`:

| Folder or file | Contents |
| --- | --- |
| `feed/` | `articles.json`, `processed_history.json` |
| `staging/` | Raw article HTML |
| `smartreader/` | One analysis JSON per article |
| `epubs/` | EPUBs and Anki packages (the `.md` and `.txt` working files are removed after a successful build unless `--keep-md`) |
| `html_output/` | Article pages, `manifest.json`, `styles.css` |
| `index.html` | The index page |
| `audio/`, `slow_audio/` | Downloaded and per-article slowed MP3s (removed after use unless `--keep-slow-mp3`) |
| `combined_slowed.mp3` | The audio that gets emailed |
| `vocabulary/unique_vocab.json` | Every word that has become a card, with first-seen date and occurrence count |

The code itself can be run from any folder: templates and `styles.css` are found next to the code. The one exception is `sudachi.py`, which looks for `jlpt_data.json` in the current folder (the file does not exist, so that lookup returns nothing).

## Design in brief

The code follows a functional-core / imperative-shell split. The `*_pipeline.py` modules (`anki_pipeline`, `html_pipeline`, `audio_pipeline`) hold the pure decisions; the `*_runner.py` modules (`anki_runner`, `html_runner`, `audio_runner`, `epub_runner`, `article_fetch_runner`) do the file, network and process work. `pipeline.py` sets up logging and orchestrates the stages, `llm.py` is the model layer, and `config.py` holds the flags and paths. Supporting modules include `article_manager` (history and vocabulary files), `web_builder` (page rendering and vocabulary linking), `slowrecord` (audio), `anki_generator`, `anki_sync_lib`, `send_to_kindle` (email for both EPUBs and audio), `fetch_rss`, `utils` and `sudachi`. `vocab_extractor.py` is no longer used by the pipeline. 105 tests in `tests/` cover the pure modules, the runners, the model adapters, email and pipeline history.

## Reviewed since, and still unread

Since the first version, `epub_runner.py`, `article_fetch_runner.py`, `fetch_rss.py`, `utils.py`, `send_to_kindle.py`, `audio_pipeline.py`, `sudachi.py`, `nhkeasier_to_epub.py`, the page template and the Anki card templates have been read, and the 2 November changes are reflected above.

Still unread: `templates/smartreader_index.html`, `index_template.html`, the other Anki templates, `prompt_nhkeasier.md`, the `jlpt/` data, the insides of `avlib/` and `pylibs/`, and the older scripts at the project root (`build_epub.py`, `extract_article.py`, `generate_epub.py`, `jinja_render.py`, `main_jinja.py`, `main_smartreader.py`, `test_fetch.py`).
