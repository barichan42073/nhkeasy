# nhkeasy — Index Page Handoff (2026-11-05)

Covers the index page rework: the files that build `index.html`, the changes
made on 2026-11-05, the one-off repair of the laptop's manifest, and open
items. Use it as the starting point for further index work.

## 1. How the index is built

```
pipeline.main()
  └─ for each new article: html_runner.write_article_html_output()
       └─ html_pipeline.build_article_html_payload()   → article page + metadata entry
  └─ html_runner.write_smartreader_index()
       ├─ _load_manifest()                              html_output/manifest.json
       ├─ html_pipeline.compute_index_render_data()     merge, sort, group, split
       ├─ render index_template.html                    → index.html
       ├─ _write_archive_page()                         → archive.html (same template)
       └─ _save_manifest()
```

| File | Role |
|---|---|
| `html_pipeline.py` | Pure core: metadata entry, reading stats, sorting, grouping, archive split |
| `html_runner.py` | I/O shell: loads and saves the manifest, renders and writes index/archive, copies `styles.css` |
| `index_template.html` | Jinja template for both `index.html` and `archive.html` (`is_archive` flag) |
| `templates/article.html` | Article page; now also records "read" in localStorage |
| `styles.css` | Shared by the index and article pages; the index rules come first |
| `analysis_runner.py`, `article_schema.py` | Prompt and schema text for the English kicker |

Output (laptop): `~/.local/share/nhkeasy/` → `index.html`, `archive.html`,
`styles.css`, `html_output/` (`manifest.json`, `styles.css`, article pages).
`run_and_publish.sh` rsyncs this to `/var/www/html`.

**The index is only rebuilt when a run processes at least one new article.**
`pipeline.main()` returns early when there is nothing new, before
`write_smartreader_index()` is reached. So changing the template has no visible
effect until the next new article, or a manual rebuild (see section 7).

## 2. Data contract

### Manifest entry (`html_output/manifest.json`, one per article)

| Key | Notes |
|---|---|
| `id` | Feed id, e.g. `https://nhkeasier.com/story/10085/` |
| `title` | Japanese title |
| `date` | ISO 8601 with an offset. New entries come from the feed's `published` value. |
| `relative_path` | `html_output/<file>.html`. Older entries without the prefix get it added when loaded. |
| `image_url` | Hotlinked from nhkeasier.com |
| `kicker` | Raw model output. It is cleaned only for display, never in the manifest. |
| `char_count`, `kanji_count`, `reading_minutes`, `n1_count`, `n2_count` | Reading stats. Added 2026-11-05; may be missing on older entries, and the template copes. |

`new` and `date_obj` are added in memory only and stripped before saving.

### Template context (`compute_index_render_data()["template_data"]`)

`lead_article`, `today_grid_articles` (next 3), `older_articles_grouped` (day
groups within the window), `archive_groups` (older day groups),
`index_recent_days`, `current_date_japanese`, `current_date_japanese_title`,
`current_date_iso`, `current_date_obj`. For `archive.html` the runner also passes
`is_archive=True`, with `older_articles_grouped` set to the archive groups.

Each article passed to the template has `date` converted to JST and `kicker`
cleaned. Each day group has `day`, `date_iso`, `date_japanese`
(`2026年11月2日（月）`) and `articles`.

## 3. Layout and ordering rules (`html_pipeline.py`)

- **Time zone.** Dates are converted to `JST` (fixed +09:00) for display and
  grouping. Entries stored without a time zone are treated as UTC.
- **Sort key** (`_index_sort_key`): JST day, then story number, then
  timestamp, all descending. Story number (`story_number()`, from `/story/NNNNN`
  in `id` or `link`) follows NHK's publication order even when a stored time is
  wrong. Entries without a number sort after numbered ones on the same day.
- **Top block (最新):** the lead article plus the next 3. This "1 + 3" rule is
  covered by `test_compute_index_render_data_caps_at_4_photo_articles`.
- **Day sections:** everything after the top block, grouped by JST day.
- **Archive split:** `INDEX_RECENT_DAYS = 10` calendar days, counted back from
  the **newest article** (not today), inclusive. Older days go to `archive.html`.
  The archive link only appears when the archive has articles.
- **Kicker cleanup** (`clean_kicker`): trims whitespace and a trailing `.` or `。`.
  Title Case is requested in the prompt but not enforced in code.
- **Reading stats** (`compute_reading_stats`): `analysis.sentences` with the
  `[furigana]` brackets and whitespace removed. Kanji are counted in CJK
  Unified Ideographs plus Extension A. `reading_minutes = ceil(chars / 200)`
  (`READING_CHARS_PER_MINUTE`). Only N1 and N2 vocab are counted.
- **Article filenames:** new pages are `story_<number>.html`, falling back to the
  old sanitised title + id if there is no number. Existing pages keep their
  old names, and their manifest paths are still valid.

## 4. Template and front end (`index_template.html`)

- **Head and headings:** a viewport meta tag. The logo is the page `h1`, each
  day section's heading is an `h2`, and card titles are `h3.title`.
- **Card macro:** a single `article_card(article, lead=False)` macro.
  - Images have `alt=""`, `loading="lazy"` (the lead uses `fetchpriority="high"`)
    and `decoding="async"`. Layout shift is already prevented by the fixed
    `.photo` heights in the CSS.
  - The kicker has `lang="en"`.
  - Meta line: time, 約N分, N字, N1×n, N2×n, NEW, and 既読 (hidden unless read).
