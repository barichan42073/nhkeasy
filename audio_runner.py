import logging
import os
import smtplib
import sys
from pathlib import Path

# 1. Update sys.path FIRST before importing local/third-party libs
AVLIB_PATH = Path(__file__).resolve().parent.parent / "avlib" / "avlib"
if str(AVLIB_PATH) not in sys.path:
    sys.path.insert(0, str(AVLIB_PATH))

# 2. Guard pydub import with a fallback exception class
try:
    from pydub import AudioSegment
    from pydub.exceptions import PydubError
except ImportError:
    AudioSegment = None

    class PydubError(Exception):
        """Fallback exception when pydub is not installed."""
        pass

import requests

try:
    import slowrecord
except ImportError:
    logger = logging.getLogger(__name__)
    logger.error("Could not import slowrecord.")
    slowrecord = None

import audio_pipeline

try:
    import send_to_kindle
except ImportError:
    send_to_kindle = None

from config import PipelineConfig
from utils import download_mp3

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Imperative Shell: optional dependency / environment wiring specific to the
# audio boundary. Kept local to this module so future audio configuration
# changes never require touching pipeline.py.
# ---------------------------------------------------------------------------


def run_audio_preflight_checks(config: PipelineConfig) -> None:
    """
    Imperative-shell wrapper: probes the environment (module import result,
    env var presence), delegates the pure validation logic to
    audio_pipeline.check_audio_preflight, and exits the process on failure.
    """
    errors = audio_pipeline.check_audio_preflight(
        config,
        slowrecord_available=slowrecord is not None,
        groq_api_key_present=bool(os.getenv("GROQ_API_KEY")),
    )
    for message in errors:
        logger.error(message)
    if errors:
        sys.exit(1)


async def execute_audio_processing_for_article(
    article: dict,
    config: PipelineConfig,
    raw_html_content: str | None,
    newly_processed_article_ids: set[str],
    generated_slow_files: list[Path],
) -> None:
    """
    Imperative-shell wrapper: asks the functional core whether/how to
    process audio for this article, then performs the actual download,
    external 'slowrecord' invocation, and file cleanup.
    """
    if config.no_audio:
        return

    if slowrecord is None:
        logger.warning("slowrecord module is not available; cannot generate audio.")
        return

    task = audio_pipeline.build_audio_task(article, config, raw_html_content)
    if task is None:
        return

    audio_processed = False
    try:
        download_mp3(task.mp3_url, task.audio_orig_path)
        slowrecord.process_news_with_pysbd(  # type: ignore
            str(task.audio_orig_path), str(task.slowed_path)
        )
        generated_slow_files.append(task.slowed_path)
        logger.info("Created slowed MP3: %s", task.slowed_path.name)
        audio_processed = True
        try:
            task.audio_orig_path.unlink(missing_ok=True)
        except OSError:
            logger.exception(
                "Could not remove temporary audio file %s",
                task.audio_orig_path.name,
            )
    except (OSError, requests.RequestException, PydubError):
        logger.exception(
            "Audio generation failed for '%s' (ID: %s)",
            task.article_title,
            task.article_id,
        )

    if audio_pipeline.should_mark_article_processed_for_audio_only(
        config, audio_processed
    ):
        newly_processed_article_ids.add(task.article_id)
        logger.info("'%s' (audio only) marked as processed.", task.article_title)


async def combine_and_export_audio(
    generated_slow_files: list[Path], config: PipelineConfig
) -> Path | None:
    """
    Imperative-shell function: combines all generated slowed MP3 files and
    exports the combined audio. Cleans up individual slowed files on
    success. Delivery (e.g. sending to Kindle) is handled separately by
    deliver_combined_audio so the orchestrator can sequence it.
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
    combined_audio = AudioSegment.empty() if AudioSegment else None
    if combined_audio is None:
        logger.error("pydub.AudioSegment is unavailable; cannot combine audio.")
        return None

    for slow_path in generated_slow_files:
        try:
            combined_audio += AudioSegment.from_mp3(str(slow_path))
        except (OSError, PydubError):
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
    except (OSError, PydubError):
        logger.exception("Failed to export combined MP3")
        return None

async def deliver_combined_audio(
    combined_audio_path: Path, config: PipelineConfig
) -> None:
    """Sends the combined audio file to the configured destination email."""
    if send_to_kindle is None:
        logger.error(
            "send_to_kindle module is not available; cannot deliver combined audio."
        )
        return

    recipient = config.combined_mp3_email or "barichan42073@gmail.com"

    try:
        success = send_to_kindle.send_epub_to_kindle(
            combined_audio_path, kindle_email=recipient
        )
        if success:
            logger.info("Sent combined MP3 to %s", recipient)
        else:
            logger.error("Failed to send combined MP3 via email")
    except (OSError, smtplib.SMTPException):
        logger.exception("Failed to send combined MP3 via email")
