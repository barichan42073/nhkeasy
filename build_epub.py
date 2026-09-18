import json
import sys
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape
import ebooklib
from ebooklib import epub

EPUB_CSS = """
body { font-family: sans-serif; padding: 5%; }
p { margin-bottom: 1.2em; line-height: 1.7; font-size: 1.15em; }
.vocab-link { color: #0066cc; text-decoration: none; border-bottom: 1px dashed #0066cc; }
.footnotes-section { margin-top: 3em; border-top: 1px solid #ccc; padding-top: 1.5em; font-size: 0.95em; }
.footnote-item { margin-bottom: 1.5em; display: block; }
"""

def force_safe_str(val):
    """
    Forces any input (int, float, None) into a clean, XML-escaped string.
    """
    if val is None:
        return ""
    s = str(val).strip()
    return xml_escape(s, {'"': "&quot;", "'": "&apos;"})

def main():
    if len(sys.argv) < 2:
        print("Usage: python build_epub.py <input_json> [output_epub]")
        sys.exit(1)
        
    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2]) if len(sys.argv) > 2 else input_path.with_suffix(".epub")
    
    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    processed_sentences = []
    flat_notes = []
    fn_counter = 0

    # Process sequentially to avoid nested loop logical traps
    for sentence in data.get("sentences", []):
        sentence_chunks = []
        
        for token in sentence.get("tokens", []):
            surface = force_safe_str(token.get("surface", ""))
            reading = force_safe_str(token.get("base_reading", ""))
            
            # --- PATCH: TRANSLATION SIMPLIFICATION ---
            raw_translation = token.get("translation", "")
            if raw_translation:
                # Truncate at delimiters to isolate the clean gloss (added '-' to fix tournament descriptions)
                for delimiter in [",", "(", "[", "-"]:
                    if delimiter in raw_translation:
                        raw_translation = raw_translation.split(delimiter)[0]
                translation = force_safe_str(raw_translation)
            else:
                translation = ""
            
            should_note = token.get("has_kanji", False) or token.get("is_katakana", False)
            
            if should_note and translation:
                fn_id = f"fn_{fn_counter}"
                ref_id = f"ref_{fn_counter}"
                
                # FIX: Wrap link tags with zero-width character blocks to isolate alphanumeric inline tokens
                link_html = f'&#8203;<a epub:type="noteref" id="{ref_id}" href="#{fn_id}" class="vocab-link">{surface}</a>&#8203;'
                sentence_chunks.append(link_html)
                
                # Append to flat notes deck
                reading_display = f"【{reading}】" if reading else ""
                note_html = (
                    f'<aside epub:type="footnote" id="{fn_id}" class="footnote-item">'
                    f'<p><strong>{surface}</strong> {reading_display}<br/>'
                    f'{translation} '
                    f'<a href="#{ref_id}" style="text-decoration: none; font-size: 0.85em;">&#160;↩</a></p>'
                    f'</aside>'
                )
                flat_notes.append(note_html)
                fn_counter += 1
            else:
                sentence_chunks.append(surface)
        
        # Combine chunks into a single paragraph string
        processed_sentences.append({
            "jp_html": "".join(sentence_chunks),
            "en": force_safe_str(sentence.get("en", ""))
        })

    # Assemble raw HTML inside Python to bypass Jinja loop complexity entirely
    html_lines = [
        '<!DOCTYPE html>',
        '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="ja" lang="ja">',
        '<head>',
        '    <meta charset="utf-8" />',
        f'    <title>{force_safe_str(data.get("title", "Reading"))}</title>',
        f'    <style type="text/css">{EPUB_CSS}</style>',
        '</head>',
        '<body>',
        f'    <h1>{force_safe_str(data.get("title", "Japanese Reading"))}</h1>'
    ]
    
    if data.get("title_en"):
        html_lines.append(f'    <p style="color: #555; font-style: italic;">{force_safe_str(data["title_en"])}</p><br/>')

    # Add text paragraphs
    for s in processed_sentences:
        html_lines.append(f'    <p>{s["jp_html"]}</p>')
        if s["en"]:
            html_lines.append(f'    <p style="color: #666; font-size: 0.9em; margin-top: -0.5em; font-style: italic;">{s["en"]}</p>')

    # Add flat footnotes
    if flat_notes:
        html_lines.append('    <section epub:type="footnotes" class="footnotes-section">')
        html_lines.extend([f'        {note}' for note in flat_notes])
        html_lines.append('    </section>')
        
    html_lines.append('</body>')
    html_lines.append('</html>')
    
    xhtml_content = "\n".join(html_lines)

    # --- BUILD EPUB ---
    book = epub.EpubBook()
    book.set_identifier("smartreader_pipeline_id_001")
    book.set_title(data.get("title", "Immersion Article"))
    book.set_language("ja")
    book.add_author("SmartReader Pipeline")

    c1 = epub.EpubHtml(
        title="Article", 
        file_name="article.xhtml", 
        lang="ja", 
        media_type="application/xhtml+xml"
    )
    c1.content = xhtml_content
    book.add_item(c1)

    nav_page = epub.EpubHtml(
        title="Navigation", 
        file_name="nav.xhtml", 
        lang="ja", 
        media_type="application/xhtml+xml"
    )
    nav_page.content = (
        '<!DOCTYPE html>\n'
        '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="ja">\n'
        '<head><meta charset="utf-8" /><title>Navigation</title></head>\n'
        '<body><nav epub:type="toc"><h2>Contents</h2><ol><li><a href="article.xhtml">Article</a></li></ol></nav></body>\n'
        '</html>'
    )
    book.add_item(nav_page)

    book.toc = (c1,)
    if output_path.exists():
        output_path.unlink()
        
    print(f"Total notes packed: {len(flat_notes)}")
    epub.write_epub(output_path, book, {})
    print(f"Successfully generated clean footnote EPUB at: {output_path}")

if __name__ == "__main__":
    main()




