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
            analysis=Mock(),
            all_filtered_vocabulary=all_filtered_vocabulary,
        )

    mock_build.assert_not_called()
    assert all_filtered_vocabulary == []


def test_collect_article_vocab_for_anki_noop_when_no_analysis():
    config = Mock(no_anki=False)
    all_filtered_vocabulary = []

    with patch.object(anki_runner.anki_pipeline, "build_article_vocab_items") as mock_build:
        anki_runner.collect_article_vocab_for_anki(
            article={"title": "Test"},
            config=config,
            analysis=None,
            all_filtered_vocabulary=all_filtered_vocabulary,
        )

    mock_build.assert_not_called()
    assert all_filtered_vocabulary == []


def test_collect_article_vocab_for_anki_extends_pool():
    config = Mock(no_anki=False)
    all_filtered_vocabulary = []
    article = {"title": "Test"}
    analysis = Mock()
    fake_vocab_items = [{"word": "犬"}, {"word": "猫"}]

    with patch.object(
        anki_runner.anki_pipeline, "build_article_vocab_items", return_value=fake_vocab_items
    ) as mock_build:
        anki_runner.collect_article_vocab_for_anki(
            article=article,
            config=config,
            analysis=analysis,
            all_filtered_vocabulary=all_filtered_vocabulary,
        )

    mock_build.assert_called_once_with(article, analysis)
    assert all_filtered_vocabulary == fake_vocab_items


# ---------------------------------------------------------------------------
# _setup_anki_manager
# ---------------------------------------------------------------------------

def test_setup_anki_manager_returns_none_when_no_anki():
    config = Mock(no_anki=True)
    result = anki_runner._setup_anki_manager(config)
    assert result is None


def test_setup_anki_manager_skips_import_when_genanki_missing():
    config = Mock(no_anki=False, send_anki_to_app=True)

    with patch.object(anki_runner.anki_generator, "genanki", None):
        result = anki_runner._setup_anki_manager(config)

    assert result is None
    assert config.send_anki_to_app is False


def test_setup_anki_manager_disables_send_when_ankiwebmanager_missing():
    config = Mock(no_anki=False, send_anki_to_app=True)

    with patch.object(anki_runner.anki_generator, "genanki", object()), \
         patch.object(anki_runner, "AnkiWebManager", None):
        result = anki_runner._setup_anki_manager(config)

    assert result is None
    assert config.send_anki_to_app is False


def test_setup_anki_manager_skips_import_when_env_vars_missing():
    config = Mock(no_anki=False, send_anki_to_app=True)

    with patch.object(anki_runner.anki_generator, "genanki", object()), \
         patch.object(anki_runner, "AnkiWebManager", MagicMock()), \
         patch.object(anki_runner.os, "getenv", return_value=None):
        result = anki_runner._setup_anki_manager(config)

    assert result is None
    assert config.send_anki_to_app is False


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


def _send_patches(gen_return, manager):
    return (
        patch.object(anki_runner.article_manager, "load_unique_vocab", return_value={}),
        patch.object(anki_runner.anki_pipeline, "build_daily_anki_package_config", return_value=Mock()),
        patch.object(anki_runner.anki_generator, "generate_anki_package", return_value=gen_return),
        patch.object(anki_runner.article_manager, "update_unique_vocab", return_value=1),
        patch.object(anki_runner.article_manager, "save_unique_vocab"),
        patch.object(anki_runner, "_setup_anki_manager", return_value=manager),
    )


def test_new_words_recorded_after_successful_import():
    config = Mock(no_anki=False, send_anki_to_app=True, unique_vocab_json=Path("/tmp/uv.json"))
    pool = [{"word": "犬", "article_title": "A"}]
    manager = MagicMock()
    order = []
    manager.import_and_sync.side_effect = lambda *a, **k: order.append("import")

    p = _send_patches(Path("/tmp/daily.apkg"), manager)
    with p[0], p[1], p[2], p[3] as mock_update, p[4] as mock_save, p[5]:
        mock_update.side_effect = lambda *a, **k: order.append("record") or 1
        asyncio.run(anki_runner.generate_and_deliver_daily_anki_package(pool, config))

    assert order == ["import", "record"]
    mock_save.assert_called_once()


def test_new_words_not_recorded_when_import_fails():
    config = Mock(no_anki=False, send_anki_to_app=True, unique_vocab_json=Path("/tmp/uv.json"))
    pool = [{"word": "犬", "article_title": "A"}]
    manager = MagicMock()
    manager.import_and_sync.side_effect = RuntimeError("sync failed")

    p = _send_patches(Path("/tmp/daily.apkg"), manager)
    with p[0], p[1], p[2], p[3] as mock_update, p[4] as mock_save, p[5]:
        asyncio.run(anki_runner.generate_and_deliver_daily_anki_package(pool, config))

    mock_update.assert_not_called()
    mock_save.assert_not_called()


def test_new_words_not_recorded_when_import_cannot_start():
    # e.g. ANKIWEB_USER/PASS missing: _setup_anki_manager returns None
    config = Mock(no_anki=False, send_anki_to_app=True, unique_vocab_json=Path("/tmp/uv.json"))
    pool = [{"word": "犬", "article_title": "A"}]

    p = _send_patches(Path("/tmp/daily.apkg"), None)
    with p[0], p[1], p[2], p[3] as mock_update, p[4] as mock_save, p[5]:
        asyncio.run(anki_runner.generate_and_deliver_daily_anki_package(pool, config))

    mock_update.assert_not_called()
    mock_save.assert_not_called()


