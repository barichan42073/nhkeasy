import json
import locale
import logging
import platform
import shutil
from datetime import datetime, timezone
from pathlib import Path

from bs4 import BeautifulSoup
from google.api_core.exceptions import GoogleAPIError

from article_schema import ArticleAnalysis
from config import PipelineConfig
from jinja_render import render_html_from_json_data
from utils import find_mp3_url, sanitize_filename
from web_builder import render_interactive_page

logger = logging.getLogger(__name__)


def _fix_article_image_urls(
    raw_html_content: str, article_image_url: str | None
) -> tuple[str, str | None]:
    """Resolves relative image URLs and updates image source in article HTML content."""
    if not article_image_url:
        return raw_html_content, None

    if article_image_url.startswith("/"):
        article_image_url = f"https://nhkeasier.com{article_image_url}"

    soup_for_modification = BeautifulSoup(raw_html_content, "html.parser")
    article_container = soup_for_modification.find("article", lang="ja")
    img_tag_in_html = None
    if article_container:
        img_tag_in_html = article_container.find("img")

    if (
        img_tag_in_html
        and img_tag_in_html.get("src")
        and (
            img_tag_in_html["src"].startswith("/")
            or "/static/always.svg" in img_tag_in_html["src"]
        )
    ):
        img_tag_in_html["src"] = article_image_url
        raw_html_content = str(soup_for_modification)

    return raw_html_content, article_image_url


async def process_article_html_output(
    article: dict,
    config: PipelineConfig,
    raw_html_content: str,
    analysis: ArticleAnalysis,
    all_filtered_vocabulary: list[dict[str, str]],
    all_article_metadata_for_index: list[dict],
    smartreader_output_dir: Path,
) -> None:
    """
    Handles the generation of interactive HTML pages and related metadata.
    """
    article_id = article.get("id", article["link"])
    article_title = article.get("title", "Untitled Article")

    try:
        original_mp3_url = find_mp3_url(
            article, raw_html_content, article["link"]
        )
        modified_html_content, article_image_url = _fix_article_image_urls(
            raw_html_content, article.get("image_url")
        )

        html_output = render_interactive_page(
            raw_html=modified_html_content,
            analysis=analysis,
            slow_audio_path=original_mp3_url,
            article_original_url=article["link"],
            image_url=article_image_url,
        )

        html_filename = sanitize_filename(f"{article_title}_{article_id}.html")
        html_output_path = smartreader_output_dir / html_filename
        html_output_path.write_text(html_output, encoding="utf-8")
        logger.info(f"Generated interactive HTML article: {html_output_path}")

        article_pub_date = article.get(
            "date_parsed", datetime.now(timezone.utc)
        )
        all_article_metadata_for_index.append(
            {
                "id": article_id,
                "title": article_title,
                "date": article_pub_date.isoformat(),
                "relative_path": html_output_path.name,
                "image_url": article_image_url,
                "kicker": analysis.kicker,
            }
        )

        for vocab in analysis.side_vocab:
            all_filtered_vocabulary.append(
                {
                    "word": vocab.word,
                    "reading": vocab.reading,
                    "definition": vocab.definition,
                    "jlpt_level": vocab.jlpt_level,
                    "article_title": article_title,
                }
            )

    except GoogleAPIError as e:
        logger.error("Gemini API call failed for '%s': %s", article_title, e)
    except Exception:
        logger.exception(
            "An unexpected error occurred during HTML generation for '%s'",
            article_title,
        )