- **Attribution:** the old per-photo "NHK NEWS EASY" badge is gone; the footer
  carries the NHK credit instead.
- **Inline script:**
  - Reads `localStorage["nhkeasy-read"]` (an object of `pathname → timestamp`)
    and adds `.is-read` to the matching cards.
  - The search box (`#filter`) matches `data-search` (lowercased title +
    kicker) and hides empty sections. It shows `#no-results` when nothing
    matches.
  - The 既読を隠す checkbox (`#hide-read`) is remembered in
    `localStorage["nhkeasy-read-hide"]`.
  - All storage access is wrapped in try/catch.
- **Article page:** `templates/article.html` writes `location.pathname` into
  `nhkeasy-read` on load. On 2026-11-05 the same snippet was also added
  directly to the 35 existing pages in the laptop's `html_output/`.
- **CSS (`styles.css`):**
  - New rules: `.lead .title` and `.card .title` (replacing `h1` and
    `.card h2` for cards), `.day`/`.day-heading`, `.toolbar`, `.badge*`,
    `.is-read`, `[hidden]{display:none !important}` (needed because `.card`
    sets `display:block`), `.more-link`, `.empty`.
  - `.grid` uses `auto-fill`, so a day with one article keeps normal card
    width.
  - At ≤700px the header wraps rather than breaking the logo.
  - About 40KB of trailing whitespace was removed. Use `git diff -w` to see
    the real changes.

## 5. Prompt change

`analysis_runner.build_analysis_prompt()` and the `ArticleAnalysis.kicker`
field description now ask for an English kicker of at most 8 words, in Title
Case, as a phrase, with no full stop. Only articles analysed from now on are
affected; staged analysis JSON keeps the old kickers.

## 6. One-off data repair (laptop only, 2026-11-05)

These changes were made directly in `~/.local/share/nhkeasy/`, not through the
code:

1. **`html_output/manifest.json`:** 30 of 35 `date` values were pipeline run
   times rather than NHK's. Each was replaced with the `<time datetime>` from
   that article's saved NHK page in `staging/`, stored in JST. Example:
   10069 went from `2026-10-29T10:57Z` to `2026-10-28T20:10+09:00`.
2. **Reading stats backfilled** from `smartreader/*_analysis.json` for 34
   entries. 10068 (柿の日) has no analysis file, so it has no stats.
3. **`index.html` and `archive.html` regenerated** with the new code. The
   index covers 10/26–11/4 and the archive holds 10/21–10/23.
4. **Read snippet** added to the 35 existing article pages.

There was no backup of the old manifest in that folder, and it isn't under git.

## 7. Verified

- `tests/test_html_pipeline.py` and `tests/test_html_runner.py`: 35 passing (8
  new). These were run in a sandbox with stand-in `sudachipy` and LLM SDK
  modules, **not yet on the laptop or the server**.
- Rendered with the real manifest in headless Chromium at 1200px and 390px:
  - no JS errors and no horizontal scroll;
  - the filter, the hide-read toggle, the no-results message and the archive
    page all worked.

```bash
pytest tests/test_html_pipeline.py tests/test_html_runner.py -q
```

Manual index rebuild (no new articles needed):

```python
import asyncio
from types import SimpleNamespace
from pathlib import Path
import html_runner
d = Path.home() / ".local/share/nhkeasy"
asyncio.run(html_runner.write_smartreader_index(
    SimpleNamespace(nhkeasy_dir=d, html_output_dir=d / "html_output"), set(), []))
```

## 8. Open items

1. **Not committed.** The code changes are in the laptop working tree only.
   Commit, push, and `git pull` on the server.
2. **The server's manifest still has the bad dates and no stats.** The repair
   in section 6 was laptop-only, and the repair script isn't in the repo.
   Either repeat it on the server (read `<time datetime>` from `staging/*.html`
   and stats from `smartreader/*_analysis.json`, matched by story number) or
   add a small `repair_manifest.py`.
3. **The index only rebuilds when there are new articles** (section 1).
   Consider calling `write_smartreader_index()` on every run, or adding a
   `--rebuild-index` flag.
4. **Read state is per browser and keyed by path.** It doesn't sync between
   devices. Reprocessing an old article now gives it a `story_N.html` name, so
   its read flag is lost and the old file is left behind.
5. **Images are hotlinked** from nhkeasier.com. Old cards break if NHK removes
   the images. Option: download them during the run into `html_output/img/`.
6. **`archive.html` is never deleted.** If the archive becomes empty, the stale
   file remains but isn't linked.
7. **NEW** only marks articles processed in the current run, so it disappears
   on the next run. With read tracking, "unread" may be the more useful signal.
8. **Header date** uses `datetime.now(timezone.utc)` in `html_runner`, not JST
   or local time.
9. **Search** only covers the page it's on; the index and the archive are
   searched separately.
10. **`templates/article.html`** has no viewport tag and relies on inline
    styles. Its mobile layout hasn't been reviewed.
11. **Tuning:** the 200 chars/min reading speed and the 10-day window are
    guesses. Both are constants in `html_pipeline.py`.

## 9. Ideas not started

- Show the full vocab-level breakdown (N3 and below) or a single difficulty
  score per card.
- Add topic tags (weather, disaster, politics, …) from the analysis, with tag
  filters on the index.
- Add a "study queue" of unread articles sorted by reading time.
- Use one shared stylesheet structure, so index and article rules stop sharing
  global selectors such as `h1`.