# ---------------------------------------------------------------------------
# Known-word filtering in generate_and_deliver_daily_anki_package
# ---------------------------------------------------------------------------

def _daily_package_patches(master, gen_return):
    """Patches shared by the known-word tests (real split/select/update-shaping)."""
    return (
        patch.object(anki_runner.article_manager, "load_unique_vocab", return_value=master),
        patch.object(anki_runner.anki_pipeline, "build_daily_anki_package_config", return_value=Mock()),
        patch.object(anki_runner.anki_generator, "generate_anki_package", return_value=gen_return),
        patch.object(anki_runner.article_manager, "update_unique_vocab"),
        patch.object(anki_runner.article_manager, "save_unique_vocab"),
    )


def test_generate_and_deliver_skips_known_words_and_counts_them():
    config = Mock(no_anki=False, send_anki_to_app=False, unique_vocab_json=Path("/tmp/uv.json"))
    pool = [{"word": "安全", "article_title": "A"}, {"word": "守る", "article_title": "A"}]
    master = {"安全": {"word": "安全", "occurrence_count": 1}}

    p_load, p_cfg, p_gen, p_update, p_save = _daily_package_patches(master, Path("/tmp/daily.apkg"))
    with p_load, p_cfg, p_gen as mock_gen, p_update as mock_update, p_save as mock_save:
        asyncio.run(anki_runner.generate_and_deliver_daily_anki_package(pool, config))

    assert [v["word"] for v in mock_gen.call_args.args[0]] == ["守る"]
    # once for the known word's recurrence counter, once for the new word
    assert mock_update.call_count == 2
    mock_save.assert_called_once()


def test_generate_and_deliver_builds_no_package_when_all_words_known():
    config = Mock(no_anki=False, send_anki_to_app=True, unique_vocab_json=Path("/tmp/uv.json"))
    pool = [{"word": "安全", "article_title": "A"}]
    master = {"安全": {"word": "安全", "occurrence_count": 1}}

    p_load, p_cfg, p_gen, p_update, p_save = _daily_package_patches(master, Path("/tmp/daily.apkg"))
    with p_load, p_cfg, p_gen as mock_gen, p_update as mock_update, p_save as mock_save, \
         patch.object(anki_runner, "_setup_anki_manager") as mock_setup_manager:
        asyncio.run(anki_runner.generate_and_deliver_daily_anki_package(pool, config))

    mock_gen.assert_not_called()
    mock_setup_manager.assert_not_called()
    mock_update.assert_called_once()   # recurrence counter only
    mock_save.assert_called_once()


def test_generate_and_deliver_does_not_record_new_words_when_package_fails():
    config = Mock(no_anki=False, send_anki_to_app=False, unique_vocab_json=Path("/tmp/uv.json"))
    pool = [{"word": "安全", "article_title": "A"}, {"word": "守る", "article_title": "A"}]
    master = {"安全": {"word": "安全", "occurrence_count": 1}}

    p_load, p_cfg, p_gen, p_update, p_save = _daily_package_patches(master, None)
    with p_load, p_cfg, p_gen, p_update as mock_update, p_save:
        asyncio.run(anki_runner.generate_and_deliver_daily_anki_package(pool, config))

    recorded = [[v["word"] for v in call.args[1]] for call in mock_update.call_args_list]
    assert recorded == [["安全"]]


# ---------------------------------------------------------------------------
# Flat Deck Structure Tests
# ---------------------------------------------------------------------------

def test_build_daily_anki_package_config_sets_flat_deck_name():
    from anki_pipeline import build_daily_anki_package_config

    config = Mock(anki_output_dir=Path("/tmp/anki_out"))
    anki_config = build_daily_anki_package_config(config)

    assert anki_config.deck_name == "NHKeasynews"
    assert anki_config.package_name.startswith("nhkeasy_")


def test_anki_generator_respects_deck_name_override():
    import anki_generator
    from anki_generator import AnkiPackageConfig, generate_anki_package

    config = AnkiPackageConfig(
        output_dir=Path("/tmp"),
        package_name="test_pkg",
        deck_name="MyCustomOverriddenDeck",
    )

    vocabulary_list = [{"word": "test_word", "reading": "test_reading", "definition": "test_def"}]

    with patch("anki_generator.get_anki_model") as mock_model, \
         patch("anki_generator._create_anki_note_from_mapped_data") as mock_note, \
         patch("anki_generator.build_generic_anki_package") as mock_build:
        
        mock_note.return_value = MagicMock()
        generate_anki_package(vocabulary_list, config)

        mock_build.assert_called_once()
        called_args, called_kwargs = mock_build.call_args
        assert called_args[1] == "MyCustomOverriddenDeck"


def test_anki_generator_falls_back_to_nested_deck_when_no_override():
    import anki_generator
    from anki_generator import AnkiPackageConfig, generate_anki_package

    config = AnkiPackageConfig(
        output_dir=Path("/tmp"),
        package_name="test_pkg",
        parent_deck="MyParentDeck",
    )

    vocabulary_list = [{"word": "test_word", "reading": "test_reading", "definition": "test_def"}]

    with patch("anki_generator.get_anki_model") as mock_model, \
         patch("anki_generator._create_anki_note_from_mapped_data") as mock_note, \
         patch("anki_generator.build_generic_anki_package") as mock_build:
        
        mock_note.return_value = MagicMock()
        generate_anki_package(vocabulary_list, config)

        mock_build.assert_called_once()
        called_args, called_kwargs = mock_build.call_args
        assert called_args[1] == "MyParentDeck::test_pkg"
