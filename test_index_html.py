import json
import unittest
from datetime import datetime, timezone
from pathlib import Path

# Import the new function from html_pipeline
from html_pipeline import compute_index_render_data


class TestComputeIndexRenderData(unittest.TestCase):
    """
    Tests for the compute_index_render_data function in html_pipeline.py.
    """

    def setUp(self):
        """Set up test data before each test."""
        self.current_date = datetime(2023, 1, 3, 15, 0, 0, tzinfo=timezone.utc)
        self.current_date_japanese_full = "2023年01月03日 (火)"
        self.current_date_japanese_title = "2023年01月03日"
        self.current_date_iso = self.current_date.strftime("%Y-%m-%d")

        self.articles_from_current_run_base = [
            {
                "id": "article_id_1",
                "title": "Test Article 1",
                "date": "2023-01-03T10:00:00+00:00",
                "relative_path": "test_article_1.html",
                "image_url": "image1.jpg",
                "kicker": "Kicker 1",
            },
            {
                "id": "article_id_2",
                "title": "Test Article 2",
                "date": "2023-01-02T11:00:00+00:00",
                "relative_path": "test_article_2.html",
                "image_url": "image2.jpg",
                "kicker": "Kicker 2",
            },
        ]

    def test_compute_index_render_data_basic_merge_and_sort(self):
        """
        Verify that compute_index_render_data correctly merges new articles,
        sorts them, and structures the output.
        """
        newly_processed_article_ids = {"article_id_1"}
        articles_from_current_run = [self.articles_from_current_run_base[0]]
        existing_manifest = [self.articles_from_current_run_base[1]]

        result = compute_index_render_data(
            existing_manifest=existing_manifest,
            articles_from_current_run=articles_from_current_run,
            newly_processed_article_ids=newly_processed_article_ids,
            current_date=self.current_date,
            current_date_japanese_full=self.current_date_japanese_full,
            current_date_japanese_title=self.current_date_japanese_title,
        )

        template_data = result["template_data"]
        manifest_for_save = result["manifest_for_save"]

        # Assert template_data structure
        self.assertIsNotNone(template_data["lead_article"])
        self.assertEqual(template_data["lead_article"]["id"], "article_id_1")
        self.assertTrue(template_data["lead_article"]["new"])  # Check 'new' tag for lead

        self.assertEqual(len(template_data["today_grid_articles"]), 0) # Only lead article is from today

        self.assertEqual(len(template_data["older_articles_grouped"]), 1)
        self.assertIn(
            self.articles_from_current_run_base[1]["date_obj"].date(),
            template_data["older_articles_grouped"],
        )
        self.assertEqual(
            template_data["older_articles_grouped"][
                self.articles_from_current_run_base[1]["date_obj"].date()
            ]["articles"][0]["id"],
            "article_id_2",
        )
        # Check 'new' tag for older article
        self.assertFalse(
            template_data["older_articles_grouped"][
                self.articles_from_current_run_base[1]["date_obj"].date()
            ]["articles"][0].get("new", False)
        )

        self.assertEqual(template_data["current_date_japanese"], self.current_date_japanese_full)
        self.assertEqual(template_data["current_date_japanese_title"], self.current_date_japanese_title)
        self.assertEqual(template_data["current_date_iso"], self.current_date_iso)
        self.assertEqual(template_data["current_date_obj"], self.current_date)


        # Assert manifest_for_save structure
        self.assertEqual(len(manifest_for_save), 2)
        self.assertEqual(manifest_for_save[0]["id"], "article_id_1")
        self.assertEqual(manifest_for_save[1]["id"], "article_id_2")
        self.assertNotIn("new", manifest_for_save[0])
        self.assertNotIn("date_obj", manifest_for_save[0])

    def test_compute_index_render_data_with_no_new_articles(self):
        """
        Verify behavior when no new articles are processed in the current run,
        but existing manifest is present.
        """
        newly_processed_article_ids = set()
        articles_from_current_run = []
        existing_manifest = [self.articles_from_current_run_base[1]]

        result = compute_index_render_data(
            existing_manifest=existing_manifest,
            articles_from_current_run=articles_from_current_run,
            newly_processed_article_ids=newly_processed_article_ids,
            current_date=self.current_date,
            current_date_japanese_full=self.current_date_japanese_full,
            current_date_japanese_title=self.current_date_japanese_title,
        )

        template_data = result["template_data"]
        manifest_for_save = result["manifest_for_save"]

        # Lead article should be the latest from existing manifest
        self.assertEqual(template_data["lead_article"]["id"], "article_id_2")
        self.assertFalse(template_data["lead_article"].get("new", False))

        self.assertEqual(len(template_data["today_grid_articles"]), 0)
        self.assertEqual(len(template_data["older_articles_grouped"]), 0) # No older articles relative to the single lead article

        # Manifest should reflect the existing articles
        self.assertEqual(len(manifest_for_save), 1)
        self.assertEqual(manifest_for_save[0]["id"], "article_id_2")

    def test_compute_index_render_data_all_articles_today(self):
        """
        Verify grouping when multiple articles are from the 'current display date'.
        """
        self.current_date = datetime(2023, 1, 3, 15, 0, 0, tzinfo=timezone.utc)
        articles_from_current_run = [
            {
                "id": "article_id_A",
                "title": "Article A",
                "date": "2023-01-03T09:00:00+00:00",
                "relative_path": "a.html",
                "image_url": "imgA.jpg",
                "kicker": "Kicker A",
            },
            {
                "id": "article_id_B",
                "title": "Article B",
                "date": "2023-01-03T11:00:00+00:00",
                "relative_path": "b.html",
                "image_url": "imgB.jpg",
                "kicker": "Kicker B",
            },
            {
                "id": "article_id_C",
                "title": "Article C",
                "date": "2023-01-03T10:30:00+00:00",
                "relative_path": "c.html",
                "image_url": "imgC.jpg",
                "kicker": "Kicker C",
            },
        ]
        newly_processed_article_ids = {"article_id_A", "article_id_B", "article_id_C"}

        result = compute_index_render_data(
            existing_manifest=[],
            articles_from_current_run=articles_from_current_run,
            newly_processed_article_ids=newly_processed_article_ids,
            current_date=self.current_date,
            current_date_japanese_full=self.current_date_japanese_full,
            current_date_japanese_title=self.current_date_japanese_title,
        )

        template_data = result["template_data"]
        # The latest article (B) should be lead
        self.assertEqual(template_data["lead_article"]["id"], "article_id_B")
        self.assertTrue(template_data["lead_article"]["new"])

        # The other two (A and C) should be in today_grid_articles, sorted by date (desc)
        self.assertEqual(len(template_data["today_grid_articles"]), 2)
        self.assertEqual(template_data["today_grid_articles"][0]["id"], "article_id_C") # 10:30
        self.assertEqual(template_data["today_grid_articles"][1]["id"], "article_id_A") # 09:00

        self.assertEqual(len(template_data["older_articles_grouped"]), 0)
        self.assertEqual(len(result["manifest_for_save"]), 3)


    def test_compute_index_render_data_with_no_articles_at_all(self):
        """
        Verify behavior when no articles are available, neither existing nor new.
        """
        newly_processed_article_ids = set()
        articles_from_current_run = []
        existing_manifest = []

        result = compute_index_render_data(
            existing_manifest=existing_manifest,
            articles_from_current_run=articles_from_current_run,
            newly_processed_article_ids=newly_processed_article_ids,
            current_date=self.current_date,
            current_date_japanese_full=self.current_date_japanese_full,
            current_date_japanese_title=self.current_date_japanese_title,
        )

        template_data = result["template_data"]
        manifest_for_save = result["manifest_for_save"]

        self.assertIsNone(template_data["lead_article"])
        self.assertEqual(template_data["today_grid_articles"], [])
        self.assertEqual(template_data["older_articles_grouped"], [])
        self.assertEqual(template_data["current_date_japanese"], self.current_date_japanese_full)
        self.assertEqual(template_data["current_date_japanese_title"], self.current_date_japanese_title)
        self.assertEqual(template_data["current_date_iso"], self.current_date_iso)
        self.assertEqual(template_data["current_date_obj"], self.current_date)

        self.assertEqual(manifest_for_save, [])


# This allows running the tests directly from the command line
if __name__ == "__main__":
    unittest.main()
