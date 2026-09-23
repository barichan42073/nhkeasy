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


def save_feed_data(days_back: int = 3, feed_source: str | Path | None = None, output_file: Path = OUTPUT_FILE):
    # Ensure storage directory exists
    output_file.parent.mkdir(parents=True, exist_ok=True)

    # Resolve feed source
    resolved_source = FEED_URL
    if feed_source:
        if isinstance(feed_source, Path):
            resolved_source = str(feed_source)
        else:
            resolved_source = feed_source
        logger.info("Using custom feed source: %s", resolved_source)
    else:
        logger.info("Using default feed source: %s", resolved_source)

    # Fetch and parse feed
    feed = feedparser.parse(resolved_source)
    new_articles = []

    # Calculate cutoff days
    cutoff_days = max(days_back, 3) if days_back > 0 else 3
    cutoff_date = datetime.now(timezone.utc) - timedelta(days=cutoff_days)
    logger.info("Cutoff date set to %s (considering up to %d days back)", cutoff_date, cutoff_days)

    for entry in feed.entries:
        published_str = entry.get("published", "")
        if published_str:
            try:
                pub_date = date_parser.parse(published_str)
                if pub_date.tzinfo is None:
                    pub_date = pub_date.replace(tzinfo=timezone.utc)
                if pub_date < cutoff_date:
                    logger.debug("Skipping entry older than %d days: %s", cutoff_days, entry.title)
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
    temp_file = output_file.with_suffix(".tmp")
    with open(temp_file, "w", encoding="utf-8") as f:
        json.dump(new_articles, f, ensure_ascii=False, indent=2)

    # Rename temp file to main file (prevents corrupt files if laptop goes to sleep mid-write)
    temp_file.replace(output_file)
    logger.info(
        "Successfully updated %d articles to %s", len(new_articles), output_file
    )


if __name__ == "__main__":
    import argparse
    # Setup basic logging for standalone execution
    logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

    parser = argparse.ArgumentParser(description="Fetch and parse NHK Easy RSS feed.")
    parser.add_argument(
        "--days-back",
        type=int,
        default=3,
        help="Number of days back from today to consider articles as 'new' (default: 3)."
    )
    parser.add_argument(
        "--feed-source",
        type=str,
        default=None,
        help="Path to a local RSS file or custom feed URL."
    )
    args = parser.parse_args()
    save_feed_data(days_back=args.days_back, feed_source=args.feed_source)
