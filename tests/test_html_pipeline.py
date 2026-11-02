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
