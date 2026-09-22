import argparse
import asyncio
import logging
import os
import re
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin

import httpx
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from google import genai
from google.genai import types
from playwright.async_api import async_playwright

from article_schema import ArticleAnalysis

# Default system prompt file location (same directory as this script)
PROMPT_FILE_PATH = Path(__file__).parent / "prompt_nhkeasier.md"

logger = logging.getLogger(__name__)

# --- NHK official-site session/auth flow -----------------------------------
# Ported from update.py's authenticate()/fetch_story_list() and
# test_fetch.py's _authenticate()/_establish_session(). Establishing these
# cookies before fetching an article page is what lets a plain HTTP GET
# bypass NHK's sitewide "emergency mode" consent gate; see claudehandoff.txt
# for the investigation behind this. Without it, fetch_article_html() used
# to go straight to Playwright for every official NHK URL, which is slower
# and still doesn't solve the gate (a plain page.goto() can't satisfy its
# interactive confirm step either).

DEFAULT_NHK_USER_AGENT = "curl/8.14.1"  # avoids 500s from NHK during authentication

BUILD_AUTHORIZE_URL = (
    "https://news.web.nhk/tix/build_authorize?idp=a-alaz&profileType=abroad&"
    "redirect_uri=https%3A%2F%2Fnews.web.nhk%2Fnews%2Feasy%2F&entity=none&area=130&"
    "pref=13&jisx0402=13101&postal=1000001"
)
STORY_LIST_URL = "https://news.web.nhk/news/easy/news-list.json"

# Matches the news_id segment in either
# https://news.web.nhk/news/easy/{id}/{id}.html or
# http://www3.nhk.or.jp/news/easy/{id}/{id}.html
NEWS_ID_URL_PATTERN = re.compile(r"/news/easy/([^/]+)/")


class AuthenticationError(Exception):
    """Raised when the authentication flow to news.web.nhk fails."""


def extract_news_id(url: str) -> str | None:
    """Extracts the NHK news_id segment from an NHK article URL.

    Ported from test_fetch.py/update.py: matches the {id} segment in
    /news/easy/{id}/{id}.html style paths, covering both the legacy
    k1001... ID scheme and newer formats like 20260918de51002 (the
    previous k1001\\d+-only regex didn't recognize the newer scheme, so the
    legacy static mirror was never attempted for those articles).
    """
    match = NEWS_ID_URL_PATTERN.search(url)
    return match.group(1) if match else None


async def _authenticate_nhk(client: httpx.AsyncClient) -> None:
    """Performs the cookie-establishing auth flow required by news.web.nhk.

    Ported from update.py's authenticate(): GETs the News Web Easy home
    page, then the build_authorize URL. Cookies set along the way persist
    in `client`'s cookie jar for subsequent requests on the same client.
    """
    await client.get("https://news.web.nhk/news/easy/")
    res = await client.get(BUILD_AUTHORIZE_URL)
    if res.status_code != 200:
        raise AuthenticationError(
            f"received {res.status_code} when authenticating: {res.text}"
        )


async def _establish_nhk_session(client: httpx.AsyncClient) -> None:
    """Establishes NHK session cookies on `client` before fetching an article.

    Ported from update.py's fetch_story_list(): fetches news-list.json and
    authenticates on 401/403. This is exactly the step that makes NHK serve
    the real article instead of its emergency-mode consent gate on the
    subsequent request.
    """
    res = await client.get(STORY_LIST_URL)
    if res.status_code in (401, 403):
        await _authenticate_nhk(client)
        res = await client.get(STORY_LIST_URL)
    res.raise_for_status()


def _looks_like_emergency_cushion(html: str) -> bool:
    """Detects NHK's sitewide 'cushion'/emergency-mode consent interstitial,
    served instead of the real article for any URL on the domain, which
    requires an interactive confirm step no automated fetch can satisfy."""
    return (
        "hidden/cushion" in html
        or "emergency-mode-info" in html
        or ("emergencyMode\":true" in html and "ご利用にあたって" in html)
    )


