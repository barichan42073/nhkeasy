import asyncio
import json
import locale
import logging
import os
import platform
import shutil
import smtplib
import sys
from datetime import datetime, timezone
from pathlib import Path

import pydub.exceptions as pydub_exceptions
import requests
from pydub import AudioSegment

# local imports
import anki_generator
import anki_pipeline
import article_manager
import audio_pipeline
import fetch_rss
import html_pipeline
import nhkeasier_to_epub
import send_to_kindle
from article_schema import ArticleAnalysis
from config import PipelineConfig, parse_arguments
from geminimodels import GeminiModels
from jinja_render import render_html_from_json_data
from utils import download_mp3, sanitize_filename

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Imperative Shell: optional dependency / environment wiring.
#
# All environment probing (module imports that depend on external, optional
# packages living outside this project) lives here rather than in the
# functional-core modules, since import resolution and sys.path mutation are
# process-level side effects.
# ---------------------------------------------------------------------------

AVLIB_PATH = Path(__file__).resolve().parent.parent / "avlib" / "avlib"
if str(AVLIB_PATH) not in sys.path:
    sys.path.insert(0, str(AVLIB_PATH))

try:
    import slowrecord
except ImportError:
    logger.error("Could not import slowrecord.")
    slowrecord = None

PYLIBS_PATH = Path("/home/nev/pylibs")
if str(PYLIBS_PATH) not in sys.path:
    sys.path.insert(0, str(PYLIBS_PATH))

AnkiWebManager = None
try:
    from my_anki.anki_sync_lib import AnkiWebManager
except ImportError:
    logger.warning(
        "Could not import 'AnkiWebManager' from 'my_anki.anki_sync_lib'. "
        "AnkiWeb synchronization will be disabled."
    )


def _ensure_valid_unique_vocab_json(path: Path):
    """Ensures the unique vocabulary JSON file exists and contains valid JSON."""
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text("{}", encoding="utf-8")
        logger.info("Created empty unique vocabulary file at: %s", path)
        return

    if path.stat().st_size == 0:
        path.write_text("{}", encoding="utf-8")
        logger.info("Unique vocabulary file at %s was empty, initialized to '{}'.", path)
        return

    try:
        with open(path, "r", encoding="utf-8") as f:
            json.load(f)
    except json.JSONDecodeError:
        logger.warning(
            "Unique vocabulary file at %s is corrupted. Resetting to '{}'.", path
        )
        path.write_text("{}", encoding="utf-8")
    except Exception as e:
        logger.warning(
            "Unexpected error checking unique vocabulary file at %s: %s. Resetting to '{}'.",
            path,
            e,
        )
        path.write_text("{}", encoding="utf-8")


async def analyze_article_with_gemini(raw_article_text: str) -> ArticleAnalysis:
    """
    Calls the Gemini API using the defined Structured Output schema to generate a structured analysis.
    Uses GeminiModels to get the model.
    """
    model = GeminiModels.get_model(
        system_instruction=(
            "You are an expert Japanese translator and language analyst specializing in NHK Easy News. "
            "Analyze the provided text and strictly output JSON conforming to the requested schema. "
            "IMPORTANT: Output MUST be valid JSON, containing NO Markdown code block wrapping (e.g., ```json)."
        ),
        response_schema=ArticleAnalysis,
    )

    prompt = (
        "Perform a complete structural analysis of the following NHK Easy News article.\n"
        "1. Reconstruct full article HTML structure.\n"
        "2. Break down every sentence with hiragana readings, English translations, and precise word mappings.\n"
        "3. Provide a side vocabulary table.\n\n"
        f"Article Text:\n{raw_article_text}"
    )

    response = await model.generate_content_async(prompt)
    logger.debug("Raw Response Text from Gemini:\n%s", response.text)

    analysis = ArticleAnalysis.model_validate_json(response.text)
    return analysis


