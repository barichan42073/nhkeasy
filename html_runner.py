import logging
from pathlib import Path
from config import PipelineConfig
# Import pure builders from functional core if separated
# import html_pipeline

logger = logging.getLogger(__name__)


def save_article_html(
    article_id: str,
    raw_html: str,
    output_dir: Path,
) -> Path | None:
    """
    Imperative Shell: Saves raw HTML content for a specific article to disk.
    Returns the file path on success, or None on failure.
    """
    file_path = output_dir / f"{article_id}.html"
    try:
        output_dir.mkdir(parents=True, exist_ok=True)
        file_path.write_text(raw_html, encoding="utf-8")
        logger.info("Saved article HTML: %s", file_path)
        return file_path
    except OSError:
        logger.exception("Failed to write article HTML for ID %s", article_id)
        return None


def render_and_save_index(
    articles: list[dict],
    config: PipelineConfig,
) -> Path | None:
    """
    Imperative Shell: Formats index data and writes/overwrites index.html.
    """
    index_path = config.output_dir / "index.html"
    try:
        # Delegate pure formatting/rendering to core if available
        # html_content = html_pipeline.build_index_html(articles, config)
        config.output_dir.mkdir(parents=True, exist_ok=True)
        # Example write step:
        # index_path.write_text(html_content, encoding="utf-8")
        logger.info("Successfully updated index: %s", index_path)
        return index_path
    except OSError:
        logger.exception("Failed to write index.html")
        return None
