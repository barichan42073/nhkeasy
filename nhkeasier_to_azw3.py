#!/usr/bin/env python3
import argparse
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
import asyncio
import httpx
from typing import Tuple
# import urllib.request # Replaced by Playwright

from bs4 import BeautifulSoup
from dotenv import load_dotenv
from google import genai
from playwright.async_api import async_playwright

# Default system prompt file location (same directory as this script)
PROMPT_FILE_PATH = Path(__file__).parent / "prompt_nhkeasier.md"


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
        print(f"Fetching lightweight HTML from {url} via httpx...")
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10.0)
                if resp.status_code == 200:
                    return resp.text
        except Exception as e:
            print(f"Fast fetch failed ({e}), falling back to Playwright...")

    # Reliable path for www3.nhk.or.jp or fallback
    print(f"Fetching article content from {url} using Playwright...")
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        content = await page.content()
        await browser.close()
        return content


def extract_article_content_from_html(html_content: str) -> Tuple[str, str]:
    """Uses BeautifulSoup to extract the core article text from raw NHK Easier or NHK Easy HTML."""
    print("Parsing HTML to extract core article content...")
    soup = BeautifulSoup(html_content, "html.parser")

    # Remove script tags with type="edict" or type="enamdict"
    for script in soup.find_all("script", {"type": ["edict", "enamdict"]}):
        script.extract()

    title_node = None
    date_node = None
    body_container = None

    # --- Attempt 1: New NHK Easier selectors (for pages like nhkeasier.com/story/ID/) ---
    print("Attempting new selectors for NHK Easier (nhkeasier.com/story/ID/)...")
    article_tag = soup.find("article", lang="ja")
    if article_tag:
        title_node = article_tag.select_one("h3")
        date_node = article_tag.select_one("h4 time")
        body_container = article_tag

    # --- Attempt 2: Older NHK Easier selectors (e.g., div.content) ---
    if not title_node or not body_container: # If Attempt 1 failed or incomplete
        print("New NHK Easier selectors failed or incomplete. Trying older NHK Easier selectors (e.g. nhkeasier.com/2026/07/24/)...")
        title_node = soup.select_one("div.content h1")
        date_node = soup.select_one("div.content p.story-date")
        body_container = soup.find("div", id="article-body")

    # --- Attempt 3: Standard NHK selectors (www3.nhk.or.jp) ---
    if not title_node or not body_container: # If Attempt 2 failed or incomplete
        print("Older NHK Easier selectors failed or incomplete. Trying standard NHK selectors (www3.nhk.or.jp)...")
        title_node = soup.find("h1", class_="article-main__title")
        date_node = soup.find("p", class_="article-main__date")
        body_container = soup.find("div", class_="article-main__body")

    # --- Fallback if all attempts fail ---
    if not title_node or not body_container:
        print(
            "Warning: Could not find expected title/body tags for any known site. "
            "Falling back to sending raw HTML to the AI.",
            file=sys.stderr
        )
        return "", html_content

    # Extract text content and clean up whitespace
    title = title_node.get_text(strip=True)

    # Check for "Page Not Found" or similar error pages early
    if "Page Not Found" in title:
        print(f"Error: The URL returned a '{title}' page. Cannot process as an article.", file=sys.stderr)
        sys.exit(1)

    date = date_node.get_text(strip=True) if date_node else ""
    
    # Reconstruct body text, preserving paragraphs.
    # For the new nhkeasier.com layout, body_container is the <article> tag, so we find p tags within it.
    # For older layouts, body_container is div#article-body or div.article-main__body.

# Strip out furigana reading tags (<rt>) so get_text() doesn't double up text like "避難ひなん"
    for rt in body_container.find_all("rt"):
       rt.decompose()

    paragraphs = [p.get_text(strip=True) for p in body_container.find_all("p") if p.get_text(strip=True)]
    body = "\n\n".join(paragraphs)

    # Combine and return (title, combined_content)
    if date:
        return title, f"{title}\n{date}\n\n{body}"
    else:
        return title, f"{title}\n\n{body}"


def generate_markdown(article_content: str, system_prompt: str, model_name: str) -> str:
    """Calls Gemini API with the system prompt and article content to generate formatted Markdown."""
    print(f"Calling Gemini API with model '{model_name}' to process article and generate Markdown...")
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    try:
        response = client.models.generate_content(
            model=model_name,
            contents=[
                "Convert the following NHK Easy article text into formatted Markdown according to your system instructions:\n\n" + article_content
            ],
            config={
                "system_instruction": system_prompt,
                "temperature": 0.2
                #"thinking_config": {"thinking_budget": 0},  # Forces immediate response streaming
            }
        )

        if response.usage_metadata:
            usage = response.usage_metadata
            print(
                f"API Token Usage: {usage.total_token_count} total "
                f"({usage.prompt_token_count} prompt, {usage.candidates_token_count} completion)."
            )

        return response.text
    except Exception as e:
        print(f"\nError calling Gemini API: {e}", file=sys.stderr)
        sys.exit(1)