async def _fetch_nhk_official_html(url: str) -> str | None:
    """Attempts to fetch an official NHK Easy article page via plain httpx,
    after establishing session cookies (mirrors update.py's --url flow /
    test_fetch.py's fetch_nhk_story()). Tries the legacy static
    www3.nhk.or.jp mirror first (works across news_id schemes and reliably
    avoids the emergency-mode gate once cookies are set), then the original
    URL. Returns None if every attempt fails or is gated, so the caller can
    fall back to a JS-rendered Playwright fetch.
    """
    news_id = extract_news_id(url)

    attempts: list[tuple[str, str]] = []
    if news_id:
        attempts.append(
            (
                "legacy_static_mirror",
                f"http://www3.nhk.or.jp/news/easy/{news_id}/{news_id}.html",
            )
        )
    attempts.append(("original_url_httpx", url))

    async with httpx.AsyncClient(
        follow_redirects=True, headers={"User-Agent": DEFAULT_NHK_USER_AGENT}
    ) as client:
        logger.info("Establishing NHK session (news-list.json + authenticate if needed)...")
        try:
            await _establish_nhk_session(client)
            logger.info("NHK session established; cookies will be reused for the article fetch.")
        except (httpx.HTTPError, AuthenticationError) as e:
            logger.warning(
                f"Failed to establish NHK session via news-list.json: {e}. "
                "Proceeding without it (article fetch may hit the emergency-mode gate)."
            )

        for label, attempt_url in attempts:
            logger.info(f"Trying {label}: {attempt_url} ...")
            try:
                resp = await client.get(attempt_url, timeout=15.0)
                resp.raise_for_status()
            except httpx.HTTPError as e:
                logger.warning(f"Fetch failed for {label} ({attempt_url}): {e}")
                continue

            html = resp.content.decode("utf-8", errors="replace")
            if _looks_like_emergency_cushion(html):
                logger.warning(
                    f"{label}: response looks like NHK's sitewide emergency-mode "
                    "'cushion' consent gate, not the real article page."
                )
                continue

            logger.info(f"{label}: HTTP {resp.status_code}, {len(html)} bytes of HTML.")
            return html

    return None


def load_system_prompt(prompt_path: Path) -> str:
    """Loads the system prompt from the designated Markdown file."""
    if not prompt_path.is_file():
        print(f"Error: Prompt file not found at '{prompt_path}'", file=sys.stderr)
        sys.exit(1)
    return prompt_path.read_text(encoding="utf-8")


async def fetch_article_html(url: str) -> str:
    """Fetches raw HTML. Directs to nhkeasier directly via httpx, tries a
    session-authenticated plain-httpx fetch for official NHK Easy pages
    (including the legacy static mirror), or uses Playwright for JS
    rendering as a last resort."""
    # Fast path for nhkeasier (check FIRST before diverting by news_id)
    if "nhkeasier.com" in url:
        logger.info(f"Fetching lightweight HTML from {url} via httpx...")
        try:
            async with httpx.AsyncClient(follow_redirects=True) as client:
                resp = await client.get(
                    url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10.0
                )
                resp.raise_for_status()
                return resp.text
        except httpx.HTTPStatusError as e:
            logger.warning(
                f"Fast fetch failed with HTTP error {e.response.status_code} ({e}), falling back to Playwright..."
            )
        except httpx.RequestError as e:
            logger.warning(
                f"Fast fetch failed with network error ({e}), falling back to Playwright..."
            )

    # Official NHK Easy site: try a session-authenticated plain httpx fetch
    # first (mirrors update.py's --url flow / test_fetch.py's
    # fetch_nhk_story()). This reliably avoids the emergency-mode consent
    # gate and is much cheaper than spinning up a browser.
    if "nhk.or.jp" in url or "news.web.nhk" in url:
        html = await _fetch_nhk_official_html(url)
        if html is not None:
            return html
        logger.warning(
            "All plain-httpx attempts failed or were gated; falling back to Playwright."
        )

    # Fallback path using Playwright for official NHK and complex DOM rendering
    logger.info(f"Fetching article content from {url} using Playwright...")
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)

            try:
                await page.wait_for_load_state("networkidle", timeout=5000)
            except Exception:
                logger.debug("Network did not go idle within 5s; proceeding with current DOM.")

            content = await page.content()
            await browser.close()
            return content
    except Exception as e:
        logger.error(f"Playwright fetch failed for {url}: {e}")
        raise


