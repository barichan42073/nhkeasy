"""
HTML processing module — Functional Core.

Every function in this module is pure: given already-fetched HTML, an
already-computed ArticleAnalysis, and in-memory metadata lists, they
compute and return new data structures. They perform no disk writes, no
network requests, no locale/global-state mutation, and invoke no external
processes. All file I/O (writing HTML/index/manifest files, copying
styles.css) is handled by the imperative shell in pipeline.py.
"""

import logging
from dataclasses import dataclass
from datetime import datetime, timezone

from bs4 import BeautifulSoup

from article_schema import ArticleAnalysis
from utils import find_mp3_url, sanitize_filename
from web_builder import render_interactive_page

logger = logging.getLogger(__name__)


def _fix_article_image_urls(
    raw_html_content: str, article_image_url: str | None
) -> tuple[str, str | None]:
    """Resolves relative image URLs and updates image source in article HTML content.

    Pure in-memory HTML transformation; performs no I/O.
    """
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


@dataclass
class ArticleHtmlPayload:
    """Pure result of building the interactive HTML page for one article."""

    html_filename: str
    html_content: str
    metadata_entry: dict
    vocab_items: list[dict[str, str]]


def build_article_html_payload(
    article: dict,
    raw_html_content: str,
    analysis: ArticleAnalysis,
) -> ArticleHtmlPayload | None:
    """
    Builds the interactive HTML content and associated metadata/vocab
    payloads for a single article. Performs no disk writes and no network
    calls. Returns None if the payload could not be built.
    """
    article_id = article.get("id", article["link"])
    article_title = article.get("title", "Untitled Article")

    try:
        original_mp3_url = find_mp3_url(article, raw_html_content, article["link"])
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

        article_pub_date = article.get("date_parsed", datetime.now(timezone.utc))
        metadata_entry = {
            "id": article_id,
            "title": article_title,
            "date": article_pub_date.isoformat(),
            "relative_path": f"html_output/{html_filename}",
            "image_url": article_image_url,
            "kicker": analysis.kicker,
        }

        vocab_items = [
            {
                "word": vocab.word,
                "reading": vocab.reading,
                "definition": vocab.definition,
                "jlpt_level": vocab.jlpt_level,
                "article_title": article_title,
            }
            for vocab in analysis.side_vocab
        ]

        return ArticleHtmlPayload(
            html_filename=html_filename,
            html_content=html_output,
            metadata_entry=metadata_entry,
            vocab_items=vocab_items,
        )
    except Exception:
        logger.exception(
            "An unexpected error occurred while building the HTML payload for '%s'",
            article_title,
        )
        return None


def compute_index_render_data(
    existing_manifest: list[dict],
    articles_from_current_run: list[dict],
    newly_processed_article_ids: set[str],
    current_date: datetime,
    current_date_japanese_full: str,
    current_date_japanese_title: str,
) -> dict:
    """
    Merges existing manifest entries with newly-generated article metadata,
    sorts and groups them for the index template, and returns a fully
    prepared payload containing both the Jinja template context and the
    manifest data to persist.

    Performs no I/O and depends only on its inputs. Locale-formatted date
    strings must be computed by the caller, since locale configuration is
    a process-global side effect that does not belong in the functional
    core.
    """
    current_date_iso = current_date.strftime("%Y-%m-%d")

    all_articles_metadata: dict[str, dict] = {}
    for item in existing_manifest:
        if "id" in item and "date" in item:
            item = dict(item)
            item["date_obj"] = datetime.fromisoformat(item["date"])
            rel_path = item.get("relative_path", "")
            if (
                rel_path
                and not rel_path.startswith("html_output/")
                and not rel_path.startswith("http://")
                and not rel_path.startswith("https://")
            ):
                item["relative_path"] = f"html_output/{rel_path}"
            all_articles_metadata[item["id"]] = item

    for article_meta in articles_from_current_run:
        article_meta = dict(article_meta)
        article_meta["date_obj"] = datetime.fromisoformat(article_meta["date"])
        article_meta["new"] = article_meta["id"] in newly_processed_article_ids
        rel_path = article_meta.get("relative_path", "")
        if (
            rel_path
            and not rel_path.startswith("html_output/")
            and not rel_path.startswith("http://")
            and not rel_path.startswith("https://")
        ):
            article_meta["relative_path"] = f"html_output/{rel_path}"
        all_articles_metadata[article_meta["id"]] = article_meta

    sorted_all_articles = sorted(
        all_articles_metadata.values(), key=lambda x: x["date_obj"], reverse=True
    )

    lead_article = None
    today_grid_articles = []
    older_articles_grouped: dict = {}

    if sorted_all_articles:
        lead_article = sorted_all_articles[0]
        current_display_date = lead_article["date_obj"].date()
    else:
        current_display_date = current_date.date()

    for article_meta in sorted_all_articles:
        temp_article_data = article_meta.copy()
        temp_article_data["date"] = article_meta["date_obj"]

        if lead_article is not None and temp_article_data["id"] == lead_article["id"]:
            lead_article = temp_article_data
            continue

        if temp_article_data["date_obj"].date() == current_display_date:
            today_grid_articles.append(temp_article_data)
        else:
            article_date_key = temp_article_data["date_obj"].date()
            if article_date_key not in older_articles_grouped:
                older_articles_grouped[article_date_key] = {
                    "date_japanese": temp_article_data["date_obj"].strftime(
                        "%Y年%m月%d日"
                    ),
                    "articles": [],
                }
            older_articles_grouped[article_date_key]["articles"].append(
                temp_article_data
            )

    today_grid_articles = sorted(
        today_grid_articles, key=lambda x: x["date"], reverse=True
    )

    older_articles_grouped_list = []
    for date_key in sorted(older_articles_grouped.keys(), reverse=True):
        group = older_articles_grouped[date_key]
        group["articles"] = sorted(
            group["articles"], key=lambda x: x["date"], reverse=True
        )
        older_articles_grouped_list.append(group)

    template_data = {
        "lead_article": lead_article,
        "today_grid_articles": today_grid_articles,
        "older_articles_grouped": older_articles_grouped_list,
        "current_date_japanese": current_date_japanese_full,
        "current_date_japanese_title": current_date_japanese_title,
        "current_date_iso": current_date_iso,
        "current_date_obj": current_date,
    }

    manifest_for_save = [
        {k: v for k, v in item.items() if k not in {"new", "date_obj"}}
        for item in sorted_all_articles
    ]

    return {"template_data": template_data, "manifest_for_save": manifest_for_save}
