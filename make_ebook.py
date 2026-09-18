import ebooklib
from ebooklib import epub
from pathlib import Path
import logging
from typing import List, Dict

# Assuming these imports will work based on project structure
from geminitranslation import get_article_translation, DeepDive

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def load_article_text(path: str | Path) -> str:
    """Reads the entire content of a file."""
    try:
        return Path(path).read_text(encoding="utf-8")
    except FileNotFoundError:
        logging.error(f"Input file not found at {path}")
        raise

def extract_vocabulary(translation_data: DeepDive) -> List[Dict]:
    """Extracts JLPT N1-N3 and specialist vocabulary."""
    vocab_list = []
    seen_bases = set()
    allowed_levels = {'JLPT N1', 'JLPT N2', 'JLPT N3', 'Specialist'}

    if not hasattr(translation_data, 'sentences'):
        logging.warning("translation_data has no 'sentences' attribute. Cannot extract vocabulary.")
        return []

    for sentence in translation_data.sentences:
        if not hasattr(sentence, 'tokens'):
            continue
        for token in getattr(sentence, 'tokens', []):
            token_level = token.get('level', '')
            base_form = token.get('base', '')

            if base_form and base_form not in seen_bases:
                # Check if any part of the level string matches our allowed levels
                if any(level in token_level for level in allowed_levels):
                    vocab_list.append({
                        'word': token.get('surface', ''),
                        'reading': token.get('reading', ''),
                        'meaning': token.get('translation', ''),
                        'level': token_level,
                    })
                    seen_bases.add(base_form)
    
    return sorted(vocab_list, key=lambda x: x['reading'])

def build_translation_chapter_html(translation_data: DeepDive) -> str:
    """Builds the HTML for the chapter with Japanese text and English translation."""
    title_jp = getattr(translation_data, 'title_jp', 'Japanese Text')
    title_en = getattr(translation_data, 'title_en', 'English Translation')

    html_parts = [f'<h1>{title_jp}</h1>', f'<h2>{title_en}</h2>']
    
    if not hasattr(translation_data, 'sentences'):
        logging.warning("translation_data has no 'sentences' attribute for chapter generation.")
        return "".join(html_parts)

    for sentence in translation_data.sentences:
        html_parts.append(f'<p lang="ja">{getattr(sentence, "jp", "")}</p>')
        html_parts.append(f'<p lang="en">{getattr(sentence, "en", "")}</p>')
    
    return "\n".join(html_parts)

def build_vocab_appendix_html(vocab_list: List[Dict]) -> str:
    """Builds the HTML table for the vocabulary appendix."""
    if not vocab_list:
        return "<h1>Vocabulary Appendix</h1><p>No vocabulary to display.</p>"

    table_header = """
    <thead>
      <tr>
        <th>Kanji/Word</th>
        <th>Reading</th>
        <th>English Meaning</th>
        <th>Level/Category</th>
      </tr>
    </thead>
    """
    
    rows = []
    for item in vocab_list:
        rows.append(f"""
        <tr>
          <td>{item['word']}</td>
          <td>{item['reading']}</td>
          <td>{item['meaning']}</td>
          <td>{item['level']}</td>
        </tr>
        """)
    
    table_body = f"<tbody>{''.join(rows)}</tbody>"
    
    style = """
    <style>
      body { font-family: sans-serif; }
      table { width: 100%; border-collapse: collapse; margin-top: 1em;}
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
      td[lang="ja"] { font-family: "Hiragino Mincho ProN", "MS Mincho", serif; }
    </style>
    """
    
    return f"""
    <h1>Vocabulary Appendix</h1>
    {style}
    <table>
      {table_header}
      {table_body}
    </table>
    """

def create_epub(title: str, author: str, chapter_html: str, appendix_html: str, output_file: str):
    """Creates an EPUB file with the given content."""
    book = epub.EpubBook()

    # Set metadata
    book.set_identifier('id_jp_reader_001')
    book.set_title(title)
    book.set_language('en')
    book.add_author(author)

    # CSS for Japanese text styling
    style = '''
@namespace epub "http://www.idpf.org/2007/ops";
body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
p[lang="ja"] {
    font-family: "Hiragino Mincho ProN", "MS Mincho", serif;
    -epub-writing-mode: horizontal-tb;
    line-height: 1.8;
}
'''
    nav_css = epub.EpubItem(uid="style_nav", file_name="style/nav.css", media_type="text/css", content=style)
    book.add_item(nav_css)

    # Create chapter
    chapter1 = epub.EpubHtml(title='Main Text', file_name='chap_01.xhtml', lang='ja')
    chapter1.content = f'<html><head><title>Main Text</title><link rel="stylesheet" type="text/css" href="style/nav.css"></head><body>{chapter_html}</body></html>'
    book.add_item(chapter1)
    chapter1.add_item(nav_css)

    # Create appendix
    appendix = epub.EpubHtml(title='Vocabulary', file_name='appendix_01.xhtml', lang='en')
    appendix.content = f'<html><head><title>Vocabulary</title><link rel="stylesheet" type="text/css" href="style/nav.css"></head><body>{appendix_html}</body></html>'
    book.add_item(appendix)
    appendix.add_item(nav_css)
    
    # Define TOC
    book.toc = (epub.Link('chap_01.xhtml', 'Main Text', 'main_text'),
                epub.Link('appendix_01.xhtml', 'Vocabulary', 'vocab'))

    # Add default NCX and Nav file
    book.add_item(epub.EpubNcx())
    book.add_item(epub.EpubNav())

    # Define spine
    book.spine = ['nav', chapter1, appendix]

    # Write to file
    epub.write_epub(output_file, book, {})
    logging.info(f"Successfully created {output_file}")


def main():
    """Main script to generate the EPUB."""
    input_file = './nhk_kokushobi.txt'
    output_file = 'japanese_reader.epub'
    
    logging.info(f"Reading from {input_file}...")
    japanese_text = load_article_text(input_file)
    
    logging.info("Translating and analyzing text...")
    # This might take a while and require API keys to be set up in the environment
    try:
        translation_data = get_article_translation(japanese_text)
    except Exception as e:
        logging.error(f"Failed to get article translation: {e}")
        logging.error("Please ensure your environment is configured correctly for the translation API.")
        return

    logging.info("Extracting vocabulary...")
    vocab = extract_vocabulary(translation_data)
    
    logging.info("Building EPUB content...")
    chapter_content = build_translation_chapter_html(translation_data)
    appendix_content = build_vocab_appendix_html(vocab)
    
    title = getattr(translation_data, 'title_en', "Japanese Reader")
    logging.info(f"Creating EPUB file: {output_file}...")
    create_epub(
        title=title,
        author="Ebook Generator",
        chapter_html=chapter_content,
        appendix_html=appendix_content,
        output_file=output_file
    )

if __name__ == '__main__':
    main()
