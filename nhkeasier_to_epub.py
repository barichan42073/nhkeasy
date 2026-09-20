import argparse
import asyncio
import logging
import os
import re  # Added to support regex for furigana stripping
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin

import httpx

# import openai # No longer using OpenAI
# import urllib.request # Replaced by Playwright
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from google import genai  # Now using Gemini
from playwright.async_api import async_playwright

from article_schema import ArticleAnalysis  # Import ArticleAnalysis

# Default system prompt file location (same directory as this script)
PROMPT_FILE_PATH = Path(__file__).parent / "prompt_nhkeasier.md"

logger = logging.getLogger(__name__)  # Use module-level logger


def load_system_prompt(prompt_path: Path) -> str:
    """Loads the system prompt from the designated Markdown file."""
    if not prompt_path.is_file():
        print(f"Error: Prompt file not found at '{prompt_path}'", file=sys.stderr)
        sys.exit(1)
    return prompt_path.read_text(encoding="utf-8")


async def fetch_article_html(url: str) -> str:
    """Fetches raw HTML. Uses httpx for nhkeasier, Playwright for nhk.or.jp."""
    # Fast path for nhkeasier (static HTML, no JS/bot checks needed)
    if "nhkeasier.com" in url:
        logger.info(f"Fetching lightweight HTML from {url} via httpx...")
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10.0
                )
                resp.raise_for_status()  # Raise an exception for 4xx/5xx responses
                return resp.text
        except httpx.HTTPStatusError as e:
            logger.warning(
                f"Fast fetch failed with HTTP error {e.response.status_code} ({e}), falling back to Playwright..."
            )
        except httpx.RequestError as e:
            logger.warning(
                f"Fast fetch failed with network error ({e}), falling back to Playwright..."
            )

    # Reliable path for www3.nhk.or.jp or fallback
    logger.info(f"Fetching article content from {url} using Playwright...")
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            content = await page.content()
            await browser.close()
            return content
    except Exception as e:
        logger.error(f"Playwright fetch failed for {url}: {e}")
        raise  # Re-raise to be caught by caller


