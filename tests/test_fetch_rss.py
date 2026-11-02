import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch

import pytest

import fetch_rss
from config import parse_arguments


def test_config_parser_feed_source():
    """Verify that --feed-source command-line argument is parsed correctly."""
    test_args = ["pipeline.py", "--feed-source", "/path/to/my/feed.rss", "--days-back", "5"]
    with patch.object(sys, "argv", test_args):
        config = parse_arguments()
        assert config.feed_source == "/path/to/my/feed.rss"
        assert config.days_back == 5


def test_nhkeasy_destination_paths():
    """Verify that the primary base destination is ~/.local/share/nhkeasy and feed directory is used."""
    test_args = ["pipeline.py"]
    with patch.object(sys, "argv", test_args):
        config = parse_arguments()

    expected_base = Path.home() / ".local" / "share" / "nhkeasy"
    expected_feed = expected_base / "feed"

    assert config.nhkeasy_dir == expected_base
    assert config.feed_dir == expected_feed
    assert config.articles_json == expected_feed / "articles.json"
    assert config.processed_history_json == expected_feed / "processed_history.json"
    assert config.epubs_dir == expected_base / "epubs"
    assert config.audio_dir == expected_base / "audio"
    assert config.slow_audio_dir == expected_base / "slow_audio"
    assert config.vocab_dir == expected_base / "vocabulary"
    assert config.html_output_dir == expected_base / "html_output"
    assert config.smartreader_dir == expected_base / "smartreader"
    assert config.index_html_path == expected_base / "index.html"

    assert fetch_rss.OUTPUT_DIR == expected_feed
    assert fetch_rss.OUTPUT_FILE == expected_feed / "articles.json"

    # Verify all expected directories exist
    assert expected_base.is_dir()
    assert expected_feed.is_dir()
    assert config.epubs_dir.is_dir()
    assert config.audio_dir.is_dir()
    assert config.slow_audio_dir.is_dir()
    assert config.vocab_dir.is_dir()
    assert config.html_output_dir.is_dir()
    assert config.smartreader_dir.is_dir()


def test_save_feed_data_local_source(tmp_path):
    """Verify that save_feed_data successfully processes entries from a local RSS file source."""
    # Construct a published date that is 1 day ago to ensure it is always within days_back=5
    from datetime import timedelta
    pub_date = datetime.now(timezone.utc) - timedelta(days=1)
    pub_date_str = pub_date.strftime("%a, %d %b %Y %H:%M:%S +0000")

    # Write a simple dummy RSS content
    dummy_rss_content = f"""<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <title>NHK Easy</title>
    <link>https://nhkeasier.com</link>
    <description>NHK Easy News RSS Feed</description>
    <item>
      <title>Test Article 1</title>
      <link>https://nhkeasier.com/story/1</link>
      <published>{pub_date_str}</published>
      <summary>&lt;img src="https://nhkeasier.com/img1.jpg"/&gt;&lt;p&gt;Summary test&lt;/p></summary>
    </item>
  </channel>
</rss>
"""
    rss_file = tmp_path / "test_nhkeasier.rss"
    rss_file.write_text(dummy_rss_content, encoding="utf-8")

    output_json = tmp_path / "test_articles.json"

    # Call save_feed_data with days_back set large enough to include the test date
    fetch_rss.save_feed_data(days_back=5, feed_source=rss_file, output_file=output_json)

    assert output_json.is_file()
    with open(output_json, "r", encoding="utf-8") as f:
        articles = json.load(f)

    assert len(articles) == 1
    assert articles[0]["title"] == "Test Article 1"
    assert articles[0]["link"] == "https://nhkeasier.com/story/1"
    assert articles[0]["image_url"] == "https://nhkeasier.com/img1.jpg"


def _fake_feed(entries, bozo=False, status=None, exc=None):
    from types import SimpleNamespace

    class _Feed(dict):
        pass

    feed = _Feed(bozo=bozo, bozo_exception=exc)
    if status is not None:
        feed["status"] = status
    feed.entries = entries
    return feed


def _entry():
    from datetime import timedelta
    from feedparser import FeedParserDict

    pub = (datetime.now(timezone.utc) - timedelta(days=1)).strftime(
        "%a, %d %b %Y %H:%M:%S +0000"
    )
    return FeedParserDict(
        id="https://nhkeasier.com/story/1/", title="T", link="https://nhkeasier.com/story/1/",
        published=pub, summary="<p>no image</p>",
    )


def test_failed_feed_keeps_existing_articles_json(tmp_path):
    output_json = tmp_path / "articles.json"
    output_json.write_text('[{"id": "old"}]', encoding="utf-8")

    with patch.object(
        fetch_rss.feedparser, "parse",
        return_value=_fake_feed([], bozo=True, exc=OSError("no network")),
    ):
        assert fetch_rss.save_feed_data(output_file=output_json) is False

    assert json.loads(output_json.read_text(encoding="utf-8")) == [{"id": "old"}]


def test_http_error_keeps_existing_articles_json(tmp_path):
    output_json = tmp_path / "articles.json"
    output_json.write_text('[{"id": "old"}]', encoding="utf-8")

    with patch.object(
        fetch_rss.feedparser, "parse", return_value=_fake_feed([_entry()], status=503)
    ):
        assert fetch_rss.save_feed_data(output_file=output_json) is False

    assert json.loads(output_json.read_text(encoding="utf-8")) == [{"id": "old"}]


def test_empty_feed_keeps_existing_articles_json(tmp_path):
    output_json = tmp_path / "articles.json"
    output_json.write_text('[{"id": "old"}]', encoding="utf-8")

    with patch.object(fetch_rss.feedparser, "parse", return_value=_fake_feed([])):
        assert fetch_rss.save_feed_data(output_file=output_json) is False

    assert json.loads(output_json.read_text(encoding="utf-8")) == [{"id": "old"}]


def test_minor_parse_error_with_entries_still_saves(tmp_path):
    output_json = tmp_path / "articles.json"

    with patch.object(
        fetch_rss.feedparser, "parse",
        return_value=_fake_feed([_entry()], bozo=True, exc=ValueError("odd xml"), status=200),
    ):
        assert fetch_rss.save_feed_data(output_file=output_json) is True

    assert [a["title"] for a in json.loads(output_json.read_text(encoding="utf-8"))] == ["T"]


def test_dead_html_options_removed():
    for flag in ("--html-template", "--html-output-dir"):
        with patch.object(sys, "argv", ["pipeline.py", flag, "x"]):
            with pytest.raises(SystemExit):
                parse_arguments()
