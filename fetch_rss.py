import json
import logging  # Add logging import
from datetime import datetime, timedelta, timezone
from pathlib import Path

import feedparser  # pip install feedparser
from bs4 import BeautifulSoup  # Import BeautifulSoup
from dateutil import parser as date_parser

# Setup logging
logger = logging.getLogger(__name__)

# Define local file storage path (relative to home directory for portability)
OUTPUT_DIR = Path.home() / ".local" / "share" / "rss_fetcher"
OUTPUT_FILE = OUTPUT_DIR / "articles.json"

FEED_URL = "https://nhkeasier.com/feed/"  # Or your target RSS feed URL


def save_feed_data():
    # Ensure storage directory exists
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Fetch and parse feed
    feed = feedparser.parse(FEED_URL)
    new_articles = []

    cutoff_date = datetime.now(timezone.utc) - timedelta(days=3)

    for entry in feed.entries:
        published_str = entry.get("published", "")
        if published_str:
            try:
                pub_date = date_parser.parse(published_str)
                if pub_date.tzinfo is None:
                    pub_date = pub_date.replace(tzinfo=timezone.utc)
                if pub_date < cutoff_date:
                    logger.debug("Skipping entry older than 3 days: %s", entry.title)
                    continue
            except (ValueError, TypeError):
                pass  # If date parsing fails, process entry as fallback

        article = {
            "id": entry.get("id", entry.link),
            "title": entry.title,
            "link": entry.link,
            "published": published_str,
            "summary": entry.get("summary", ""),
        }

        logger.debug("Processing entry: %s", entry.title)

        # Extract image URL from the summary HTML
        soup = BeautifulSoup(entry.summary, "html.parser")
        img_tag = soup.find("img")

        if img_tag:
            logger.debug("Found img tag in summary: %s", img_tag)
            src = img_tag.get("src")
            if src:
                article["image_url"] = src
                logger.debug("Extracted image_url: %s", article["image_url"])
            else:
                article["image_url"] = None
                logger.debug("Img tag found but no 'src' attribute.")
        else:
            article["image_url"] = None  # Explicitly set to None if no image found
            logger.debug("No img tag found in summary.")

        new_articles.append(article)

    # Simple atomic write to JSON file
    temp_file = OUTPUT_FILE.with_suffix(".tmp")
    with open(temp_file, "w", encoding="utf-8") as f:
        json.dump(new_articles, f, ensure_ascii=False, indent=2)

    # Rename temp file to main file (prevents corrupt files if laptop goes to sleep mid-write)
    temp_file.replace(OUTPUT_FILE)
    logger.info(
        "Successfully updated %d articles to %s", len(new_articles), OUTPUT_FILE
    )


if __name__ == "__main__":
    save_feed_data()
