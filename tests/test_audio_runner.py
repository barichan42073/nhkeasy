import asyncio
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import MagicMock, Mock, patch

import audio_runner


# ---------------------------------------------------------------------------
# run_audio_preflight_checks
# ---------------------------------------------------------------------------

def test_run_audio_preflight_checks_no_errors_does_not_exit():
    config = Mock()

    with patch.object(
        audio_runner.audio_pipeline, "check_audio_preflight", return_value=[]
    ), patch.object(audio_runner.sys, "exit") as mock_exit:
        audio_runner.run_audio_preflight_checks(config)

    mock_exit.assert_not_called()


def test_run_audio_preflight_checks_exits_on_errors():
    config = Mock()

    with patch.object(
        audio_runner.audio_pipeline,
        "check_audio_preflight",
        return_value=["missing GROQ_API_KEY"],
    ), patch.object(
        audio_runner.sys, "exit", side_effect=SystemExit(1)
    ) as mock_exit:
        try:
            audio_runner.run_audio_preflight_checks(config)
        except SystemExit:
            pass

    mock_exit.assert_called_once_with(1)


# ---------------------------------------------------------------------------
# execute_audio_processing_for_article
# ---------------------------------------------------------------------------

def test_execute_audio_processing_noop_when_no_audio():
    config = Mock(no_audio=True)
    generated_slow_files = []
    newly_processed_article_ids = set()

    with patch.object(audio_runner.audio_pipeline, "build_audio_task") as mock_build:
        asyncio.run(
            audio_runner.execute_audio_processing_for_article(
                article={"title": "Test"},
                config=config,
                raw_html_content="<html></html>",
                newly_processed_article_ids=newly_processed_article_ids,
                generated_slow_files=generated_slow_files,
            )
        )

    mock_build.assert_not_called()
    assert generated_slow_files == []
    assert newly_processed_article_ids == set()


def test_execute_audio_processing_noop_when_slowrecord_unavailable():
    config = Mock(no_audio=False)

    with patch.object(audio_runner, "slowrecord", None), patch.object(
        audio_runner.audio_pipeline, "build_audio_task"
    ) as mock_build:
        asyncio.run(
            audio_runner.execute_audio_processing_for_article(
                article={"title": "Test"},
                config=config,
                raw_html_content="<html></html>",
                newly_processed_article_ids=set(),
                generated_slow_files=[],
            )
        )

    mock_build.assert_not_called()


def test_execute_audio_processing_noop_when_task_none():
    config = Mock(no_audio=False)

    with patch.object(audio_runner, "slowrecord", MagicMock()), patch.object(
        audio_runner.audio_pipeline, "build_audio_task", return_value=None
    ) as mock_build:
        asyncio.run(
            audio_runner.execute_audio_processing_for_article(
                article={"title": "Test"},
                config=config,
                raw_html_content="<html></html>",
                newly_processed_article_ids=set(),
                generated_slow_files=[],
            )
        )

    mock_build.assert_called_once()


def test_execute_audio_processing_happy_path(tmp_path):
    config = Mock(no_audio=False)
    task = SimpleNamespace(
        mp3_url="http://example.com/audio.mp3",
        audio_orig_path=tmp_path / "orig.mp3",
        slowed_path=tmp_path / "slowed.mp3",
        article_title="Test Article",
        article_id="123",
    )
    generated_slow_files = []
    newly_processed_article_ids = set()
    fake_slowrecord = MagicMock()

    with patch.object(audio_runner, "slowrecord", fake_slowrecord), patch.object(
        audio_runner.audio_pipeline, "build_audio_task", return_value=task
    ), patch.object(audio_runner, "download_mp3") as mock_download, patch.object(
        audio_runner.audio_pipeline,
        "should_mark_article_processed_for_audio_only",
        return_value=True,
    ) as mock_should_mark:
        asyncio.run(
            audio_runner.execute_audio_processing_for_article(
                article={"title": "Test Article"},
                config=config,
                raw_html_content="<html></html>",
                newly_processed_article_ids=newly_processed_article_ids,
                generated_slow_files=generated_slow_files,
            )
        )

    mock_download.assert_called_once_with(task.mp3_url, task.audio_orig_path)
    fake_slowrecord.process_news_with_pysbd.assert_called_once_with(
        str(task.audio_orig_path), str(task.slowed_path)
    )
    assert generated_slow_files == [task.slowed_path]
    mock_should_mark.assert_called_once_with(config, True)
    assert newly_processed_article_ids == {"123"}


def test_execute_audio_processing_handles_download_failure(tmp_path):
    config = Mock(no_audio=False)
    task = SimpleNamespace(
        mp3_url="http://example.com/audio.mp3",
        audio_orig_path=tmp_path / "orig.mp3",
        slowed_path=tmp_path / "slowed.mp3",
        article_title="Test Article",
        article_id="123",
    )
    generated_slow_files = []
    newly_processed_article_ids = set()

    with patch.object(audio_runner, "slowrecord", MagicMock()), patch.object(
        audio_runner.audio_pipeline, "build_audio_task", return_value=task
    ), patch.object(
        audio_runner, "download_mp3", side_effect=OSError("boom")
    ), patch.object(
        audio_runner.audio_pipeline,
        "should_mark_article_processed_for_audio_only",
        return_value=False,
    ) as mock_should_mark:
        asyncio.run(
            audio_runner.execute_audio_processing_for_article(
                article={"title": "Test Article"},
                config=config,
                raw_html_content="<html></html>",
                newly_processed_article_ids=newly_processed_article_ids,
                generated_slow_files=generated_slow_files,
            )
        )

    assert generated_slow_files == []
    mock_should_mark.assert_called_once_with(config, False)
    assert newly_processed_article_ids == set()


