"""
EPUB generation and Kindle delivery module — Imperative Shell.

This module orchestrates the I/O concerns of converting a single article
into an EPUB file (via nhkeasier_to_epub.process_article_to_epub) and,
when enabled, delivering that EPUB to a Kindle device via email (via
send_to_kindle.send_epub_to_kindle). It follows the same shape as
audio_runner.py and html_runner.py: reads/derives configuration, performs
the actual disk/network side effects, and updates the shared in-memory
bookkeeping structures used by pipeline.py.
"""

import logging
from pathlib import Path

import nhkeasier_to_epub
import send_to_kindle
from article_schema import ArticleAnalysis
from config import PipelineConfig
from utils import sanitize_filename

logger = logging.getLogger(__name__)


def _build_epub_output_path(article: dict, config: PipelineConfig) -> Path:
    """Derives the destination .epub path for a given article."""
    article_id = article.get("id", article["link"])
    article_title = article.get("title", "Untitled Article")
    epub_filename = (
        f"{sanitize_filename(article_title)}_{sanitize_filename(article_id)}.epub"
    )
    return config.epubs_dir / epub_filename


async def process_epub_and_kindle(
    article: dict,
    config: PipelineConfig,
    raw_html_content: str,
    analysis: ArticleAnalysis,
    newly_processed_article_ids: set[str],
    kindle_sent_count: list[int],
) -> tuple[Path | None, str | None]:
    """
    Converts a single article into an EPUB file and, if enabled, delivers
    it to a Kindle device via email. Marks the article as processed on
    successful EPUB generation, and increments kindle_sent_count[0] on
    successful delivery.

    Returns a tuple of (epub_path, article_markdown_content). Both will be
    None if EPUB generation failed.
    """
    article_id = article.get("id", article["link"])
    article_title = article.get("title", "Untitled Article")

    output_path = _build_epub_output_path(article, config)

    try:
        epub_path, article_markdown_content = (
            await nhkeasier_to_epub.process_article_to_epub(
                html_content=raw_html_content,
                output_path=output_path,
                keep_md=config.keep_md,
                article_title_for_metadata=article_title,
                analysis=analysis,
            )
        )
    except Exception:
        logger.exception(
            "Failed to generate EPUB for '%s' (ID: %s)", article_title, article_id
        )
        return None, None

    logger.info("Generated EPUB for '%s' -> %s", article_title, epub_path)
    newly_processed_article_ids.add(article_id)

    if config.send_to_kindle:
        try:
            success = send_to_kindle.send_epub_to_kindle(
                epub_path, kindle_email=config.kindle_email or None
            )
            if success:
                kindle_sent_count[0] += 1
            else:
                logger.error(
                    "Failed to send EPUB for '%s' to Kindle.", article_title
                )
        except Exception:
            logger.exception(
                "Unexpected error sending EPUB for '%s' to Kindle.", article_title
            )
    else:
        logger.info("Kindle delivery disabled; skipping send for '%s'.", article_title)

    return epub_path, article_markdown_content
