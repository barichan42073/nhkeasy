import asyncio
import logging
import os
import sys
from pathlib import Path

import anki_generator
import anki_pipeline
import article_manager
from article_schema import ArticleAnalysis
from config import PipelineConfig

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Imperative Shell: optional dependency / environment wiring specific to the
# Anki boundary. Kept local to this module so future Anki configuration
# changes never require touching pipeline.py.
# ---------------------------------------------------------------------------

PYLIBS_PATH = Path(__file__).parent / "pylibs"
if str(PYLIBS_PATH) not in sys.path:
    sys.path.insert(0, str(PYLIBS_PATH))

AnkiWebManager = None
try:
    from my_anki.anki_sync_lib import AnkiWebManager
except ImportError:
    logger.warning(
        "Could not import 'AnkiWebManager' from 'my_anki.anki_sync_lib'. "
        "AnkiWeb synchronization will be disabled."
    )


def _setup_anki_manager(config: PipelineConfig):
    """
    Imperative-shell function: initializes and returns an AnkiWebManager
    instance based on configuration. Performs environment reads and opens
    a local database connection.

    Never exits the process: on a missing dependency or credential it logs
    an error and returns None, so the rest of the run (audio, history) still
    completes and only the AnkiWeb import is skipped.
    """
    if config.no_anki:
        return None

    if anki_generator.genanki is None:
        logger.error("'genanki' module not installed; skipping Anki import.")
        config.send_anki_to_app = False
        return None

    if AnkiWebManager is None:
        config.send_anki_to_app = False
        return None

    if config.send_anki_to_app:
        anki_web_username = os.getenv("ANKIWEB_USER")
        anki_web_password = os.getenv("ANKIWEB_PASS")
        if not anki_web_username or not anki_web_password:
            logger.error(
                "ANKIWEB_USER and/or ANKIWEB_PASS variables not set; skipping "
                "AnkiWeb import (the .apkg package was still saved)."
            )
            config.send_anki_to_app = False
            return None
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


def collect_article_vocab_for_anki(
    article: dict,
    config: PipelineConfig,
    analysis: ArticleAnalysis | None,
    all_filtered_vocabulary: list[dict[str, str]],
) -> None:
    """
    Imperative-shell wrapper: asks the functional core
    (anki_pipeline.build_article_vocab_items) for the article's vocabulary
    and appends it to the shared in-memory pool.
    """
    if config.no_anki or analysis is None:
        return

    vocab_items = anki_pipeline.build_article_vocab_items(article, analysis)
    logger.debug(
        "Collected %d vocabulary item(s) for '%s'.",
        len(vocab_items),
        article.get("title", "Untitled Article"),
    )
    all_filtered_vocabulary.extend(vocab_items)


async def _import_package(package_path: Path, config: PipelineConfig) -> bool:
    """Imports and syncs the package via AnkiWeb. Returns True on success."""
    anki_web_manager = _setup_anki_manager(config)
    if not anki_web_manager:
        return False
    logger.info("Importing combined Anki package '%s' into Anki...", package_path.name)
    try:
        await asyncio.to_thread(
            anki_web_manager.import_and_sync,
            str(package_path),
            with_scheduling=False,
        )
    except Exception:
        logger.exception("Failed to import Anki package via AnkiWebManager")
        return False
    logger.info("Combined Anki package successfully imported and synchronized.")
    return True


async def generate_and_deliver_daily_anki_package(
    all_filtered_vocabulary: list[dict[str, str]],
    config: PipelineConfig,
) -> None:
    """
    Imperative-shell function: uses the functional core to drop words already
    in the master vocabulary, select/shape the daily vocabulary pool and
    package config, then performs the .apkg generation, the AnkiWeb import
    and unique_vocab.json persistence.

    New words are recorded as known only once they are really in Anki: after
    a successful import, or, with --no-anki-import, once the package is built
    (you import it yourself). If an import was wanted but failed, the words
    stay unrecorded so they come up again, and the .apkg is kept on disk.
    Recurrence counts for already-known words are always saved.
    """
    if config.no_anki:
        logger.info("Anki processing is disabled (--no-anki).")
        return

    if not all_filtered_vocabulary:
        logger.info("No vocabulary collected across all new articles for Anki package.")
        return

    master_vocab = article_manager.load_unique_vocab(config.unique_vocab_json)
    new_vocab, known_vocab = anki_pipeline.split_known_vocab(
        all_filtered_vocabulary, master_vocab
    )

    if known_vocab:
        logger.info(
            "Skipping %d vocabulary word(s) already in unique_vocab.json.",
            len(known_vocab),
        )
        # Words seen again still count towards their recurrence counter.
        article_manager.update_unique_vocab(
            master_vocab, anki_pipeline.build_unique_vocab_updates(known_vocab)
        )

    recorded_new_words = False
    if new_vocab:
        unique_daily_vocab = anki_pipeline.select_daily_vocab(new_vocab, max_words=12)
        current_date_tag = anki_pipeline.build_daily_tag()

        logger.info(
            "Generating combined daily Anki package for %d vocabulary words...",
            len(unique_daily_vocab),
        )

        anki_config = anki_pipeline.build_daily_anki_package_config(config)

        combined_anki_package_path = anki_generator.generate_anki_package(
            unique_daily_vocab, anki_config, card_tags=[current_date_tag]
        )

        if combined_anki_package_path:
            import_wanted = config.send_anki_to_app
            imported = (
                await _import_package(combined_anki_package_path, config)
                if import_wanted
                else False
            )
            if imported or not import_wanted:
                added = article_manager.update_unique_vocab(
                    master_vocab,
                    anki_pipeline.build_unique_vocab_updates(unique_daily_vocab),
                )
                recorded_new_words = True
                logger.info("Added %d new words to master unique_vocab.json.", added)
            else:
                logger.warning(
                    "Anki import did not complete: %d new word(s) not recorded as "
                    "known, so they can come up again. The package is kept at %s.",
                    len(unique_daily_vocab),
                    combined_anki_package_path,
                )
    else:
        logger.info(
            "No new vocabulary for an Anki package: every collected word is already known."
        )

    if known_vocab or recorded_new_words:
        article_manager.save_unique_vocab(master_vocab, config.unique_vocab_json)