def extract_article_content_from_html(
    html_content: str, base_url: str | None = None
) -> tuple[str, str, str | None]:
    """Uses BeautifulSoup to extract core article text from raw NHK Easy or NHK Easier HTML.

    Returns a tuple of (title, combined_text, image_url).
    """
    logger.debug("Parsing HTML to extract core article content...")
    soup = BeautifulSoup(html_content, "html.parser")

    # Remove script, style, navigation, and furigana markup tags
    for tag in soup.find_all(["script", "style", "nav", "footer"]):
        tag.decompose()

    title_node = None
    date_node = None
    body_container = None

    # --- Attempt 1: Standard Static NHK Easy Selectors ---
    body_container = (
        soup.find("div", class_="article-body")
        or soup.find("div", id="article-body")
        or soup.find("div", class_="article-main__body")
        or soup.find("div", id="article-main__body")
        or soup.find("div", id="newscontent")
        or soup.find("div", class_="article-main")
    )
    title_node = (
        soup.find("h1", class_="article-main__title")
        or soup.find("h1", id="article-main__title")
        or soup.find("h1", id="news-title")
        or soup.find("h1", class_="title")
    )
    date_node = (
        soup.find("p", class_="article-main__date")
        or soup.find("p", id="article-main__date")
    )

    # --- Attempt 2: NHK Easier Selectors (nhkeasier.com) ---
    if not body_container:
        logger.debug("Attempting NHK Easier selectors...")
        article_tag = soup.find("article")
        if article_tag:
            body_container = article_tag
            title_node = title_node or article_tag.find(["h1", "h2", "h3", "h4"])
            date_node = date_node or article_tag.find(["time"]) or article_tag.select_one(".story-date, .date, p.date")

    if not body_container:
        content_div = soup.select_one("div.content, div.entry-content, main")
        if content_div:
            body_container = content_div
            title_node = title_node or content_div.find(["h1", "h2", "h3"])
            date_node = date_node or content_div.select_one(".story-date, .date, time")

    # --- Attempt 3: Generic Fallback ---
    if not title_node:
        title_node = soup.find("h1") or soup.find("h2")
    if not date_node:
        date_node = soup.find("time") or soup.find("p", class_=re.compile(r"date|time", re.I))

    if not body_container:
        body_container = soup.find("main") or soup.find("body")

    if not body_container:
        logger.warning(
            "Could not find expected title/body tags for any known site. "
            "Falling back to sending raw HTML to the AI."
        )
        return "", html_content, None

    title = title_node.get_text(strip=True) if title_node else ""

    if "Page Not Found" in title:
        raise ValueError(f"The URL returned a '{title}' page. Cannot process as an article.")

    date = date_node.get_text(strip=True) if date_node else ""
    image_url: str | None = None

    # Clean body_container for text extraction:
    # 1. Strip furigana (<rt>, <rp>)
    for tag in body_container.find_all(["rt", "rp"]):
        tag.decompose()

    # 2. Extract image if present
    image_md = ""
    img_tag = body_container.find("img")
    if img_tag and img_tag.get("src"):
        src = img_tag.get("src")
        if base_url:
            src = urljoin(base_url, src)
        image_url = src
        alt = img_tag.get("alt", "")
        image_md = f"![{alt}]({src})\n\n"

    # 3. Replace <br> tags with newlines inside body_container to prevent joined text
    for br in body_container.find_all("br"):
        br.replace_with("\n")

    # 4. Extract paragraphs
    p_tags = body_container.find_all(["p", "div"])
    paragraphs = []
    for p in p_tags:
        if p == title_node or p == date_node:
            continue
        if any(cls in p.get("class", []) for cls in ["date", "title", "story-date"]):
            continue
        if any(parent in p_tags for parent in p.parents if parent != body_container):
            continue
        text = p.get_text(strip=True)
        if text and len(text) > 2:
            paragraphs.append(text)

    # Fallback if paragraph search returned very little text
    if not paragraphs or sum(len(p) for p in paragraphs) < 30:
        raw_text = body_container.get_text(separator="\n", strip=True)
        paragraphs = [
            line.strip()
            for line in raw_text.splitlines()
            if line.strip() and line.strip() != title and line.strip() != date
        ]

    # Deduplicate consecutive identical paragraphs
    dedup_paragraphs = []
    for p in paragraphs:
        if not dedup_paragraphs or dedup_paragraphs[-1] != p:
            dedup_paragraphs.append(p)

    body = image_md + "\n\n".join(dedup_paragraphs)

    if date:
        return title, f"{title}\n{date}\n\n{body}", image_url
    else:
        return title, f"{title}\n\n{body}", image_url


