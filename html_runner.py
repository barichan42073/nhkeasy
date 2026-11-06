"""
HTML processing module — Imperative Shell.

This module orchestrates the HTML pipeline's I/O concerns: reading and
writing files on disk, copying static assets, and rendering Jinja2
templates. All actual data-transformation logic lives in the pure
functional core in html_pipeline.py. Nothing in html_pipeline.py touches
disk; everything in this module that touches disk delegates its actual
data computation to html_pipeline.py.
"""

import json
import logging
import shutil
from datetime import datetime, timezone
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape

from article_schema import ArticleAnalysis
from config import PipelineConfig
from html_pipeline import build_article_html_payload, compute_index_render_data

logger = logging.getLogger(__name__)

_TEMPLATE_DIR = Path(__file__).resolve().parent
_INDEX_TEMPLATE_NAME = "index_template.html"
_MANIFEST_FILENAME = "manifest.json"
_ARCHIVE_FILENAME = "archive.html"
_STYLES_FILENAME = "styles.css"
# The one stylesheet, anchored to the project folder (not the working directory).
_STYLES_SOURCE = _TEMPLATE_DIR / _STYLES_FILENAME
# Shared page script (site menu, furigana modes), copied alongside styles.css.
_SITE_JS_FILENAME = "site.js"
_SITE_JS_SOURCE = _TEMPLATE_DIR / _SITE_JS_FILENAME

_WEEKDAY_JA = ["月", "火", "水", "木", "金", "土", "日"]

_jinja_env = Environment(
    loader=FileSystemLoader(str(_TEMPLATE_DIR)),
    autoescape=select_autoescape(["html", "xml"]),
)


def _format_japanese_dates(current_date: datetime) -> tuple[str, str]:
    """Computes Japanese-formatted date strings for the index page.

    Locale formatting is a process-global side effect, so it is
    deliberately kept out of the pure functional core (html_pipeline.py)
    and computed here in the imperative shell instead. Weekday names are
    computed manually rather than relying on the host's installed system
    locales, so this works reliably regardless of environment.
    """
    weekday_ja = _WEEKDAY_JA[current_date.weekday()]
    current_date_japanese_full = (
        f"{current_date.year}年{current_date.month}月{current_date.day}日"
        f"（{weekday_ja}）"
    )
    current_date_japanese_title = (
        f"{current_date.month}月{current_date.day}日（{weekday_ja}）"
    )
    return current_date_japanese_full, current_date_japanese_title


def _copy_styles_css(config: PipelineConfig) -> None:
    """Copies the project's static assets (styles.css, site.js) into the HTML
    output and top-level directories."""
    destinations_dirs = [config.html_output_dir]
    top_dir = getattr(config, "nhkeasy_dir", None)
    if top_dir and top_dir != config.html_output_dir:
        destinations_dirs.append(top_dir)

    # Sources are read from the module globals at call time so tests can
    # point them at temporary files.
    assets = (
        (_STYLES_FILENAME, _STYLES_SOURCE),
        (_SITE_JS_FILENAME, _SITE_JS_SOURCE),
    )
    for filename, source in assets:
        if not source.is_file():
            logger.warning("%s not found at %s; skipping copy.", filename, source)
            continue
        for destination_dir in destinations_dirs:
            destination = destination_dir / filename
            try:
                shutil.copyfile(source, destination)
            except OSError:
                logger.exception("Failed to copy %s to %s", filename, destination)


