import sys
import requests
from bs4 import BeautifulSoup


def extract_nhk_easier_article(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return f"Error fetching the webpage: {e}"

    soup = BeautifulSoup(response.text, "html.parser")

    # Find the main article container
    article = soup.find("article", lang="ja")
    if not article:
        return "Could not find the article container in the page."

    # Remove the Furigana (<rt>) tags to prevent them from merging with the Kanji text
    for rt in article.find_all("rt"):
        rt.decompose()

    # Extract Title (h3)
    title_tag = article.find("h3")
    title = title_tag.get_text(strip=True) if title_tag else "No Title"

    # Extract Publish Date (time)
    time_tag = article.find("time")
    date = time_tag.get_text(strip=True) if time_tag else ""

    # Extract all paragraphs (<p>) of the body text
    paragraphs = []
    for p in article.find_all("p", recursive=False):
        text = p.get_text(strip=True)
        if text:
            paragraphs.append(text)

    body_text = "\n\n".join(paragraphs)

    # Format the plain text output
    plain_text_output = f"{title}\n"
    if date:
        plain_text_output += f"Date: {date}\n"
    plain_text_output += "=" * 40 + "\n\n"
    plain_text_output += body_text

    return plain_text_output


if __name__ == "__main__":
    # You can supply the URL as a command line argument, or use the default one
    target_url = (
        sys.argv[1]
        if len(sys.argv) > 1
        else "https://nhkeasier.com/story/9796/"
    )

    print(f"Extracting article from: {target_url}\n")
    article_text = extract_nhk_easier_article(target_url)
    print(article_text)
