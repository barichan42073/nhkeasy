"""Tests for nhkeasier_to_epub.process_article_to_epub intermediate-file cleanup."""
import asyncio
from pathlib import Path
from unittest.mock import patch

import pytest

pytest.importorskip("google.genai")
import nhkeasier_to_epub  # noqa: E402


def _fake_convert(md_path, output_path, title=None):
    Path(output_path).write_bytes(b"epub")


def _run(tmp_path, keep_md):
    output_path = tmp_path / "article.epub"
    with patch.object(
        nhkeasier_to_epub,
        "extract_article_content_from_html",
        return_value=("タイトル", "本文です。", None),
    ), patch.object(
        nhkeasier_to_epub,
        "_generate_markdown_from_article_analysis",
        return_value="# md",
    ), patch.object(nhkeasier_to_epub, "convert_md_to_epub", side_effect=_fake_convert):
        result = asyncio.run(
            nhkeasier_to_epub.process_article_to_epub(
                html_content="<html></html>",
                output_path=output_path,
                keep_md=keep_md,
                analysis=object(),  # any truthy analysis takes the analysis branch
            )
        )
    return output_path, result


def test_txt_and_md_removed_after_epub(tmp_path):
    output_path, (epub_path, md) = _run(tmp_path, keep_md=False)
    assert epub_path == output_path and output_path.exists()
    assert md == "# md"
    assert not output_path.with_suffix(".txt").exists()
    assert not output_path.with_suffix(".md").exists()


def test_keep_md_keeps_txt_and_md(tmp_path):
    output_path, _ = _run(tmp_path, keep_md=True)
    assert output_path.with_suffix(".txt").read_text(encoding="utf-8") == "本文です。"
    assert output_path.with_suffix(".md").exists()


def test_txt_kept_when_conversion_fails(tmp_path):
    output_path = tmp_path / "article.epub"
    with patch.object(
        nhkeasier_to_epub,
        "extract_article_content_from_html",
        return_value=("タイトル", "本文です。", None),
    ), patch.object(
        nhkeasier_to_epub,
        "_generate_markdown_from_article_analysis",
        return_value="# md",
    ), patch.object(
        nhkeasier_to_epub, "convert_md_to_epub", side_effect=RuntimeError("boom")
    ):
        with pytest.raises(RuntimeError):
            asyncio.run(
                nhkeasier_to_epub.process_article_to_epub(
                    html_content="<html></html>",
                    output_path=output_path,
                    analysis=object(),
                )
            )
    # Left in place so a failed conversion can be inspected.
    assert output_path.with_suffix(".txt").exists()
