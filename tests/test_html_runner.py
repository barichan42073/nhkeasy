"""Unit tests for html_runner.py.

These tests are hermetic: all disk writes are isolated to pytest's tmp_path
fixture, and every external collaborator (html_pipeline, jinja_render,
locale, platform, shutil) is mocked so no real filesystem/template/locale
state outside of tmp_path is touched or required.
"""
import asyncio
import json
import logging
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import pytest

import html_runner


def run_async(coro):
    """Helper to run a coroutine to completion without requiring pytest-asyncio."""
    return asyncio.run(coro)


class FakePayload:
    """Stand-in for the object returned by html_pipeline.build_article_html_payload."""

    def __init__(self, html_filename, html_content, metadata_entry, vocab_items):
        self.html_filename = html_filename
        self.html_content = html_content
        self.metadata_entry = metadata_entry
        self.vocab_items = vocab_items


@pytest.fixture
def config(tmp_path):
    """A minimal stand-in for PipelineConfig exposing only smartreader_dir,
    which is the only attribute html_runner.py actually uses."""
    return SimpleNamespace(smartreader_dir=tmp_path / "smartreader_output")


@pytest.fixture
def patch_locale_success():
    """Make locale handling deterministic and successful, regardless of the
    host machine's installed locales."""
    with patch.object(
        html_runner.platform, "system", return_value="Linux"
    ), patch.object(
        html_runner.locale, "setlocale", return_value="ja_JP.UTF-8"
    ):
        yield


@pytest.fixture
def patch_locale_failure():
    """Force the locale-setting branch to fail, exercising the fallback path."""
    with patch.object(
        html_runner.platform, "system", return_value="Linux"
    ), patch.object(
        html_runner.locale,
        "setlocale",
        side_effect=html_runner.locale.Error("unsupported locale"),
    ):
        yield


def _fake_is_file_factory(styles_exists: bool):
    """Builds an is_file() replacement that only special-cases styles.css,
    delegating everything else (e.g. manifest_path) to the real Path.is_file."""
    original_is_file = Path.is_file

    def fake_is_file(self):
        if self.name == "styles.css":
            return styles_exists
        return original_is_file(self)

    return fake_is_file


# ---------------------------------------------------------------------------
# write_article_html_output
# ---------------------------------------------------------------------------


class TestWriteArticleHtmlOutput:
    def test_happy_path_writes_file_and_updates_lists(self, config, caplog):
        caplog.set_level(logging.INFO)
        article = {"title": "Test Article", "id": "123"}
        payload = FakePayload(
            html_filename="test-article.html",
            html_content="<html>hello</html>",
            metadata_entry={"id": "123", "title": "Test Article"},
            vocab_items=[{"word": "テスト"}],
        )
        all_vocab = []
        all_metadata = []

        with patch.object(
            html_runner.html_pipeline,
            "build_article_html_payload",
            return_value=payload,
        ) as mock_build:
            run_async(
                html_runner.write_article_html_output(
                    article=article,
                    raw_html_content="<raw>",
                    analysis=MagicMock(),
                    config=config,
                    all_filtered_vocabulary=all_vocab,
                    all_article_metadata_for_index=all_metadata,
                )
            )

        mock_build.assert_called_once()
        output_file = config.smartreader_dir / "test-article.html"
        assert output_file.is_file()
        assert output_file.read_text(encoding="utf-8") == "<html>hello</html>"
        assert all_metadata == [payload.metadata_entry]
        assert all_vocab == payload.vocab_items
        assert "Generated interactive HTML article" in caplog.text

    def test_payload_none_does_not_write_or_update(self, config):
        article = {"title": "Test Article", "id": "123"}
        all_vocab = []
        all_metadata = []

        with patch.object(
            html_runner.html_pipeline, "build_article_html_payload", return_value=None
        ):
            run_async(
                html_runner.write_article_html_output(
                    article=article,
                    raw_html_content="<raw>",
                    analysis=MagicMock(),
                    config=config,
                    all_filtered_vocabulary=all_vocab,
                    all_article_metadata_for_index=all_metadata,
                )
            )

        assert not config.smartreader_dir.exists() or not list(
            config.smartreader_dir.glob("*.html")
        )
        assert all_vocab == []
        assert all_metadata == []

    def test_build_payload_raises_is_caught_and_logged(self, config, caplog):
        caplog.set_level(logging.ERROR)
        article = {"title": "Broken Article", "id": "999"}
        all_vocab = []
        all_metadata = []

        with patch.object(
            html_runner.html_pipeline,
            "build_article_html_payload",
            side_effect=ValueError("boom"),
        ):
            run_async(
                html_runner.write_article_html_output(
                    article=article,
                    raw_html_content="<raw>",
                    analysis=MagicMock(),
                    config=config,
                    all_filtered_vocabulary=all_vocab,
                    all_article_metadata_for_index=all_metadata,
                )
            )

        assert all_vocab == []
        assert all_metadata == []
        assert "Failed to build HTML payload" in caplog.text
        assert "Broken Article" in caplog.text

    def test_write_text_oserror_is_caught_and_logged(self, config, caplog):
        caplog.set_level(logging.ERROR)
        article = {"title": "Test Article", "id": "123"}
        payload = FakePayload(
            html_filename="test-article.html",
            html_content="<html>hello</html>",
            metadata_entry={"id": "123"},
            vocab_items=[{"word": "テスト"}],
        )
        all_vocab = []
        all_metadata = []

        with patch.object(
            html_runner.html_pipeline,
            "build_article_html_payload",
            return_value=payload,
        ), patch.object(Path, "write_text", side_effect=OSError("Permission denied")):
            run_async(
                html_runner.write_article_html_output(
                    article=article,
                    raw_html_content="<raw>",
                    analysis=MagicMock(),
                    config=config,
                    all_filtered_vocabulary=all_vocab,
                    all_article_metadata_for_index=all_metadata,
                )
            )

        assert all_vocab == []
        assert all_metadata == []
        assert "Failed to write interactive HTML article" in caplog.text


