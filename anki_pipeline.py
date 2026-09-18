"""
Anki processing module for the NHK Easy News pipeline.

This module handles vocabulary extraction, Anki package generation,
and optional synchronization with AnkiWeb.
"""

import asyncio
import json
import logging
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import requests

logger = logging.getLogger(__name__)

# Path to anki_sync.lib (../pylibs)
PYLIBS_PATH = Path("/home/nev/pylibs")
if str(PYLIBS_PATH) not in sys.path:
    sys.path.insert(0, str(PYLIBS_PATH))

# Local utility imports
AnkiWebManager = None
try:
    from my_anki.anki_sync_lib import AnkiWebManager
except ImportError:
    logger.warning(
        "Could not import 'AnkiWebManager' from 'my_anki.anki_sync_lib'. "
        "AnkiWeb synchronization will be disabled."
    )

import anki_generator
import article_manager
import vocab_extractor
from config import PipelineConfig
from utils import sanitize_filename


def setup_anki_manager(config: PipelineConfig) -> Optional["AnkiWebManager"]:
    """
    Initializes and returns an AnkiWebManager instance based on configuration.
    """
    if config.no_anki:
        return None

    if anki_generator.genanki is None:
        logger.error("'genanki' module not installed. Skipping Anki package generation.")
        sys.exit(1)

    if AnkiWebManager is None:
        config.send_anki_to_app = False
        return None

    if config.send_anki_to_app:
        anki_web_username = os.getenv("ANKIWEB_USER")
        anki_web_password = os.getenv("ANKIWEB_PASS")
        if not anki_web_username or not anki_web_password:
            logger.error("ANKIWEB_USER and/or ANKIWEB_PASS variables not set.")
            sys.exit(1)
        try:
            return AnkiWebManager(
                username=anki_web_username,
                password=anki_web_password,
                db_path=str(config.anki_local_db_path),
            )
        except Exception:
            logger.exception("Failed to initialize AnkiWebManager.")
            config.send_anki_to_app = False
    return None


def extract_and_generate_anki_for_article(
    article: dict,
    config: PipelineConfig,
    article_markdown_content: str | None,
    all_filtered_vocabulary: list[dict[str, str]],
    current_article_extracted_vocab: list[dict[str, str]] | None = None,
) -> None:
    """
    Extracts vocabulary for the current article and appends it to the daily pool.
    """
    if config.no_anki or not article_markdown_content:
        return

    article_id = article.get("id", article["link"])
    article_title = article.get("title", "Untitled Article")

    existing_unique_vocab = article_manager.load_unique_vocab(config.unique_vocab_json)

    logger.info("Extracting vocabulary for '%s'...", article_title)
    article_vocab = vocab_extractor.filter_vocabulary_from_markdown(
        article_markdown_content, max_words=3, existing_unique_vocab=existing_unique_vocab
    )

    for item in article_vocab:
        item["article_id"] = article_id
        item["article_title"] = article_title
        all_filtered_vocabulary.append(item)


async def handle_combined_anki_package(
    all_filtered_vocabulary: list[dict[str, str]],
    config: PipelineConfig,
) -> None:
    """
    Generates a combined daily Anki package from all collected vocabulary
    and updates unique_vocab.json once for the entire run.
    """
    if config.no_anki:
        logger.info("Anki processing is disabled (--no-anki).")
        return

    if not all_filtered_vocabulary:
        logger.info("No vocabulary collected across all new articles for Anki package.")
        return

    current_date_tag = f"date-{datetime.now(timezone.utc).strftime('%Y%m%d')}"

    # Deduplicate within today's collected vocabulary pool and limit to 12 words total
    unique_daily_vocab: list[dict[str, str]] = []
    seen_words: set[str] = set()

    for item in all_filtered_vocabulary:
        word = item["word"]
        if word not in seen_words:
            seen_words.add(word)
            unique_daily_vocab.append(item)
        if len(unique_daily_vocab) >= 12:
            break

    logger.info(
        "Generating combined daily Anki package for %d vocabulary words...",
        len(unique_daily_vocab),
    )

    anki_config = anki_generator.AnkiPackageConfig(
        output_dir=config.anki_output_dir,
        package_name=f"nhkeasy_{datetime.now(timezone.utc).strftime('%Y%m%d')}",
        max_notes=None,
        model_name="Japanese Custom Template",
        template_prefix="nhkeasy",
    )

    combined_anki_package_path = anki_generator.generate_anki_package(
        unique_daily_vocab, anki_config, card_tags=[current_date_tag]
    )

    if combined_anki_package_path:
        # Save newly added words to master unique_vocab.json ONCE at end of batch
        master_vocab = article_manager.load_unique_vocab(config.unique_vocab_json)
        new_items_for_master = [
            {"kanji": v["word"], "hiragana": v["reading"], "meaning": v["definition"]}
            for v in unique_daily_vocab
        ]
        article_manager.update_unique_vocab(master_vocab, new_items_for_master)
        article_manager.save_unique_vocab(master_vocab, config.unique_vocab_json)
        logger.info("Updated master unique_vocab.json with %d new words.", len(unique_daily_vocab))

    if config.send_anki_to_app and combined_anki_package_path:
        anki_web_manager = setup_anki_manager(config)
        if anki_web_manager:
            logger.info("Importing combined Anki package '%s' into Anki...", combined_anki_package_path.name)
            try:
                await asyncio.to_thread(
                    anki_web_manager.import_and_sync,
                    str(combined_anki_package_path),
                    with_scheduling=False,
                )
                logger.info("Combined Anki package successfully imported and synchronized.")
            except Exception:
                logger.exception("Failed to import Anki package via AnkiWebManager")