async def _fetch_and_stage_article_html(
    article: dict, config: PipelineConfig
) -> tuple[str | None, str | None]:
    """Fetches raw HTML for an article and saves it locally."""
    article_id = article.get("id", article["link"])
    article_title = article.get("title", "Untitled Article")
    logger.info("Fetching lightweight HTML from %s via httpx...", article["link"])

    raw_html_content = await nhkeasier_to_epub.fetch_article_html(
        article["link"]
    )
    if not raw_html_content:
        logger.warning(
            "Failed to fetch HTML content for '%s'. Skipping article.",
            article_title,
        )
        return None, None

    (
        _article_title_from_html,
        article_text_for_gemini,
        extracted_image_url_from_html,
    ) = nhkeasier_to_epub.extract_article_content_from_html(
        raw_html_content, base_url=article["link"]
    )

    if extracted_image_url_from_html and not article.get("image_url"):
        article["image_url"] = extracted_image_url_from_html

    staged_text_filename = (
        f"{sanitize_filename(article_title)}_{sanitize_filename(article_id)}.txt"
    )
    staged_text_path = config.smartreader_dir / staged_text_filename
    try:
        staged_text_path.write_text(article_text_for_gemini, encoding="utf-8")
        logger.debug(
            "Saved exact text payload sent to Gemini -> '%s'",
            staged_text_filename,
        )
    except OSError:
        logger.exception("Failed to save staged text file to %s", staged_text_path)

    return raw_html_content, article_text_for_gemini


async def _process_epub_and_kindle(
    article: dict,
    config: PipelineConfig,
    raw_html_content: str,
    analysis: ArticleAnalysis,
    newly_processed_article_ids: set[str],
    kindle_sent_count: list[int],
) -> tuple[Path | None, str | None]:
    """Generates EPUB, sends to Kindle if configured, and returns article markdown content."""
    article_id = article.get("id", article["link"])
    article_title = article.get("title", "Untitled Article")

    epub_filename = (
        f"{sanitize_filename(article_title)}_{sanitize_filename(article_id)}.epub"
    )
    output_epub_path = config.epubs_dir / epub_filename

    epub_generated_path, article_markdown_content = (
        await nhkeasier_to_epub.process_article_to_epub(
            article_url=article["link"],
            html_content=raw_html_content,
            output_path=output_epub_path,
            keep_md=config.keep_md,
            model_name=config.model_name,
            article_title_for_metadata=article_title,
            analysis=analysis,
        )
    )

    if epub_generated_path and epub_generated_path.exists():
        newly_processed_article_ids.add(article_id)

        if config.send_to_kindle and not config.no_kindle:
            logger.info("Sending '%s' to Kindle...", article_title)

            success = send_to_kindle.send_epub_to_kindle(epub_generated_path)
            if success:
                logger.info(
                    "Successfully sent '%s' to Kindle.", article_title
                )
                kindle_sent_count[0] += 1
            else:
                logger.error("Failed to send '%s' to Kindle.", article_title)
    else:
        logger.error(
            "EPUB processing failed for '%s'. File not created.",
            article_title,
        )

    return epub_generated_path, article_markdown_content


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


def _run_audio_preflight_checks(config: PipelineConfig) -> None:
    """
    Imperative-shell wrapper: probes the environment (module import result,
    env var presence), delegates the pure validation logic to
    audio_pipeline.check_audio_preflight, and exits the process on failure.
    """
    errors = audio_pipeline.check_audio_preflight(
        config,
        slowrecord_available=slowrecord is not None,
        groq_api_key_present=bool(os.getenv("GROQ_API_KEY")),
    )
    for message in errors:
        logger.error(message)
    if errors:
        sys.exit(1)


