import json
import unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import MagicMock, patch

from jinja_render import render_html_from_json_data
from pipeline import _generate_index_html


class TestGenerateIndexHtml(unittest.IsolatedAsyncioTestCase):
    """
    Tests for the _generate_index_html function in pipeline.py.
    """

    def setUp(self):
        """Set up test data and mocks before each test."""
        self.smartreader_output_dir = Path("./temp_output_for_test")
        self.newly_processed_article_ids = {"article_id_1"}
        self.articles_from_current_run = [
            {
                "id": "article_id_1",
                "title": "Test Article 1",
                "date": "2023-01-01T10:00:00+00:00",
                "relative_path": "test_article_1.html",
            },
            {
                "id": "article_id_2",
                "title": "Test Article 2",
                "date": "2023-01-02T11:00:00+00:00",
                "relative_path": "test_article_2.html",
            },
        ]
        self.current_date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

        # Mock Path.mkdir for directory creation
        self.mock_mkdir = patch.object(Path, "mkdir", MagicMock()).start()
        # Mock Path.write_text for file writing
        self.mock_write_text = patch.object(Path, "write_text", MagicMock()).start()
        # Mock Path.is_file
        self.mock_is_file = patch.object(
            Path, "is_file", MagicMock(return_value=False)
        ).start()
        # Mock Path.read_text
        self.mock_read_text = patch.object(
            Path, "read_text", MagicMock(return_value="[]")
        ).start()

    def tearDown(self):
        """Clean up mocks after each test."""
        patch.stopall()

    async def test_generate_index_html_creates_directory_and_file(self):
        """
        Verify that _generate_index_html creates the output directory
        and writes the index.html file with correct content.
        """
        await _generate_index_html(
            self.smartreader_output_dir,
            self.newly_processed_article_ids,
            self.articles_from_current_run,
        )

        # Assert that the output directory was created
        self.mock_mkdir.assert_called_once_with(parents=True, exist_ok=True)

        # Assert that jinja_render.render_html_from_json_data was called
        # The first call to write_text is for index.html, the second for the manifest.
        self.assertEqual(self.mock_write_text.call_count, 2)

        # Verify index.html content write
        expected_data = {
            "new_articles": [self.articles_from_current_run[0]],
            "older_articles_grouped": {
                "2023-01-02": [self.articles_from_current_run[1]]
            },
            "current_date": self.current_date_str,
        }
        self.mock_write_text.assert_any_call(
            render_html_from_json_data(
                data=expected_data,
                template_dir=Path(__file__).parent / "templates",
                template_filename="smartreader_index.html",
            ),
            encoding="utf-8",
        )

        # Verify manifest.json content write (checking for article_id_1 and article_id_2)
        written_manifest_content = self.mock_write_text.call_args_list[1].args[0]
        self.assertIn('"id": "article_id_1"', written_manifest_content)
        self.assertIn('"id": "article_id_2"', written_manifest_content)

    async def test_generate_index_html_with_no_articles_in_run(self):
        """
        Verify behavior when no articles are passed for processing in the current run,
        but existing manifest is empty.
        """
        await _generate_index_html(
            self.smartreader_output_dir,
            set(),
            [],
        )
        self.mock_mkdir.assert_called_once_with(parents=True, exist_ok=True)
        # Should still try to render the template and write the file
        self.assertEqual(self.mock_write_text.call_count, 2)

        # Verify index.html content (empty lists)
        expected_data = {
            "new_articles": [],
            "older_articles_grouped": {},
            "current_date": self.current_date_str,
        }
        self.mock_write_text.assert_any_call(
            render_html_from_json_data(
                data=expected_data,
                template_dir=Path(__file__).parent / "templates",
                template_filename="smartreader_index.html",
            ),
            encoding="utf-8",
        )

        # Verify manifest.json content (empty list)
        written_manifest_content = self.mock_write_text.call_args_list[1].args[0]
        self.assertEqual(written_manifest_content, "[]")

    async def test_generate_index_html_loads_existing_manifest(self):
        """
        Verify that _generate_index_html correctly loads and merges with an existing manifest.
        """
        self.mock_is_file.return_value = True
        existing_manifest_data = [
            {
                "id": "article_id_old",
                "title": "Old Article",
                "date": "2022-12-01T09:00:00+00:00",
                "relative_path": "old_article.html",
            }
        ]
        self.mock_read_text.return_value = json.dumps(existing_manifest_data)

        articles_from_current_run = [
            {
                "id": "article_id_new",
                "title": "New Article",
                "date": "2023-01-03T12:00:00+00:00",
                "relative_path": "new_article.html",
            }
        ]
        newly_processed_article_ids = {"article_id_new"}

        await _generate_index_html(
            self.smartreader_output_dir,
            newly_processed_article_ids,
            articles_from_current_run,
        )

        # Assert that existing manifest was read
        self.mock_read_text.assert_called_once()

        # Verify index.html content
        expected_data = {
            "new_articles": [articles_from_current_run[0]],
            "older_articles_grouped": {"2022-12-01": [existing_manifest_data[0]]},
            "current_date": self.current_date_str,
        }
        self.mock_write_text.assert_any_call(
            render_html_from_json_data(
                data=expected_data,
                template_dir=Path(__file__).parent / "templates",
                template_filename="smartreader_index.html",
            ),
            encoding="utf-8",
        )

        # Verify manifest.json content
        written_manifest_content = self.mock_write_text.call_args_list[1].args[0]
        self.assertIn('"id": "article_id_old"', written_manifest_content)
        self.assertIn('"id": "article_id_new"', written_manifest_content)


# This allows running the tests directly from the command line
if __name__ == "__main__":
    unittest.main()
