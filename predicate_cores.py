import json
import sys
from pathlib import Path

import spacy
from jamdict import Jamdict
from jinja2 import Environment, FileSystemLoader

jam = Jamdict()
translation_cache = {}
reading_cache = {}
nlp = spacy.load("ja_ginza")


BASE_DIR = Path(__file__).resolve().parent
JLPT_DIR = BASE_DIR / "jlpt"

paths = [
    JLPT_DIR / "term_meta_bank_1.json",
    JLPT_DIR / "term_meta_bank_2.json",
    JLPT_DIR / "term_meta_bank_3.json",
    JLPT_DIR / "term_meta_bank_4.json",
    JLPT_DIR / "term_meta_bank_5.json",
]

def load_jlpt_vocab():
    vocab = {}

    for name in [
        "term_meta_bank_1.json",
        "term_meta_bank_2.json",
        "term_meta_bank_3.json",
        "term_meta_bank_4.json",
        "term_meta_bank_5.json",
    ]:
        path = JLPT_DIR / name

        try:
            with open(path, "r", encoding="utf-8") as f:
                rows = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"SKIP {path} ({e})")  # 👈 DEBUG
            continue

#        print(f"LOADED {path}, rows={len(rows)}")  # 👈 DEBUG

        for row in rows:
            if not isinstance(row, list) or len(row) < 3:
                continue

            term = row[0]
            meta = row[2]

            if not isinstance(term, str) or not isinstance(meta, dict):
                continue

            freq = meta.get("frequency", {})
            level = freq.get("displayValue")

            if isinstance(level, str):
                vocab[term] = level.lower()

    return vocab

VOCAB_DB = load_jlpt_vocab()
#print("VOCAB size:", len(VOCAB_DB))
#print("国:", VOCAB_DB.get("国"))
#print("攻撃:", VOCAB_DB.get("攻撃"))
#print("人:", VOCAB_DB.get("人"))


def is_cjk(char):
    return "\u4e00" <= char <= "\u9faf"


def is_all_katakana(text: str) -> bool:
    """Returns True if the text consists entirely of Katakana characters or the long vowel mark (ー)."""
    if not text:
        return False
    return all('\u30a0' <= char <= '\u30ff' or char == '\u30fc' for char in text)


def is_all_hiragana(surface: str) -> bool:
    chars = [c for c in surface if c.strip()]
    return bool(chars) and all("ぁ" <= c <= "ゖ" for c in chars)


def expand_lookup_forms(base_form, surface=None):
    forms = []

    for form in (base_form, surface):
        if form and form not in forms:
            forms.append(form)

    if isinstance(base_form, str) and base_form.endswith("する"):
        stem = base_form[:-2]
        if stem and stem not in forms:
            forms.append(stem)

    return forms

def get_word_level(surface, base_form):
    for form in expand_lookup_forms(base_form, surface):
        if form in VOCAB_DB:
            return VOCAB_DB[form]

    return "unknown"


def translate_lemma(lemma):
    if lemma in translation_cache:
        return translation_cache[lemma]

    def lookup(term):
        try:
            result = jam.lookup(term)
            if result.entries and result.entries[0].senses:
                glosses = result.entries[0].senses[0].gloss
                return ", ".join(str(g) for g in glosses)
        except Exception:
            return None
        return None

    translation = None

    for form in expand_lookup_forms(lemma):
        translation = lookup(form)
        if translation:
            break

    translation_cache[lemma] = translation
    return translation


def predicate_parts(token):
    parts = {token}
    stack = [token]

    while stack:
        cur = stack.pop()
        for child in cur.children:
            if child.pos_ in {"AUX", "SCONJ"} or child.dep_ == "fixed":
                if child not in parts:
                    parts.add(child)
                    stack.append(child)

    return sorted(parts, key=lambda t: t.i)


def predicate_lemma(head, parts):
    lemmas = [t.lemma_ for t in parts]

    if head.pos_ in {"NOUN", "VERB"} and "する" in lemmas:
        if head.lemma_.endswith("する"):
            return head.lemma_
        return head.lemma_ + "する"

    return head.lemma_


def detect_aspect(tokens):
    ts = [t.text for t in tokens]
    ls = [t.lemma_ for t in tokens]

    if "て" in ts and "いる" in ls:
        return "progressive"
    if "て" in ts and "しまう" in ls:
        return "completion"
    if "て" in ts and "おく" in ls:
        return "preparation"

    return None


def detect_polarity(tokens):
    ls = [t.lemma_ for t in tokens]
    ts = [t.text for t in tokens]

    if any(x in ls for x in {"ない", "ぬ", "ず", "ません"}):
        return "negative"
    if "なかっ" in ts:
        return "negative"

    return "positive"


def detect_tense(tokens):
    ls = [t.lemma_ for t in tokens]
    ts = [t.text for t in tokens]

    if "た" in ls or "た" in ts:
        return "past"

    return "nonpast"

