"""
Anki processing module — Functional Core.

Every function in this module is pure: given vocabulary data already held
in memory (and, where relevant, an already-loaded unique-vocab dictionary),
they compute and return new data structures. None of these functions write
files to disk, make network calls, or invoke external processes/scripts.

Actual .apkg file generation (via anki_generator), unique_vocab.json
persistence (via article_manager), and AnkiWeb synchronization are all
performed by the imperative shell in anki_runner.py.
"""

import logging
from collections import deque
from collections.abc import Container
from datetime import datetime, timezone

import anki_generator
from article_schema import ArticleAnalysis
from config import PipelineConfig

logger = logging.getLogger(__name__)


def build_article_vocab_items(
    article: dict, analysis: ArticleAnalysis | None
) -> list[dict[str, str]]:
    """
    Turns an article's analysed vocabulary (the side_vocab list the page also
    shows) into Anki vocab items tagged with the article's id/title. No
    per-article cap and no known-word filtering here: the daily step drops
    known words (counting their recurrence) and shares the daily cap
    round-robin across articles. Pure function, no I/O.
    """
    if analysis is None:
        return []

    article_id = article.get("id", article["link"])
    article_title = article.get("title", "Untitled Article")

    return [
        {
            "word": vocab.word,
            "reading": vocab.reading,
            "definition": vocab.definition,
            "jlpt_level": vocab.jlpt_level,
            "article_id": article_id,
            "article_title": article_title,
        }
        for vocab in analysis.side_vocab
        if vocab.word
    ]


def split_known_vocab(
    all_vocabulary: list[dict[str, str]], known_words: Container[str]
) -> tuple[list[dict[str, str]], list[dict[str, str]]]:
    """
    Splits the collected vocabulary pool into (new, known) according to
    whether each word is already in the master vocabulary (`known_words`,
    e.g. the unique_vocab.json dict, keyed by word). Both lists are
    de-duplicated by word, keeping the first occurrence and the original
    order. Pure function, no I/O.
    """
    new_items: list[dict[str, str]] = []
    known_items: list[dict[str, str]] = []
    seen_words: set[str] = set()

    for item in all_vocabulary:
        word = item["word"]
        if word in seen_words:
            continue
        seen_words.add(word)
        (known_items if word in known_words else new_items).append(item)

    return new_items, known_items


def select_daily_vocab(
    all_filtered_vocabulary: list[dict[str, str]], max_words: int = 12
) -> list[dict[str, str]]:
    """
    De-duplicates the collected vocabulary pool by word and caps it at
    `max_words`, taking words round-robin across articles (grouped by
    `article_title`) so that one article with a long vocabulary list cannot
    fill the whole day's deck. Within an article the original order is kept.
    With a single article this behaves like a plain de-duplicate-and-cap.
    Pure function, no I/O.
    """
    by_article: dict[str, list[dict[str, str]]] = {}
    for item in all_filtered_vocabulary:
        by_article.setdefault(item.get("article_title", ""), []).append(item)

    queues = [deque(items) for items in by_article.values()]
    selected: list[dict[str, str]] = []
    seen_words: set[str] = set()

    while queues and len(selected) < max_words:
        for queue in queues:
            while queue and queue[0]["word"] in seen_words:
                queue.popleft()
            if queue and len(selected) < max_words:
                item = queue.popleft()
                seen_words.add(item["word"])
                selected.append(item)
        queues = [queue for queue in queues if queue]

    return selected


def build_daily_anki_package_config(
    config: PipelineConfig,
) -> "anki_generator.AnkiPackageConfig":
    """Pure construction of the AnkiPackageConfig for the daily combined deck."""
    return anki_generator.AnkiPackageConfig(
        output_dir=config.anki_output_dir,
        package_name=f"nhkeasy_{datetime.now(timezone.utc).strftime('%Y%m%d')}",
        deck_name="NHKeasynews",
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
