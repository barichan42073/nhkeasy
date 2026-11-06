"""
HTML processing module — Functional Core.

Every function in this module is pure: given already-fetched HTML, an
already-computed ArticleAnalysis, and in-memory metadata lists, they
compute and return new data structures. They perform no disk writes, no
network requests, no locale/global-state mutation, and invoke no external
processes. All file I/O (writing HTML/index/manifest files, copying
styles.css) is handled by the imperative shell in html_runner.py.
"""

import logging
import math
import re
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime

from bs4 import BeautifulSoup

from article_schema import ArticleAnalysis
from utils import find_mp3_url, sanitize_filename
from web_builder import render_interactive_page

logger = logging.getLogger(__name__)

# NHK publishes on Japan time, so the index shows and groups dates in JST
# (fixed +09:00: Japan has no daylight saving time).
JST = timezone(timedelta(hours=9), "JST")

# The index lists articles from this many days before the newest article;
# older ones go to archive.html. Counted from the newest article, not from
# today, so the index never empties out if the pipeline hasn't run for a while.
INDEX_RECENT_DAYS = 10

# Rough reading speed for a learner, in Japanese characters per minute.
READING_CHARS_PER_MINUTE = 200

_STORY_NUMBER_RE = re.compile(r"/story/(\d+)")
_FURIGANA_RE = re.compile(r"\[.*?\]")
_KANJI_RE = re.compile(r"[一-鿿㐀-䶿]")


def story_number(article: dict) -> int | None:
    """The nhkeasier story number (e.g. 10085) from the article's id or link.
    Story numbers increase with publication, so they give a stable order
    even when stored dates are off. Pure function."""
    for key in ("id", "link"):
        match = _STORY_NUMBER_RE.search(str(article.get(key) or ""))
        if match:
            return int(match.group(1))
    return None


def clean_kicker(kicker: str | None) -> str:
    """Trims a model-written kicker for display: no surrounding whitespace
    and no trailing full stop. Pure function."""
    return (kicker or "").strip().rstrip(".。").strip()


def compute_reading_stats(analysis: ArticleAnalysis) -> dict:
    """Length and difficulty figures shown on the index cards. Pure function."""
    text = "".join(
        _FURIGANA_RE.sub("", sentence.japanese) for sentence in analysis.sentences
    )
    text = re.sub(r"\s", "", text)
    char_count = len(text)
    levels: dict[str, int] = {}
    for vocab in analysis.side_vocab:
        if vocab.jlpt_level in ("n1", "n2"):
            levels[vocab.jlpt_level] = levels.get(vocab.jlpt_level, 0) + 1
    return {
        "char_count": char_count,
        "kanji_count": len(_KANJI_RE.findall(text)),
        "reading_minutes": max(1, math.ceil(char_count / READING_CHARS_PER_MINUTE))
        if char_count
        else None,
        "n1_count": levels.get("n1", 0),
        "n2_count": levels.get("n2", 0),
    }


def article_publication_date(article: dict, fallback: datetime) -> datetime:
    """Publication date from the feed's `published` string (RFC 822, e.g.
    'Mon, 2 Nov 2026 20:30:00 +0900', or ISO 8601), as an aware datetime.
    Returns `fallback` if it is missing or unparseable. Pure function."""
    published = (article.get("published") or "").strip()
    if not published:
        return fallback
    try:
        parsed = parsedate_to_datetime(published)
    except (TypeError, ValueError):
        try:
            parsed = datetime.fromisoformat(published)
        except ValueError:
            logger.warning("Could not parse published date %r; using %s.", published, fallback)
            return fallback
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed


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


def build_article_html_payload(
    article: dict,
    raw_html_content: str,
    analysis: ArticleAnalysis,
    now: datetime | None = None,
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

        # Short, stable filename from the story number (story_10085.html);
        # falls back to the old title-based name if the link has no number.
        number = story_number(article)
        if number is not None:
            html_filename = f"story_{number}.html"
        else:
            html_filename = sanitize_filename(f"{article_title}_{article_id}.html")

        article_pub_date = article_publication_date(
            article, now or datetime.now(timezone.utc)
        )
        metadata_entry = {
            "id": article_id,
            "title": article_title,
            "date": article_pub_date.isoformat(),
            "relative_path": f"html_output/{html_filename}",
            "image_url": article_image_url,
            "kicker": analysis.kicker,
            **compute_reading_stats(analysis),
        }

        return ArticleHtmlPayload(
            html_filename=html_filename,
            html_content=html_output,
            metadata_entry=metadata_entry,
        )
    except Exception:
        logger.exception(
            "An unexpected error occurred while building the HTML payload for '%s'",
            article_title,
        )
        return None


_WEEKDAY_JA = ["月", "火", "水", "木", "金", "土", "日"]


def _index_sort_key(item: dict) -> tuple:
    """Sort key for index entries: (JST day, story number, timestamp)."""
    number = story_number(item)
    return (
        item["date_obj"].astimezone(JST).date(),
        number if number is not None else -1,
        item["date_obj"],
    )


def japanese_day_label(day) -> str:
    """'2026年11月2日（月）' for a date. Pure function (no locale)."""
    return f"{day.year}年{day.month}月{day.day}日（{_WEEKDAY_JA[day.weekday()]}）"


def _group_by_day(articles: list[dict]) -> list[dict]:
    """Groups already-sorted display entries by their JST day, newest day
    first, keeping the incoming order within each day."""
    groups: dict = {}
    for article in articles:
        day = article["date"].date()
        if day not in groups:
            groups[day] = {
                "day": day,
                "date_iso": day.isoformat(),
                "date_japanese": japanese_day_label(day),
                "articles": [],
            }
        groups[day]["articles"].append(article)
    return [groups[day] for day in sorted(groups, reverse=True)]


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

    for item in all_articles_metadata.values():
        if item["date_obj"].tzinfo is None:
            item["date_obj"] = item["date_obj"].replace(tzinfo=timezone.utc)

    # Newest day first (in Japan time); within a day, highest story number
    # first, which follows NHK's publication order even for entries whose
    # stored time is when the pipeline ran rather than when NHK published.
    sorted_all_articles = sorted(
        all_articles_metadata.values(), key=_index_sort_key, reverse=True
    )

    lead_article = None
    today_grid_articles = []

    formatted_articles = []
    for article_meta in sorted_all_articles:
        temp_article_data = article_meta.copy()
        temp_article_data["date"] = article_meta["date_obj"].astimezone(JST)
        temp_article_data["kicker"] = clean_kicker(article_meta.get("kicker"))
        formatted_articles.append(temp_article_data)

    if formatted_articles:
        lead_article = formatted_articles[0]
        today_grid_articles = formatted_articles[1:4]
        remaining_articles = formatted_articles[4:]
        # Calendar days counted back from the newest article, inclusive.
        oldest_recent_day = lead_article["date"].date() - timedelta(
            days=INDEX_RECENT_DAYS - 1
        )
    else:
        remaining_articles = []
        oldest_recent_day = None

    grouped = _group_by_day(remaining_articles)
    older_articles_grouped_list = [
        g for g in grouped if g["day"] >= oldest_recent_day
    ]
    archive_groups = [g for g in grouped if g["day"] < oldest_recent_day]

    template_data = {
        "lead_article": lead_article,
        "today_grid_articles": today_grid_articles,
        "older_articles_grouped": older_articles_grouped_list,
        "archive_groups": archive_groups,
        "index_recent_days": INDEX_RECENT_DAYS,
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
