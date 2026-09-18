import argparse
from pathlib import Path

from smartreader import process_article_and_render


def main():
    parser = argparse.ArgumentParser(
        description="Process a Japanese news article for translation and vocabulary analysis."
    )
    parser.add_argument("-i", "--input", type=Path, required=True)
    parser.add_argument("-o", "--output", type=Path, required=True)
    parser.add_argument("-t", "--template", type=Path, default=Path("template.html"))

    args = parser.parse_args()

    rendered_html = process_article_and_render(args.input, args.template)

    with open(args.output, "w", encoding="utf-8") as f:
        f.write(rendered_html)


if __name__ == "__main__":
    main()