def generate_markdown(article_content: str, system_prompt: str, model_name: str) -> str:
    """Calls Gemini API with system prompt and article content to generate formatted Markdown."""
    logger.info(
        f"Calling Gemini API with model '{model_name}' to process article and generate Markdown..."
    )
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set.")

    client = genai.Client(api_key=api_key)
    user_prompt = (
        "Convert the following NHK Easy article text into formatted Markdown according to your system instructions:\n\n"
        f"{article_content}"
    )

    try:
        response = client.models.generate_content(
            model=model_name,
            contents=user_prompt,
            config=types.GenerateContentConfig(system_instruction=system_prompt),
        )

        if response.usage_metadata:
            logger.info(
                f"API Token Usage: {response.usage_metadata.total_token_count} total "
                f"({response.usage_metadata.prompt_token_count} prompt, "
                f"{response.usage_metadata.candidates_token_count} completion)."
            )
        else:
            logger.debug("Gemini API response did not contain usage metadata.")

        if not response.text:
            raise ValueError("Gemini API returned an empty response.")

        return response.text
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}")
        raise


def _generate_markdown_from_article_analysis(analysis: ArticleAnalysis) -> str:
    """Generates Markdown string from an ArticleAnalysis object."""
    markdown_parts = []

    if len(analysis.sentences) > 1:
        grouped_sentence_indices = []
        i = 0
        while i < len(analysis.sentences):
            if i + 3 <= len(analysis.sentences):
                grouped_sentence_indices.append((i, i + 3))
                i += 3
            elif i + 2 <= len(analysis.sentences):
                grouped_sentence_indices.append((i, i + 2))
                i += 2
            else:
                grouped_sentence_indices.append((i, i + 1))
                i += 1

        for start_idx, end_idx in grouped_sentence_indices:
            sentence_set = analysis.sentences[start_idx:end_idx]
            if not sentence_set:
                continue

            stripped_japanese_sentences = [
                _strip_furigana(s.japanese) for s in sentence_set
            ]
            japanese_paragraph = "\n".join(stripped_japanese_sentences)

            english_translation_block = "\n> ".join(
                [s.translation for s in sentence_set]
            )
            markdown_parts.append(japanese_paragraph)
            markdown_parts.append(f"> {english_translation_block}")
            markdown_parts.append("")

    if analysis.side_vocab:
        markdown_parts.append("")
        markdown_parts.append("| Kanji | Hiragana | JLPT | 頻度 | Meaning |")
        markdown_parts.append("| :--- | :--- | :--- | :--- | :--- |")
        for vocab in analysis.side_vocab:
            jlpt_level = vocab.jlpt_level.upper() if vocab.jlpt_level else "N/A"
            markdown_parts.append(
                f"| **{vocab.word}** | {vocab.reading} | {jlpt_level} |  | {vocab.definition} |"
            )
        markdown_parts.append("")

        markdown_parts.append(
            "*凡例 (Legend): VC = Very Common | C = Common | DS = Domain Specific | PL = Place Name*"
        )
        markdown_parts.append("")

    return "\n".join(markdown_parts).strip()


