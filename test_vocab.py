import argparse
import json
import sys
from pathlib import Path

# Assuming test_vocab.py is at the same level as pipeline.py
from vocab_extractor import filter_vocabulary_from_markdown


def main():
    parser = argparse.ArgumentParser(
        description="Test the filter_vocabulary_from_markdown function with a given Markdown file."
    )
    parser.add_argument(
        "markdown_file",
        type=Path,
        help="Path to the Markdown file containing vocabulary.",
    )
    parser.add_argument(
        "--max-words",
        type=int,
        default=3,
        help="Maximum number of filtered words to return (default: 3).",
    )
    args = parser.parse_args()

    if not args.markdown_file.exists():
        print(f"Error: Markdown file not found at {args.markdown_file}")
        sys.exit(1)

    try:
        markdown_content = args.markdown_file.read_text(encoding="utf-8")
    except OSError as e:
        print(f"Error reading Markdown file {args.markdown_file}: {e}")
        sys.exit(1)

    print(f"Processing vocabulary from {args.markdown_file}...")
    filtered_vocab = filter_vocabulary_from_markdown(
        markdown_content, max_words=args.max_words
    )

    if filtered_vocab:
        print("\n--- Filtered Vocabulary ---")
        print(json.dumps(filtered_vocab, ensure_ascii=False, indent=2))
        print(f"\nFound {len(filtered_vocab)} eligible vocabulary words.")
    else:
        print("\nNo eligible vocabulary found.")


if __name__ == "__main__":
    main()
