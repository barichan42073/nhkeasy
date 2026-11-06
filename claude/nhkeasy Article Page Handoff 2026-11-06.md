# nhkeasy — Article Page Handoff (2026-11-06)

Starting point for the next chat on the **article page**:

1. Furigana switching doesn't work properly.
2. The furigana banner (the Always / On tap / Off control in the header) seems to disappear.
3. Responsive layout: vocab list **below** the article on a phone, **beside** it on a tablet.

Read with `nhkeasy Index Page Handoff 2026-11-05.md`, which covers the index
page, the manifest and the data repair.

## 1. Where things live

### Laptop (`nev-thinkpad-t14-gen-1`, Linux Mint)

| Path | What |
|---|---|
| `~/nhkeasy/` | Code (git repo) |
| `~/nhkeasy/templates/article.html` | Article page template |
| `~/nhkeasy/templates/_site_header.html` | Shared header: brand, furigana control, menu (About/Credits) |
| `~/nhkeasy/site.js` | Shared JS: furigana modes, menu |
| `~/nhkeasy/styles.css` | One stylesheet for the index and article pages |
| `~/nhkeasy/web_builder.py` | Builds the article body HTML (NHK `<ruby>` tags plus dictionary data) |
| `~/nhkeasy/html_runner.py` | Writes pages; `_copy_styles_css()` copies `styles.css` and `site.js` |
| `~/.local/share/nhkeasy/` | Generated output: `index.html`, `archive.html`, `styles.css`, `site.js`, `html_output/` (article pages, `manifest.json`, copies of `styles.css` and `site.js`) |

### Server and website

- The pipeline also runs over **SSH on an Ubuntu box**, inside a `.venv`.
  The server's `.env` has `GEMINI_API_KEY` and `DEEPSEEK_API_KEY`. See
  `nhkeasy Handoff Update 2026-11-03.md`.
- **`run_and_publish.sh`** runs `pipeline.py "$@"` and then rsyncs
  `~/.local/share/nhkeasy/` to **`/var/www/html/`**, which nginx serves. The
  rsync excludes `feed/`, `staging/`, `smartreader/`, `epubs/`, `audio/`,
  `vocabulary/`, `combined_slowed.mp3` and `*.apkg`.
- **Public site:** <https://easynhknews.com/>, named **Easy NHK News**.
- **Deployment (confirmed by the user 2026-11-06):** the Ubuntu box and
  the **Oracle VM are the same machine**. Workflow on the VM: `git pull`, then
  `run_and_publish.sh` (runs `pipeline.py` and rsyncs to `/var/www/html/` on
  the VM), then a **manual `wrangler` deploy** to the **Cloudflare Pages**
  site that hosts easynhknews.com. Wrangler login and a Cloudflare API token
  are already set up on the VM, and a manual deploy has been run.
- The furigana/menu work is committed on branch **`feature/indexpage`**
  ("Rework index page; add site header, menu and furigana modes"), not yet
  merged to `main`. Whether the VM has pulled it is still unconfirmed.

### Viewing the generated pages locally

```bash
cd ~/.local/share/nhkeasy && python3 -m http.server 8000
# open http://localhost:8000/   (Ctrl+C to stop)
```

Serve over http rather than opening the files directly, so localStorage (the
furigana mode and read tracking) behaves as it does on the site.

## 2. How furigana modes work now

Added after the 2026-11-05 index work, in another session.

- **Storage:** `localStorage["nhkeasy-furigana"]` = `all` | `tap` | `off`
  (default `tap`).
- **Class on `<html>`:** `furi-all`, `furi-tap` or `furi-off`. An inline
  script in the `<head>` of `article.html` sets it before first paint, and
  `site.js` keeps it in sync.
- **Controls (`_site_header.html`):** the `.furi-control` group of three
  `.furi-btn[data-furi]` buttons. It's only rendered when
  `show_furigana=True`, which article pages pass and the index doesn't.