def _strip_furigana(text: str) -> str:
    """Removes furigana in `漢字[ひらがな]` format from a Japanese string."""
    return re.sub(r"\[.*?\]", "", text)


def convert_md_to_epub(
    md_file: Path,
    output_epub: Path,
    title: str = "NHK Easy Article",
    author: str | None = None,
):
    """Invokes Calibre's ebook-convert binary to generate an EPUB file."""
    ebook_convert = shutil.which("ebook-convert")

    actual_author = (
        author
        if author is not None
        else f"NHK Easy • {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M')}"
    )

    if not ebook_convert:
        mac_fallback = "/Applications/calibre.app/Contents/MacOS/ebook-convert"
        if Path(mac_fallback).is_file():
            ebook_convert = mac_fallback

    if not ebook_convert:
        raise FileNotFoundError(
            "Error: 'ebook-convert' command not found. Please ensure Calibre is installed."
        )

    table_css = (
        "table { border-collapse: collapse; width: 100%; margin-top: 1em; page-break-before: always !important; font-size: 0.85em; } "
        "th, td { border: 1px solid #888888; padding: 3px 5px; text-align: left; } "
        "tr { page-break-inside: avoid !important; break-inside: avoid !important; } "
        "p, blockquote { page-break-inside: avoid !important; break-inside: avoid !important; } "
        "p + blockquote { page-break-before: avoid !important; break-before: avoid !important; margin-top: 1em; } "
        "blockquote { margin-left: 0 !important; margin-right: 0 !important; }"
    )

    cmd = [
        ebook_convert,
        str(md_file),
        str(output_epub),
        "--page-breaks-before",
        "//h:h1 | //h:h2",
        "--authors",
        actual_author,
        "--title",
        title,
        "--language",
        "ja",
        "--extra-css",
        table_css,
        "--no-default-epub-cover",
    ]

    logger.info(f"Converting '{md_file.name}' -> '{output_epub.name}' with Calibre...")
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        logger.info(f"Calibre conversion successful: {output_epub.resolve()}")
    except subprocess.CalledProcessError as e:
        logger.error(
            f"Error during ebook conversion (exit code {e.returncode}). Command: {' '.join(cmd)}"
        )
        raise