# ---------------------------------------------------------------------------
# write_smartreader_index
# ---------------------------------------------------------------------------


class TestWriteSmartreaderIndex:
    def test_happy_path_writes_index_manifest_and_styles(
        self, config, caplog, patch_locale_success
    ):
        caplog.set_level(logging.INFO)
        render_data = {
            "template_data": {"date": "2024-01-01"},
            "manifest_for_save": [{"id": "abc"}],
        }

        with patch.object(
            html_runner.html_pipeline,
            "compute_index_render_data",
            return_value=render_data,
        ) as mock_compute, patch.object(
            html_runner, "render_html_from_json_data", return_value="<html>index</html>"
        ) as mock_render, patch.object(
            Path, "is_file", _fake_is_file_factory(styles_exists=True)
        ), patch.object(
            html_runner.shutil, "copy"
        ) as mock_copy:
            run_async(
                html_runner.write_smartreader_index(
                    config=config,
                    newly_processed_article_ids={"abc"},
                    articles_from_current_run=[{"id": "abc"}],
                )
            )

        mock_compute.assert_called_once()
        mock_render.assert_called_once()
        index_path = config.smartreader_dir / "index.html"
        manifest_path = config.smartreader_dir / "articles_manifest.json"
        assert index_path.read_text(encoding="utf-8") == "<html>index</html>"
        assert json.loads(manifest_path.read_text(encoding="utf-8")) == [{"id": "abc"}]
        mock_copy.assert_called_once()
        assert "Generated SmartReader index HTML" in caplog.text
        assert "Generated manifest file" in caplog.text
        assert "Copied styles.css" in caplog.text

    def test_mkdir_failure_returns_early(self, config, caplog):
        caplog.set_level(logging.ERROR)
        with patch.object(
            Path, "mkdir", side_effect=OSError("no space")
        ), patch.object(
            html_runner.html_pipeline, "compute_index_render_data"
        ) as mock_compute:
            run_async(
                html_runner.write_smartreader_index(
                    config=config,
                    newly_processed_article_ids=set(),
                    articles_from_current_run=[],
                )
            )
        mock_compute.assert_not_called()
        assert "Failed to create SmartReader output directory" in caplog.text

    def test_locale_error_falls_back_gracefully(
        self, config, caplog, patch_locale_failure
    ):
        caplog.set_level(logging.WARNING)
        render_data = {"template_data": {}, "manifest_for_save": []}

        with patch.object(
            html_runner.html_pipeline,
            "compute_index_render_data",
            return_value=render_data,
        ), patch.object(
            html_runner, "render_html_from_json_data", return_value="<html></html>"
        ), patch.object(Path, "is_file", _fake_is_file_factory(styles_exists=False)):
            run_async(
                html_runner.write_smartreader_index(
                    config=config,
                    newly_processed_article_ids=set(),
                    articles_from_current_run=[],
                )
            )

        assert "Could not set locale" in caplog.text
        index_path = config.smartreader_dir / "index.html"
        assert index_path.is_file()

    def test_corrupted_manifest_is_reset(self, config, caplog, patch_locale_success):
        caplog.set_level(logging.WARNING)
        config.smartreader_dir.mkdir(parents=True, exist_ok=True)
        manifest_path = config.smartreader_dir / "articles_manifest.json"
        manifest_path.write_text("{not valid json", encoding="utf-8")

        captured = {}

        def fake_compute(**kwargs):
            captured["existing_manifest"] = kwargs["existing_manifest"]
            return {"template_data": {}, "manifest_for_save": []}

        with patch.object(
            html_runner.html_pipeline,
            "compute_index_render_data",
            side_effect=fake_compute,
        ), patch.object(
            html_runner, "render_html_from_json_data", return_value="<html></html>"
        ), patch.object(Path, "is_file", _fake_is_file_factory(styles_exists=False)):
            run_async(
                html_runner.write_smartreader_index(
                    config=config,
                    newly_processed_article_ids=set(),
                    articles_from_current_run=[],
                )
            )

        assert captured["existing_manifest"] == []
        assert "Could not read existing manifest" in caplog.text

    def test_compute_render_data_failure_is_logged(
        self, config, caplog, patch_locale_success
    ):
        caplog.set_level(logging.ERROR)
        with patch.object(
            html_runner.html_pipeline,
            "compute_index_render_data",
            side_effect=RuntimeError("bad data"),
        ), patch.object(
            html_runner, "render_html_from_json_data"
        ) as mock_render:
            run_async(
                html_runner.write_smartreader_index(
                    config=config,
                    newly_processed_article_ids=set(),
                    articles_from_current_run=[],
                )
            )

        mock_render.assert_not_called()
        assert "Failed to compute index render data" in caplog.text
        assert not (config.smartreader_dir / "index.html").exists()

    def test_render_html_failure_is_logged(self, config, caplog, patch_locale_success):
        caplog.set_level(logging.ERROR)
        render_data = {"template_data": {}, "manifest_for_save": []}
        with patch.object(
            html_runner.html_pipeline,
            "compute_index_render_data",
            return_value=render_data,
        ), patch.object(
            html_runner,
            "render_html_from_json_data",
            side_effect=RuntimeError("template broke"),
        ):
            run_async(
                html_runner.write_smartreader_index(
                    config=config,
                    newly_processed_article_ids=set(),
                    articles_from_current_run=[],
                )
            )

        assert "Failed to render index.html template" in caplog.text
        assert not (config.smartreader_dir / "index.html").exists()

    def test_index_write_failure_is_logged_and_stops(
        self, config, caplog, patch_locale_success
    ):
        caplog.set_level(logging.ERROR)
        render_data = {"template_data": {}, "manifest_for_save": [{"id": "x"}]}

        with patch.object(
            html_runner.html_pipeline,
            "compute_index_render_data",
            return_value=render_data,
        ), patch.object(
            html_runner, "render_html_from_json_data", return_value="<html></html>"
        ), patch.object(Path, "write_text", side_effect=OSError("disk full")):
            run_async(
                html_runner.write_smartreader_index(
                    config=config,
                    newly_processed_article_ids=set(),
                    articles_from_current_run=[],
                )
            )

        assert "Failed to write index.html" in caplog.text
        manifest_path = config.smartreader_dir / "articles_manifest.json"
        assert not manifest_path.exists()

    def test_manifest_write_failure_after_index_success(
        self, config, caplog, patch_locale_success
    ):
        caplog.set_level(logging.ERROR)
        render_data = {"template_data": {}, "manifest_for_save": [{"id": "x"}]}
        original_write_text = Path.write_text

        def fake_write_text(self, data, encoding=None):
            if self.name == "articles_manifest.json":
                raise OSError("disk full")
            return original_write_text(self, data, encoding=encoding)

        with patch.object(
            html_runner.html_pipeline,
            "compute_index_render_data",
            return_value=render_data,
        ), patch.object(
            html_runner, "render_html_from_json_data", return_value="<html></html>"
        ), patch.object(Path, "write_text", fake_write_text), patch.object(
            Path, "is_file", _fake_is_file_factory(styles_exists=False)
        ):
            run_async(
                html_runner.write_smartreader_index(
                    config=config,
                    newly_processed_article_ids=set(),
                    articles_from_current_run=[],
                )
            )

        index_path = config.smartreader_dir / "index.html"
        assert index_path.read_text(encoding="utf-8") == "<html></html>"
        assert "Failed to write manifest file" in caplog.text
        # Execution should continue past the manifest failure to the styles step.
        assert "Source styles.css not found" in caplog.text

    def test_styles_missing_logs_warning_and_returns(
        self, config, caplog, patch_locale_success
    ):
        caplog.set_level(logging.WARNING)
        render_data = {"template_data": {}, "manifest_for_save": []}

        with patch.object(
            html_runner.html_pipeline,
            "compute_index_render_data",
            return_value=render_data,
        ), patch.object(
            html_runner, "render_html_from_json_data", return_value="<html></html>"
        ), patch.object(
            Path, "is_file", _fake_is_file_factory(styles_exists=False)
        ), patch.object(
            html_runner.shutil, "copy"
        ) as mock_copy:
            run_async(
                html_runner.write_smartreader_index(
                    config=config,
                    newly_processed_article_ids=set(),
                    articles_from_current_run=[],
                )
            )

        mock_copy.assert_not_called()
        assert "Source styles.css not found" in caplog.text

    def test_styles_copy_failure_is_logged(self, config, caplog, patch_locale_success):
        caplog.set_level(logging.ERROR)
        render_data = {"template_data": {}, "manifest_for_save": []}

        with patch.object(
            html_runner.html_pipeline,
            "compute_index_render_data",
            return_value=render_data,
        ), patch.object(
            html_runner, "render_html_from_json_data", return_value="<html></html>"
        ), patch.object(
            Path, "is_file", _fake_is_file_factory(styles_exists=True)
        ), patch.object(
            html_runner.shutil, "copy", side_effect=OSError("copy failed")
        ):
            run_async(
                html_runner.write_smartreader_index(
                    config=config,
                    newly_processed_article_ids=set(),
                    articles_from_current_run=[],
                )
            )

        assert "Failed to copy styles.css" in caplog.text