- **`site.js`:**
  - `init()` only wires furigana if `.furi-control` exists.
    - Buttons call `applyMode(mode, true)`, which sets the class, sets
      `aria-pressed`, clears revealed words and saves the mode.
    - In `tap` mode, a document click on a `<ruby>` toggles `.furi-shown`. It
      ignores the header and active text selections.
    - The **F** key cycles all → tap → off, ignoring modifier keys and
      inputs.
  - It also handles the menu: the toggle button, closing on Escape, and
    closing on an outside click.
- **CSS (end of `styles.css`, "Furigana modes"):**
  - `html.furi-off rt` and `html.furi-tap rt` are hidden.
  - `html.furi-tap ruby.furi-shown rt` is shown.
  - On `(hover: hover)` devices, `html.furi-tap ruby:hover rt` is shown.
- **Older CSS that still applies (around line 393):**
  - `ruby { ruby-position: over }`;
  - `rt { visibility: visible; font-size: .55em }`;
  - unused-looking `.mode-none`, `.mode-hard` and `body.show-furigana` rules.
- **Inline rules:** `article.html` also sets `ruby rt { font-size: .65em }`.
- **Dictionary mode:** a separate **D** toggle in `article.html`
  (`dictionary-active`, with hover tooltips on `.dict-word-target`). It's
  added by `web_builder._enrich_ruby_tags`, and the tooltip handler is
  mouse-only.

### Ruby sources on the page

- **Article body:** NHK's own `<ruby>` tags (kanji only), enriched with
  `data-dict-*` attributes.
- **Sentence translation panel:** `item.japanese_html`, which may be generated
  by `_generate_furigana_html_for_text` (Sudachi). Not yet checked.

## 3. Findings so far (2026-11-06)

### Most likely cause of "the banner disappears"

Only **1 of 36** article pages was built with the new template. In
`~/.local/share/nhkeasy/html_output/`:

| Page | `.furi-control` | loads `site.js` | head script | header |
|---|---|---|---|---|
| `story_10089.html` (built after the furigana work) | yes | yes | yes | `<header class="site-header" id="article-header">` |
| the 35 older `*_https___nhkeasier.com_story_*_.html` pages | **no** | **no** | **no** | old `<header id="article-header">` with `.logo` |

Opening any older article therefore shows no furigana control. Those pages
also load the **new** shared `styles.css`, so they get the new header and
furigana CSS without the matching markup. With no `furi-*` class on `<html>`,
furigana falls back to the old `rt { visibility: visible }`, which means always
on, with no way to switch.

The older pages are never rebuilt, because the pipeline only writes pages for
articles in the current run. (On 2026-11-05 a read-tracking snippet was added
to those 35 files by hand; nothing else changed in them.)

**Likely fix:** a way to rebuild every article page from the saved
`staging/*.html` and `smartreader/*_analysis.json` files. That could be a
`--rebuild-html` flag or a small script using
`html_pipeline.build_article_html_payload()` and `render_interactive_page()`.
Story 10068 has no analysis JSON, so it would need a special case or to be
reprocessed.

### Still to investigate for "switching doesn't work properly"

Test on `story_10089.html`, which has the new code, before changing anything.

- Does each button and the F key change the `<html>` class and save the mode?
  Check in DevTools.
- **Tap mode on touch devices:**
  - Does `(hover: hover)` reveal a word on first tap, and then the click
    handler toggle it straight back off?
  - Does a tap on a ruby inside a link or a dictionary target behave?
- **Sentence translation panel:** are its `<ruby>` tags affected the same way,
  and is that wanted?
- **Conflicting `rt` rules:** the old `rt { visibility: visible }`, the inline
  `.65em` size versus `.55em` in `styles.css`, and the unused `.mode-*` rules.
- **Hidden furigana leaves a gap:** `visibility: hidden` keeps the `<rt>` space,
  so line height doesn't change between modes. Decide whether that's wanted.
- **Mobile header:** at ≤700px the control wraps to its own row (`order: 3`,
  `flex-basis: 100%`). Check it isn't pushed off-screen, or covered when the
  menu is open (`.site-menu` is `position: absolute`).
- **Header scrolls away:** the header is not sticky (`.site-header` is
  `position: relative`), while the vocab `aside` is sticky. "Disappears" might
  partly mean it scrolls off. Ask the user which they mean.

