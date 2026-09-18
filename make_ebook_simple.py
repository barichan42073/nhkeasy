import # System Prompt: NHK Easy Article to Markdown Converter

## Role & Goal
You are an expert Japanese Language Learning Assistant and Markdown Formatter. Your task is to extract content from an NHK Easy (or NHK Easy URL/text) source and produce a clean, structured Markdown output specifically formatted for e-reader conversion (such as Calibre to Kindle AZW3).

---

## Core Guidelines & Output Formatting

1. **Title Page**
   * Output the Japanese article title as a Top-Level Heading (`# Title`).
   * Below the title, display the article's publication date/timestamp formatted as italicized secondary text (e.g., `*2024年7月24日 16時00分*` or `*July 24, 2024*`).
   * Follow the title and timestamp with a page break tag: `<div style="page-break-after: always;"></div>`.

2. **Paragraph Structure**
   * Process the article paragraph by paragraph using Heading 3 (`### Paragraph 1`, `### Paragraph 2`, etc.).
   * Under each paragraph heading, provide:
     1. The original Japanese paragraph text.
     2. A line break, followed by the direct English translation of that paragraph.
   * Place a page break tag `<div style="page-break-after: always;"></div>` after **each** English paragraph block.

3. **Vocabulary List (Final Section)**
   * End the document with Heading 3: `### Vocabulary List`.
   * Present vocabulary using a standard Markdown table with the following columns:
     `| Kanji | Hiragana | JLPT Level | Commonness / Domain | Meaning |`

4. **Vocabulary Inclusion Rules**
   * **INCLUDE:**
     * Words at JLPT levels **N1, N2, and N3**.
     * Specialized or domain-specific vocabulary (e.g., weather terms, medical/safety alerts, technical terms).
     * **Kanji Compounds** consisting of two or more kanji (regardless of JLPT level, including N4/N5 compounds like `24日` or `天気`).
   * **STRICT EXCLUSIONS:**
     * **Do NOT include any geographic locations.** This includes all prefectures, cities, towns, villages, regions, regional areas, or countries (e.g., 三重県, 桑名市, 岐阜県, 山梨県, 長野県, 新潟県, 九州, 沖縄, 関東地方, 東北地方, 日本).

---

## Output Template Structure

# [Japanese Article Title]
*[Publication Date / Timestamp]*

<div style="page-break-after: always;"></div>

### Paragraph 1

[Japanese Text for Paragraph 1]

[English Translation for Paragraph 1]

<div style="page-break-after: always;"></div>

### Paragraph 2

[Japanese Text for Paragraph 2]

[English Translation for Paragraph 2]

<div style="page-break-after: always;"></div>

### Vocabulary List

| Kanji | Hiragana | JLPT Level | Commonness / Domain | Meaning |
| :--- | :--- | :--- | :--- | :--- |
| **[Kanji]** | [Hiragana] | [Level] | [Domain/Frequency] | [Meaning] |
import os
from pathlib import Path
import subprocess
import markdown
from google import genai

DEFAULT_INPUT_PATH = "nhk_kokushobi.txt"
DEFAULT_OUTPUT_PATH = "blob_reader.azw3"
XHTML_INTERMEDIATE = "temp_article.xhtml"

