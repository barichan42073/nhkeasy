import json
import locale
import logging
import platform
import shutil
from datetime import datetime, timezone
from pathlib import Path

import html_pipeline
from article_schema import ArticleAnalysis
from config import PipelineConfig
from jinja_render import render_html_from_json_data

logger = logging.getLogger(__name__)


async def write_article_html_output(
    article: dict,
    raw_html_content: str,
    analysis: ArticleAnalysis,
    config: PipelineConfig,
    all_filtered_vocabulary: list[dict[str, str]],
    all_article_metadata_for_index: list[dict],
) -> None:
    """
    Imperative-shell wrapper: asks the functional core to build the HTML
    payload, then writes it to disk and updates the shared in-memory lists.
    Any failure is logged and swallowed so a single article never aborts
    the overall pipeline run.
    """
    article_title = article.get("title", "Untitled Article")

    try:
        payload = html_pipeline.build_article_html_payload(
            article, raw_html_content, analysis
        )
    except Exception:
        logger.exception(
            "Failed to build HTML payload for article '%s'", article_title
        )
        return

    if payload is None:
        return

    html_output_path = config.smartreader_dir / payload.html_filename
    try:
        config.smartreader_dir.mkdir(parents=True, exist_ok=True)
        html_output_path.write_text(payload.html_content, encoding="utf-8")
        logger.info("Generated interactive HTML article: %s", html_output_path)
    except OSError:
        logger.exception(
            "Failed to write interactive HTML article to %s", html_output_path
        )
        return

    all_article_metadata_for_index.append(payload.metadata_entry)
    all_filtered_vocabulary.extend(payload.vocab_items)


async def write_smartreader_index(
    config: PipelineConfig,
    newly_processed_article_ids: set[str],
    articles_from_current_run: list[dict],
) -> None:
    """
    Imperative-shell function: handles locale configuration, reading the
    existing manifest, delegating the pure merge/sort/group logic to
    html_pipeline.compute_index_render_data, and writing out index.html,
    the manifest, and styles.css.

    Every disk-touching step is isolated in its own try/except so that a
    failure in one step (e.g. copying styles.css) doesn't prevent the
    others from completing, and no exception escapes this function.
    """
    smartreader_output_dir = config.smartreader_dir
    index_template_path = (
        Path(__file__).parent / "templates" / "smartreader_index.html"
    )
    styles_source_path = Path(__file__).parent / "styles.css"
    index_output_path = smartreader_output_dir / "index.html"
    manifest_path = smartreader_output_dir / "articles_manifest.json"

    try:
        smartreader_output_dir.mkdir(parents=True, exist_ok=True)
    except OSError:
        logger.exception(
            "Failed to create SmartReader output directory at %s",
            smartreader_output_dir,
        )
        return

    original_locale = None
    try:
        if platform.system() == "Windows":
            original_locale = locale.setlocale(locale.LC_TIME, "Japanese_Japan.932")
        else:  # For Linux/macOS
            original_locale = locale.setlocale(locale.LC_TIME, "ja_JP.UTF-8")
    except locale.Error:
        logger.warning(
            "Could not set locale for Japanese date formatting. Falling back to default."
        )
        original_locale = None

    current_date = datetime.now(timezone.utc)

    if original_locale:
        current_date_japanese_full = current_date.strftime("%Y年%m月%d日（%a）")
        current_date_japanese_title = current_date.strftime("%Y年%m月%d日")
        locale.setlocale(locale.LC_TIME, original_locale)
    else:
        current_date_japanese_full = current_date.strftime("%Y年%m月%d日")
        current_date_japanese_title = current_date_japanese_full

    existing_manifest: list[dict] = []
    if manifest_path.is_file():
        try:
            existing_manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            logger.warning(
                "Could not read existing manifest at %s; starting fresh.",
                manifest_path,
            )
            existing_manifest = []

    try:
        render_data = html_pipeline.compute_index_render_data(
            existing_manifest=existing_manifest,
            articles_from_current_run=articles_from_current_run,
            newly_processed_article_ids=newly_processed_article_ids,
            current_date=current_date,
            current_date_japanese_full=current_date_japanese_full,
            current_date_japanese_title=current_date_japanese_title,
        )
    except Exception:
        logger.exception("Failed to compute index render data for Smart Reader.")
        return

    try:
        rendered_html = render_html_from_json_data(
            data=render_data["template_data"],
            template_dir=index_template_path.parent,
            template_filename=index_template_path.name,
        )
    except Exception:
        logger.exception("Failed to render index.html template for Smart Reader.")
        return

    try:
        index_output_path.write_text(rendered_html, encoding="utf-8")
        logger.info("Generated SmartReader index HTML: %s", index_output_path)
    except OSError:
        logger.exception("Failed to write index.html to %s", index_output_path)
        return

    try:
        manifest_path.write_text(
            json.dumps(
                render_data["manifest_for_save"], ensure_ascii=False, indent=2
            ),
            encoding="utf-8",
        )
        logger.info("Generated manifest file: %s", manifest_path)
    except OSError:
        logger.exception("Failed to write manifest file to %s", manifest_path)

    if not styles_source_path.is_file():
        logger.warning(
            "Source styles.css not found at %s. Skipping copy.", styles_source_path
        )
        return

    styles_destination_path = smartreader_output_dir / "styles.css"
    try:
        shutil.copy(styles_source_path, styles_destination_path)
        logger.info("Copied styles.css to %s", styles_destination_path)
    except OSError:
        logger.exception(
            "Failed to copy styles.css to %s", styles_destination_path
        )
