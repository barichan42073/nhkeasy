import datetime
from unittest.mock import MagicMock, patch

from anki_pipeline import extract_and_generate_anki_for_article
from config import PipelineConfig


@patch("anki_generator.genanki")
@patch("anki_generator.build_generic_anki_package", return_value=None)
def test_anki_card_creation_date_tag(mock_build_package, mock_genanki_module):
    """
    Test that Anki cards are tagged with the correct creation date.
    """
    # Set up mocks for genanki.Note, genanki.Model, genanki.Package on the mocked genanki module
    # This allows the test to proceed even if genanki is not installed in the environment
    # and anki_generator.py sets genanki = None.
    mock_note_class = MagicMock()
    mock_model_class = MagicMock()
    mock_package_class = MagicMock()

    mock_genanki_module.Note = mock_note_class
    mock_genanki_module.Model = mock_model_class
    mock_genanki_module.Package = mock_package_class

    # Mock datetime.now to return a fixed date
    fixed_date = datetime.datetime(
        2023, 10, 26, 10, 30, 0, tzinfo=datetime.timezone.utc
    )
    with patch("anki_pipeline.datetime") as mock_dt:
        mock_dt.now.return_value = fixed_date
        mock_dt.timezone = datetime.timezone  # Ensure timezone is accessible

        # Prepare dummy data
        article = {
            "id": "test_id",
            "title": "Test Article",
            "link": "http://example.com/test_id",
        }
        config = PipelineConfig(
            # Required Path arguments
            rss_fetcher_dir=MagicMock(),
            articles_json=MagicMock(),
            processed_history_json=MagicMock(),
            staging_dir=MagicMock(),
            epubs_dir=MagicMock(),
            audio_dir=MagicMock(),
            slow_audio_dir=MagicMock(),
            combined_audio_path=MagicMock(),
            vocab_dir=MagicMock(),
            anki_local_db_path=MagicMock(),
            anki_output_dir=MagicMock(),
            # Required non-Path arguments with sensible defaults for testing
            days_back=0,
            model_name="test-model",
            keep_md=False,
            max_articles=None,
            no_audio=False,
            keep_slow_mp3=False,
            only_slowrecord=False,
            no_anki=False,  # Anki tests should not disable Anki features
            send_anki_to_app=False,
            no_kindle=False,
        )
        article_markdown_content = "# Test Markdown\n- Word: meaning"
        all_filtered_vocabulary = []

        # Call the function that generates Anki cards
        extract_and_generate_anki_for_article(
            article, config, article_markdown_content, all_filtered_vocabulary
        )

        # Assert that genanki.Note was called with the expected tag
        expected_tag = f"date-{fixed_date.strftime('%Y%m%d')}"

        # Check calls made to genanki.Note
        # The note constructor is called inside _create_anki_note_from_mapped_data
        # which is called by generate_anki_package.
        # We expect a call where the 'tags' argument matches our expected_tag.
        mock_note_class.assert_called_once()
        _args, kwargs = mock_note_class.call_args
        assert "tags" in kwargs
        assert kwargs["tags"] == [expected_tag]