# ---------------------------------------------------------------------------
# combine_and_export_audio
# ---------------------------------------------------------------------------

def test_combine_and_export_audio_returns_none_when_no_files():
    config = Mock()

    result = asyncio.run(audio_runner.combine_and_export_audio([], config))

    assert result is None


def test_combine_and_export_audio_happy_path_removes_slow_files(tmp_path):
    combined_audio_path = tmp_path / "combined.mp3"
    config = Mock(combined_audio_path=combined_audio_path, keep_slow_mp3=False)
    slow_file = tmp_path / "slow1.mp3"
    slow_file.write_bytes(b"fake-mp3-bytes")
    generated_slow_files = [slow_file]

    mock_combined = MagicMock()
    mock_combined.__add__ = Mock(return_value=mock_combined)
    mock_combined.__iadd__ = Mock(return_value=mock_combined)

    with patch.object(audio_runner, "AudioSegment") as mock_audio_segment_cls:
        mock_audio_segment_cls.empty.return_value = mock_combined
        mock_audio_segment_cls.from_mp3.return_value = MagicMock()

        result = asyncio.run(
            audio_runner.combine_and_export_audio(generated_slow_files, config)
        )

    mock_combined.export.assert_called_once_with(str(combined_audio_path), format="mp3")
    assert result == combined_audio_path
    assert not slow_file.exists()


def test_combine_and_export_audio_keeps_slow_files_when_configured(tmp_path):
    combined_audio_path = tmp_path / "combined.mp3"
    config = Mock(combined_audio_path=combined_audio_path, keep_slow_mp3=True)
    slow_file = tmp_path / "slow1.mp3"
    slow_file.write_bytes(b"fake-mp3-bytes")
    generated_slow_files = [slow_file]

    mock_combined = MagicMock()
    mock_combined.__add__ = Mock(return_value=mock_combined)
    mock_combined.__iadd__ = Mock(return_value=mock_combined)

    with patch.object(audio_runner, "AudioSegment") as mock_audio_segment_cls:
        mock_audio_segment_cls.empty.return_value = mock_combined
        mock_audio_segment_cls.from_mp3.return_value = MagicMock()

        result = asyncio.run(
            audio_runner.combine_and_export_audio(generated_slow_files, config)
        )

    assert result == combined_audio_path
    assert slow_file.exists()


def test_combine_and_export_audio_returns_none_on_export_failure(tmp_path):
    combined_audio_path = tmp_path / "combined.mp3"
    config = Mock(combined_audio_path=combined_audio_path, keep_slow_mp3=False)
    slow_file = tmp_path / "slow1.mp3"
    slow_file.write_bytes(b"fake-mp3-bytes")
    generated_slow_files = [slow_file]

    mock_combined = MagicMock()
    mock_combined.__add__ = Mock(return_value=mock_combined)
    mock_combined.__iadd__ = Mock(return_value=mock_combined)
    mock_combined.export.side_effect = OSError("export failed")

    with patch.object(audio_runner, "AudioSegment") as mock_audio_segment_cls:
        mock_audio_segment_cls.empty.return_value = mock_combined
        mock_audio_segment_cls.from_mp3.return_value = MagicMock()

        result = asyncio.run(
            audio_runner.combine_and_export_audio(generated_slow_files, config)
        )

    assert result is None
    # cleanup only happens after a successful export
    assert slow_file.exists()


# ---------------------------------------------------------------------------
# deliver_combined_audio
# ---------------------------------------------------------------------------

def test_deliver_combined_audio_success():
    combined_audio_path = Path("/tmp/combined.mp3")

    with patch.object(
        audio_runner.send_to_kindle, "send_epub_to_kindle", return_value=True
    ) as mock_send:
        asyncio.run(audio_runner.deliver_combined_audio(combined_audio_path))

    mock_send.assert_called_once_with(
        combined_audio_path, kindle_email="barichan42073@gmail.com"
    )


def test_deliver_combined_audio_failure_does_not_raise():
    combined_audio_path = Path("/tmp/combined.mp3")

    with patch.object(
        audio_runner.send_to_kindle, "send_epub_to_kindle", return_value=False
    ):
        asyncio.run(audio_runner.deliver_combined_audio(combined_audio_path))


def test_deliver_combined_audio_swallows_exceptions():
    combined_audio_path = Path("/tmp/combined.mp3")

    with patch.object(
        audio_runner.send_to_kindle,
        "send_epub_to_kindle",
        side_effect=OSError("smtp down"),
    ):
        asyncio.run(audio_runner.deliver_combined_audio(combined_audio_path))
