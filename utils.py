import unicodedata
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup


def is_all_katakana(text: str) -> bool:
    """Returns True if the text consists entirely of Katakana
    characters or the long vowel mark (ー)."""
    if not text:
        return False
    for char in text:
        if char.isspace():
            continue
        try:
            # Check for Katakana block or long vowel mark
            if not (unicodedata.name(char).startswith("KATAKANA") or char == "ー"):
                return False
        except ValueError:  # Character lacks a name in the Unicode database
            return False
    return True


def katakana_to_hiragana(text: str) -> str:
    """Helper to convert Katakana text to Hiragana."""
    # Normalize half-width katakana to full-width before conversion
    text = unicodedata.normalize("NFKC", text)
    return "".join(
        chr(ord(char) - 96) if 0x30A1 <= ord(char) <= 0x30F6 else char for char in text
    )


def sanitize_filename(text: str, max_len: int = 100) -> str:
    """Sanitizes text for use as a filename."""
    text = "".join(c if c.isalnum() or c in " .-_" else "_" for c in text)
    text = "_".join(text.split()).strip("_")
    if len(text) > max_len:
        text = text[:max_len]
    return text


def extract_mp3_url(html_content: str) -> str | None:
    """Extracts the first MP3 audio link found in raw HTML content."""
    soup = BeautifulSoup(html_content, "html.parser")
    # Check for <audio> or <source> tags first
    audio_tag = soup.find("audio")
    if audio_tag:
        if audio_tag.get("src"):
            return audio_tag["src"]
        source_tag = audio_tag.find("source")
        if source_tag and source_tag.get("src"):
            return source_tag["src"]

    # Check for any direct link pointing to an mp3
    for a in soup.find_all("a", href=True):
        if a["href"].endswith(".mp3"):
            return a["href"]

    return None


def find_mp3_url(
    article: dict, raw_html_content: str | None, article_url: str
) -> str | None:
    """
    Attempts to find an MP3 URL from article metadata or by
    extracting it from raw HTML content. Resolves relative URLs.
    """
    enclosure = article.get("enclosure")
    enclosure_url = None
    if isinstance(enclosure, dict):
        enclosure_url = enclosure.get("url")
    mp3_url = (
        article.get("mp3_url")
        or article.get("audio_url")
        or article.get("media_url")
        or article.get("mp3")
        or article.get("audio")
        or enclosure_url
    )
    if mp3_url is None and raw_html_content:
        mp3_url = extract_mp3_url(raw_html_content)

    if mp3_url and not mp3_url.startswith(("http://", "https://")):
        mp3_url = urljoin(article_url, mp3_url)
    return mp3_url


def download_mp3(url: str, output_path: Path) -> Path:
    """Downloads an MP3 file from a URL to the specified path."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    response = requests.get(url, stream=True, timeout=30)
    response.raise_for_status()
    with open(output_path, "wb") as f:
        f.writelines(response.iter_content(chunk_size=8192))
    return output_path