def extract_nouns(doc):
    results = []

    for token in doc:
        if token.pos_ in {"NOUN", "PROPN"}:
            surface = token.text
            lemma = token.lemma_
            translation = translate_lemma(lemma)
            reading = get_reading(lemma)

            jlpt_level = get_word_level(surface, lemma)
            results.append({
                "type": "proper_noun" if token.pos_ == "PROPN" else "noun",
                "surface": surface,
                "lemma": lemma,
                "reading": reading,
                "translation": translation,
                "jlpt_level": jlpt_level
            })

    return results

def get_reading(lemma):
    if lemma in reading_cache:
        return reading_cache[lemma]

    reading = None

    for form in expand_lookup_forms(lemma):
        try:
            result = jam.lookup(form)
            if result.entries:
                entry = result.entries[0]
                if entry.kana_forms:
                    kf = entry.kana_forms[0]
                    reading = getattr(kf, "text", str(kf))
                    break
        except Exception:
            continue

    reading_cache[lemma] = reading
    return reading

def extract(doc):
    results = []

    for sent in doc.sents:
        for token in sent:
            if token.pos_ == "VERB" and token.dep_ in {
                "ROOT", "advcl", "ccomp", "xcomp", "conj"
            }:
                parts = predicate_parts(token)
                surface = "".join(t.text for t in parts)
                lemma = predicate_lemma(token, parts)
                translation = translate_lemma(lemma)
                reading = get_reading(lemma)
                jlpt_level = get_word_level(surface, lemma)

                results.append({
                    "type": "predicate",
                    "surface": surface,
                    "lemma": lemma,
                    "reading":reading,
                    "translation": translation,
                    "aspect": detect_aspect(parts),
                    "polarity": detect_polarity(parts),
                    "tense": detect_tense(parts),
                    "jlpt_level": jlpt_level
                })

    return results


def make_token(token):
    surface = token.text
    lemma = token.lemma_

    return {
        "surface": surface,
        "reading": get_reading(lemma),
        "base": lemma,
        "base_reading": get_reading(lemma),
        "translation": translate_lemma(lemma) or "",
        "level": get_word_level(surface, lemma),
        "has_kanji": any(is_cjk(c) for c in surface),
        "is_japanese": True,
        "is_katakana": all("ァ" <= c <= "ヶ" for c in surface),
        "is_hiragana": all("ぁ" <= c <= "ゖ" for c in surface),
        "is_selectable": token.pos_ not in {"ADP", "PUNCT", "SCONJ"},
    }

def build_sentence_tokens(doc):
    used = set()
    tokens = []

    for token in doc:
        if token.i in used:
            continue

        # predicate
        if token.pos_ == "VERB" and token.dep_ in {
            "ROOT", "advcl", "ccomp", "xcomp", "conj"
        }:
            parts = predicate_parts(token)
            indices = [t.i for t in parts]

            for i in indices:
                used.add(i)

            surface = "".join(t.text for t in parts)
            lemma = predicate_lemma(token, parts)

            tokens.append({
                "surface": surface,
                "reading": get_reading(lemma),
                "base": lemma,
                "base_reading": get_reading(lemma),
                "translation": translate_lemma(lemma) or "",
                "level": get_word_level(surface, lemma),
                "has_kanji": any(is_cjk(c) for c in surface),
                "is_japanese": True,
                "is_katakana": False,
                "is_hiragana": False,
                "is_selectable": True
            })
            continue

        # normal token
        tokens.append(make_token(token))

    return tokens

def build_sentences(translation_data):
    sentences = []

    for i, entry in enumerate(translation_data.get("sentences", [])):
        jp_text = entry["japanese"]
        en_text = entry.get("translation", "")

        doc = nlp(jp_text)
        tokens = build_sentence_tokens(doc)

        sentences.append({
            "sentence_id": i,
            "jp": jp_text,
            "en": en_text,
            "is_title": False,
            "tokens": tokens
        })

    return sentences

def process_translation_data_and_render_html(translation_data: dict, template_path: Path) -> str:
    """
    Processes translation data for token-level analysis and renders it to an HTML string.
    """
    sentence_entries = translation_data.get("sentences", [])
    title = sentence_entries[0]["japanese"] if sentence_entries else ""
    title_en = sentence_entries[0].get("translation", "") if sentence_entries else ""

    article_data = {
        "title": title,
        "title_en": title_en,
        "sentences": build_sentences(translation_data),
    }

    env = Environment(loader=FileSystemLoader(template_path.parent))
    template = env.get_template(template_path.name)
    return template.render(**article_data)


def main():
    if len(sys.argv) < 3:
        print("Usage: python predicate_cores.py <translation_json_path> <output_html_path> [template_html_path]")
        sys.exit(1)

    translation_path = Path(sys.argv[1])
    output_html_path = Path(sys.argv[2])
    template_path = Path(sys.argv[3]) if len(sys.argv) > 3 else Path(__file__).resolve().parent / "template.html"

    with open(translation_path, "r", encoding="utf-8") as f:
        translation_data = json.load(f)

    rendered_html = process_translation_data_and_render_html(translation_data, template_path)

    with open(output_html_path, "w", encoding="utf-8") as f:
        f.write(rendered_html)

    print(f"HTML successfully written to {output_html_path}")


if __name__ == "__main__":
    main()
