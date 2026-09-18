"""
Module for extracting and filtering vocabulary from markdown content.
"""
import logging
from typing import Dict, List, Optional

# Setup logging
logger = logging.getLogger(__name__)

# Vocabulary filtering constants
ALLOWED_JLPT_LEVELS = {"N1", "N2", "N3", "N4", "N5", "N/A", ""}
ALLOWED_FREQUENCIES = {"C", "VC", "DS", ""}


def _parse_vocabulary_row(line_parts: list[str]) -> Dict[str, str] | None:
    """
    Parses a single row of vocabulary data from markdown table parts.
    Strips whitespace and markdown formatting (such as **bold** asterisks).
    Returns a dictionary if successful, None otherwise.
    """
    if len(line_parts) < 6:
        logger.debug(
            "Skipping short vocabulary row: %s "
            "(expected at least 6 parts, got %d)",
            "|".join(line_parts), len(line_parts)
        )
        return None
    try:
        parsed_row = {
            "kanji": line_parts[1].strip().strip("*").strip(),
            "hiragana": line_parts[2].strip().strip("*").strip(),
            "jlpt": line_parts[3].strip().strip("*").strip(),
            "frequency": line_parts[4].strip().strip("*").strip(),
            "meaning": line_parts[5].strip().strip("*").strip(),
        }
        logger.debug("Successfully parsed vocabulary row: %s", parsed_row)
        return parsed_row
    except IndexError:
        logger.warning("Skipping malformed vocabulary row: %s", "|".join(line_parts))
        return None


def _extract_vocabulary_from_markdown_table(markdown_content: str) -> List[Dict[str, str]]:
    """
    Parses markdown content to extract all vocabulary rows from the expected table format.
    """
    logger.debug("Attempting to extract vocabulary from markdown table.")
    lines = markdown_content.splitlines()
    vocabulary_data = []
    parsing_vocab_table = False

    for line_num, line in enumerate(lines):
        stripped_line = line.strip()
        if not stripped_line:
            continue

        if not parsing_vocab_table:
            if (stripped_line.startswith("| Kanji") and
                    "| Hiragana" in stripped_line and
                    "| JLPT" in stripped_line):
                parsing_vocab_table = True
                logger.debug("Found start of vocabulary table header on line %d.", line_num + 1)
            continue

        if stripped_line.startswith("| :---"):
            logger.debug("Skipping table separator line on line %d.", line_num + 1)
            continue
        if not stripped_line.startswith("|"):
            if parsing_vocab_table:
                logger.debug("Table parsing ended on line %d (non-table line).", line_num + 1)
            parsing_vocab_table = False
            continue

        if parsing_vocab_table:
            parts = [p.strip() for p in stripped_line.split("|")]
            word_info = _parse_vocabulary_row(parts)
            if word_info:
                vocabulary_data.append(word_info)
    logger.debug("Finished extracting raw vocabulary from markdown table. Found %d items.", len(vocabulary_data))
    return vocabulary_data


def filter_vocabulary_from_markdown(
        markdown_content: str,
        max_words: int = 3,
        existing_unique_vocab: Dict[str, Dict] | None = None
) -> List[Dict[str, str]]:
    """
    Parses a markdown table, filters out duplicate words, and caps the result.

    Args:
        markdown_content: The full markdown content as a string.
        max_words: The maximum number of filtered words to return.
        existing_unique_vocab: A dictionary of already known unique vocabulary,
                               where keys are the 'kanji' forms of the words.

    Returns:
        A list of standardized vocabulary dictionaries.
    """
    logger.debug("Filtering vocabulary from markdown. max_words: %d", max_words)
    vocabulary_data = _extract_vocabulary_from_markdown_table(markdown_content)
    logger.debug("Raw extracted vocabulary data: %s", vocabulary_data)

    filtered_words = []
    existing_unique_vocab = existing_unique_vocab if existing_unique_vocab is not None else {}

    for i, word in enumerate(vocabulary_data):
        if len(filtered_words) >= max_words:
            break

        word_kanji = word["kanji"]
        is_duplicate = word_kanji in existing_unique_vocab

        if not is_duplicate:
            standardized_item = {
                "word": word_kanji,
                "reading": word["hiragana"],
                "definition": word["meaning"],
                "jlpt_level": word["jlpt"],
            }
            filtered_words.append(standardized_item)
            logger.debug("Word '%s' passed duplicate filter.", word_kanji)

    logger.debug("Final filtered %d vocabulary words from markdown.", len(filtered_words))
    return filtered_words
