import asyncio
from pathlib import Path
from unittest.mock import MagicMock, Mock, patch

import anki_runner


# ---------------------------------------------------------------------------
# collect_article_vocab_for_anki
# ---------------------------------------------------------------------------

def test_collect_article_vocab_for_anki_noop_when_no_anki():
    config = Mock(no_anki=True)
    all_filtered_vocabulary = []

    with patch.object(anki_runner.anki_pipeline, "build_article_vocab_items") as mock_build:
        anki_runner.collect_article_vocab_for_anki(
            article={"title": "Test"},
            config=config,
            article_markdown_content="some markdown",
            existing_unique_vocab={},
            all_filtered_vocabulary=all_filtered_vocabulary,
        )

    mock_build.assert_not_called()
    assert all_filtered_vocabulary == []


def test_collect_article_vocab_for_anki_noop_when_no_markdown():
    config = Mock(no_anki=False)
    all_filtered_vocabulary = []

    with patch.object(anki_runner.anki_pipeline, "build_article_vocab_items") as mock_build:
        anki_runner.collect_article_vocab_for_anki(
            article={"title": "Test"},
            config=config,
            article_markdown_content=None,
            existing_unique_vocab={},
            all_filtered_vocabulary=all_filtered_vocabulary,
        )

    mock_build.assert_not_called()
    assert all_filtered_vocabulary == []


def test_collect_article_vocab_for_anki_extends_pool():
    config = Mock(no_anki=False)
    all_filtered_vocabulary = []
    existing_unique_vocab = {"foo": {"bar": "baz"}}
    article = {"title": "Test"}
    fake_vocab_items = [{"word": "犬"}, {"word": "猫"}]

    with patch.object(
        anki_runner.anki_pipeline, "build_article_vocab_items", return_value=fake_vocab_items
    ) as mock_build:
        anki_runner.collect_article_vocab_for_anki(
            article=article,
            config=config,
            article_markdown_content="some markdown",
            existing_unique_vocab=existing_unique_vocab,
            all_filtered_vocabulary=all_filtered_vocabulary,
        )

    mock_build.assert_called_once_with(
        article, "some markdown", existing_unique_vocab, max_words=3
    )
    assert all_filtered_vocabulary == fake_vocab_items


# ---------------------------------------------------------------------------
# _setup_anki_manager
# ---------------------------------------------------------------------------

def test_setup_anki_manager_returns_none_when_no_anki():
    config = Mock(no_anki=True)
    result = anki_runner._setup_anki_manager(config)
    assert result is None


def test_setup_anki_manager_exits_when_genanki_missing():
    config = Mock(no_anki=False)

    with patch.object(anki_runner.anki_generator, "genanki", None), \
         patch.object(anki_runner.sys, "exit", side_effect=SystemExit(1)) as mock_exit:
        try:
            anki_runner._setup_anki_manager(config)
        except SystemExit:
            pass

    mock_exit.assert_called_once_with(1)


def test_setup_anki_manager_disables_send_when_ankiwebmanager_missing():
    config = Mock(no_anki=False, send_anki_to_app=True)

    with patch.object(anki_runner.anki_generator, "genanki", object()), \
         patch.object(anki_runner, "AnkiWebManager", None):
        result = anki_runner._setup_anki_manager(config)

    assert result is None
    assert config.send_anki_to_app is False


def test_setup_anki_manager_exits_when_env_vars_missing():
    config = Mock(no_anki=False, send_anki_to_app=True)

    with patch.object(anki_runner.anki_generator, "genanki", object()), \
         patch.object(anki_runner, "AnkiWebManager", MagicMock()), \
         patch.object(anki_runner.os, "getenv", return_value=None), \
         patch.object(anki_runner.sys, "exit", side_effect=SystemExit(1)) as mock_exit:
        try:
            anki_runner._setup_anki_manager(config)
        except SystemExit:
            pass

    mock_exit.assert_called_once_with(1)


def test_setup_anki_manager_happy_path():
    config = Mock(
        no_anki=False,
        send_anki_to_app=True,
        anki_local_db_path=Path("/tmp/anki.db"),
    )
    fake_instance = MagicMock()
    fake_manager_class = MagicMock(return_value=fake_instance)

    def fake_getenv(key):
        return {"ANKIWEB_USER": "user", "ANKIWEB_PASS": "pass"}.get(key)

    with patch.object(anki_runner.anki_generator, "genanki", object()), \
         patch.object(anki_runner, "AnkiWebManager", fake_manager_class), \
         patch.object(anki_runner.os, "getenv", side_effect=fake_getenv):
        result = anki_runner._setup_anki_manager(config)

    fake_manager_class.assert_called_once_with(
        username="user", password="pass", db_path=str(config.anki_local_db_path)
    )
    assert result is fake_instance


