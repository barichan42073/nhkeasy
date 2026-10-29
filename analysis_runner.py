"""
Module for obtaining a structured ArticleAnalysis for an article, either by
reusing a previously staged analysis JSON file, or by calling the Gemini API.
"""

import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai

from article_schema import ArticleAnalysis

logger = logging.getLogger(__name__)


async def get_article_analysis(
    article_text_for_gemini: str,
    analysis_json_path: Path,
    use_staged_analysis: bool,
    article_title: str,
    model_name: str = "gemini-3.8-flash",
) -> ArticleAnalysis:
    """
    Returns an ArticleAnalysis for the given article text.

    If `use_staged_analysis` is True and a staged analysis JSON file already
    exists at `analysis_json_path`, it is loaded and returned directly.
    Otherwise, the Gemini API is called to generate a fresh analysis, which is
    then saved to `analysis_json_path` for future staged runs.
    """
    if use_staged_analysis and analysis_json_path.exists():
        logger.info(
            "Using staged analysis JSON for '%s' from '%s'.",
            article_title,
            analysis_json_path,
        )
        try:
            return ArticleAnalysis.model_validate_json(
                analysis_json_path.read_text(encoding="utf-8")
            )
        except Exception:
            logger.exception(
                "Failed to load staged analysis JSON for '%s' from '%s'. "
                "Falling back to Gemini API.",
                article_title,
                analysis_json_path,
            )

    analysis = await analyze_article_with_gemini(article_text_for_gemini, model_name)

    try:
        analysis_json_path.parent.mkdir(parents=True, exist_ok=True)
        analysis_json_path.write_text(
            analysis.model_dump_json(indent=2), encoding="utf-8"
        )
        logger.debug(
            "Saved analysis JSON for '%s' to '%s'.", article_title, analysis_json_path
        )
    except OSError:
        logger.exception(
            "Failed to save analysis JSON for '%s' to '%s'.",
            article_title,
            analysis_json_path,
        )

    return analysis


async def analyze_article_with_gemini(
    article_text: str, model_name: str = "gemini-3.8-flash"
) -> ArticleAnalysis:
    """Calls the Gemini API to produce a structured ArticleAnalysis for the article text."""
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set.")

    logger.info("Calling Gemini API with model '%s' to analyze article...", model_name)
    client = genai.Client(api_key=api_key)

    prompt = (
        "Analyze the following NHK Easy Japanese news article text.\n"
        "Extract:\n"
        "- The Japanese title and its English translation.\n"
        "- A short, attention-grabbing kicker/subtitle (one concise phrase).\n"
        "- A sentence-by-sentence breakdown with natural English translations.\n"
        "- 10-15 key vocabulary items suitable for a side panel and Anki flashcards, "
        "each with its dictionary form, hiragana reading, contextual English definition, "
        "and JLPT level if known.\n"
        "- A mapping from exact kanji surface stems found inside furigana ruby annotations "
        "to their dictionary base forms.\n\n"
        f"Article text:\n{article_text}"
    )

    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": ArticleAnalysis,
            },
        )

        if hasattr(response, "usage_metadata") and response.usage_metadata:
            logger.info(
                "Gemini analysis token usage: %d total (%d prompt, %d completion).",
                response.usage_metadata.total_token_count,
                response.usage_metadata.prompt_token_count,
                response.usage_metadata.candidates_token_count,
            )
        else:
            logger.debug("Gemini API response did not contain usage metadata.")

        if not response.text:
            raise ValueError("Gemini API returned an empty response during analysis.")

        return ArticleAnalysis.model_validate_json(response.text)
    except Exception:
        logger.exception("Error calling Gemini API for article analysis.")
        raise
