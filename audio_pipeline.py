"""
Audio processing module for the NHK Easy News pipeline — Functional Core.

Every function in this module is pure: given the same inputs, it returns
the same output, performs no file writes, makes no network calls, and
invokes no external processes or subprocesses. All actual I/O (downloading
audio, invoking 'slowrecord', combining/exporting MP3s, deleting files) is
performed by the imperative shell in pipeline.py.
"""

import logging
from dataclasses import dataclass
from pathlib import Path

from config import PipelineConfig
from utils import find_mp3_url, sanitize_filename

logger = logging.getLogger(__name__)


@dataclass
class AudioTask:
    """Pure description of the audio work needed for a single article."""

    article_id: str
    article_title: str
    mp3_url: str
    audio_orig_path: Path
    slowed_path: Path


def check_audio_preflight(
    config: PipelineConfig,
    slowrecord_available: bool,
    groq_api_key_present: bool,
) -> list[str]:
    """
    Returns a list of human-readable error messages describing any missing
    audio-generation prerequisites. An empty list means all checks passed.

    This function performs no probing itself (no imports, no environment
    reads) -- the caller (imperative shell) is responsible for attempting
    the 'slowrecord' import and checking for the GROQ_API_KEY environment
    variable, then passing the results in as booleans.
    """
    if config.no_audio:
        return []

    errors = []
    if not slowrecord_available:
        errors.append(
            "'slowrecord' module could not be imported. "
            "Ensure it's installed and configured correctly."
        )
    if not groq_api_key_present:
        errors.append(
            "GROQ_API_KEY environment variable not set (required for "
            "'slowrecord' audio generation)."
        )
    return errors


def build_audio_task(
    article: dict,
    config: PipelineConfig,
    raw_html_content: str | None,
) -> AudioTask | None:
    """
    Determines whether an audio task is needed for the given article and,
    if so, returns a fully-specified AudioTask describing the work to do.
    Returns None if no audio processing should occur (e.g. no MP3 URL
    could be found, or audio generation is disabled).

    This function performs no network calls, no file I/O, and invokes no
    subprocesses. `find_mp3_url` only inspects already-fetched HTML/article
    metadata and constructs a URL string; it never touches the network or
    disk itself.
    """
    if config.no_audio:
        return None

    article_url = article["link"]
    article_id = article.get("id", article_url)
    article_title = article.get("title", "Untitled Article")

    mp3_url = find_mp3_url(article, raw_html_content, article_url)
    if not mp3_url:
        logger.warning(
            "No MP3 URL found in article metadata for '%s', skipping audio "
            "generation.",
            article_title,
        )
        return None

    audio_orig_path = config.audio_dir / (
        f"{sanitize_filename(article_title)}_{sanitize_filename(article_id)}.mp3"
    )
    slowed_filename = (
        f"{sanitize_filename(article_title)}_{sanitize_filename(article_id)}_slow.mp3"
    )
    slowed_path = config.slow_audio_dir / slowed_filename

    return AudioTask(
        article_id=article_id,
        article_title=article_title,
        mp3_url=mp3_url,
        audio_orig_path=audio_orig_path,
        slowed_path=slowed_path,
    )


def should_mark_article_processed_for_audio_only(
    config: PipelineConfig, audio_processed: bool
) -> bool:
    """Pure decision: should this article be marked as fully processed based
    solely on successful audio generation (--only-slowrecord mode)?"""
    return config.only_slowrecord and audio_processed
