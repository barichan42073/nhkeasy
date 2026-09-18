import json
import os
import unicodedata

from pydantic import BaseModel
from google import genai
from google.genai import types

TRANSLATION_CACHE_FILE = "translation_cache.json"
USE_TRANSLATION_CACHE = True
ACTIVE_MODEL = "models/gemini-2.5-pro"

class SentenceAnalysis(BaseModel):
    japanese: str
    translation: str

class DeepDive(BaseModel):
    sentences: list[SentenceAnalysis]

def save_translation_cache(data: DeepDive):
    with open(TRANSLATION_CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(data.model_dump(), f, ensure_ascii=False, indent=2)


def load_translation_cache() -> DeepDive | None:
    if not os.path.exists(TRANSLATION_CACHE_FILE):
        return None

    with open(TRANSLATION_CACHE_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    return DeepDive(**data)


def get_article_translation(full_article: str) -> DeepDive:
    normalized_text = unicodedata.normalize('NFKC', full_article)
    clean_article = normalized_text.strip()
    if not clean_article:
        return DeepDive(sentences=[])

    if USE_TRANSLATION_CACHE:
        cached = load_translation_cache()
        if cached:
            print("Using cached translation")
            return cached

    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    prompt = (
        "Translate the following Japanese news article into natural English, "
        "providing a sentence-by-sentence breakdown:\n\n"
        f"{clean_article}"
    )

    response = client.models.generate_content(
        model=ACTIVE_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=DeepDive,
        ),
    )

    result = response.parsed

    if USE_TRANSLATION_CACHE:
        save_translation_cache(result)

    return result

