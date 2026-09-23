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


def test_save_feed_data_local_source(tmp_path):
    """Verify that save_feed_data successfully processes entries from a local RSS file source."""
    # Write a simple dummy RSS content
    dummy_rss_content = """<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <title>NHK Easy</title>
    <link>https://nhkeasier.com</link>
    <description>NHK Easy News RSS Feed</description>
    <item>
      <title>Test Article 1</title>
      <link>https://nhkeasier.com/story/1</link>
      <published>Fri, 18 Sep 2026 20:15:00 +0900</published>
      <summary>&lt;img src="https://nhkeasier.com/img1.jpg"/&gt;&lt;p&gt;Summary test&lt;/p&gt;</summary>
    </item>
  </channel>
</rss>
"""
    rss_file = tmp_path / "test_nhkeasier.rss"
    rss_file.write_text(dummy_rss_content, encoding="utf-8")

    output_json = tmp_path / "test_articles.json"

    # Call save_feed_data with days_back set large enough to include Sep 18, 2026
    # Note: Because the current system date in our environment is Tuesday, Sep 22, 2026,
    # days_back=5 is sufficient to include Sep 18, 2026.
    fetch_rss.save_feed_data(days_back=5, feed_source=rss_file, output_file=output_json)

    assert output_json.is_file()
    with open(output_json, "r", encoding="utf-8") as f:
        articles = json.load(f)

    assert len(articles) == 1
    assert articles[0]["title"] == "Test Article 1"
    assert articles[0]["link"] == "https://nhkeasier.com/story/1"
    assert articles[0]["image_url"] == "https://nhkeasier.com/img1.jpg"