async def _execute_audio_processing_for_article(
    article: dict,
    config: PipelineConfig,
    raw_html_content: str | None,
    newly_processed_article_ids: set[str],
    generated_slow_files: list[Path],
) -> None:
    """
    Imperative-shell wrapper: asks the functional core whether/how to
    process audio for this article, then performs the actual download,
    external 'slowrecord' invocation, and file cleanup.
    """
    if config.no_audio:
        return

    if slowrecord is None:
        logger.warning("slowrecord module is not available; cannot generate audio.")
        return

    task = audio_pipeline.build_audio_task(article, config, raw_html_content)
    if task is None:
        return

    audio_processed = False
    try:
        download_mp3(task.mp3_url, task.audio_orig_path)
        slowrecord.process_news_with_pysbd(  # type: ignore
            str(task.audio_orig_path), str(task.slowed_path)
        )
        generated_slow_files.append(task.slowed_path)
        logger.info("Created slowed MP3: %s", task.slowed_path.name)
        audio_processed = True
        try:
            task.audio_orig_path.unlink(missing_ok=True)
        except OSError:
            logger.exception(
                "Could not remove temporary audio file %s",
                task.audio_orig_path.name,
            )
    except (OSError, requests.RequestException, pydub_exceptions.PydubError):
        logger.exception(
            "Audio generation failed for '%s' (ID: %s)",
            task.article_title,
            task.article_id,
        )

    if audio_pipeline.should_mark_article_processed_for_audio_only(
        config, audio_processed
    ):
        newly_processed_article_ids.add(task.article_id)
        logger.info("'%s' (audio only) marked as processed.", task.article_title)


async def _write_article_html_output(
    article: dict,
    raw_html_content: str,
    analysis: ArticleAnalysis,
    config: PipelineConfig,
    all_filtered_vocabulary: list[dict[str, str]],
    all_article_metadata_for_index: list[dict],
) -> None:
    """
    Imperative-shell wrapper: asks the functional core to build the HTML
    payload, then writes it to disk and updates the shared in-memory lists.
    """
    payload = html_pipeline.build_article_html_payload(
        article, raw_html_content, analysis
    )
    if payload is None:
        return

    html_output_path = config.smartreader_dir / payload.html_filename
    try:
        html_output_path.write_text(payload.html_content, encoding="utf-8")
        logger.info("Generated interactive HTML article: %s", html_output_path)
    except OSError:
        logger.exception(
            "Failed to write interactive HTML article to %s", html_output_path
        )
        return

    all_article_metadata_for_index.append(payload.metadata_entry)
    all_filtered_vocabulary.extend(payload.vocab_items)


def _collect_article_vocab_for_anki(
    article: dict,
    config: PipelineConfig,
    article_markdown_content: str | None,
    existing_unique_vocab: dict[str, dict],
    all_filtered_vocabulary: list[dict[str, str]],
) -> None:
    """
    Imperative-shell wrapper: delegates vocabulary extraction to the
    functional core (anki_pipeline.build_article_vocab_items) and appends
    the results to the shared in-memory pool.
    """
    if config.no_anki or not article_markdown_content:
        return

    article_title = article.get("title", "Untitled Article")
    logger.info("Extracting vocabulary for '%s'...", article_title)

    vocab_items = anki_pipeline.build_article_vocab_items(
        article, article_markdown_content, existing_unique_vocab, max_words=3
    )
    all_filtered_vocabulary.extend(vocab_items)


async def _process_single_article(
    article: dict,
    config: PipelineConfig,
    newly_processed_article_ids: set[str],
    all_filtered_vocabulary: list[dict[str, str]],
    generated_slow_files: list[Path],
    all_article_metadata_for_index: list[dict],
    kindle_sent_count: list[int],
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
        await _fetch_and_stage_article_html(article, config)
    )

    if not raw_html_content or not article_text_for_gemini:
        return

    analysis_json_filename = f"{sanitize_filename(article_title)}_{sanitize_filename(article_id)}_analysis.json"
    analysis_json_path = config.smartreader_dir / analysis_json_filename

    analysis: ArticleAnalysis
    if config.use_staged_analysis and analysis_json_path.exists():
        logger.info(
            "Using existing staged ArticleAnalysis JSON for '%s' from %s",
            article_title,
            analysis_json_path.name,
        )
        analysis = ArticleAnalysis.model_validate_json(
            analysis_json_path.read_text(encoding="utf-8")
        )
    else:
        logger.info("Analyzing article text with Gemini for '%s'...", article_title)
        analysis = await analyze_article_with_gemini(article_text_for_gemini)
        try:
            analysis_json_path.write_text(
                analysis.model_dump_json(indent=2), encoding="utf-8"
            )
            logger.debug(
                "Saved ArticleAnalysis to %s",
                analysis_json_path,
            )
        except OSError:
            logger.exception(
                "Failed to save ArticleAnalysis to %s", analysis_json_path
            )

    _epub_path, article_markdown_content = await _process_epub_and_kindle(
        article,
        config,
        raw_html_content,
        analysis,
        newly_processed_article_ids,
        kindle_sent_count,
    )

    if config.generate_html:
        await _write_article_html_output(
            article,
            raw_html_content,
            analysis,
            config,
            all_filtered_vocabulary,
            all_article_metadata_for_index,
        )

    _collect_article_vocab_for_anki(
        article,
        config,
        article_markdown_content,
        existing_unique_vocab,
        all_filtered_vocabulary,
    )

    await _execute_audio_processing_for_article(
        article,
        config,
        raw_html_content,
        newly_processed_article_ids,
        generated_slow_files,
    )


