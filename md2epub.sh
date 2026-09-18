#!/usr/bin/env bash

set -euo pipefail

# 1. Check if an input file was provided
if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <path-to-markdown-file> [title] [author]"
  echo "Example: $0 nhk_easy_article.md \"危険な暑さが続く\" \"NHK Easy\""
  exit 1
fi

INPUT_FILE="$1"

# 2. Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
  echo "Error: File '$INPUT_FILE' not found."
  exit 1
fi

# 3. Derive output filename ("inputfile.azw3")
FILENAME=$(basename -- "$INPUT_FILE")
FILENAME_NO_EXT="${FILENAME%.*}"
OUTPUT_FILE="${FILENAME_NO_EXT}.epub"

# 4. Set optional Title and Author (default to filename and "NHK Easy" if not provided)
TITLE="${2:-$FILENAME_NO_EXT}"
AUTHOR="${3:-NHK Easy}"

# 5. Check if ebook-convert command is available
EBOOK_CONVERT="ebook-convert"

if ! command -v "$EBOOK_CONVERT" &>/dev/null; then
  # Fallback paths for macOS / Linux if not in PATH
  if [ -f "/Applications/calibre.app/Contents/MacOS/ebook-convert" ]; then
    EBOOK_CONVERT="/Applications/calibre.app/Contents/MacOS/ebook-convert"
  else
    echo "Error: 'ebook-convert' command not found. Make sure Calibre is installed."
    exit 1
  fi
fi

# 6. Execute conversion
echo "Converting '$INPUT_FILE' -> '$OUTPUT_FILE'..."

"$EBOOK_CONVERT" "$INPUT_FILE" "$OUTPUT_FILE" \
  --page-breaks-before="//h:h1 | //h:h3" \
  --authors "$AUTHOR" \
  --title "$TITLE" \
  --language "ja"

echo "Done! Generated: $OUTPUT_FILE"
