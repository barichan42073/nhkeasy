import unittest
from datetime import datetime, timezone
from pathlib import Path

from bs4 import BeautifulSoup  # Optional, for more robust HTML parsing

from jinja_render import render_html_from_json_data


class TestSmartReaderIndexRendering(unittest.TestCase):
    def setUp(self):
        self.template_dir = Path(__file__).parent / "templates"
        self.maxDiff = None  # Allows full diff for long strings in assertions

        today_date = datetime(2026, 11, 25, 9, 0, 0, tzinfo=timezone.utc)
        yesterday_date = datetime(2026, 11, 24, tzinfo=timezone.utc)

        # Mock raw article data
        self.mock_articles_raw = [
            {
                "id": "article1_today",
                "title": "最新記事のタイトル１",
                "date": datetime(2026, 11, 25, 10, 0, 0, tzinfo=timezone.utc),
                "relative_path": "article1_output.html",
                "image_url": "https://example.com/image1.jpg",
                "kicker": "最新記事のキッカー１",
            },
            {
                "id": "article2_today",
                "title": "最新記事のタイトル２",
                "date": datetime(2026, 11, 25, 11, 0, 0, tzinfo=timezone.utc),
                "relative_path": "article2_output.html",
                "image_url": "https://example.com/image2.jpg",
                "kicker": "最新記事のキッカー２",
            },
            {
                "id": "article3_today",
                "title": "最新記事のタイトル３",
                "date": datetime(2026, 11, 25, 12, 0, 0, tzinfo=timezone.utc),
                "relative_path": "article3_output.html",
                "image_url": "https://example.com/image3.jpg",
                "kicker": "最新記事のキッカー３",
            },
            {
                "id": "article4_yesterday",
                "title": "古い記事のタイトル４",
                "date": datetime(2026, 11, 24, 15, 30, 0, tzinfo=timezone.utc),
                "relative_path": "article4_output.html",
                "image_url": "",
                "kicker": "古い記事のキッカー４",
            },
            {
                "id": "article5_yesterday",
                "title": "古い記事のタイトル５",
                "date": datetime(2026, 11, 24, 9, 0, 0, tzinfo=timezone.utc),
                "relative_path": "article5_output.html",
                "image_url": "",
                "kicker": "古い記事のキッカー５",
            },
        ]
        self.mock_current_date = today_date # The "main article date" for comparison (fixed for 2026-11-25)

        # --- Prepare data for template based on new logic (mimicking pipeline.py) ---
        sorted_articles = sorted(self.mock_articles_raw, key=lambda x: x["date"], reverse=True)

        lead_article = sorted_articles[0] if sorted_articles else None
        
        current_display_date = self.mock_current_date.date() # Ensure this is used consistently

        today_grid_articles = []
        older_articles_grouped_dict = {}

        for article in sorted_articles:
            temp_article_data = article.copy()
            # Ensure the 'date' field in temp_article_data is the datetime object for template use
            temp_article_data["date"] = article["date"]

            if lead_article and temp_article_data["id"] == lead_article["id"]:
                # Ensure lead_article also uses the datetime object
                lead_article = temp_article_data
                continue # Skip lead article, already processed

            if temp_article_data["date"].date() == current_display_date:
                today_grid_articles.append(temp_article_data)
            else:
                article_date_key = temp_article_data["date"].date()
                if article_date_key not in older_articles_grouped_dict:
                    older_articles_grouped_dict[article_date_key] = {
                        "date_japanese": temp_article_data["date"].strftime('%Y年%m月%d日'),
                        "articles": []
                    }
                older_articles_grouped_dict[article_date_key]["articles"].append(temp_article_data)

        # Sort today's grid articles by date (time) descending
        today_grid_articles = sorted(today_grid_articles, key=lambda x: x["date"], reverse=True)

        # Convert grouped dict to sorted list for template iteration
        older_articles_grouped_list = []
        for date_key in sorted(older_articles_grouped_dict.keys(), reverse=True): # Sort dates descending
            group = older_articles_grouped_dict[date_key]
            group["articles"] = sorted(group["articles"], key=lambda x: x["date"], reverse=True) # Sort articles by time descending
            older_articles_grouped_list.append(group)


        self.mock_template_data = {
            "lead_article": lead_article,
            "today_grid_articles": today_grid_articles,
            "older_articles_grouped": older_articles_grouped_list,
            "current_date_japanese": self.mock_current_date.strftime("%Y年%m月%d日"),
            "current_date_japanese_title": self.mock_current_date.strftime("%Y年%m月%d日"),
            "current_date_iso": self.mock_current_date.strftime("%Y-%m-%d"),
            "current_date_obj": self.mock_current_date, # Pass datetime object for comparison
        }

    def test_index_html_renders_correctly(self):
        rendered_html = render_html_from_json_data(
            data=self.mock_template_data,
            template_dir=self.template_dir,
            template_filename="smartreader_index.html",
        )

        output_path = Path(__file__).parent / "temp_smartreader_index_output.html"
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(rendered_html)
        print(f"\nRendered HTML saved to: {output_path}")

        soup = BeautifulSoup(rendered_html, "html.parser")

        # Check overall structure and header dates
        self.assertEqual(soup.title.string, "NHK Easy News — 2026年11月25日")
        self.assertIn("2026年11月25日</div>", str(soup.find("header")))
        self.assertIn("Stories: NHK News Web Easy, 2026-11-25。", str(soup.find("footer")))

        # Check lead article (should be article3_today as it has the latest timestamp)
        lead_article_soup = soup.find("a", class_="lead")
        self.assertIsNotNone(lead_article_soup)
        self.assertIn("最新記事のキッカー３", str(lead_article_soup))
        self.assertIn("<h1>最新記事のタイトル３</h1>", str(lead_article_soup))
        self.assertIn('div class="article-date">2026年11月25日 12時00分</div>', str(lead_article_soup))
        self.assertIn('src="https://example.com/image3.jpg"', str(lead_article_soup.find("img")))

        # Check today's grid articles (should be 2: article2_today then article1_today, sorted by date descending)
        grid_articles = soup.select("section.grid a.card")
        self.assertEqual(len(grid_articles), 2)
        # Expected order: article2_today (11:00) then article1_today (10:00)
        self.assertIn("最新記事のタイトル２", str(grid_articles[0]))
        self.assertIn('div class="article-date">2026年11月25日 11時00分</div>', str(grid_articles[0]))
        self.assertIn('src="https://example.com/image2.jpg"', str(grid_articles[0].find("img")))

        self.assertIn("最新記事のタイトル１", str(grid_articles[1]))
        self.assertIn('div class="article-date">2026年11月25日 10時00分</div>', str(grid_articles[1]))
        self.assertIn('src="https://example.com/image1.jpg"', str(grid_articles[1].find("img")))

        # Check older articles section
        older_articles_section = soup.find("section", class_="older-articles")
        self.assertIsNotNone(older_articles_section)
        self.assertIn("<h2>Older Articles</h2>", str(older_articles_section))

        # Check older article date groups
        date_groups = older_articles_section.find_all("h3")
        self.assertEqual(len(date_groups), 1) # Expect one older date group: 24th
        self.assertEqual(date_groups[0].text, "2026年11月24日")

        # Check articles within the older date group (24th)
        older_articles_table_group1 = date_groups[0].find_next_sibling("table")
        self.assertIsNotNone(older_articles_table_group1) # Ensure table is found
        table_rows_group1 = older_articles_table_group1.find_all("tr")
        self.assertEqual(len(table_rows_group1), 2) # Expect 2 rows (articles) for 24th

        # First article in the older group
        first_older_article_title_link = table_rows_group1[0].find("td").find("a")
        self.assertIsNotNone(first_older_article_title_link)
        self.assertEqual(first_older_article_title_link.text, "古い記事のタイトル４")
        self.assertFalse(table_rows_group1[0].find_all("td")[1:]) # Ensure no extra cells for date/time
        self.assertIsNone(table_rows_group1[0].find("img")) # No images for older articles in table

        # Second article in the older group
        second_older_article_title_link = table_rows_group1[1].find("td").find("a")
        self.assertIsNotNone(second_older_article_title_link)
        self.assertEqual(second_older_article_title_link.text, "古い記事のタイトル５")
        self.assertFalse(table_rows_group1[1].find_all("td")[1:]) # Ensure no extra cells for date/time
        self.assertIsNone(table_rows_group1[1].find("img")) # No images for older articles in table


if __name__ == "__main__":
    unittest.main()