async def _process_all_articles(
    articles_to_process,
    config,
    newly_processed_article_ids,
    all_filtered_vocabulary,
    generated_slow_files,
    all_article_metadata_for_index,
    kindle_sent_count,
    existing_unique_vocab,
):
    """Iterates through and processes each article."""
    for article in articles_to_process:
        try:
            await _process_single_article(
                article,
                config,
                newly_processed_article_ids,
                all_filtered_vocabulary,
                generated_slow_files,
                all_article_metadata_for_index,
                kindle_sent_count,
                existing_unique_vocab,
            )
        except Exception:
            article_title = article.get("title", "Untitled Article")
            logger.exception("Failed to process article '%s'", article_title)


async def _combine_and_export_audio(
    generated_slow_files: list[Path], config: PipelineConfig
) -> Path | None:
    """
    Imperative-shell function: combines all generated slowed MP3 files and
    exports the combined audio. Cleans up individual slowed files on
    success. Delivery (e.g. sending to Kindle) is handled separately by
    _deliver_combined_audio so the orchestrator can sequence it.
    """
    if not generated_slow_files:
        logger.info(
            "No slowed MP3 files were generated; skipping combined audio creation."
        )
        return None

    logger.info(
        "Combining %d slowed MP3 files into %s...",
        len(generated_slow_files),
        config.combined_audio_path,
    )
    combined_audio = AudioSegment.empty()
    for slow_path in generated_slow_files:
        try:
            combined_audio += AudioSegment.from_mp3(str(slow_path))
        except (OSError, pydub_exceptions.PydubError):
            logger.exception(
                "Failed to load %s for concatenation",
                slow_path,
            )

    try:
        combined_audio.export(str(config.combined_audio_path), format="mp3")
        logger.info(
            "Created combined MP3: %s", config.combined_audio_path.resolve()
        )
        if not config.keep_slow_mp3:
            for slow_path in generated_slow_files:
                try:
                    slow_path.unlink(missing_ok=True)
                except OSError:
                    logger.exception("Could not remove %s", slow_path.name)
            logger.info("Removed per-article slowed MP3 files.")
        return config.combined_audio_path
    except (OSError, pydub_exceptions.PydubError):
        logger.exception("Failed to export combined MP3")
        return None


async def _deliver_combined_audio(combined_audio_path: Path) -> None:
    """Sends the combined audio file to Kindle. Isolated so failures don't
    interrupt the rest of the pipeline's finalization steps."""
    try:
        success = send_to_kindle.send_epub_to_kindle(
            combined_audio_path, kindle_email="barichan42073@gmail.com"
        )
        if success:
            logger.info("Sent combined MP3 to barichan42073@gmail.com")
        else:
            logger.error("Failed to send combined MP3 via email")
    except (OSError, smtplib.SMTPException):
        logger.exception("Failed to send combined MP3 via email")


