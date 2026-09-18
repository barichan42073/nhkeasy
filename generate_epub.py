import argparse
import json
import os
import re
import subprocess

# Default paths if arguments are not provided
DEFAULT_JSON_INPUT_PATH = "weather.json"
DEFAULT_EPUB_OUTPUT_PATH = "nhk_weather.epub"
XHTML_INTERMEDIATE = "article.xhtml"

def load_split_data_into_paragraphs(json_path, sentences_per_paragraph=3):
    """
    Extracts sentences and combines them into larger true paragraphs.
    Also extracts rich vocabulary definitions from token objects.
    """
    if not os.path.exists(json_path):
        print(f"Warning: File '{json_path}' not found. Using dummy fallback data.")
        return "NHK News Article", "This is news from the Soccer World Cup.", [], [], []
        
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    title_jp = data.get("title", "NHK News Article").strip()
    title_en = data.get("title_en", "This is news from the Soccer World Cup.").strip()
    sentences_data = data.get("sentences", [])
    
    jp_sentences = []
    en_sentences = []
    sentence_vocab_lists = []
    
    for s in sentences_data:
        if s.get("is_title", False):
            continue
            
        # Extract vocabulary terms that are verbs/adjectives or have complex definitions
        vocab_entries = []
        if s.get("tokens"):
            # Reconstruct sentence from token surface elements
            jp_text = "".join(token.get("surface", "") for token in s["tokens"]).strip()
            
            # Extract useful vocab tokens to show in the legend
            for token in s["tokens"]:
                surface = token.get("surface", "").strip()
                # Clean up any raw ruby markup in surface for the vocab sheet
                clean_surface = re.sub(r'<[^>]*>', '', surface)
                translation = token.get("translation")
                
                # Check if it has a useful translation and contains kanji or conjugation
                if clean_surface and translation and (token.get("has_kanji") or "conjugation" in token.get("grammar_label", "").lower() or token.get("is_grammar")):
                    base = token.get("base", "")
                    meaning = token.get("grammar_meaning", "")
                    
                    if meaning:
                        display_def = f"{clean_surface} ({base}): {translation} — {meaning}"
                    else:
                        display_def = f"{clean_surface} ({base}): {translation}"
                        
                    if display_def not in vocab_entries:
                        vocab_entries.append(display_def)
        else:
            jp_text = s.get("jp", "").strip()
            # Padding hyphens only for plain fallback texts to prevent CSS/HTML bugs
            jp_text = jp_text.replace("-", " - ")
            
        en_text = s.get("en", "").strip()
        en_text = en_text.replace("-", " - ")
        
        if jp_text == title_jp or en_text == title_en:
            continue
        
        if jp_text:
            jp_sentences.append(jp_text)
        if en_text:
            en_sentences.append(en_text)
        sentence_vocab_lists.append(vocab_entries)
            
    # Group the sentences and vocab into paragraph blocks
    jp_paras = []
    en_paras = []
    vocab_paras = []
    
    for i in range(0, len(jp_sentences), sentences_per_paragraph):
        jp_chunk = jp_sentences[i:i + sentences_per_paragraph]
        en_chunk = en_sentences[i:i + sentences_per_paragraph]
        vocab_chunk = []
        for v_list in sentence_vocab_lists[i:i + sentences_per_paragraph]:
            vocab_chunk.extend(v_list)
            
        # Deduplicate paragraph vocabulary list
        unique_vocab = list(dict.fromkeys(vocab_chunk))
        
        jp_paras.append("".join(jp_chunk))
        en_paras.append(" ".join(en_chunk))
        vocab_paras.append(unique_vocab)
        
    return title_jp, title_en, jp_paras, en_paras, vocab_paras

def build_split_view_xhtml(title_jp, title_en, jp_paras, en_paras, vocab_paras):
    """
    Generates a valid XHTML document incorporating dual-view blocks and
    the vocabulary helper sheets cleanly styled.
    """
    body_content = []
    
    body_content.append(f"""
    <div class="title-section">
        <h1 class="title-jp">{title_jp}</h1>
        <h2 class="title-en">{title_en}</h2>
    </div>
    <hr class="separator" />
    """)
    
    for idx, (jp_p, en_p, vocab_list) in enumerate(zip(jp_paras, en_paras, vocab_paras)):
        # Strip old duplicate RT tags and prevent double-escaped &amp;#8203; errors
        safe_jp = jp_p.replace("&", "&#38;")
        safe_en = en_p.replace("&", "&#38;").replace("<", "&#60;").replace(">", "&#62;")
        
        # Intercept and clean up any dirty rt elements inside token surfaces
        safe_jp = re.sub(r'<rt[^>]*>.*?</rt>', '', safe_jp)
        # Apply clean CSS pseudo-element injection class
        safe_jp = safe_jp.replace("<ruby>", '<ruby class="vocab-node">')
        safe_jp = safe_jp.replace("</ruby>", '<rt class="zw-space"></rt></ruby>')
        
        # Build vocabulary list display block if items exist
        vocab_html = ""
        if vocab_list:
            vocab_items = "".join(f"<li>{item}</li>" for item in vocab_list)
            vocab_html = f"""
            <div class="vocab-legend">
                <span class="vocab-legend-title">📚 Word & Conjugation Help:</span>
                <ul>
                    {vocab_items}
                </ul>
            </div>
            """
        
        body_content.append(f"""
        <div class="paragraph-block">
            <p class="jp-text" lang="ja">{safe_jp}</p>
            <p class="en-text" lang="en">{safe_en}</p>
            {vocab_html}
        </div>
        """)
        
    full_body = "\n".join(body_content)
    
    xhtml_template = f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja">
