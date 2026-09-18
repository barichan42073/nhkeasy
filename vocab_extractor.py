"""
Vocabulary extraction module — Functional Core.

Parses the vocabulary table embedded in per-article Markdown content and
filters it against an already-loaded "existing unique vocabulary" mapping.
This module performs no file I/O and no network calls; the caller is
responsible for loading `existing_unique_vocab` from disk and persisting
any updates.
"""

import logging
import re

logger = logging.getLogger(__name__)

# Matches a pipe-delimited markdown table row of the form:
# | **word** | reading | JLPT | frequency | meaning |
# The word column may or may not be wrapped in markdown bold (**).
_TABLE_ROW_PATTERN = re.compile(
    r"^\|\s*\*{0,2}(?P<word>[^|*]+?)\*{0,2}\s*\|"
    r"\s*(?P<reading>[^|]*?)\s*\|"
    r"\s*(?P<jlpt>[^|]*?)\s*\|"
    r"\s*(?P<freq>[^|]*?)\s*\|"
    r"\s*(?P<meaning>[^|]*?)\s*\|\s*$"
)

_HEADER_WORDS = {"kanji", "word", ""}


def _is_separator_row(line: str) -> bool:
    """Detects markdown table separator rows like '| :--- | :--- |'."""
    stripped = line.replace("|", "").strip()
    return bool(stripped) and set(stripped) <= {"-", " ", ":"}


def _parse_vocab_table_rows(markdown_content: str) -> list[dict[str, str]]:
    """
    Parses the pipe-delimited vocabulary table embedded in article
    markdown and returns a list of vocab dicts with keys: word, reading,
    definition, jlpt_level. Pure function, no I/O.
    """
    rows: list[dict[str, str]] = []

    for raw_line in markdown_content.splitlines():
        line = raw_line.strip()
        if not line.startswith("|"):
            continue
        if _is_separator_row(line):
            continue

        match = _TABLE_ROW_PATTERN.match(line)
        if not match:
            continue

        word = match.group("word").strip()
        if word.lower() in _HEADER_WORDS:
            continue

        reading = match.group("reading").strip()
        jlpt_raw = match.group("jlpt").strip()
        meaning = match.group("meaning").strip()

        jlpt_level = "" if jlpt_raw.upper() in {"N/A", ""} else jlpt_raw.lower()

        rows.append(
            {
                "word": word,
                "reading": reading,
                "definition": meaning,
                "jlpt_level": jlpt_level,
            }
        )

    return rows


def filter_vocabulary_from_markdown(
    markdown_content: str | None,
    max_words: int = 3,
    existing_unique_vocab: dict[str, dict] | None = None,
) -> list[dict[str, str]]:
    """
    Parses vocabulary entries from the markdown table produced for an
    article and returns up to `max_words` items whose `word` is not
    already present in `existing_unique_vocab`.

    Pure function: performs no file I/O and no network calls. The caller
    is responsible for loading `existing_unique_vocab` from disk ahead of
    time and passing it in.
    """
    if not markdown_content:
        return []

    if existing_unique_vocab is None:
        existing_unique_vocab = {}

    parsed_rows = _parse_vocab_table_rows(markdown_content)

    filtered: list[dict[str, str]] = []
    seen_words: set[str] = set()

    for row in parsed_rows:
        word = row["word"]
        if word in existing_unique_vocab or word in seen_words:
            continue

        filtered.append(row)
        seen_words.add(word)

        if len(filtered) >= max_words:
            break

    return filtered
