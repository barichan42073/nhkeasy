import argparse
import json

from jinja_render import render_html_from_json_data


def main():
    """
    Parses arguments, loads JSON data, renders HTML, and saves it to a file.
    """
    parser = argparse.ArgumentParser(
        description="Render HTML from a JSON file using a Jinja2 template."
    )
    parser.add_argument("input_file", help="Path to the input JSON file")
    parser.add_argument(
        "-o",
        "--output",
        default="reader.html",
        help="Output HTML file (default: reader.html)",
    )
    parser.add_argument(
        "-t",
        "--template",
        default="template.html",
        help="Jinja2 template file (default: template.html)",
    )

    args = parser.parse_args()

    with open(args.input_file, encoding="utf-8") as f:
        data = json.load(f)

    html = render_html_from_json_data(data, args.template)

    with open(args.output, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"HTML successfully written to {args.output}")


if __name__ == "__main__":
    main()