def convert_md_to_epub(md_file: Path, output_epub: Path, title: str = "NHK Easy Article", author: str = "NHK Easy"):
    """Invokes Calibre's ebook-convert binary to generate an EPUB file."""
    ebook_convert = shutil.which("ebook-convert")

    # macOS fallback path if not present in system PATH
    if not ebook_convert:
        mac_fallback = "/Applications/calibre.app/Contents/MacOS/ebook-convert"
        if Path(mac_fallback).is_file():
            ebook_convert = mac_fallback

    if not ebook_convert:
        print("Error: 'ebook-convert' command not found. Please ensure Calibre is installed.", file=sys.stderr)
        sys.exit(1)

    table_css = (
        "table { border-collapse: collapse; width: 100%; margin-top: 1em; } "
        "th, td { border: 1px solid #888888; padding: 6px; text-align: left; }"
    )

    cmd = [
        ebook_convert,
        str(md_file),
        str(output_epub),
        "--page-breaks-before", "//h:h1 | //h:h3",
        "--authors", author,
        "--title", title,
        "--language", "ja",
        "--extra-css", table_css,
    ]

    print(f"Converting '{md_file.name}' -> '{output_epub.name}'...")
    try:
        subprocess.run(cmd, check=True)
        print(f"Success! Output generated: {output_epub.resolve()}")
    except subprocess.CalledProcessError as e:
        print(f"Error during ebook conversion (exit code {e.returncode}).", file=sys.stderr)
        sys.exit(e.returncode)


async def main():
    load_dotenv()
    if not os.getenv("GEMINI_API_KEY"):
        print("Error: GEMINI_API_KEY environment variable not set.", file=sys.stderr)
        sys.exit(1)

    parser = argparse.ArgumentParser(
        description="Fetch an NHK Easy article, convert it to formatted Markdown via Gemini, and compile to EPUB."
    )
    parser.add_argument("url", help="URL of the NHK Easy / NHK Easier article")
    parser.add_argument("output", help="Output filename for the .epub file (e.g. article.epub)")
    parser.add_argument("--keep-md", action="store_true", help="Keep the intermediate .md file after conversion")
    parser.add_argument(
        "--model",
        default="gemini-2.5-pro",
        help="Specify the Gemini model to use (default: gemini-2.5-pro)"
    )
    
    args = parser.parse_args()

    # Ensure output filename ends with .epub
    output_path = Path(args.output)
    if output_path.suffix.lower() != ".epub":
        output_path = output_path.with_suffix(".epub")

    # Intermediate markdown path
    md_path = output_path.with_suffix(".md")

    # 1. Load System Prompt
    system_prompt = load_system_prompt(PROMPT_FILE_PATH)
    start = time.time()
    
    # 2. Fetch HTML
    t0 = time.time()
    html_content = await fetch_article_html(args.url)
    print(f"Fetch took: {time.time() - t0:.2f}s")

    # 3. Extract core content from HTML
    t0 = time.time()
    article_title, article_text = extract_article_content_from_html(html_content)
    print(f"HTML parsing took: {time.time() - t0:.2f}s")
    
    # --- SNIPPET TO SAVE PAYLOAD TO DISK ---
    payload_txt_path = output_path.with_suffix(".txt")
    payload_txt_path.write_text(article_text, encoding="utf-8")
    print(f"Saved exact text payload sent to Gemini -> '{payload_txt_path.name}'")
    # ---------------------------------------
    #
    # 4. Request Markdown generation from Gemini
    t0 = time.time()
    md_content = generate_markdown(article_text, system_prompt, args.model)
    print(f"Gemini API took: {time.time() - t0:.2f}s")
    # Save Markdown to disk temporarily
    md_path.write_text(md_content, encoding="utf-8")
    print(f"Intermediate Markdown saved to '{md_path.name}'.")

    # 5. Convert Markdown to AZW3
    # Use the extracted article title, falling back to a derived title if extraction failed
    ebook_title = article_title if article_title else output_path.stem.replace("_", " ").title()
    t0 = time.time()
    convert_md_to_epub(md_path, output_path, title=ebook_title)
    print(f"Calibre conversion took: {time.time() - t0:.2f}s")

    print(f"Total pipeline time: {time.time() - start:.2f}s")
    # Clean up temporary markdown file unless --keep-md is set
    if not args.keep_md:
        md_path.unlink()

if __name__ == "__main__":
    asyncio.run(main())