def main():
    # 1. Parse Command Line Arguments
    parser = argparse.ArgumentParser(
        description="Convert a Japanese text file into a Kindle AZW3 file with AI translation and rendered vocabulary using Calibre."
    )
    parser.add_argument(
        "-i", "--input", 
        default=DEFAULT_INPUT_PATH,
        help="Path to the input Japanese .txt file"
    )
    parser.add_argument(
        "-o", "--output", 
        default=DEFAULT_OUTPUT_PATH,
        help="Path for the output .azw3 file"
    )

    args = parser.parse_args()
    input_file = args.input
    output_file = args.output

    # 2. Read input file and split Title, Timestamp, and Body
    raw_text = Path(input_file).read_text(encoding="utf-8").strip()
    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]

    title_jp = lines[0] if len(lines) > 0 else "Japanese Article"
    timestamp = lines[1] if len(lines) > 1 else ""
    body_lines = lines[2:] if len(lines) > 2 else lines

    japanese_body = "\n\n".join(body_lines)

    # 3. Query Gemini for English Translation + Vocab Blobs
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    prompt = f"""
Translate this Japanese article into English and pull out vocabulary. 
Return your response in two clear text sections with Markdown headers:

# ENGLISH
The complete English translation in clear, natural paragraphs.

# VOCABULARY
A Markdown table or formatted list of key JLPT N1-N3/specialist vocabulary:
| Kanji | Reading (Hiragana) | Meaning | Level |

Text:
{title_jp}
{japanese_body}
"""

    print(f"Asking Gemini (gemini-3.5-flash) for translation and vocabulary blobs for '{input_file}'...")
    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt
    )

    # 4. Render Markdown to HTML and inject page breaks
    raw_ai_markdown = response.text or ""
    
    # Convert Markdown (including tables) into real HTML tags
    ai_html = markdown.markdown(raw_ai_markdown, extensions=['tables'])

    # Inject page break class before h1/h2 section headers
    ai_html = ai_html.replace('<h1>ENGLISH</h1>', '<div class="page-break"></div><h4>ENGLISH</h4>')
    ai_html = ai_html.replace('<h2>ENGLISH</h2>', '<div class="page-break"></div><h4>ENGLISH</h4>')
    ai_html = ai_html.replace('<h1>VOCABULARY</h1>', '<div class="page-break"></div><h2>VOCABULARY</h2>')
    ai_html = ai_html.replace('<h2>VOCABULARY</h2>', '<div class="page-break"></div><h2>VOCABULARY</h2>')

    # 5. Build XHTML Template with Table and Heading CSS
    xhtml_content = f"""<?xml version="1.0" encoding="utf-8"?>
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
            background-color: #ffffff;
        }}
        .article-header {{
            text-align: center;
            margin-bottom: 2em;
        }}
        .title-jp {{
            font-size: 1.6em;
            font-weight: bold;
            color: #111111;
            margin-bottom: 0.2em;
        }}
        .timestamp {{
            color: #666666;
            font-size: 0.85em;
            margin-top: 0;
        }}
        .japanese-blob {{
            font-size: 1.1em;
            line-height: 1.8;
            margin-bottom: 2em;
        }}
        .ai-response-blob {{
            font-size: 0.95em;
            line-height: 1.6;
            color: #2c3e50;
        }}
        h4 {{
            margin-top: 1em;
            margin-bottom: 0.4em;
            padding-bottom: 0;
            color: #2c3e50;
        }}
        .page-break {{
            page-break-before: always;
            break-before: page;
        }}
        /* Styling for Rendered Vocabulary Tables */
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 1em;
            margin-bottom: 1.5em;
            font-size: 0.9em;
        }}
        th, td {{
            border: 1px solid #d3d3d3;
            padding: 8px 10px;
            text-align: left;
        }}
        th {{
            background-color: #f4f4f4;
            font-weight: bold;
            color: #111111;
        }}
        tr:nth-child(even) {{
            background-color: #fafafa;
        }}
    </style>
</head>
<body>
    <div class="article-header">
        <h1 class="title-jp">{title_jp}</h1>
        <p class="timestamp">{timestamp}</p>
    </div>
    
    <div class="japanese-blob">
        {japanese_body.replace('\n', '<br/>')}
    </div>
    
    <div class="ai-response-blob">
        {ai_html}
    </div>
</body>
</html>"""

    # 6. Write Intermediate XHTML File
    with open(XHTML_INTERMEDIATE, "w", encoding="utf-8") as f:
        f.write(xhtml_content)

    # 7. Run Calibre CLI convert
    try:
        author_meta = f"NHK Reader Generator | {timestamp}" if timestamp else "NHK Reader Generator"

        subprocess.run([
            "ebook-convert",
            XHTML_INTERMEDIATE,
            output_file,
            "--language", "ja",
            "--title", title_jp,
            "--authors", author_meta,
            "--insert-metadata"  # Inserts an explicit title page for Kindle/ebook-viewer
        ], check=True)

        print(f"\nSuccess! Built Kindle file via Calibre -> {output_file}")   

    except FileNotFoundError:
        print("\nError: Calibre compiler tool 'ebook-convert' not found in PATH.")
    finally:
        if os.path.exists(XHTML_INTERMEDIATE):
            os.remove(XHTML_INTERMEDIATE)

if __name__ == "__main__":
    main()
