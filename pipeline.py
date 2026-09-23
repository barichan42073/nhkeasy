import asyncio
import logging
import sys
from dataclasses import dataclass, field
from pathlib import Path

# local imports
import anki_runner
import analysis_runner
import article_fetch_runner
import article_manager
import audio_runner
import epub_runner
import fetch_rss
import html_runner
from config import PipelineConfig, parse_arguments
from utils import sanitize_filename

logger = logging.getLogger(__name__)


@dataclass
class RunState:
    """Holds dynamic state accumulated during a single pipeline run."""

    newly_processed_article_ids: set[str] = field(default_factory=set)
    all_filtered_vocabulary: list[dict[str, str]] = field(default_factory=list)
    generated_slow_files: list[Path] = field(default_factory=list)
    all_article_metadata_for_index: list[dict] = field(default_factory=list)
    kindle_sent_count: list[int] = field(default_factory=lambda: [0])


def _load_and_filter_articles(
    config: PipelineConfig, processed_history: set[str]
) -> tuple[list[dict], set[str]]:
    """Loads articles from RSS fetcher JSON and filters them."""
    if not config.articles_json.is_file():
        logger.error(
            "Articles file not found at: %s. Please run fetch_rss.py first.",
            config.articles_json,
        )
        sys.exit(1)

    all_articles = article_manager.load_articles(config.articles_json)
    articles_to_process = article_manager.filter_new_articles(
        all_articles, processed_history, config.cutoff_date
    )

    if config.max_articles:
        articles_to_process = articles_to_process[: config.max_articles]
        logger.info(
            "Capped articles to process at %d as per --max-articles.",
            config.max_articles,
        )

    if not articles_to_process:
        logger.info("No new articles eligible for processing.")
        return [], set()

    logger.info("Found %d new articles to process.", len(articles_to_process))
    return articles_to_process, {
        a.get("id", a["link"]) for a in articles_to_process
    }


async def _process_single_article(
    article: dict,
    config: PipelineConfig,
    state: RunState,
    existing_unique_vocab: dict[str, dict],
):
    """Processes a single article through all pipeline steps."""
    article_id = article.get("id", article["link"])
    article_title = article.get("title", "Untitled Article")
    pub_date_str = article.get("published", "N/A")
    logger.info(
        "Eligible for processing: '%s' (ID: %s) - published %s.",
        article_title,
        article_id,
        pub_date_str,
    )

    raw_html_content, article_text_for_gemini = (
        await article_fetch_runner.fetch_and_stage_article_html(article, config)
    )

    if not raw_html_content or not article_text_for_gemini:
        return

    analysis_json_filename = (
        f"{sanitize_filename(article_title)}_{sanitize_filename(article_id)}_analysis.json"
    )
    analysis_json_path = config.smartreader_dir / analysis_json_filename

    analysis = await analysis_runner.get_article_analysis(
        article_text_for_gemini,
        analysis_json_path,
        config.use_staged_analysis,
        article_title,
    )

    _epub_path, article_markdown_content = await epub_runner.process_epub_and_kindle(
        article,
        config,
        raw_html_content,
        analysis,
        state.newly_processed_article_ids,
        state.kindle_sent_count,
    )

    if config.generate_html:
        await html_runner.write_article_html_output(
            article,
            raw_html_content,
            analysis,
            config,
            state.all_filtered_vocabulary,
            state.all_article_metadata_for_index,
        )

    anki_runner.collect_article_vocab_for_anki(
        article,
        config,
        article_markdown_content,
        existing_unique_vocab,
        state.all_filtered_vocabulary,
    )

    await audio_runner.execute_audio_processing_for_article(
        article,
        config,
        raw_html_content,
        state.newly_processed_article_ids,
        state.generated_slow_files,
    )


async def _process_all_articles(
    articles_to_process: list[dict],
    config: PipelineConfig,
    state: RunState,
    existing_unique_vocab: dict[str, dict],
):
    """Iterates through and processes each article."""
    for article in articles_to_process:
        try:
            await _process_single_article(
                article,
                config,
                state,
                existing_unique_vocab,
            )
        except Exception:
            article_title = article.get("title", "Untitled Article")
            logger.exception("Failed to process article '%s'", article_title)


async def main():
    config = parse_arguments()

    # Call fetch_rss to ensure articles.json is up-to-date
    fetch_rss.save_feed_data(days_back=config.days_back, feed_source=config.feed_source)

    # Ensure unique_vocab.json is valid before any Anki operations that might load it
    article_manager.ensure_valid_unique_vocab_json(config.unique_vocab_json)

    audio_runner.run_audio_preflight_checks(config)

    processed_history = article_manager.load_processed_history(
        config.processed_history_json
    )
    articles_to_process, articles_to_process_ids = _load_and_filter_articles(
        config, processed_history
    )

    if not articles_to_process:
        return

    # Load the master unique-vocab store once for the whole run.
    existing_unique_vocab = article_manager.load_unique_vocab(
        config.unique_vocab_json
    )

    state = RunState()

    await _process_all_articles(
        articles_to_process,
        config,
        state,
        existing_unique_vocab,
    )

    if config.generate_html:
        await html_runner.write_smartreader_index(
            config=config,
            newly_processed_article_ids=state.newly_processed_article_ids,
            articles_from_current_run=state.all_article_metadata_for_index,
        )

    # Generate combined Anki package for the daily pool and update unique_vocab.json ONCE
    await anki_runner.generate_and_deliver_daily_anki_package(
        state.all_filtered_vocabulary, config
    )

    # Combined Audio creation, followed by delivery (sequenced by the orchestrator)
    combined_audio_path = await audio_runner.combine_and_export_audio(
        state.generated_slow_files, config
    )
    if combined_audio_path:
        await audio_runner.deliver_combined_audio(combined_audio_path, config)

    # Update processed history JSON
    if state.newly_processed_article_ids:
        processed_history.update(state.newly_processed_article_ids)
        article_manager.save_processed_history(
            processed_history, config.processed_history_json
        )
        logger.info(
            "Updated processed history: %d entries in %s.",
            len(state.newly_processed_article_ids),
            config.processed_history_json,
        )

    if state.kindle_sent_count[0] > 0:
        logger.info("Sent %d EPUB(s) to Kindle.", state.kindle_sent_count[0])

    logger.info("Pipeline processing complete.")


if __name__ == "__main__":
    asyncio.run(main())
