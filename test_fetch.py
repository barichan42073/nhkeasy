import argparse
import asyncio
import json
import re
import sys
import httpx
from bs4 import BeautifulSoup


def extract_news_id(url: str) -> str | None:
    """Extracts NHK article ID (e.g. k10014285111000) from an NHK or NHKEasier URL."""
    match = re.search(r"k1001\d+", url)
    return match.group(0) if match else None


async def fetch_nhk_story(url_or_id: str) -> dict:
    """Replicates update.rs fetching logic directly in Python.

    Returns a dict with: {'title': str, 'text': str, 'image_url': str}
    """
    news_id = extract_news_id(url_or_id)

    async with httpx.AsyncClient(
        follow_redirects=True, headers={"User-Agent": "Mozilla/5.0"}
    ) as client:
        # Strategy A: If news_id is detected, hit static assets on www3.nhk.or.jp directly
        if news_id:
            static_url = f"http://www3.nhk.or.jp/news/easy/{news_id}/{news_id}.html"
            print(f"[INFO] Detected news ID '{news_id}'. Fetching static asset from {static_url}...")
            resp = await client.get(static_url)
            resp.raise_for_status()
            html = resp.text
        # Strategy B: If it's a generic web page without an official news ID
        else:
            print(f"[INFO] Fetching HTML directly from {url_or_id}...")
            resp = await client.get(url_or_id)
            resp.raise_for_status()
            html = resp.text

    soup = BeautifulSoup(html, "html.parser")

    # Locate main body and title container (matching update.rs selectors)
    body_container = (
        soup.find("div", id="article-main__body")
        or soup.find("div", class_="article-main__body")
        or soup.find("div", id="article-body")
        or soup.find("div", class_="article-body")
        or soup.find("article")
    )

    title_node = (
        soup.find("h1", class_="article-main__title")
        or soup.find("h1", id="article-main__title")
        or soup.find("h1")
    )

    if not body_container:
        raise ValueError("Could not locate article body in HTML payload.")

    title = title_node.get_text(strip=True) if title_node else "NHK Easy Article"

    # Strip furigana (<rt>, <rp>) and unwanted script/style elements
    for tag in body_container.find_all(["rt", "rp", "script", "style"]):
        tag.decompose()

    # Extract Image URL if present
    img_tag = body_container.find("img")
    image_url = img_tag.get("src") if img_tag else None

    # Convert <br> tags to newlines
    for br in body_container.find_all("br"):
        br.replace_with("\n")

    # Extract paragraphs cleanly
    paragraphs = []
    for p in body_container.find_all(["p", "div"]):
        # Ignore parent wrappers to prevent duplicate text
        if any(
            parent in body_container.find_all(["p", "div"])
            for parent in p.parents
            if parent != body_container
        ):
            continue
        text = p.get_text(strip=True)
        if text and text != title:
            paragraphs.append(text)

    # Fallback to newline splitting if standard paragraph tags weren't used
    if not paragraphs:
        paragraphs = [
            line.strip()
            for line in body_container.get_text(separator="\n").splitlines()
            if line.strip()
        ]

    # Deduplicate consecutive duplicate lines
    clean_paragraphs = []
    for line in paragraphs:
        if not clean_paragraphs or clean_paragraphs[-1] != line:
            clean_paragraphs.append(line)

    combined_text = f"{title}\n\n" + "\n\n".join(clean_paragraphs)

    return {"title": title, "text": combined_text, "image_url": image_url}


async def main():
    parser = argparse.ArgumentParser(description="Test NHK Easy Python fetcher.")
    parser.add_argument("url", help="NHK Easy or NHKEasier URL (or news ID)")
    args = parser.parse_args()

    try:
        result = await fetch_nhk_story(args.url)
        print("\n--- EXTRACTED RESULT ---")
        print(f"Title: {result['title']}")
        print(f"Image: {result['image_url']}")
        print("--- EXTRACTED TEXT ---")
        print(result["text"])
        print("------------------------\n")
    except Exception as e:
        print(f"[ERROR] Failed to fetch article: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())