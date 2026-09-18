import argparse
import sys
from pathlib import Path
import asyncio

# Adjust the path to import from nhkeasier_to_azw3.py
# Assuming debug_nhk_parser.py is in the same directory as nhkeasier_to_azw3.py
script_dir = Path(__file__).parent
sys.path.insert(0, str(script_dir))

from nhkeasier_to_azw3 import fetch_article_html, extract_article_content_from_html


async def main():
    parser = argparse.ArgumentParser(
        description="Fetch an NHK Easy article and print its parsed content."
    )
    parser.add_argument("--url", help="URL of the NHK Easy / NHK Easier article (mutually exclusive with --input-html)")
    parser.add_argument("--input-html", help="Optional: Read HTML content from this local file path instead of fetching from URL")
    parser.add_argument("--save-html", help="Optional: Save the fetched raw HTML to this file path (only used with --url)")
    
    args = parser.parse_args()

    if args.url and args.input_html:
        parser.error("Arguments --url and --input-html are mutually exclusive. Please provide only one.")
    if not args.url and not args.input_html:
        parser.error("Either --url or --input-html must be provided.")
    if args.save_html and not args.url:
        parser.error("--save-html can only be used when --url is provided.")

    html_content = ""
    if args.input_html:
        input_html_path = Path(args.input_html)
        if not input_html_path.is_file():
            print(f"Error: Input HTML file not found at '{input_html_path}'", file=sys.stderr)
            sys.exit(1)
        try:
            html_content = input_html_path.read_text(encoding="utf-8")
            print(f"Read HTML content from '{input_html_path.resolve()}'")
        except Exception as e:
            print(f"Error reading HTML from file '{input_html_path}': {e}", file=sys.stderr)
            sys.exit(1)
    elif args.url:
        # 1. Fetch HTML
        html_content = await fetch_article_html(args.url)
        
        # Save raw HTML to disk if requested
        if args.save_html:
            output_html_path = Path(args.save_html)
            try:
                output_html_path.write_text(html_content, encoding="utf-8")
                print(f"\nRaw HTML fetched and saved to '{output_html_path.resolve()}'")
            except Exception as e:
                print(f"Error saving HTML to file '{output_html_path}': {e}", file=sys.stderr)
    
    # 2. Extract core content from HTML
    article_title, article_text = extract_article_content_from_html(html_content)

    print("\n--- Raw HTML Content (first 1000 chars) ---")
    print(html_content[:1000] + ("..." if len(html_content) > 1000 else ""))
    print("\n--------------------------------------------")

    print("\n--- Extracted Article Title ---")
    print(article_title)
    print("\n-------------------------------")

    print("\n--- Extracted Article Text ---")
    print(article_text)
    print("\n------------------------------")

    if not article_title and article_text == html_content:
        print("\nNote: Title extraction failed, and raw HTML was returned as article text.")
        print("This indicates that the content selectors likely failed.")


if __name__ == "__main__":
    asyncio.run(main())