def _load_manifest(config: PipelineConfig) -> list[dict]:
    """Loads the existing article manifest JSON, if present."""
    manifest_path = config.html_output_dir / _MANIFEST_FILENAME
    if not manifest_path.is_file():
        return []

    try:
        with open(manifest_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        logger.exception(
            "Failed to read manifest at %s; starting with an empty manifest.",
            manifest_path,
        )
        return []


def _save_manifest(config: PipelineConfig, manifest_data: list[dict]) -> None:
    """Persists the article manifest JSON to disk."""
    manifest_path = config.html_output_dir / _MANIFEST_FILENAME
    try:
        with open(manifest_path, "w", encoding="utf-8") as f:
            json.dump(manifest_data, f, ensure_ascii=False, indent=2)
    except OSError:
        logger.exception("Failed to save manifest to %s", manifest_path)


async def write_article_html_output(
    article: dict,
    raw_html_content: str,
    analysis: ArticleAnalysis,
    config: PipelineConfig,
    all_article_metadata_for_index: list[dict],
) -> None:
    """
    Builds the interactive HTML page for a single article and writes it to
    disk, then adds the article's metadata to the shared in-memory list used
    later for the index page. (Anki vocabulary is collected separately, from
    the analysis, by anki_runner.)
    """
    article_title = article.get("title", "Untitled Article")

    payload = build_article_html_payload(article, raw_html_content, analysis)
    if payload is None:
        logger.error(
            "Skipping HTML output for '%s' because the payload could not be built.",
            article_title,
        )
        return

    output_path = config.html_output_dir / payload.html_filename
    try:
        output_path.write_text(payload.html_content, encoding="utf-8")
        logger.info(
            "Wrote interactive HTML page for '%s' -> %s", article_title, output_path
        )
    except OSError:
        logger.exception("Failed to write HTML output to %s", output_path)
        return

    all_article_metadata_for_index.append(payload.metadata_entry)


async def write_smartreader_index(
    config: PipelineConfig,
    newly_processed_article_ids: set[str],
    articles_from_current_run: list[dict],
) -> None:
    """
    Merges newly-generated article metadata with the existing manifest,
    renders the index page, and persists both the rendered HTML and the
    updated manifest to disk. Also ensures styles.css is present alongside
    the generated output.
    """
    _copy_styles_css(config)

    existing_manifest = _load_manifest(config)

    current_date = datetime.now(timezone.utc)
    current_date_japanese_full, current_date_japanese_title = (
        _format_japanese_dates(current_date)
    )

    render_data = compute_index_render_data(
        existing_manifest=existing_manifest,
        articles_from_current_run=articles_from_current_run,
        newly_processed_article_ids=newly_processed_article_ids,
        current_date=current_date,
        current_date_japanese_full=current_date_japanese_full,
        current_date_japanese_title=current_date_japanese_title,
    )

    try:
        template = _jinja_env.get_template(_INDEX_TEMPLATE_NAME)
    except Exception:
        logger.exception(
            "Failed to load index template '%s'; skipping index generation.",
            _INDEX_TEMPLATE_NAME,
        )
        return

    rendered_html = template.render(**render_data["template_data"])

    index_path = getattr(config, "index_html_path", None)
    if index_path is None:
        index_dir = getattr(config, "nhkeasy_dir", None) or getattr(
            config, "html_output_dir"
        )
        index_path = index_dir / "index.html"
    try:
        index_path.write_text(rendered_html, encoding="utf-8")
        logger.info("Wrote index page -> %s", index_path)
    except OSError:
        logger.exception("Failed to write index page to %s", index_path)

    _write_archive_page(template, render_data["template_data"], index_path.parent)

    _save_manifest(config, render_data["manifest_for_save"])


def _write_archive_page(template, template_data: dict, output_dir: Path) -> None:
    """Renders articles older than the index's window to archive.html, using
    the index template. Does nothing while there is nothing to archive."""
    archive_groups = template_data.get("archive_groups") or []
    if not archive_groups:
        return
    archive_html = template.render(
        **{
            **template_data,
            "is_archive": True,
            "lead_article": None,
            "today_grid_articles": [],
            "older_articles_grouped": archive_groups,
        }
    )
    archive_path = output_dir / _ARCHIVE_FILENAME
    try:
        archive_path.write_text(archive_html, encoding="utf-8")
        logger.info("Wrote archive page -> %s", archive_path)
    except OSError:
        logger.exception("Failed to write archive page to %s", archive_path)
