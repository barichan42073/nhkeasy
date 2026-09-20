"""
Module for fetching and staging raw article HTML content, and extracting
the plain-text payload used for Gemini analysis.
"""

import logging

import nhkeasier_to_epub
from config import PipelineConfig
from utils import sanitize_filename

logger = logging.getLogger(__name__)


async def fetch_and_stage_article_html(
    article: dict, config: PipelineConfig
) -> tuple[str, str]:
    """
    Fetches the raw HTML for an article (reusing a staged copy on disk if one
    already exists), then extracts the plain-text content used as the payload
    for Gemini analysis.

    Returns a tuple of (raw_html_content, article_text_for_gemini). On any
    failure, returns ("", "") so callers can skip the article.
    """
    article_link = article["link"]
    article_title = article.get("title", "Untitled Article")
    article_id = article.get("id", article_link)

    html_filename = (
        f"{sanitize_filename(article_title)}_{sanitize_filename(article_id)}.html"
    )
    staged_html_path = config.staging_dir / html_filename

    if staged_html_path.exists():
        logger.info(
            "Using staged HTML for '%s' from '%s'.", article_title, staged_html_path
        )
        raw_html_content = staged_html_path.read_text(encoding="utf-8")
    else:
        logger.info("Fetching HTML for '%s' from '%s'.", article_title, article_link)
        try:
            raw_html_content = await nhkeasier_to_epub.fetch_article_html(
                article_link
            )
        except Exception:
            logger.exception(
                "Failed to fetch HTML for article '%s' (%s).",
                article_title,
                article_link,
            )
            return "", ""

        try:
            staged_html_path.write_text(raw_html_content, encoding="utf-8")
            logger.debug(
                "Staged HTML for '%s' saved to '%s'.", article_title, staged_html_path
            )
        except OSError:
            logger.exception(
                "Failed to stage HTML for '%s' to '%s'.",
                article_title,
                staged_html_path,
            )

    try:
        _title, article_text_for_gemini, _image_url = (
            nhkeasier_to_epub.extract_article_content_from_html(
                raw_html_content, base_url=article_link
            )
        )
    except Exception:
        logger.exception(
            "Failed to extract content from article '%s' (%s).",
            article_title,
            article_link,
        )
        return "", ""

    return raw_html_content, article_text_for_gemini