async def process_article_to_epub(
    article_url: str | None = None,
    html_content: str | None = None,
    output_path: Path = Path("output.epub"),
    keep_md: bool = False,
    model_name: str = "gemini-2.5-flash",
    article_title_for_metadata: str | None = None,
    system_prompt_path: Path = PROMPT_FILE_PATH,
    analysis: ArticleAnalysis | None = None,
) -> tuple[Path, str]:
    """Core logic for fetching, processing, and converting an article to EPUB."""
    load_dotenv()
    if not os.getenv("GEMINI_API_KEY"):
        raise ValueError("GEMINI_API_KEY environment variable not set.")

    system_prompt = load_system_prompt(system_prompt_path)

    if html_content is None:
        if article_url is None:
            raise ValueError("Either article_url or html_content must be provided.")
        logger.info(f"Fetching HTML for {article_url}...")
        html_content = await fetch_article_html(article_url)
    else:
        logger.info("Using provided HTML content for processing.")

    article_title, article_text, _extracted_image_url = extract_article_content_from_html(
        html_content, base_url=article_url
    )
    logger.info(f"Extracted title: '{article_title}'")

    payload_txt_path = output_path.with_suffix(".txt")
    payload_txt_path.write_text(article_text, encoding="utf-8")
    logger.debug(
        f"Saved exact text payload sent to Gemini -> '{payload_txt_path.name}'"
    )

    if analysis:
        logger.info(
            f"Generating Markdown for '{article_title}' from ArticleAnalysis object..."
        )
        md_content = _generate_markdown_from_article_analysis(analysis)
    else:
        logger.info(
            f"Generating Markdown for '{article_title}' using model '{model_name}' (fallback)..."
        )
        md_content = generate_markdown(article_text, system_prompt, model_name)

    md_content = md_content.replace('<div style="page-break-after: always;"></div>', "")

    md_path = output_path.with_suffix(".md")
    md_path.write_text(md_content, encoding="utf-8")
    logger.debug(f"Intermediate Markdown saved to '{md_path.name}'.")

    ebook_title = (
        article_title_for_metadata
        if article_title_for_metadata
        else article_title
        if article_title
        else output_path.stem.replace("_", " ").title()
    )
    logger.info(f"Converting Markdown to EPUB for '{ebook_title}'...")
    convert_md_to_epub(md_path, output_path, title=ebook_title)

    if not keep_md and md_path.exists():
        md_path.unlink()
        logger.debug(f"Removed temporary Markdown file: '{md_path.name}'")

    return (output_path, md_content)


async def main():
    load_dotenv()
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
    )

    if not os.getenv("GEMINI_API_KEY"):
        logger.error("Error: GEMINI_API_KEY environment variable not set.")
        sys.exit(1)

    parser = argparse.ArgumentParser(
        description="Fetch an NHK Easy article, convert it to formatted Markdown via Gemini, and compile to EPUB."
    )
    parser.add_argument(
        "source",
        help="URL of the NHK Easy / NHK Easier article OR path to local HTML file.",
    )
    parser.add_argument(
        "output", help="Output filename for the .epub file (e.g. article.epub)"
    )
    parser.add_argument(
        "--keep-md",
        action="store_true",
        help="Keep the intermediate .md file after conversion",
    )
    parser.add_argument(
        "--model",
        default="gemini-2.5-flash",
        help="Specify the Gemini model to use (default: gemini-2.5-flash)",
    )
    parser.add_argument(
        "--local-html",
        action="store_true",
        help="Treat the 'source' argument as a path to a local HTML file instead of a URL.",
    )

    args = parser.parse_args()

    output_path = Path(args.output)
    if output_path.suffix.lower() != ".epub":
        output_path = output_path.with_suffix(".epub")

    html_content_to_pass: str | None = None
    article_url_to_pass: str | None = None

    if args.local_html:
        source_path = Path(args.source)
        if not source_path.is_file():
            logger.error(f"Error: Local HTML file not found at '{source_path}'.")
            sys.exit(1)
        html_content_to_pass = source_path.read_text(encoding="utf-8")
        logger.info(f"Processing from local HTML file: {source_path}")

        filename_stem = source_path.stem
        if "_http" in filename_stem:
            url_start_index = filename_stem.rfind("_http")
            potential_url = filename_stem[url_start_index + 1 :]
            if potential_url.startswith(("http://", "https://")):
                article_url_to_pass = potential_url
                logger.info(f"Inferred base URL from filename: {article_url_to_pass}")
    else:
        article_url_to_pass = args.source
        logger.info(f"Processing from URL: {article_url_to_pass}")

    start = time.time()
    try:
        await process_article_to_epub(
            article_url=article_url_to_pass,
            html_content=html_content_to_pass,
            output_path=output_path,
            keep_md=args.keep_md,
            model_name=args.model,
            article_title_for_metadata=None,
        )
        logger.info(f"Total processing time: {time.time() - start:.2f}s")
    except Exception:
        logger.exception("An error occurred during article processing.")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
