"""Tests for when articles are recorded as processed (per article, after send)."""
import asyncio
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

import epub_runner
import pipeline


def _config(tmp_path, **kw):
    base = dict(
        processed_history_json=tmp_path / "history.json",
        reprocess=False,
    )
    base.update(kw)
    return SimpleNamespace(**base)


def test_history_saved_after_each_article(tmp_path):
    config = _config(tmp_path)
    state = pipeline.RunState()
    history: set[str] = set()
    saves = []

    async def fake_process(article, config, state, llm_client):
        state.newly_processed_article_ids.add(article["id"])

    with patch.object(pipeline, "_process_single_article", side_effect=fake_process), \
         patch.object(pipeline.article_manager, "save_processed_history",
                      side_effect=lambda h, p: saves.append(set(h))):
        asyncio.run(pipeline._process_all_articles(
            [{"id": "a", "link": "a"}, {"id": "b", "link": "b"}], config, state, history, None
        ))

    assert saves == [{"a"}, {"a", "b"}]


def test_history_saved_for_earlier_articles_when_a_later_one_crashes(tmp_path):
    config = _config(tmp_path)
    state = pipeline.RunState()
    history: set[str] = set()
    saves = []

    async def fake_process(article, config, state, llm_client):
        if article["id"] == "b":
            raise RuntimeError("boom")
        state.newly_processed_article_ids.add(article["id"])

    with patch.object(pipeline, "_process_single_article", side_effect=fake_process), \
         patch.object(pipeline.article_manager, "save_processed_history",
                      side_effect=lambda h, p: saves.append(set(h))):
        asyncio.run(pipeline._process_all_articles(
            [{"id": "a", "link": "a"}, {"id": "b", "link": "b"}], config, state, history, None
        ))

    assert saves == [{"a"}]


def test_reprocess_never_saves_history(tmp_path):
    config = _config(tmp_path, reprocess=True)
    state = pipeline.RunState()
    state.newly_processed_article_ids.add("a")
    with patch.object(pipeline.article_manager, "save_processed_history") as mock_save:
        pipeline._save_history_if_changed(config, set(), state)
    mock_save.assert_not_called()


def _run_epub(send_to_kindle_on, send_result):
    config = SimpleNamespace(
        epubs_dir=Path("/tmp"), keep_md=False, send_to_kindle=send_to_kindle_on, kindle_email=""
    )
    processed: set[str] = set()
    count = [0]
    with patch.object(epub_runner.nhkeasier_to_epub, "process_article_to_epub",
                      AsyncMock(return_value=(Path("/tmp/a.epub"), "md"))), \
         patch.object(epub_runner.send_to_kindle, "send_epub_to_kindle",
                      Mock(return_value=send_result)):
        asyncio.run(epub_runner.process_epub_and_kindle(
            {"id": "a", "link": "a", "title": "T"}, config, "<html/>", Mock(), processed, count
        ))
    return processed, count[0]


def test_article_marked_only_after_successful_send():
    assert _run_epub(True, True) == ({"a"}, 1)


def test_failed_send_leaves_article_unmarked_for_retry():
    assert _run_epub(True, False) == (set(), 0)


def test_no_kindle_marks_after_epub_built():
    assert _run_epub(False, None) == ({"a"}, 0)
