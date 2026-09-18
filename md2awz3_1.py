#!/usr/bin/env python3
import os
import shutil
import subprocess
import sys


def prepare_file_paths(input_file: str) -> tuple[str, str, str]:
    """Validates input file existence and resolves input, output, and base filenames."""
    if not os.path.isfile(input_file):
        print(f"Error: File '{input_file}' not found.", file=sys.stderr)
        sys.exit(1)

    base_name = os.path.splitext(os.path.basename(input_file))[0]
    output_file = f"{base_name}.azw3"

    return input_file, output_file, base_name


def convert_to_azw3(input_file: str, output_file: str, title: str, author: str = "NHK Easy"):
    """Handles Calibre binary resolution and conversion execution."""
    # 1. Locate 'ebook-convert' binary
    ebook_convert = shutil.which("ebook-convert")

    # macOS fallback path if not present in system PATH
    if not ebook_convert:
        mac_fallback = "/Applications/calibre.app/Contents/MacOS/ebook-convert"
        if os.path.isfile(mac_fallback):
            ebook_convert = mac_fallback

    if not ebook_convert:
        print(
            "Error: 'ebook-convert' command not found. Please ensure Calibre is installed.",
            file=sys.stderr,
        )
        sys.exit(1)

    # 2. Table Gridline Styling (CSS)
    table_css = (
        "table { border-collapse: collapse; width: 100%; margin-top: 1em; } "
        "th, td { border: 1px solid #888888; padding: 6px; text-align: left; }"
    )

    # 3. Build command list using Option A (separate flag/value pairs)
    cmd = [
        ebook_convert,
        input_file,
        output_file,
        "--page-breaks-before", "//h:h1 | //h:h3",
        "--authors", author,
        "--title", title,
        "--language", "ja",
        "--extra-css", table_css,
    ]

    # 4. Execute conversion
    print(f"Converting '{input_file}' -> '{output_file}'...")
    try:
        subprocess.run(cmd, check=True)
        print(f"Done! Generated: {output_file}")
    except subprocess.CalledProcessError as e:
        print(f"Error during conversion (exit code {e.returncode}).", file=sys.stderr)
        sys.exit(e.returncode)


def main():
    if len(sys.argv) < 2:
        print("Usage: python convert_to_azw3.py <path-to-markdown-file> [title] [author]")
        print('Example: python convert_to_azw3.py nhk_easy_article.md "危険な暑さが続く" "NHK Easy"')
        sys.exit(1)

    raw_input_path = sys.argv[1]
    
    # Separate file handling step
    input_file, output_file, base_name = prepare_file_paths(raw_input_path)

    # Resolve title and author overrides
    title = sys.argv[2] if len(sys.argv) > 2 else base_name
    author = sys.argv[3] if len(sys.argv) > 3 else "NHK Easy"

    # Separate conversion step
    convert_to_azw3(input_file, output_file, title, author)


if __name__ == "__main__":
    main()
