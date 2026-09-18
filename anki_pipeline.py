"""
Anki processing module — Functional Core.

Every function in this module is pure: given vocabulary data already held
in memory (and, where relevant, an already-loaded unique-vocab dictionary),
they compute and return new data structures. None of these functions write
files to disk, make network calls, or invoke external processes/scripts.

Actual .apkg file generation (via anki_generator), unique_vocab.json
persistence (via article_manager), and AnkiConnect/AnkiWeb synchronization
are all performed by the imperative shell in pipeline.py.
"""

import logging
from datetime import datetime, timezone

import anki_generator
import vocab_extractor
from config import PipelineConfig

logger = logging.getLogger(__name__)


def build_article_vocab_items(
    article: dict,
    article_markdown_content: str | None,
    existing_unique_vocab: dict[str, dict],
    max_words: int = 3,
) -> list[dict[str, str]]:
    """
    Extracts up to `max_words` new vocabulary items for a single article,
    tagging each item with the article's id/title. Performs no I/O; the
    caller is responsible for loading `existing_unique_vocab` from disk
    beforehand and passing it in.
    """
    if not article_markdown_content:
        return []

    article_id = article.get("id", article["link"])
    article_title = article.get("title", "Untitled Article")

    article_vocab = vocab_extractor.filter_vocabulary_from_markdown(
        article_markdown_content,
        max_words=max_words,
        existing_unique_vocab=existing_unique_vocab,
    )

    for item in article_vocab:
        item["article_id"] = article_id
        item["article_title"] = article_title

    return article_vocab


def select_daily_vocab(
    all_filtered_vocabulary: list[dict[str, str]], max_words: int = 12
) -> list[dict[str, str]]:
    """
    Deduplicates the collected vocabulary pool by word and caps it at
    `max_words`. Pure function, no I/O.
    """
    unique_daily_vocab: list[dict[str, str]] = []
    seen_words: set[str] = set()

    for item in all_filtered_vocabulary:
        word = item["word"]
        if word not in seen_words:
            seen_words.add(word)
            unique_daily_vocab.append(item)
        if len(unique_daily_vocab) >= max_words:
            break

    return unique_daily_vocab


def build_daily_anki_package_config(
    config: PipelineConfig,
) -> "anki_generator.AnkiPackageConfig":
    """Pure construction of the AnkiPackageConfig for the daily combined deck."""
    return anki_generator.AnkiPackageConfig(
        output_dir=config.anki_output_dir,
        package_name=f"nhkeasy_{datetime.now(timezone.utc).strftime('%Y%m%d')}",
        max_notes=None,
        model_name="Japanese Custom Template",
        template_prefix="nhkeasy",
    )


def build_daily_tag() -> str:
    """Pure helper computing the date tag applied to today's Anki notes."""
    return f"date-{datetime.now(timezone.utc).strftime('%Y%m%d')}"


def build_unique_vocab_updates(
    unique_daily_vocab: list[dict[str, str]]
) -> list[dict[str, str]]:
    """
    Pure transform converting the daily vocab payload shape into the shape
    expected by article_manager.update_unique_vocab (word/reading/definition/
    jlpt_level keys).
    """
    return [
        {
            "word": v["word"],
            "reading": v.get("reading", ""),
            "definition": v.get("definition", ""),
            "jlpt_level": v.get("jlpt_level", ""),
        }
        for v in unique_daily_vocab
    ]
