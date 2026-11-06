"""Tests for html_pipeline's publication-date handling (index page dates)."""
from datetime import datetime, timezone

from html_pipeline import article_publication_date, compute_index_render_data

NOW = datetime(2026, 11, 2, 13, 0, tzinfo=timezone.utc)


def test_rfc822_published_date():
    d = article_publication_date({"published": "Mon, 2 Nov 2026 20:30:00 +0900"}, NOW)
    assert d == datetime(2026, 11, 2, 11, 30, tzinfo=timezone.utc)


def test_iso_published_date():
    d = article_publication_date({"published": "2026-10-30T11:05:00+00:00"}, NOW)
    assert d == datetime(2026, 10, 30, 11, 5, tzinfo=timezone.utc)


def test_missing_or_bad_date_falls_back():
    assert article_publication_date({}, NOW) == NOW
    assert article_publication_date({"published": "not a date"}, NOW) == NOW


def test_reprocessed_old_article_is_not_lead():
    old = {"id": "old", "title": "old", "relative_path": "html_output/o.html",
           "date": article_publication_date({"published": "Fri, 30 Oct 2026 20:05:00 +0900"}, NOW).isoformat()}
    new = {"id": "new", "title": "new", "relative_path": "html_output/n.html",
           "date": "2026-11-02T11:30:00+00:00"}
    data = compute_index_render_data([new], [old], {"old"}, NOW, "x", "y")
    assert data["template_data"]["lead_article"]["id"] == "new"


# --- Index layout: story order, JST days, archive, kickers, stats ----------

from article_schema import ArticleAnalysis, SentenceTranslation, VocabItem
from html_pipeline import (
    INDEX_RECENT_DAYS,
    build_article_html_payload,
    clean_kicker,
    compute_reading_stats,
    story_number,
)


def _entry(num, date, **extra):
    return {"id": f"https://nhkeasier.com/story/{num}/", "title": f"t{num}",
            "relative_path": f"html_output/story_{num}.html", "date": date, **extra}


def _render(entries, now=NOW):
    return compute_index_render_data(entries, [], set(), now, "x", "y")["template_data"]


def test_story_number_from_id_or_link():
    assert story_number({"id": "https://nhkeasier.com/story/10085/"}) == 10085
    assert story_number({"id": "x", "link": "https://nhkeasier.com/story/7/"}) == 7
    assert story_number({"id": "art-1"}) is None


def test_same_day_sorted_by_story_number_not_time():
    # Batch-processed entries: stored times don't follow publication order.
    entries = [_entry(n, f"2026-10-29T01:{m:02d}:00+00:00")
               for n, m in [(10064, 49), (10069, 57), (10061, 47), (10068, 47)]]
    data = _render(entries)
    order = [data["lead_article"]["id"]] + [a["id"] for a in data["today_grid_articles"]]
    assert [story_number({"id": i}) for i in order] == [10069, 10068, 10064, 10061]


def test_days_are_grouped_in_japan_time():
    # 23:30 UTC on 1 Nov is 08:30 on 2 Nov in Japan.
    entries = [_entry(1, "2026-11-03T00:00:00+00:00"), _entry(2, "2026-11-03T00:00:00+00:00"),
               _entry(3, "2026-11-03T00:00:00+00:00"), _entry(4, "2026-11-03T00:00:00+00:00"),
               _entry(5, "2026-11-01T23:30:00+00:00")]
    groups = _render(entries)["older_articles_grouped"]
    assert groups[0]["date_iso"] == "2026-11-02"
    assert groups[0]["date_japanese"] == "2026年11月2日（月）"
    assert groups[0]["articles"][0]["date"].hour == 8


def test_old_days_go_to_archive():
    entries = [_entry(100 + i, "2026-11-02T03:00:00+00:00") for i in range(5)]
    entries.append(_entry(50, "2026-10-01T03:00:00+00:00"))
    data = _render(entries)
    assert [g["date_iso"] for g in data["older_articles_grouped"]] == ["2026-11-02"]
    assert [g["date_iso"] for g in data["archive_groups"]] == ["2026-10-01"]
    assert INDEX_RECENT_DAYS >= 7


def test_kicker_cleaned_for_display_but_not_in_manifest():
    entries = [_entry(1, "2026-11-02T03:00:00+00:00", kicker="  Rising data theft. ")]
    result = compute_index_render_data(entries, [], set(), NOW, "x", "y")
    assert result["template_data"]["lead_article"]["kicker"] == "Rising data theft"
    assert result["manifest_for_save"][0]["kicker"] == "  Rising data theft. "
    assert clean_kicker(None) == ""
    assert clean_kicker("雨。") == "雨"


def _analysis(sentences, levels):
    return ArticleAnalysis(
        title_ja="t", title_en="t", kicker="k",
        sentences=[SentenceTranslation(japanese=s, translation="") for s in sentences],
        side_vocab=[VocabItem(word=f"w{i}", reading="", definition="", jlpt_level=lv)
                    for i, lv in enumerate(levels)],
    )


def test_reading_stats():
    stats = compute_reading_stats(_analysis(["雨[あめ]が 降[ふ]った。"] * 50, ["N1", "n2", "n2", "n3", ""]))
    assert stats["char_count"] == 6 * 50          # furigana and spaces removed
    assert stats["kanji_count"] == 2 * 50
    assert stats["reading_minutes"] == 2           # 300 chars at 200/min, rounded up
    assert (stats["n1_count"], stats["n2_count"]) == (1, 2)
    assert compute_reading_stats(_analysis([], []))["reading_minutes"] is None


def test_article_filename_uses_story_number():
    article = {"id": "https://nhkeasier.com/story/10085/", "link": "https://nhkeasier.com/story/10085/",
               "title": "トランプ大統領　テスト", "published": "Wed, 4 Nov 2026 20:10:00 +0900"}
    payload = build_article_html_payload(article, "<article lang='ja'><p>テスト</p></article>",
                                         _analysis(["テスト"], []), NOW)
    assert payload.html_filename == "story_10085.html"
    assert payload.metadata_entry["relative_path"] == "html_output/story_10085.html"
    assert payload.metadata_entry["char_count"] == 3
