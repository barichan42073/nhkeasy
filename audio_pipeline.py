"""
Audio processing module for the NHK Easy News pipeline.

This module handles downloading original audio, slowing it down,
and combining multiple slowed audio files.
"""

import logging
import os
import sys  # Added for sys.path modification and sys.exit
from pathlib import Path

import pydub.exceptions as pydub_exceptions
import requests
from pydub import AudioSegment

# Path to slowrecord module (../avlib/avlib)
AVLIB_PATH = Path(__file__).resolve().parent.parent / "avlib" / "avlib"
if str(AVLIB_PATH) not in sys.path:
    sys.path.insert(0, str(AVLIB_PATH))

try:
    import slowrecord
except ImportError:
    logging.getLogger(__name__).error("Could not import slowrecord.")
    slowrecord = None


# Local utility imports from the main pipeline's context
# Assuming these are available or can be passed
from config import PipelineConfig
from utils import download_mp3, extract_mp3_url, find_mp3_url, sanitize_filename

logger = logging.getLogger(__name__)


def setup_audio_preflight_checks(config: PipelineConfig):
    """
    Performs pre-flight checks for audio generation dependencies.
    Exits if critical dependencies are missing.
    """
    if config.no_audio:
        return

    if slowrecord is None:
        logger.error(
            "'slowrecord' module could not be imported. "
            "Ensure it's installed and configured correctly."
        )
        sys.exit(1)
    if not os.getenv("GROQ_API_KEY"):
        logger.error(
            "GROQ_API_KEY environment variable not set (required for "
            "'slowrecord' audio generation)."
        )
        sys.exit(1)


async def process_audio_for_article(
    article: dict,
    config: PipelineConfig,
    raw_html_content: str | None,
    newly_processed_article_ids: set[str],
    generated_slow_files: list[Path],
) -> None:
    """
    Downloads original article audio, slows it down,
    and adds the slowed file path to the shared list.
    Marks article as processed if only audio processing was
    requested and succeeded.
    """
    if config.no_audio:
        return

    article_url = article["link"]
    article_id = article.get("id", article_url)
    article_title = article.get("title", "Untitled Article")
    audio_processed = False

    try:
        if slowrecord is None:
            logger.warning("slowrecord module is not available; cannot generate audio.")
            return

        mp3_url = find_mp3_url(article, raw_html_content, article_url)

        if mp3_url:
            audio_orig_path = config.audio_dir / (
                f"{sanitize_filename(article_title)}_"
                f"{sanitize_filename(article_id)}.mp3"
            )

            download_mp3(mp3_url, audio_orig_path)
            slowed_filename = (
                f"{sanitize_filename(article_title)}_"
                f"{sanitize_filename(article_id)}_slow.mp3"
            )
            slowed_path = config.slow_audio_dir / slowed_filename
            slowrecord.process_news_with_pysbd(  # type: ignore
                str(audio_orig_path), str(slowed_path)
            )
            generated_slow_files.append(slowed_path)
            logger.info("Created slowed MP3: %s", slowed_path.name)
            audio_processed = True
            try:
                audio_orig_path.unlink(missing_ok=True)
            except OSError:
                logger.exception(
                    "Could not remove temporary audio file %s",
                    audio_orig_path.name,
                )
        else:
            logger.warning(
                "No MP3 URL found in article metadata for '%s', skipping audio "
                "generation.",
                article_title,
            )
    except (OSError, requests.RequestException, pydub_exceptions.PydubError):
        logger.exception(
            "Audio generation failed for '%s' (ID: %s)",
            article_title,
            article_id,
        )
    if config.only_slowrecord and audio_processed:
        newly_processed_article_ids.add(article_id)
        logger.info("'%s' (audio only) marked as processed.", article_title)


async def handle_combined_audio(
    generated_slow_files: list[Path], config: PipelineConfig
) -> Path | None:
    """
    Combines all generated slowed MP3 files and exports the combined audio.
    Cleans up individual slowed files on success.

    Delivery (e.g. sending to Kindle) is NOT handled here; this function
    only generates the combined artifact and returns its path so the
    orchestrator (pipeline.py) can sequence delivery afterwards.

    Returns:
        The path to the combined MP3 file if successfully created,
        otherwise None.
    """
    if not generated_slow_files:
        logger.info(
            "No slowed MP3 files were generated; skipping combined audio creation."
        )
        return None

    logger.info(
        "Combining %d slowed MP3 files into %s...",
        len(generated_slow_files),
        config.combined_audio_path,
    )
    combined_audio = AudioSegment.empty()
    for slow_path in generated_slow_files:
        try:
            combined_audio += AudioSegment.from_mp3(str(slow_path))
        except (OSError, pydub_exceptions.PydubError):
            logger.exception(
                "Failed to load %s for concatenation",
                slow_path,
            )

    try:
        combined_audio.export(str(config.combined_audio_path), format="mp3")
        logger.info(
            "Created combined MP3: %s", config.combined_audio_path.resolve()
        )
        if not config.keep_slow_mp3:
            for slow_path in generated_slow_files:
                try:
                    slow_path.unlink(missing_ok=True)
                except OSError:
                    logger.exception("Could not remove %s", slow_path.name)
            logger.info("Removed per-article slowed MP3 files.")
        return config.combined_audio_path
    except (OSError, pydub_exceptions.PydubError):
        logger.exception("Failed to export combined MP3")
        return None
