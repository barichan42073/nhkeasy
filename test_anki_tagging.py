import datetime
from unittest.mock import MagicMock, patch

from anki_pipeline import build_daily_tag


def test_build_daily_tag_returns_correct_date():
    """
    Test that build_daily_tag returns the correct date string in the expected format.
    """
    # Mock datetime.now to return a fixed date
    fixed_date = datetime.datetime(
        2023, 10, 26, 10, 30, 0, tzinfo=datetime.timezone.utc
    )
    with patch("anki_pipeline.datetime") as mock_dt:
        mock_dt.now.return_value = fixed_date
        mock_dt.timezone = datetime.timezone  # Ensure timezone is accessible

        # Call the function under test
        daily_tag = build_daily_tag()

        # Assert the returned tag matches the expected format
        expected_tag = f"date-{fixed_date.strftime('%Y%m%d')}"
        assert daily_tag == expected_tag