## 4. Layout: current state and what's wanted

**Current** (inline `<style>` in `article.html`, no media queries):

- `.container { display:flex; gap:30px; max-width:1200px }`
- `main { flex:2 }` holds the title, links, image, audio, article body and the
  sentence translation panel.
- `aside { flex:1; position:sticky; top:20px; max-height:90vh; overflow-y:auto }`
  holds Key Vocabulary.
- On a phone both columns are squeezed side by side.

**Wanted:**

| Width | Layout |
|---|---|
| Phone (≤ ~700px) | One column; vocab **below** the article. `aside` already comes after `main` in the DOM, so stacking gives this order. It must not be sticky or height-limited at this size. |
| Tablet (~700–1100px) | Vocab **beside** the article (two columns, narrower vocab), sticky with its own scroll. |
| Desktop | As now. |

**Open questions for the user:**

- Where should the sentence translation panel go on a phone: inside the
  article flow (as now) or after the vocab?
- Should the vocab list on a phone be collapsible?
- What breakpoints, matching the index's 700px?

Consider moving the inline `<style>` from `article.html` into `styles.css`
under a scoped class (e.g. `body.article-page`), so all layout rules are in
one place.

## 5. Suggested order for the next chat

1. **Done 2026-11-06.** Deploy path confirmed (section 1). Exact wrangler
   command not yet recorded.
2. **Done 2026-11-06.** `python3 pipeline.py --rebuild-html` (no LLM or feed
   calls) uses `html_runner.rebuild_all_article_pages()` with
   `html_pipeline.article_from_manifest_entry()` / `article_file_stem()`.
   Pages are rewritten as `story_<n>.html` and the manifest is repointed; old
   title-based files stay on disk. On the laptop: 166 tests pass, 35 pages
   rebuilt, 10068 skipped (no analysis JSON, keeps its old page). The index
   now links 21 `story_<n>.html` pages, all with the furigana control, so the
   "banner disappears" report is fixed locally. Commit 41206d9.
   **Still to do:** on the VM, `git pull`, `--rebuild-html`, wrangler upload.
3. **Done 2026-11-06.** Furigana switching checked on story 10085 at
   localhost: buttons and F set the `<html>` class and save the mode; tap
   toggles `.furi-shown`; at 375px touch emulation `(hover: hover)` is false,
   so there is no reveal-then-hide on tap. No JS change was needed. The
   phone problem was the layout: the vocab `aside` was squeezed to 40px and
   pushed off-screen, making the page 440px wide, so taps missed words.
   The Sentence Translation panel's ruby follows the same mode (left as is).
4. **Done 2026-11-06** (commit 051969d), checked in the browser and on the
   user's iPhone over the home network:
   - `article.html` inline style: `main, aside { min-width: 0 }`;
     701–1100px: `aside { flex: 0 0 260px }`, still sticky; ≤700px: one column,
     vocab below, `aside` not sticky or height-limited.
   - `styles.css` ≤700px: `.site-head .date { flex-basis: 100% }`, so on the
     index the menu stays right of the brand instead of moving left of the
     date (seen at ~450–700px).
   - Defaults chosen, not yet confirmed: translation panel stays in the
     article, vocab not collapsible, header not sticky.
5. **Open idea:** on phones, move the furigana control into the hamburger menu
   as nhkeasier.com does, leaving only the brand and menu in the header. The
   cost is two taps to switch mode. Not decided.
6. Story 10068: reprocess it or special-case it so it gets the new template.
7. **Next chat's task:** on the Oracle VM, set up a systemd service + timer
   that runs Mon–Fri: `pipeline.py`, then deploy to Cloudflare Pages,
   automating the manual wrangler step. Wrangler login and the Cloudflare
   token already work on the VM. Bring the exact wrangler command and
   `run_and_publish.sh`.

### Viewing on a phone

`python3 -m http.server 8000` already listens on all interfaces. Find the
laptop IP with `hostname -I` (192.168.1.108 on 2026-11-06) and open
`http://<ip>:8000/` on the phone. If it doesn't load, allow the port in `ufw`
for the LAN only.