async def _generate_index_html(
    smartreader_output_dir: Path,
    newly_processed_article_ids: set[str],
    articles_from_current_run: list[dict],
) -> None:
    index_template_path = Path(__file__).parent / "templates" / "smartreader_index.html"
    styles_source_path = (
        Path(__file__).parent / "styles.css"
    )  # Corrected path for styles.css
    index_output_path = smartreader_output_dir / "index.html"
    manifest_path = smartreader_output_dir / "articles_manifest.json"

    smartreader_output_dir.mkdir(parents=True, exist_ok=True)

    # Set locale for Japanese date formatting
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
        original_locale = None  # Ensure it's None if setting failed

    current_date = datetime.now(timezone.utc)
    current_date_iso = current_date.strftime("%Y-%m-%d")

    # Format current date in Japanese if locale was set successfully
    current_date_japanese_full: str
    current_date_japanese_title: str

    if original_locale:
        current_date_japanese_full = current_date.strftime("%Y年%m月%d日（%a）")
        # For the title, we want just the date without the day of the week in parentheses
        current_date_japanese_title = current_date.strftime("%Y年%m月%d日")
        locale.setlocale(locale.LC_TIME, original_locale)  # Restore original locale
    else:
        current_date_japanese_full = current_date.strftime("%Y年%m月%d日")  # Fallback
        current_date_japanese_title = (
            current_date_japanese_full  # Title is same as full fallback
        )

    all_articles_metadata = {}
    if manifest_path.is_file():
        try:
            existing_manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
            for item in existing_manifest:
                if "id" in item and "date" in item:
                    item["date_obj"] = datetime.fromisoformat(item["date"])
                    all_articles_metadata[item["id"]] = item
        except (json.JSONDecodeError, OSError):
            pass

    for article_meta in articles_from_current_run:
        article_meta["date_obj"] = datetime.fromisoformat(article_meta["date"])
        article_meta["new"] = article_meta["id"] in newly_processed_article_ids
        all_articles_metadata[article_meta["id"]] = article_meta

    sorted_all_articles = sorted(
        all_articles_metadata.values(), key=lambda x: x["date_obj"], reverse=True
    )

    lead_article = None
    today_grid_articles = []
    older_articles_grouped = {}

    if sorted_all_articles:
        lead_article = sorted_all_articles[0]
        # Use the lead article's date as the "current day" for display purposes
        current_display_date = lead_article["date_obj"].date()
    else:
        current_display_date = current_date.date() # Fallback to actual current date if no articles

    for article_meta in sorted_all_articles:
        # Replace the 'date' string with the 'date_obj' datetime object for the template
        temp_article_data = article_meta.copy()
        temp_article_data["date"] = article_meta["date_obj"]

        if temp_article_data["id"] == lead_article["id"]:
            lead_article = temp_article_data # Ensure lead_article has the datetime object
            continue

        if temp_article_data["date_obj"].date() == current_display_date:
            today_grid_articles.append(temp_article_data)
        else:
            article_date_key = temp_article_data["date_obj"].date()
            if article_date_key not in older_articles_grouped:
                older_articles_grouped[article_date_key] = {
                    "date_japanese": temp_article_data["date_obj"].strftime('%Y年%m月%d日'),
                    "articles": []
                }
            older_articles_grouped[article_date_key]["articles"].append(temp_article_data)

    # Sort today's grid articles by date descending
    today_grid_articles = sorted(today_grid_articles, key=lambda x: x["date"], reverse=True)

    # Convert grouped dict to sorted list of lists for template iteration
    # Sort older dates in descending order, and articles within each group by time descending
    older_articles_grouped_list = []
    for date_key in sorted(older_articles_grouped.keys(), reverse=True):
        group = older_articles_grouped[date_key]
        group["articles"] = sorted(group["articles"], key=lambda x: x["date"], reverse=True)
        older_articles_grouped_list.append(group)


    template_data = {
        "lead_article": lead_article,
        "today_grid_articles": today_grid_articles,
        "older_articles_grouped": older_articles_grouped_list,
        "current_date_japanese": current_date_japanese_full,
        "current_date_japanese_title": current_date_japanese_title,
        "current_date_iso": current_date_iso,
        "current_date_obj": current_date, # Pass current_date_obj for potential template comparisons
    }

    try:
        rendered_html = render_html_from_json_data(
            data=template_data,
            template_dir=index_template_path.parent,
            template_filename=index_template_path.name,
        )
        index_output_path.write_text(rendered_html, encoding="utf-8")
        logger.info(f"Generated SmartReader index HTML: {index_output_path}")
        manifest_for_save = [
            {k: v for k, v in item.items() if k not in {"new", "date_obj"}}
            for item in sorted_all_articles
        ]
        manifest_path.write_text(
            json.dumps(manifest_for_save, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        logger.info(f"Generated manifest file: {manifest_path}")

        # Copy styles.css to the output directory
        styles_destination_path = smartreader_output_dir / "styles.css"
        logger.debug(
            "Attempting to copy styles.css from %s to %s",
            styles_source_path,
            styles_destination_path,
        )
        if not styles_source_path.is_file():
            logger.warning(
                "Source styles.css not found at %s. Skipping copy.", styles_source_path
            )
        else:
            try:
                shutil.copy(styles_source_path, styles_destination_path)
                logger.info("Copied styles.css to %s", styles_destination_path)
            except Exception:
                logger.exception("Failed to copy styles.css to %s", styles_destination_path)
    except Exception:
        logger.exception("Failed to generate or save index.html for Smart Reader.")
