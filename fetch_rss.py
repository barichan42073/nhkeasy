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
OUTPUT_DIR = Path.home() / ".local" / "share" / "nhkeasy" / "feed"
OUTPUT_FILE = OUTPUT_DIR / "articles.json"

FEED_URL = "https://nhkeasier.com/feed/"  # Or your target RSS feed URL


def _feed_is_usable(feed, source: str, output_file: Path) -> bool:
    """Decides whether a parsed feed may replace articles.json.

    A failed download (network error, HTTP error status) or a feed with no
    entries must not overwrite the existing file with an empty list. A feed
    that parsed with a minor error but still has entries is used, with a
    warning.
    """
    status = feed.get("status")
    if isinstance(status, int) and status >= 400:
        logger.error(
            "Feed request to %s returned HTTP %d; keeping existing %s.",
            source, status, output_file,
        )
        return False
    if not feed.entries:
        if feed.get("bozo"):
            logger.error(
                "Could not read feed %s (%s); keeping existing %s.",
                source, feed.get("bozo_exception"), output_file,
            )
        else:
            logger.error(
                "Feed %s returned no entries; keeping existing %s.",
                source, output_file,
            )
        return False
    if feed.get("bozo"):
        logger.warning(
            "Feed %s parsed with an error (%s); using its %d entries.",
            source, feed.get("bozo_exception"), len(feed.entries),
        )
    return True


def save_feed_data(days_back: int = 3, feed_source: str | Path | None = None, output_file: Path = OUTPUT_FILE) -> bool:
    """Refreshes articles.json from the feed. Returns False (and leaves the
    existing file untouched) when the feed could not be fetched or is empty."""
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
    if not _feed_is_usable(feed, resolved_source, output_file):
        return False
    new_articles = []

    # articles.json is a cache of recent feed entries, so it always keeps at
    # least 3 days; the pipeline applies --days-back itself when choosing
    # what to process.
    cutoff_days = max(days_back, 3)
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
    return True


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