<head>
    <meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
    <title>{title_jp}</title>
    <style type="text/css">
        body {{
            font-family: "Helvetica Neue", Helvetica, Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
            margin: 8%;
            line-height: 1.8;
            color: #1a1a1a;
            background-color: #fafafa;
        }}
        .title-section {{
            text-align: center;
            margin-bottom: 2em;
            page-break-after: always;
        }}
        .title-jp {{
            font-size: 1.5em;
            font-weight: bold;
            color: #111111;
            margin-bottom: 0.3em;
        }}
        .title-en {{
            font-size: 1.0em;
            font-weight: normal;
            color: #555555;
            margin-top: 0;
            line-height: 1.4;
        }}
        .separator {{
            border: 0;
            height: 1px;
            background: #e0e0e0;
            margin: 2em 0;
        }}
        .paragraph-block {{
            margin-bottom: 2.5em;
            border-bottom: 1px dashed #ececec;
            padding-bottom: 1.5em;
            page-break-inside: avoid;
            break-inside: avoid;
        }}
        .jp-text {{
            font-size: 1.1em;
            color: #000000;
            margin-bottom: 0.4em;
            text-align: justify;
        }}
        .en-text {{
            font-size: 0.88em;
            color: #4a4a4a;
            margin-top: 0.4em;
            background-color: #f5f7f8;
            padding: 10px 15px;
            border-left: 3px solid #0076a3;
            border-radius: 4px;
            text-align: justify;
        }}
        .vocab-legend {{
            margin-top: 1em;
            background-color: #fcfcfc;
            border: 1px solid #eef2f5;
            border-radius: 6px;
            padding: 12px 18px;
            font-size: 0.82em;
            color: #444444;
        }}
        .vocab-legend-title {{
            font-weight: bold;
            color: #2c3e50;
            display: block;
            margin-bottom: 0.5em;
        }}
        .vocab-legend ul {{
            margin: 0;
            padding-left: 1.2em;
        }}
        .vocab-legend li {{
            margin-bottom: 0.4em;
            line-height: 1.4;
        }}
        rt.zw-space::before {{
            content: "\\200B";
        }}
    </style>
</head>
<body>
{full_body}
</body>
</html>"""

    return xhtml_template

def main():
    parser = argparse.ArgumentParser(description="Generate bilingual EPUB files with word legend support.")
    
    parser.add_argument(
        "-i", "--input", 
        default=DEFAULT_JSON_INPUT_PATH,
        help=f"Path to the input JSON file"
    )
    parser.add_argument(
        "-o", "--output", 
        default=DEFAULT_EPUB_OUTPUT_PATH,
        help=f"Path where output EPUB should be saved"
    )
    
    args = parser.parse_args()
    
    json_input = args.input
    epub_output = args.output
    
    print(f"Reading: {json_input}")
    print(f"Target:  {epub_output}")
    
    title_jp, title_en, jp_paras, en_paras, vocab_paras = load_split_data_into_paragraphs(json_input, sentences_per_paragraph=3)
    
    xhtml_out = build_split_view_xhtml(title_jp, title_en, jp_paras, en_paras, vocab_paras)
    
    with open(XHTML_INTERMEDIATE, "w", encoding="utf-8") as f:
        f.write(xhtml_out)
        
    try:
        subprocess.run([
            "ebook-convert",
            XHTML_INTERMEDIATE,
            epub_output,
            "--language", "ja",
            "--title", title_jp,
            "--authors", "NHK News Split-Parser"
        ], check=True)
        
        print(f"\nSuccess! Built EPUB with inline Vocabulary helpers -> {epub_output}")
    except FileNotFoundError:
        print("\nError: Calibre compiler tool 'ebook-convert' not found.")
    finally:
        if os.path.exists(XHTML_INTERMEDIATE):
            os.remove(XHTML_INTERMEDIATE)

if __name__ == "__main__":
    main()