def extract_article_content_from_html(
    html_content: str, base_url: str | None = None
) -> tuple[str, str, str | None]:
    """Uses BeautifulSoup to extract the core article text from raw NHK Easier or NHK Easy HTML.

    Returns a tuple of (title, combined_text, image_url). image_url will be
    None if no image could be found within the article body.
    """
    logger.debug("Parsing HTML to extract core article content...")
    soup = BeautifulSoup(html_content, "html.parser")

    # Remove script tags with type="edict" or type="enamdict"
    for script in soup.find_all("script", {"type": ["edict", "enamdict"]}):
        script.extract()

    title_node = None
    date_node = None
    body_container = None

    # --- Attempt 1: New NHK Easier selectors (for pages like nhkeasier.com/story/ID/) ---
    logger.debug("Attempting new selectors for NHK Easier (nhkeasier.com/story/ID/)...")
    article_tag = soup.find("article", lang="ja")
    if article_tag:
        title_node = article_tag.select_one("h3")
        date_node = article_tag.select_one("h4 time")
        body_container = article_tag

    # --- Attempt 2: Older NHK Easier selectors (e.g., div.content) ---
    if not title_node or not body_container:  # If Attempt 1 failed or incomplete
        logger.debug(
            "New NHK Easier selectors failed or incomplete. Trying older NHK Easier selectors (e.g. nhkeasier.com/2026/07/24/)..."
        )
        title_node = soup.select_one("div.content h1")
        date_node = soup.select_one("div.content p.story-date")
        body_container = soup.find("div", id="article-body")

    # --- Attempt 3: Standard NHK selectors (www3.nhk.or.jp) ---
    if not title_node or not body_container:  # If Attempt 2 failed or incomplete
        logger.debug(
            "Older NHK Easier selectors failed or incomplete. Trying standard NHK selectors (www3.nhk.or.jp)..."
        )
        title_node = soup.find("h1", class_="article-main__title")
        date_node = soup.find("p", class_="article-main__date")
        body_container = soup.find("div", class_="article-main__body")

    # --- Fallback if all attempts fail ---
    if not title_node or not body_container:
        logger.warning(
            "Could not find expected title/body tags for any known site. "
            "Falling back to sending raw HTML to the AI."
        )
        # We need to return an empty string for title, but still return html_content
        return "", html_content, None

    # Extract text content and clean up whitespace
    title = title_node.get_text(strip=True) if title_node else ""

    # Check for "Page Not Found" or similar error pages early
    if "Page Not Found" in title:
        raise ValueError(
            f"The URL returned a '{title}' page. Cannot process as an article."
        )

    date = date_node.get_text(strip=True) if date_node else ""

    # Reconstruct body text, preserving paragraphs.
    # For the new nhkeasier.com layout, body_container is the <article> tag, so we find p tags within it.
    # For older layouts, body_container is div#article-body or div.article-main__body.

    image_url: str | None = None

    if body_container:
        # Strip out furigana reading tags (<rt>) so get_text() doesn't double up text like "避難ひなん"
        for rt in body_container.find_all("rt"):
            rt.decompose()

        # Extract image if present and convert to markdown
        image_md = ""
        img_tag = body_container.find("img")
        if img_tag and img_tag.get("src"):
            src = img_tag.get("src")
            logger.debug("Initial image src: %s", src)
            if base_url:
                logger.debug("Base URL for join: %s", base_url)
                src = urljoin(base_url, src)
                logger.debug("After urljoin, src: %s", src)
            image_url = src
            alt = img_tag.get("alt", "")
            image_md = f"![{alt}]({src})\n\n"
            logger.debug("Generated image_md: %s", image_md.strip())

        paragraphs = [
            p.get_text(strip=True)
            for p in body_container.find_all("p")
            if p.get_text(strip=True)
        ]
        body = image_md + "\n\n".join(paragraphs)
    else:
        body = ""  # If no body container, then body is empty.

    # Combine and return (title, combined_content, image_url)
    if date:
        return title, f"{title}\n{date}\n\n{body}", image_url
    else:
        return title, f"{title}\n\n{body}", image_url


def generate_markdown(article_content: str, system_prompt: str, model_name: str) -> str:
    """Calls Gemini API with the system prompt and article content to generate formatted Markdown."""
    logger.info(
        f"Calling Gemini API with model '{model_name}' to process article and generate Markdown..."
    )
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set.")

    client = genai.Client(api_key=api_key)
    full_prompt = (
        f"{system_prompt}\n\n"
        "Convert the following NHK Easy article text into formatted Markdown according to your system instructions:\n\n"
        f"{article_content}"
    )

    try:
        response = client.models.generate_content(
            model=model_name,
            contents=full_prompt,
            # No specific response_mime_type or response_schema for plain markdown text
        )

        if hasattr(response, "usage_metadata") and response.usage_metadata:
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
        raise  # Re-raise to be caught by caller


