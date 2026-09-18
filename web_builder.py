# web_builder.py
"""Module for building interactive web pages from article analysis."""

import json
import logging
import re  # Added for _strip_furigana_text

from bs4 import BeautifulSoup
from bs4.element import NavigableString, Tag
from jinja2 import Environment, FileSystemLoader
from markupsafe import Markup

import sudachi  # Import sudachi to use its tokenizer and helper functions
from article_schema import ArticleAnalysis

logger = logging.getLogger(__name__)

_jinja_env = Environment(loader=FileSystemLoader("templates"), autoescape=True)


def _clean_article_body(article_body: Tag) -> None:
    """Remove non-content elements and inline media from article body DOM."""
    for time_tag in article_body.find_all("time"):
        if time_tag.parent and time_tag.parent.name == "a":
            time_tag.parent.unwrap()

    for element in article_body.find_all(["table", "audio", "img"]):
        classes = element.get("class") or []
        # Keep non-link tables, decompose everything else (audio, img, and class="links" tables)
        if element.name == "table" and "links" not in classes:
            continue
        element.decompose()


def _strip_furigana_text(text: str) -> str:
    """Removes furigana in `漢字[ひらがな]` format from a Japanese string."""
    return re.sub(r"\[.*?\]", "", text)


def _inject_dictionary_attributes(article_body: Tag, analysis: ArticleAnalysis) -> None:
    """Attach dictionary metadata and target classes to <ruby> tags in article DOM."""
    vocab_map = {v.word: v for v in analysis.side_vocab}
    ai_mapping = {item.surface: item.base for item in analysis.surface_mapping}

    for ruby_tag in article_body.find_all("ruby"):
        base_text_parts = [
            str(c)
            for c in ruby_tag.contents
            if isinstance(c, NavigableString) or (isinstance(c, Tag) and c.name != "rt")
        ]
        base_text = "".join(base_text_parts).strip()

        if not base_text:
            continue

        dictionary_form = ai_mapping.get(base_text, base_text)
        vocab_item = vocab_map.get(dictionary_form)

        if vocab_item:
            ruby_tag["data-dict-word"] = vocab_item.word
            ruby_tag["data-dict-reading"] = vocab_item.reading
            ruby_tag["data-dict-definition"] = vocab_item.definition
            if vocab_item.jlpt_level:
                ruby_tag["data-dict-level"] = vocab_item.jlpt_level

            classes = ruby_tag.get("class", [])
            if isinstance(classes, str):
                classes = classes.split()
            if "dict-word-target" not in classes:
                classes.append("dict-word-target")
                ruby_tag["class"] = classes


def _sync_sentence_translations(article_body: Tag, analysis: ArticleAnalysis) -> None:
    """Sync DOM HTML paragraphs with analysis.sentences while handling length mismatches gracefully."""
    paragraphs = article_body.find_all("p")
    p_count = len(paragraphs)
    s_count = len(analysis.sentences)

    if p_count != s_count:
        logger.warning(
            "Paragraph count (%d) mismatch with analysis sentences (%d). Syncing matching indices.",
            p_count,
            s_count,
        )

    for p, sentence in zip(paragraphs, analysis.sentences):
        # The analysis object already contains the correct Japanese sentences and translations.
        # Overwriting sentence.japanese with raw p_html here was causing issues.
        # The purpose of this function is primarily to check for mismatches, not to modify content.
        pass  # No longer modifying sentence.japanese


def _generate_furigana_html_for_text(japanese_text: str) -> str:
    """Generates HTML with <ruby> tags for a given Japanese text using Sudachi."""
    tokens = sudachi.tokenizer_obj.tokenize(japanese_text, sudachi.mode)
    furigana_elements = []
    current_char_idx = 0

    for t in tokens:
        # Add any text before the current token (e.g., untokenized punctuation/spaces)
        if t.begin() > current_char_idx:
            furigana_elements.append(japanese_text[current_char_idx : t.begin()])

        surface = t.surface()
        if surface.strip():
            if sudachi.contains_kanji(surface):
                reading = sudachi.katakana_to_hiragana(t.reading_form())
                display_word = f"<ruby>{surface}<rt>{reading}</rt></ruby>"
            else:
                display_word = surface
            furigana_elements.append(display_word)
        else:
            furigana_elements.append(surface)

        current_char_idx = t.end()

    # Add any remaining text after the last token
    if current_char_idx < len(japanese_text):
        furigana_elements.append(japanese_text[current_char_idx:])

    return "".join(furigana_elements)


def render_interactive_page(
    raw_html: str,
    analysis: ArticleAnalysis,
    slow_audio_path: str | None = None,
    article_original_url: str | None = None,
    image_url: str | None = None,
) -> str:
    """Extracts native NHK ruby HTML and renders the full interactive Jinja page."""
    soup = BeautifulSoup(raw_html, "html.parser")
    article_body = soup.find("article", lang="ja") or soup.find(
        "div", id="article-body"
    )

    if article_body:
        _clean_article_body(article_body)
        _inject_dictionary_attributes(article_body, analysis)
        _sync_sentence_translations(article_body, analysis)
        body_html = str(article_body)
    else:
        body_html = str(soup)

    template = _jinja_env.get_template("article.html")

    # Create a copy of the analysis object to modify for rendering purposes,
    # specifically stripping furigana from the Japanese sentences.
    # This prevents modifying the original analysis object which might be used elsewhere.
    analysis_for_rendering = analysis.model_copy(deep=True)
    for sentence in analysis_for_rendering.sentences:
        sentence.japanese = _strip_furigana_text(sentence.japanese)

    vocab_data_for_json = [v.model_dump() for v in analysis.side_vocab]

    # Prepare data for paragraph translations with furigana
    paragraph_translation_display_data = []
    for sentence in analysis.sentences:
        # Strip existing furigana in brackets before adding ruby tags
        stripped_japanese_text = _strip_furigana_text(sentence.japanese)
        japanese_with_furigana_html = _generate_furigana_html_for_text(
            stripped_japanese_text
        )
        paragraph_translation_display_data.append(
            {
                "japanese_html": japanese_with_furigana_html,
                "translation": sentence.translation,
            }
        )

    rendered_html = template.render(
        article_body_html=Markup(body_html),
        analysis=analysis_for_rendering,  # Use the modified analysis object for rendering
        vocab_data_json=Markup(json.dumps(vocab_data_for_json, ensure_ascii=False)),
        slow_audio_path=slow_audio_path,
        article_original_url=article_original_url,
        image_url=image_url,
        paragraph_translation_display_data=paragraph_translation_display_data,  # Pass new data
    )

    return rendered_html
