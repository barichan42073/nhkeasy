"""
Configuration module for the NHK Easy News pipeline.

This module defines a dataclass for pipeline configuration parameters
and a function to parse command-line arguments.
"""

import argparse
import os
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path


@dataclass
class PipelineConfig:
    """
    Configuration parameters for the NHK Easy News processing pipeline.
    """

    nhkeasy_dir: Path
    feed_dir: Path
    articles_json: Path
    processed_history_json: Path
    unique_vocab_json: Path
    staging_dir: Path
    epubs_dir: Path
    audio_dir: Path
    slow_audio_dir: Path
    combined_audio_path: Path
    vocab_dir: Path
    anki_local_db_path: Path
    days_back: int
    model_name: str
    keep_md: bool
    max_articles: int | None
    no_audio: bool
    keep_slow_mp3: bool
    only_slowrecord: bool
    no_anki: bool
    anki_output_dir: Path
    send_anki_to_app: bool
    no_kindle: bool
    rss_fetcher_dir: Path | None = None
    generate_html: bool = True
    html_template_path: Path = Path("template.html")
    html_output_dir: Path = Path("html_output")
    smartreader_dir: Path = Path("smartreader")
    use_staged_analysis: bool = False
    verbose: bool = False
    kindle_email: str = os.getenv("KINDLE_EMAIL", "")
    combined_mp3_email: str = os.getenv("COMBINED_MP3_EMAIL", "")
    feed_source: str | None = None

    @property
    def cutoff_date(self) -> datetime:
        """Calculates the cutoff datetime based on days_back."""
        if self.days_back == 0:
            today = datetime.now(timezone.utc).date()
            return datetime(today.year, today.month, today.day, tzinfo=timezone.utc)
        return datetime.now(timezone.utc) - timedelta(days=self.days_back)

    @property
    def send_to_kindle(self) -> bool:
        """Helper property for Kindle sending status."""
        return not self.no_kindle

    def __post_init__(self):
        """Ensure all necessary directories exist after initialization."""
        if self.rss_fetcher_dir is None:
            self.rss_fetcher_dir = self.nhkeasy_dir
        self.nhkeasy_dir.mkdir(parents=True, exist_ok=True)
        self.feed_dir.mkdir(parents=True, exist_ok=True)
        self.staging_dir.mkdir(parents=True, exist_ok=True)
        self.epubs_dir.mkdir(parents=True, exist_ok=True)
        self.audio_dir.mkdir(parents=True, exist_ok=True)
        self.slow_audio_dir.mkdir(parents=True, exist_ok=True)
        self.vocab_dir.mkdir(parents=True, exist_ok=True)
        self.anki_local_db_path.parent.mkdir(parents=True, exist_ok=True)
        self.html_output_dir.mkdir(parents=True, exist_ok=True)
        self.smartreader_dir.mkdir(parents=True, exist_ok=True)


def parse_arguments() -> PipelineConfig:
    """Parses command-line arguments and returns a PipelineConfig object."""
    parser = argparse.ArgumentParser(
        description="Process new NHK Easy articles from RSS feed into EPUBs."
    )
    parser.add_argument(
        "--days-back",
        type=int,
        default=0,
        help="Number of days back from today to consider articles as 'new'. "
        "Set to 0 for today only.",
    )
    parser.add_argument(
        "--feed-source",
        type=str,
        default=None,
        help="Path to a local RSS file or a custom feed URL.",
    )
    parser.add_argument(
        "--model",
        default="gemini-2.5-flash",
        dest="model_name",
        help="Specify the Gemini model to use (default: gemini-2.5-flash).",
    )
    parser.add_argument(
        "--keep-md",
        action="store_true",
        help="Keep the intermediate .md file after conversion.",
    )
    parser.add_argument(
        "--max-articles",
        type=int,
        default=None,
        help="Maximum number of eligible articles to process.",
    )
    parser.add_argument(
        "--no-audio",
        action="store_true",
        help="Skip generation of slowed-down audio MP3s.",
    )
    parser.add_argument(
        "--keep-slow-mp3",
        action="store_true",
        help="Keep per-article slowed MP3 files.",
    )
    parser.add_argument(
        "--only-slowrecord",
        action="store_true",
        help="Only generate slowed-down audio MP3s.",
    )
    parser.add_argument(
        "--no-anki",
        action="store_true",
        help="Skip Anki package generation.",
    )
    parser.add_argument(
        "--anki-output-dir",
        type=Path,
        default=None,
        help="Directory to save Anki packages.",
    )
    parser.add_argument(
        "--no-anki-import",
        action="store_false",
        dest="send_anki_to_app",
        default=True,
        help="Do not automatically import generated Anki packages.",
    )
    parser.add_argument(
        "--no-kindle",
        action="store_true",
        help="Do not send generated EPUBs to Kindle.",
    )
    parser.add_argument(
        "--generate-html",
        type=lambda x: x.lower() == "true",
        nargs="?",
        const=True,
        default=True,
        help="Generate interactive HTML pages.",
    )
    parser.add_argument(
        "--html-template",
        type=Path,
        default=Path("template.html"),
        help="Path to the Jinja2 template for HTML generation.",
    )
    parser.add_argument(
        "--html-output-dir",
        type=Path,
        default=Path("html_output"),
        help="Directory to save generated HTML files.",
    )
    parser.add_argument(
        "--use-staged-analysis",
        action="store_true",
        help="Use existing staged analysis JSON files if available.",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable verbose logging.",
    )
    args = parser.parse_args()

    nhkeasy_dir = Path.home() / ".local" / "share" / "nhkeasy"
    feed_dir = nhkeasy_dir / "feed"
    epubs_dir = nhkeasy_dir / "epubs"

    if args.anki_output_dir is None:
        args.anki_output_dir = epubs_dir

    return PipelineConfig(
        nhkeasy_dir=nhkeasy_dir,
        feed_dir=feed_dir,
        articles_json=feed_dir / "articles.json",
        processed_history_json=feed_dir / "processed_history.json",
        unique_vocab_json=nhkeasy_dir / "vocabulary" / "unique_vocab.json",
        staging_dir=nhkeasy_dir / "staging",
        epubs_dir=epubs_dir,
        audio_dir=nhkeasy_dir / "audio",
        slow_audio_dir=nhkeasy_dir / "slow_audio",
        combined_audio_path=nhkeasy_dir / "combined_slowed.mp3",
        vocab_dir=nhkeasy_dir / "vocabulary",
        anki_local_db_path=Path(
            os.getenv(
                "ANKI_LOCAL_DATA",
                "/home/nev/pyprojects/data/local_anki_data/collection.anki2",
            )
        ),
        days_back=args.days_back,
        model_name=args.model_name,
        keep_md=args.keep_md,
        max_articles=args.max_articles,
        no_audio=args.no_audio,
        keep_slow_mp3=args.keep_slow_mp3,
        only_slowrecord=args.only_slowrecord,
        no_anki=args.no_anki,
        anki_output_dir=args.anki_output_dir,
        send_anki_to_app=args.send_anki_to_app,
        no_kindle=args.no_kindle,
        generate_html=args.generate_html,
        html_template_path=args.html_template,
        html_output_dir=nhkeasy_dir / "html_output",
        smartreader_dir=nhkeasy_dir / "smartreader",
        use_staged_analysis=args.use_staged_analysis,
        verbose=args.verbose,
        feed_source=args.feed_source,
    )