def _generate_markdown_from_article_analysis(analysis: ArticleAnalysis) -> str:
    """
    Generates a Markdown string from an ArticleAnalysis object,
    replicating the format expected from baseline.md and prompt_nhkeasier.md.
    """
    markdown_parts = []

    # 1. No explicit title headings for markdown body, as per baseline.md.

    # 2. Paragraphs with Translations (grouped to match baseline.md for this article's observed structure)
    # The baseline.md skips analysis.sentences[0] and groups the rest as (2, 3) sentences.
    # This specific grouping logic is applied to match the baseline for the provided example.
    # A more general grouping logic would be needed if the sentence counts per paragraph vary.
    if (
        len(analysis.sentences) > 1
    ):  # Ensure there are sentences to process beyond the potential title-duplicate
        # Assuming the first sentence is typically a duplicate of the title,
        # and the baseline starts effective content from the second sentence.
        # Group sentences based on baseline.md's observation for this specific article:
        # Group sentences dynamically, aiming for 2-3 sentences per paragraph
        # Start from analysis.sentences[0] to include all content
        grouped_sentence_indices = []
        i = 0
        while i < len(analysis.sentences):
            # Try to group 3 sentences if available, otherwise 2, otherwise 1
            if i + 3 <= len(analysis.sentences):
                grouped_sentence_indices.append((i, i + 3))
                i += 3
            elif i + 2 <= len(analysis.sentences):
                grouped_sentence_indices.append((i, i + 2))
                i += 2
            else:  # Remaining 1 sentence
                grouped_sentence_indices.append((i, i + 1))
                i += 1

        for start_idx, end_idx in grouped_sentence_indices:
            sentence_set = analysis.sentences[start_idx:end_idx]
            if not sentence_set:
                continue

            # Strip furigana from each Japanese sentence before joining
            stripped_japanese_sentences = [
                _strip_furigana(s.japanese) for s in sentence_set
            ]
            japanese_paragraph = "\n".join(stripped_japanese_sentences)

            english_translation_block = "\n> ".join(
                [s.translation for s in sentence_set]
            )
            markdown_parts.append(japanese_paragraph)
            markdown_parts.append(f"> {english_translation_block}")
            markdown_parts.append("")  # Add a blank line between paragraphs

    # 3. Vocabulary List
    if analysis.side_vocab:
        # No "Vocabulary" title as per baseline.md
        markdown_parts.append("")  # Add a blank line before the vocab table
        markdown_parts.append("| Kanji | Hiragana | JLPT | 頻度 | Meaning |")
        markdown_parts.append("| :--- | :--- | :--- | :--- | :--- |")
        for vocab in analysis.side_vocab:
            # Format JLPT level to N1, N3, N5, N/A, and uppercase
            jlpt_level = vocab.jlpt_level.upper() if vocab.jlpt_level else "N/A"
            # Add an empty space for the 頻度 column and bold the Kanji
            markdown_parts.append(
                f"| **{vocab.word}** | {vocab.reading} | {jlpt_level} |  | {vocab.definition} |"
            )
        markdown_parts.append("")  # Add a trailing blank line after the table

        # Add the legend as seen in baseline.md
        markdown_parts.append(
            "*凡例 (Legend): VC = Very Common | C = Common | DS = Domain Specific | PL = Place Name*"
        )
        markdown_parts.append("")  # Final blank line after legend

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

    # Generate author string with timestamp if not provided
    actual_author = (
        author
        if author is not None
        else f"NHK Easy • {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M')}"
    )

    # macOS fallback path if not present in system PATH
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
        "--no-default-epub-cover",  # <-- ADD THIS LINE
    ]

    logger.info(f"Converting '{md_file.name}' -> '{output_epub.name}' with Calibre...")
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        logger.info(f"Calibre conversion successful: {output_epub.resolve()}")
    except subprocess.CalledProcessError as e:
        logger.error(
            f"Error during ebook conversion (exit code {e.returncode}). Command: {' '.join(cmd)}"
        )
        raise  # Re-raise