# ---------------------------------------------------------------------------
# generate_and_deliver_daily_anki_package
# ---------------------------------------------------------------------------

def test_generate_and_deliver_noop_when_no_anki():
    config = Mock(no_anki=True)

    with patch.object(anki_runner.anki_pipeline, "select_daily_vocab") as mock_select, \
         patch.object(anki_runner.anki_generator, "generate_anki_package") as mock_gen:
        asyncio.run(
            anki_runner.generate_and_deliver_daily_anki_package([{"word": "foo"}], config)
        )

    mock_select.assert_not_called()
    mock_gen.assert_not_called()


def test_generate_and_deliver_noop_when_empty_vocab():
    config = Mock(no_anki=False)

    with patch.object(anki_runner.anki_pipeline, "select_daily_vocab") as mock_select, \
         patch.object(anki_runner.anki_generator, "generate_anki_package") as mock_gen:
        asyncio.run(anki_runner.generate_and_deliver_daily_anki_package([], config))

    mock_select.assert_not_called()
    mock_gen.assert_not_called()


def test_generate_and_deliver_happy_path_without_send():
    config = Mock(no_anki=False, send_anki_to_app=False, unique_vocab_json=Path("/tmp/uv.json"))
    all_filtered_vocabulary = [{"word": "犬"}, {"word": "猫"}]
    unique_daily_vocab = [{"word": "犬"}]
    fake_package_path = Path("/tmp/daily.apkg")

    with patch.object(
        anki_runner.anki_pipeline, "select_daily_vocab", return_value=unique_daily_vocab
    ) as mock_select, \
         patch.object(anki_runner.anki_pipeline, "build_daily_tag", return_value="2024-01-01") as mock_tag, \
         patch.object(
             anki_runner.anki_pipeline, "build_daily_anki_package_config", return_value=Mock()
         ) as mock_pkg_config, \
         patch.object(
             anki_runner.anki_generator, "generate_anki_package", return_value=fake_package_path
         ) as mock_gen, \
         patch.object(
             anki_runner.anki_pipeline, "build_unique_vocab_updates", return_value={"犬": {}}
         ) as mock_updates, \
         patch.object(
             anki_runner.article_manager, "load_unique_vocab", return_value={}
         ) as mock_load, \
         patch.object(anki_runner.article_manager, "update_unique_vocab") as mock_update, \
         patch.object(anki_runner.article_manager, "save_unique_vocab") as mock_save, \
         patch.object(anki_runner, "_setup_anki_manager") as mock_setup_manager:
        asyncio.run(
            anki_runner.generate_and_deliver_daily_anki_package(
                all_filtered_vocabulary, config
            )
        )

    mock_select.assert_called_once_with(all_filtered_vocabulary, max_words=12)
    mock_tag.assert_called_once()
    mock_pkg_config.assert_called_once_with(config)
    mock_gen.assert_called_once()
    mock_updates.assert_called_once_with(unique_daily_vocab)
    mock_load.assert_called_once_with(config.unique_vocab_json)
    mock_update.assert_called_once()
    mock_save.assert_called_once()
    mock_setup_manager.assert_not_called()


def test_generate_and_deliver_happy_path_with_send():
    config = Mock(no_anki=False, send_anki_to_app=True, unique_vocab_json=Path("/tmp/uv.json"))
    all_filtered_vocabulary = [{"word": "犬"}]
    unique_daily_vocab = [{"word": "犬"}]
    fake_package_path = Path("/tmp/daily.apkg")
    fake_anki_web_manager = MagicMock()

    with patch.object(
        anki_runner.anki_pipeline, "select_daily_vocab", return_value=unique_daily_vocab
    ), \
         patch.object(anki_runner.anki_pipeline, "build_daily_tag", return_value="2024-01-01"), \
         patch.object(
             anki_runner.anki_pipeline, "build_daily_anki_package_config", return_value=Mock()
         ), \
         patch.object(
             anki_runner.anki_generator, "generate_anki_package", return_value=fake_package_path
         ), \
         patch.object(
             anki_runner.anki_pipeline, "build_unique_vocab_updates", return_value={}
         ), \
         patch.object(anki_runner.article_manager, "load_unique_vocab", return_value={}), \
         patch.object(anki_runner.article_manager, "update_unique_vocab"), \
         patch.object(anki_runner.article_manager, "save_unique_vocab"), \
         patch.object(
             anki_runner, "_setup_anki_manager", return_value=fake_anki_web_manager
         ) as mock_setup_manager:
        asyncio.run(
            anki_runner.generate_and_deliver_daily_anki_package(
                all_filtered_vocabulary, config
            )
        )

    mock_setup_manager.assert_called_once_with(config)
    fake_anki_web_manager.import_and_sync.assert_called_once_with(
        str(fake_package_path), with_scheduling=False
    )