def _setup_anki_manager(config: PipelineConfig):
    """
    Imperative-shell function: initializes and returns an AnkiWebManager
    instance based on configuration. Performs environment reads and opens
    a local database connection.
    """
    if config.no_anki:
        return None

    if anki_generator.genanki is None:
        logger.error("'genanki' module not installed. Skipping Anki package generation.")
        sys.exit(1)

    if AnkiWebManager is None:
        config.send_anki_to_app = False
        return None

    if config.send_anki_to_app:
        anki_web_username = os.getenv("ANKIWEB_USER")
        anki_web_password = os.getenv("ANKIWEB_PASS")
        if not anki_web_username or not anki_web_password:
            logger.error("ANKIWEB_USER and/or ANKIWEB_PASS variables not set.")
            sys.exit(1)
        try:
            return AnkiWebManager(
                username=anki_web_username,
                password=anki_web_password,
                db_path=str(config.anki_local_db_path),
            )
        except Exception:
            logger.exception("Failed to initialize AnkiWebManager.")
            config.send_anki_to_app = False
    return None


async def _generate_and_deliver_daily_anki_package(
    all_filtered_vocabulary: list[dict[str, str]],
    config: PipelineConfig,
) -> None:
    """
    Imperative-shell function: uses the functional core to select/shape the
    daily vocabulary pool and package config, then performs the actual
    .apkg file generation, unique_vocab.json persistence, and AnkiWeb sync.
    """
    if config.no_anki:
        logger.info("Anki processing is disabled (--no-anki).")
        return

    if not all_filtered_vocabulary:
        logger.info("No vocabulary collected across all new articles for Anki package.")
        return

    unique_daily_vocab = anki_pipeline.select_daily_vocab(
        all_filtered_vocabulary, max_words=12
    )
    current_date_tag = anki_pipeline.build_daily_tag()

    logger.info(
        "Generating combined daily Anki package for %d vocabulary words...",
        len(unique_daily_vocab),
    )

    anki_config = anki_pipeline.build_daily_anki_package_config(config)

    combined_anki_package_path = anki_generator.generate_anki_package(
        unique_daily_vocab, anki_config, card_tags=[current_date_tag]
    )

    if combined_anki_package_path:
        master_vocab = article_manager.load_unique_vocab(config.unique_vocab_json)
        new_items_for_master = anki_pipeline.build_unique_vocab_updates(
            unique_daily_vocab
        )
        article_manager.update_unique_vocab(master_vocab, new_items_for_master)
        article_manager.save_unique_vocab(master_vocab, config.unique_vocab_json)
        logger.info(
            "Updated master unique_vocab.json with %d new words.",
            len(unique_daily_vocab),
        )

    if config.send_anki_to_app and combined_anki_package_path:
        anki_web_manager = _setup_anki_manager(config)
        if anki_web_manager:
            logger.info(
                "Importing combined Anki package '%s' into Anki...",
                combined_anki_package_path.name,
            )
            try:
                await asyncio.to_thread(
                    anki_web_manager.import_and_sync,
                    str(combined_anki_package_path),
                    with_scheduling=False,
                )
                logger.info("Combined Anki package successfully imported and synchronized.")
            except Exception:
                logger.exception("Failed to import Anki package via AnkiWebManager")