async def process_article_to_epub(
    article_url: str | None = None,
    html_content: str | None = None,
    output_path: Path = Path("output.epub"),
    keep_md: bool = False,
    model_name: str = "gemini-2.5-flash",  # Changed default model to Gemini
    article_title_for_metadata: str | None = None,
    system_prompt_path: Path = PROMPT_FILE_PATH,
    analysis: ArticleAnalysis
    | None = None,  # New parameter to pass the analysis object
) -> tuple[Path, str]:
    """
    Core logic for fetching, processing, and converting an article to EPUB.
    Can accept either a URL to fetch, or pre-fetched HTML content.
    Returns the path to the generated EPUB file.
    """
    load_dotenv()
    if not os.getenv("GEMINI_API_KEY"):
        raise ValueError("GEMINI_API_KEY environment variable not set.")
    # if not os.getenv("DEEPSEEK_API_KEY"): # No longer using DeepSeek
    #     raise ValueError("DEEPSEEK_API_KEY environment variable not set.")

    # 1. Load System Prompt
    system_prompt = load_system_prompt(system_prompt_path)

    # 2. Get HTML Content
    if html_content is None:
        if article_url is None:
            raise ValueError("Either article_url or html_content must be provided.")
        logger.info(f"Fetching HTML for {article_url}...")
        html_content = await fetch_article_html(article_url)
    else:
        logger.info("Using provided HTML content for processing.")

    # 3. Extract core content from HTML
    article_title, article_text, _extracted_image_url = extract_article_content_from_html(
        html_content, base_url=article_url
    )
    logger.info(f"Extracted title: '{article_title}'")

    # Save exact text payload sent to Gemini for debugging
    payload_txt_path = output_path.with_suffix(".txt")
    payload_txt_path.write_text(article_text, encoding="utf-8")
    logger.debug(
        f"Saved exact text payload sent to Gemini -> '{payload_txt_path.name}'"
    )

    # 4. Request Markdown generation
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

    # Remove unwanted page-break divs that Calibre might insert if HTML is present
    md_content = md_content.replace('<div style="page-break-after: always;"></div>', "")

    # Save Markdown to disk temporarily
    md_path = output_path.with_suffix(".md")
    md_path.write_text(md_content, encoding="utf-8")
    logger.debug(f"Intermediate Markdown saved to '{md_path.name}'.")

    # 5. Convert Markdown to EPUB
    ebook_title = (
        article_title_for_metadata
        if article_title_for_metadata
        else article_title
        if article_title
        else output_path.stem.replace("_", " ").title()
    )
    logger.info(f"Converting Markdown to EPUB for '{ebook_title}'...")
    convert_md_to_epub(md_path, output_path, title=ebook_title)

    # Clean up temporary markdown file unless --keep-md is set
    if not keep_md and md_path.exists():
        md_path.unlink()
        logger.debug(f"Removed temporary Markdown file: '{md_path.name}'")

    return (output_path, md_content)


async def main():
    load_dotenv()
    # Configure basic logging for standalone execution
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
    )

    if not os.getenv("GEMINI_API_KEY"):
        logger.error("Error: GEMINI_API_KEY environment variable not set.")
        sys.exit(1)
    # if not os.getenv("DEEPSEEK_API_KEY"): # No longer using DeepSeek
    #     logger.error("Error: DEEPSEEK_API_KEY environment variable not set.")
    #     sys.exit(1)

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
        default="gemini-2.5-flash",  # Changed default model to Gemini
        help="Specify the Gemini model to use (default: gemini-2.5-flash)",
    )
    parser.add_argument(
        "--local-html",
        action="store_true",
        help="Treat the 'source' argument as a path to a local HTML file instead of a URL.",
    )

    args = parser.parse_args()

    # Ensure output filename ends with .epub
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

        # Extract base_url from filename if it contains a URL pattern
        filename_stem = source_path.stem
        if "_http" in filename_stem:  # Check if a URL pattern might exist
            url_start_index = filename_stem.rfind("_http")  # Find the last occurrence
            # Extract the potential URL string, skipping the underscore
            potential_url = filename_stem[url_start_index + 1 :]
            # Basic validation that it looks like a URL
            if potential_url.startswith(("http://", "https://")):
                article_url_to_pass = potential_url
                logger.info(f"Inferred base URL from filename: {article_url_to_pass}")
    else:
        article_url_to_pass = args.source
        logger.info(f"Processing from URL: {article_url_to_pass}")

    start = time.time()
    try:
        await process_article_to_epub(
            article_url=article_url_to_pass,  # This will now be the inferred URL for local files
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
