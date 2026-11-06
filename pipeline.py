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
import llm
from config import PipelineConfig, parse_arguments
from utils import sanitize_filename

logger = logging.getLogger(__name__)

# Third-party loggers that flood the output at DEBUG.
_NOISY_LOGGERS = ("httpx", "httpcore", "urllib3", "openai", "google_genai", "asyncio")


def setup_logging(verbose: bool = False) -> None:
    """Configures logging once for the whole run. --verbose switches to DEBUG."""
    logging.basicConfig(
        level=logging.DEBUG if verbose else logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
        force=True,
    )
    if verbose:
        # Keep third-party request chatter at INFO (as in a normal run).
        for name in _NOISY_LOGGERS:
            logging.getLogger(name).setLevel(logging.INFO)
        # epub_runner quietens this module to WARNING at import; undo that.
        logging.getLogger("nhkeasier_to_epub").setLevel(logging.DEBUG)


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
    llm_client: llm.LLMClient,
):
    """Processes a single article through all pipeline steps."""
    article_id = article.get("id", article["link"])
    article_title = article.get("title", "Untitled Article")
    logger.info("Processing '%s' (ID: %s).", article_title, article_id)

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
        llm_client,
    )

    _epub_path, _markdown = await epub_runner.process_epub_and_kindle(
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
            state.all_article_metadata_for_index,
        )

    # Vocabulary for Anki comes from the analysis (the same list the page shows).
    anki_runner.collect_article_vocab_for_anki(
        article,
        config,
        analysis,
        state.all_filtered_vocabulary,
    )

    await audio_runner.execute_audio_processing_for_article(
        article,
        config,
        raw_html_content,
        state.newly_processed_article_ids,
        state.generated_slow_files,
    )


def _save_history_if_changed(
    config: PipelineConfig, processed_history: set[str], state: RunState
) -> None:
    """Adds newly processed article IDs to the history and saves it if it grew.

    Called after every article, so a crash later in the run cannot cause
    already-delivered EPUBs to be sent again. Does nothing with --reprocess.
    """
    if config.reprocess:
        return
    new_ids = state.newly_processed_article_ids - processed_history
    if not new_ids:
        return
    processed_history.update(new_ids)
    article_manager.save_processed_history(
        processed_history, config.processed_history_json
    )


async def _process_all_articles(
    articles_to_process: list[dict],
    config: PipelineConfig,
    state: RunState,
    processed_history: set[str],
    llm_client: llm.LLMClient,
):
    """Iterates through and processes each article, saving history after each."""
    for article in articles_to_process:
        try:
            await _process_single_article(
                article,
                config,
                state,
                llm_client,
            )
        except Exception:
            article_title = article.get("title", "Untitled Article")
            logger.exception("Failed to process article '%s'", article_title)
        _save_history_if_changed(config, processed_history, state)


async def main():
    config = parse_arguments()
    setup_logging(config.verbose)

    if config.rebuild_html:
        # Offline: rebuild pages from saved files, before any LLM setup.
        skipped = await html_runner.rebuild_all_article_pages(config)
        if skipped:
            logger.warning(
                "Not rebuilt (old page kept): %s", "; ".join(skipped)
            )
        return

    # Build the LLM client once, up front, so a bad --model spec or a missing
    # API key fails immediately rather than on the first article. --model may
    # be a comma-separated chain; models are tried in order per request.
    llm_client = llm.make_fallback_client(
        llm.parse_model_chain(config.model_name), config.api_key_env
    )
    # One cheap metadata call per model: a mistyped model name stops the run
    # here, and models whose key is rejected are dropped from the chain.
    await llm.preflight(llm_client)

    # Call fetch_rss to ensure articles.json is up-to-date
    fetch_rss.save_feed_data(
        days_back=config.days_back,
        feed_source=config.feed_source,
        output_file=config.articles_json,
    )

    # Ensure unique_vocab.json is valid before any Anki operations that might load it
    article_manager.ensure_valid_unique_vocab_json(config.unique_vocab_json)

    audio_runner.run_audio_preflight_checks(config)

    processed_history = article_manager.load_processed_history(
        config.processed_history_json
    )
    if config.reprocess:
        logger.info(
            "--reprocess: ignoring processed history (it will not be updated) "
            "and skipping Anki."
        )
    articles_to_process, articles_to_process_ids = _load_and_filter_articles(
        config, set() if config.reprocess else processed_history
    )

    if not articles_to_process:
        return

    state = RunState()

    await _process_all_articles(
        articles_to_process,
        config,
        state,
        processed_history,
        llm_client,
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

    # History was saved after each article; this catches anything marked later.
    _save_history_if_changed(config, processed_history, state)
    if state.newly_processed_article_ids and not config.reprocess:
        logger.info(
            "Recorded %d newly processed article(s) in %s.",
            len(state.newly_processed_article_ids),
            config.processed_history_json,
        )

    if state.kindle_sent_count[0] > 0:
        logger.info("Sent %d EPUB(s) to Kindle.", state.kindle_sent_count[0])

    logger.info("Pipeline processing complete.")


if __name__ == "__main__":
    asyncio.run(main())