async def _write_smartreader_index(
    config: PipelineConfig,
    newly_processed_article_ids: set[str],
    articles_from_current_run: list[dict],
) -> None:
    """
    Imperative-shell function: handles locale configuration, reading the
    existing manifest, delegating the pure merge/sort/group logic to
    html_pipeline.compute_index_render_data, and writing out index.html,
    the manifest, and styles.css.
    """
    smartreader_output_dir = config.smartreader_dir
    index_template_path = Path(__file__).parent / "templates" / "smartreader_index.html"
    styles_source_path = Path(__file__).parent / "styles.css"
    index_output_path = smartreader_output_dir / "index.html"
    manifest_path = smartreader_output_dir / "articles_manifest.json"

    smartreader_output_dir.mkdir(parents=True, exist_ok=True)

    original_locale = None
    try:
        if platform.system() == "Windows":
            original_locale = locale.setlocale(locale.LC_TIME, "Japanese_Japan.932")
        else:  # For Linux/macOS
            original_locale = locale.setlocale(locale.LC_TIME, "ja_JP.UTF-8")
    except locale.Error:
        logger.warning(
            "Could not set locale for Japanese date formatting. Falling back to default."
        )
        original_locale = None

    current_date = datetime.now(timezone.utc)

    if original_locale:
        current_date_japanese_full = current_date.strftime("%Y年%m月%d日（%a）")
        current_date_japanese_title = current_date.strftime("%Y年%m月%d日")
        locale.setlocale(locale.LC_TIME, original_locale)
    else:
        current_date_japanese_full = current_date.strftime("%Y年%m月%d日")
        current_date_japanese_title = current_date_japanese_full

    existing_manifest: list[dict] = []
    if manifest_path.is_file():
        try:
            existing_manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            logger.warning(
                "Could not read existing manifest at %s; starting fresh.",
                manifest_path,
            )
            existing_manifest = []

    render_data = html_pipeline.compute_index_render_data(
        existing_manifest=existing_manifest,
        articles_from_current_run=articles_from_current_run,
        newly_processed_article_ids=newly_processed_article_ids,
        current_date=current_date,
        current_date_japanese_full=current_date_japanese_full,
        current_date_japanese_title=current_date_japanese_title,
    )

    try:
        rendered_html = render_html_from_json_data(
            data=render_data["template_data"],
            template_dir=index_template_path.parent,
            template_filename=index_template_path.name,
        )
        index_output_path.write_text(rendered_html, encoding="utf-8")
        logger.info("Generated SmartReader index HTML: %s", index_output_path)

        manifest_path.write_text(
            json.dumps(render_data["manifest_for_save"], ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        logger.info("Generated manifest file: %s", manifest_path)

        if not styles_source_path.is_file():
            logger.warning(
                "Source styles.css not found at %s. Skipping copy.", styles_source_path
            )
        else:
            styles_destination_path = smartreader_output_dir / "styles.css"
            try:
                shutil.copy(styles_source_path, styles_destination_path)
                logger.info("Copied styles.css to %s", styles_destination_path)
            except OSError:
                logger.exception(
                    "Failed to copy styles.css to %s", styles_destination_path
                )
    except Exception:
        logger.exception("Failed to generate or save index.html for Smart Reader.")


async def main():
    config = parse_arguments()

    # Call fetch_rss to ensure articles.json is up-to-date
    fetch_rss.save_feed_data()

    # Ensure unique_vocab.json is valid before any Anki operations that might load it
    _ensure_valid_unique_vocab_json(config.unique_vocab_json)

    _run_audio_preflight_checks(config)

    processed_history = article_manager.load_processed_history(
        config.processed_history_json
    )
    articles_to_process, articles_to_process_ids = _load_and_filter_articles(
        config, processed_history
    )

    if not articles_to_process:
        return

    # Load the master unique-vocab store once for the whole run. It is only
    # written back at the end, in _generate_and_deliver_daily_anki_package.
    existing_unique_vocab = article_manager.load_unique_vocab(
        config.unique_vocab_json
    )

    newly_processed_article_ids = set()
    all_filtered_vocabulary = []
    generated_slow_files = []
    all_article_metadata_for_index = []
    kindle_sent_count = [0]

    await _process_all_articles(
        articles_to_process,
        config,
        newly_processed_article_ids,
        all_filtered_vocabulary,
        generated_slow_files,
        all_article_metadata_for_index,
        kindle_sent_count,
        existing_unique_vocab,
    )

    if config.generate_html:
        await _write_smartreader_index(
            config=config,
            newly_processed_article_ids=newly_processed_article_ids,
            articles_from_current_run=all_article_metadata_for_index,
        )

    # Generate combined Anki package for the daily pool and update unique_vocab.json ONCE
    await _generate_and_deliver_daily_anki_package(all_filtered_vocabulary, config)

    # Combined Audio creation, followed by delivery (sequenced by the orchestrator)
    combined_audio_path = await _combine_and_export_audio(
        generated_slow_files, config
    )
    if combined_audio_path:
        await _deliver_combined_audio(combined_audio_path)

    # Update processed history JSON
    if newly_processed_article_ids:
        processed_history.update(newly_processed_article_ids)
        article_manager.save_processed_history(
            processed_history, config.processed_history_json
        )
        logger.info(
            "Updated processed history: %d entries in %s.",
            len(processed_history),
            config.processed_history_json,
        )

    logger.info("Pipeline processing complete.")


if __name__ == "__main__":
    asyncio.run(main())
