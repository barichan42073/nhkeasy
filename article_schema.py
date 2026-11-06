from pydantic import BaseModel, Field, field_validator


class VocabItem(BaseModel):
    """Key vocabulary item for the side panel and Anki cards."""

    word: str = Field(description="Dictionary form of the word (e.g., 避難する)")
    reading: str = Field(description="Hiragana reading (e.g., ひなんする)")
    definition: str = Field(description="Contextual English definition")
    jlpt_level: str = Field(default="", description="JLPT level if known (e.g., n3)")

    @field_validator("jlpt_level")
    @classmethod
    def _normalize_jlpt_level(cls, value: str) -> str:
        """Providers differ ('N3' vs 'n3'); always store lowercase."""
        return value.strip().lower()


class SentenceTranslation(BaseModel):
    """Pairing of Japanese sentence and English translation."""

    japanese: str = Field(description="Original Japanese sentence")
    translation: str = Field(description="Natural English translation")


class SurfaceMappingItem(BaseModel):
    surface: str = Field(
        description="The exact kanji stem found inside the NHK ruby tag (e.g., '出')"
    )
    base: str = Field(description="The dictionary form of the word (e.g., '出る')")


class ArticleAnalysis(BaseModel):
    """Complete AI extraction payload for an article."""

    title_ja: str = Field(description="Japanese title")
    title_en: str = Field(description="English translation of title")
    kicker: str = Field(
        description="Short English kicker: at most 8 words, Title Case, a phrase (not a sentence), no trailing full stop."
    )
    sentences: list[SentenceTranslation] = Field(
        description="List of translated sentences"
    )
    side_vocab: list[VocabItem] = Field(
        description="10-15 key vocabulary items for the side panel"
    )
    surface_mapping: list[SurfaceMappingItem] = Field(
        default_factory=list,
        description="A list mapping exact HTML surface text stems found in NHK ruby tags to their dictionary base forms.",
    )
