"""
Module for managing article data, including loading from
RSS feed, handling processed history, and filtering new articles.
"""

import json
import logging
from datetime import datetime, timezone
from pathlib import Path

# Setup logging
logger = logging.getLogger(__name__)


def parse_feed_date_string(date_str: str) -> datetime:
    """
    Parses a date string from the RSS feed (e.g.,
    "Fri, 26 Jul 2024 07:00:00 +0000")
    into a timezone-aware datetime object.
    """
    if not date_str:
        return datetime.min.replace(tzinfo=timezone.utc)
    try:
        return datetime.strptime(date_str, "%a, %d %b %Y %H:%M:%S %z")
    except ValueError:
        logger.warning(
            "Could not parse date string '%s'. Treating as very old.",
            date_str,
        )
        return datetime.min.replace(tzinfo=timezone.utc)


def load_articles(articles_json_path: Path) -> list[dict]:
    """Loads articles from a specified JSON file."""
    if not articles_json_path.exists():
        logger.warning("'%s' not found. No articles to process.", articles_json_path)
        return []
    try:
        with open(articles_json_path, "r", encoding="utf-8") as file:
            return json.load(file)
    except json.JSONDecodeError as err:
        logger.error("Error decoding JSON from '%s': %s", articles_json_path, err)
        return []


def load_processed_history(processed_history_json_path: Path) -> set[str]:
    """Loads processed article IDs/links from a specified JSON file."""
    if not processed_history_json_path.exists():
        return set()
    try:
        with open(processed_history_json_path, "r", encoding="utf-8") as file:
            return set(json.load(file))
    except json.JSONDecodeError as err:
        logger.error(
            "Error decoding JSON from '%s': %s. Starting with empty history.",
            processed_history_json_path,
            err,
        )
        return set()


def save_processed_history(history: set[str], processed_history_json_path: Path):
    """Saves the updated processed article IDs/links to a specified JSON file."""
    temp_file = processed_history_json_path.with_suffix(".tmp")
    try:
        with open(temp_file, "w", encoding="utf-8") as file:
            json.dump(list(history), file, ensure_ascii=False, indent=2)
        temp_file.replace(processed_history_json_path)
        logger.info(
            "Updated processed history: %d entries in %s.",
            len(history),
            processed_history_json_path,
        )
    except OSError:
        logger.exception(
            "Failed to save processed history to '%s'", processed_history_json_path
        )


def ensure_valid_unique_vocab_json(path: Path):
    """Ensures the unique vocabulary JSON file exists and contains valid JSON."""
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text("{}", encoding="utf-8")
        logger.info("Created empty unique vocabulary file at: %s", path)
        return

    if path.stat().st_size == 0:
        path.write_text("{}", encoding="utf-8")
        logger.info("Unique vocabulary file at %s was empty, initialized to '{}'.", path)
        return

    try:
        with open(path, "r", encoding="utf-8") as f:
            json.load(f)
    except json.JSONDecodeError:
        logger.warning(
            "Unique vocabulary file at %s is corrupted. Resetting to '{}'.", path
        )
        path.write_text("{}", encoding="utf-8")
    except Exception as e:
        logger.warning(
            "Unexpected error checking unique vocabulary file at %s: %s. Resetting to '{}'.",
            path,
            e,
        )
        path.write_text("{}", encoding="utf-8")


def load_unique_vocab(unique_vocab_json_path: Path) -> dict[str, dict]:
    """Loads the master set of unique vocabulary from JSON."""
    if not unique_vocab_json_path.exists():
        return {}
    try:
        with open(unique_vocab_json_path, "r", encoding="utf-8") as file:
            return json.load(file)
    except json.JSONDecodeError as err:
        logger.error(
            "Error decoding JSON from '%s': %s. Starting with empty unique vocabulary.",
            unique_vocab_json_path,
            err,
        )
        return {}


def update_unique_vocab(
    master_vocab: dict[str, dict], new_vocab_items: list[dict[str, str]]
) -> int:
    """
    Updates the master unique vocabulary dictionary with new vocabulary items.
    Returns the number of newly added items.
    """
    added_count = 0
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    for item in new_vocab_items:
        word = item.get("word")
        if not word:
            continue

        if word not in master_vocab:
            master_vocab[word] = {
                "word": word,
                "reading": item.get("reading", ""),
                "definition": item.get("definition", ""),
                "jlpt_level": item.get("jlpt_level", ""),
                "first_seen": today_str,
                "occurrence_count": 1,
            }
            added_count += 1
        else:
            master_vocab[word]["occurrence_count"] = (
                master_vocab[word].get("occurrence_count", 1) + 1
            )

    return added_count


def save_unique_vocab(master_vocab: dict[str, dict], unique_vocab_json_path: Path):
    """Saves the updated master unique vocabulary dictionary to JSON."""
    temp_file = unique_vocab_json_path.with_suffix(".tmp")
    try:
        entries = [
            f"  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v, ensure_ascii=False)}"
            for k, v in master_vocab.items()
        ]
        json_content = "{\n" + ",\n".join(entries) + "\n}" if entries else "{}"
        with open(temp_file, "w", encoding="utf-8") as file:
            file.write(json_content)
        temp_file.replace(unique_vocab_json_path)
        logger.info(
            "Updated unique vocabulary store: %d total entries in %s.",
            len(master_vocab),
            unique_vocab_json_path,
        )
    except OSError:
        logger.exception(
            "Failed to save unique vocabulary to '%s'", unique_vocab_json_path
        )


def filter_new_articles(
    articles: list[dict], processed_history: set[str], cutoff_date: datetime
) -> list[dict]:
    """Filters articles based on publication date and processed history."""
    new_articles = []
    for article in articles:
        article_id = article.get("id", article["link"])

        if article_id in processed_history:
            logger.debug(
                "Skipping '%s' (ID: %s) - already processed.",
                article.get("title", "Untitled"),
                article_id,
            )
            continue

        published_date_str = article.get("published", "")
        published_dt = parse_feed_date_string(published_date_str)

        # Ensure both datetimes are timezone-aware and converted to UTC for
        # consistent comparison
        published_dt_utc = published_dt.astimezone(timezone.utc)
        cutoff_date_utc = cutoff_date.astimezone(timezone.utc)

        if published_dt_utc < cutoff_date_utc:
            logger.debug(
                "Skipping '%s' (ID: %s) - published before cutoff %s.",
                article.get("title", "Untitled"),
                article_id,
                cutoff_date_utc.isoformat(),
            )
            continue

        new_articles.append(article)
        logger.info(
            "Eligible for processing: '%s' (ID: %s) - published %s.",
            article.get("title", "Untitled"),
            article_id,
            published_dt_utc.isoformat(),
        )
    return new_articles
