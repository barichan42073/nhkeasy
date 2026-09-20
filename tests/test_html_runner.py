import asyncio
import json
from datetime import datetime, timezone
from pathlib import Path
from types import SimpleNamespace

import html_runner
from html_pipeline import ArticleHtmlPayload


# ---------------------------------------------------------------------------
# _format_japanese_dates
# ---------------------------------------------------------------------------


def test_format_japanese_dates_saturday():
    # 2024-06-15 is a Saturday.
    dt = datetime(2024, 6, 15, tzinfo=timezone.utc)

    full, title = html_runner._format_japanese_dates(dt)

    assert full == "2024年6月15日（土）"
    assert title == "6月15日（土）"


def test_format_japanese_dates_monday():
    # 2024-06-17 is a Monday.
    dt = datetime(2024, 6, 17, tzinfo=timezone.utc)

    full, title = html_runner._format_japanese_dates(dt)

    assert full == "2024年6月17日（月）"
    assert title == "6月17日（月）"


# ---------------------------------------------------------------------------
# _copy_styles_css
# ---------------------------------------------------------------------------


def test_copy_styles_css_success(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    source = tmp_path / "styles.css"
    source.write_text("body { color: red; }", encoding="utf-8")

    output_dir = tmp_path / "output"
    output_dir.mkdir()
    config = SimpleNamespace(html_output_dir=output_dir)

    html_runner._copy_styles_css(config)

    dest = output_dir / "styles.css"
    assert dest.is_file()
    assert dest.read_text(encoding="utf-8") == "body { color: red; }"


def test_copy_styles_css_missing_source(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)  # No styles.css created here.

    output_dir = tmp_path / "output"
    output_dir.mkdir()
    config = SimpleNamespace(html_output_dir=output_dir)

    # Should not raise, and should not create a destination file.
    html_runner._copy_styles_css(config)

    assert not (output_dir / "styles.css").exists()


def test_copy_styles_css_copy_error(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    source = tmp_path / "styles.css"
    source.write_text("body {}", encoding="utf-8")

    output_dir = tmp_path / "output"
    output_dir.mkdir()
    config = SimpleNamespace(html_output_dir=output_dir)

    def raise_oserror(*args, **kwargs):
        raise OSError("disk full")

    monkeypatch.setattr(html_runner.shutil, "copyfile", raise_oserror)

    # Should not raise despite the underlying copy failing.
    html_runner._copy_styles_css(config)


# ---------------------------------------------------------------------------
# _load_manifest / _save_manifest
# ---------------------------------------------------------------------------


def test_load_manifest_missing_file(tmp_path):
    config = SimpleNamespace(html_output_dir=tmp_path)

    result = html_runner._load_manifest(config)

    assert result == []


def test_load_manifest_valid_json(tmp_path):
    manifest_data = [{"id": "1", "date": "2024-06-15T00:00:00+00:00"}]
    (tmp_path / "manifest.json").write_text(
        json.dumps(manifest_data), encoding="utf-8"
    )
    config = SimpleNamespace(html_output_dir=tmp_path)

    result = html_runner._load_manifest(config)

    assert result == manifest_data


def test_load_manifest_invalid_json(tmp_path):
    (tmp_path / "manifest.json").write_text("{not valid json", encoding="utf-8")
    config = SimpleNamespace(html_output_dir=tmp_path)

    result = html_runner._load_manifest(config)

    assert result == []


def test_save_manifest_success(tmp_path):
    config = SimpleNamespace(html_output_dir=tmp_path)
    data = [{"id": "1", "title": "テスト"}]

    html_runner._save_manifest(config, data)

    manifest_path = tmp_path / "manifest.json"
    assert manifest_path.is_file()
    raw_text = manifest_path.read_text(encoding="utf-8")
    assert json.loads(raw_text) == data
    # ensure_ascii=False should preserve the raw Japanese characters.
    assert "テスト" in raw_text


def test_save_manifest_write_error(tmp_path, monkeypatch):
    config = SimpleNamespace(html_output_dir=tmp_path)
    manifest_path = tmp_path / "manifest.json"
    real_open = open

    def fake_open(file, mode="r", *args, **kwargs):
        if str(file) == str(manifest_path) and "w" in mode:
            raise OSError("permission denied")
        return real_open(file, mode, *args, **kwargs)

    monkeypatch.setattr("builtins.open", fake_open)

    # Should not raise despite the underlying write failing.
    html_runner._save_manifest(config, [{"id": "1"}])


# ---------------------------------------------------------------------------
# write_article_html_output
# ---------------------------------------------------------------------------


def test_write_article_html_output_success(tmp_path, monkeypatch):
    output_dir = tmp_path / "output"
    output_dir.mkdir()
    config = SimpleNamespace(html_output_dir=output_dir)

    payload = ArticleHtmlPayload(
        html_filename="test_article.html",
        html_content="<html>Test</html>",
        metadata_entry={"id": "abc", "title": "Test Article"},
        vocab_items=[
            {
                "word": "テスト",
                "reading": "てすと",
                "definition": "test",
                "jlpt_level": "n5",
            }
        ],
    )
    monkeypatch.setattr(
        html_runner, "build_article_html_payload", lambda *a, **kw: payload
    )

    vocab_list = []
    metadata_list = []

    asyncio.run(
        html_runner.write_article_html_output(
            article={"id": "abc", "title": "Test Article", "link": "http://x"},
            raw_html_content="<html></html>",
            analysis=None,
            config=config,
            all_filtered_vocabulary=vocab_list,
            all_article_metadata_for_index=metadata_list,
        )
    )

    output_file = output_dir / "test_article.html"
    assert output_file.is_file()
    assert output_file.read_text(encoding="utf-8") == "<html>Test</html>"
    assert metadata_list == [payload.metadata_entry]
    assert vocab_list == payload.vocab_items


def test_write_article_html_output_payload_none(tmp_path, monkeypatch):
    output_dir = tmp_path / "output"
    output_dir.mkdir()
    config = SimpleNamespace(html_output_dir=output_dir)

    monkeypatch.setattr(
        html_runner, "build_article_html_payload", lambda *a, **kw: None
    )

    vocab_list = []
    metadata_list = []

    asyncio.run(
        html_runner.write_article_html_output(
            article={"id": "abc", "title": "Test Article", "link": "http://x"},
            raw_html_content="<html></html>",
            analysis=None,
            config=config,
            all_filtered_vocabulary=vocab_list,
            all_article_metadata_for_index=metadata_list,
        )
    )

    assert vocab_list == []
    assert metadata_list == []
    assert list(output_dir.iterdir()) == []


def test_write_article_html_output_write_error(tmp_path, monkeypatch):
    output_dir = tmp_path / "output"
    output_dir.mkdir()
    config = SimpleNamespace(html_output_dir=output_dir)

    payload = ArticleHtmlPayload(
        html_filename="test_article.html",
        html_content="<html>Test</html>",
        metadata_entry={"id": "abc", "title": "Test Article"},
        vocab_items=[{"word": "テスト"}],
    )
    monkeypatch.setattr(
        html_runner, "build_article_html_payload", lambda *a, **kw: payload
    )

    original_write_text = Path.write_text

    def fake_write_text(self, *args, **kwargs):
        if self.suffix == ".html":
            raise OSError("disk full")
        return original_write_text(self, *args, **kwargs)

    monkeypatch.setattr(Path, "write_text", fake_write_text)

    vocab_list = []
    metadata_list = []

    asyncio.run(
        html_runner.write_article_html_output(
            article={"id": "abc", "title": "Test Article", "link": "http://x"},
            raw_html_content="<html></html>",
            analysis=None,
            config=config,
            all_filtered_vocabulary=vocab_list,
            all_article_metadata_for_index=metadata_list,
        )
    )

    # A failed write should prevent metadata/vocab from being recorded.
    assert vocab_list == []
    assert metadata_list == []


# ---------------------------------------------------------------------------
# write_smartreader_index
# ---------------------------------------------------------------------------


def _fake_render_data(manifest_for_save=None):
    return {
        "template_data": {
            "lead_article": None,
            "today_grid_articles": [],
            "older_articles_grouped": [],
            "current_date_japanese": "2024年6月15日（土）",
            "current_date_japanese_title": "6月15日（土）",
            "current_date_iso": "2024-06-15",
            "current_date_obj": datetime(2024, 6, 15, tzinfo=timezone.utc),
        },
        "manifest_for_save": manifest_for_save if manifest_for_save is not None else [],
    }


def test_write_smartreader_index_full_flow(tmp_path, monkeypatch):
    output_dir = tmp_path / "output"
    output_dir.mkdir()
    config = SimpleNamespace(html_output_dir=output_dir)

    monkeypatch.setattr(html_runner, "_copy_styles_css", lambda cfg: None)

    manifest_data = [
        {"id": "abc", "title": "Test Article", "date": "2024-06-15T00:00:00+00:00"}
    ]
    monkeypatch.setattr(
        html_runner,
        "compute_index_render_data",
        lambda **kwargs: _fake_render_data(manifest_data),
    )

    asyncio.run(
        html_runner.write_smartreader_index(
            config=config,
            newly_processed_article_ids=set(),
            articles_from_current_run=[],
        )
    )

    index_path = output_dir / "index.html"
    assert index_path.is_file()
    content = index_path.read_text(encoding="utf-8")
    assert "6月15日（土）" in content
    assert "2024年6月15日（土）" in content

    manifest_path = output_dir / "manifest.json"
    assert manifest_path.is_file()
    saved_manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    assert saved_manifest == manifest_data


def test_write_smartreader_index_template_load_failure(tmp_path, monkeypatch):
    output_dir = tmp_path / "output"
    output_dir.mkdir()
    config = SimpleNamespace(html_output_dir=output_dir)

    monkeypatch.setattr(html_runner, "_copy_styles_css", lambda cfg: None)
    monkeypatch.setattr(
        html_runner,
        "compute_index_render_data",
        lambda **kwargs: _fake_render_data(),
    )

    def raise_template_error(name):
        raise Exception("template not found")

    monkeypatch.setattr(html_runner._jinja_env, "get_template", raise_template_error)

    asyncio.run(
        html_runner.write_smartreader_index(
            config=config,
            newly_processed_article_ids=set(),
            articles_from_current_run=[],
        )
    )

    # Template loading failure should abort before writing anything.
    assert not (output_dir / "index.html").exists()
    assert not (output_dir / "manifest.json").exists()


def test_write_smartreader_index_write_error_still_saves_manifest(
    tmp_path, monkeypatch
):
    output_dir = tmp_path / "output"
    output_dir.mkdir()
    config = SimpleNamespace(html_output_dir=output_dir)

    monkeypatch.setattr(html_runner, "_copy_styles_css", lambda cfg: None)

    manifest_data = [{"id": "xyz"}]
    monkeypatch.setattr(
        html_runner,
        "compute_index_render_data",
        lambda **kwargs: _fake_render_data(manifest_data),
    )

    original_write_text = Path.write_text

    def fake_write_text(self, *args, **kwargs):
        if self.suffix == ".html":
            raise OSError("disk full")
        return original_write_text(self, *args, **kwargs)

    monkeypatch.setattr(Path, "write_text", fake_write_text)

    asyncio.run(
        html_runner.write_smartreader_index(
            config=config,
            newly_processed_article_ids=set(),
            articles_from_current_run=[],
        )
    )

    # index.html write failed...
    assert not (output_dir / "index.html").exists()

    # ...but the manifest should still be persisted (uses plain open(), not
    # Path.write_text, and is unconditionally called after the index write).
    manifest_path = output_dir / "manifest.json"
    assert manifest_path.is_file()
    assert json.loads(manifest_path.read_text(encoding="utf-8")) == manifest_data


def test_write_smartreader_index_integration_with_real_pipeline(tmp_path, monkeypatch):
    """
    End-to-end check that write_smartreader_index correctly wires together
    the real html_pipeline.compute_index_render_data and the real
    index_template.html: it should merge an existing on-disk manifest with
    newly-processed article metadata, render both into the index page, and
    persist the merged manifest back to disk.
    """
    output_dir = tmp_path / "output"
    output_dir.mkdir()
    config = SimpleNamespace(html_output_dir=output_dir)

    monkeypatch.setattr(html_runner, "_copy_styles_css", lambda cfg: None)

    existing_manifest = [
        {
            "id": "old-1",
            "title": "Old Article",
            "date": "2024-06-10T00:00:00+00:00",
            "relative_path": "old-1.html",
            "image_url": None,
            "kicker": "Old Kicker",
        }
    ]
    (output_dir / "manifest.json").write_text(
        json.dumps(existing_manifest), encoding="utf-8"
    )

    new_article_metadata = {
        "id": "new-1",
        "title": "New Article",
        "date": "2024-06-15T00:00:00+00:00",
        "relative_path": "new-1.html",
        "image_url": None,
        "kicker": "New Kicker",
    }

    fixed_now = datetime(2024, 6, 15, tzinfo=timezone.utc)

    class FixedDatetime(datetime):
        @classmethod
        def now(cls, tz=None):
            return fixed_now

    monkeypatch.setattr(html_runner, "datetime", FixedDatetime)

    asyncio.run(
        html_runner.write_smartreader_index(
            config=config,
            newly_processed_article_ids={"new-1"},
            articles_from_current_run=[new_article_metadata],
        )
    )

    index_path = output_dir / "index.html"
    assert index_path.is_file()
    rendered = index_path.read_text(encoding="utf-8")
    assert "New Article" in rendered
    assert "Old Article" in rendered

    manifest_path = output_dir / "manifest.json"
    saved_manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    saved_ids = {item["id"] for item in saved_manifest}
    assert saved_ids == {"old-1", "new-1"}
