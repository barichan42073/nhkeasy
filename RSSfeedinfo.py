import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup

# Load XML data
root = ET.fromstring(xml_data)

articles = []
for item in root.findall(".//item"):
    title = item.find("title").text
    link = item.find("link").text
    pub_date = item.find("pubDate").text

    # Extract original link from html inside description tag
    desc_raw = item.find("description").text
    soup = BeautifulSoup(desc_raw, "html.parser")
    orig_link_tag = soup.find("a", string="Original")
    orig_link = orig_link_tag["href"] if orig_link_tag else None

    articles.append(
        {
            "title": title,
            "permalink": link,
            "original_url": orig_link,
            "pub_date": pub_date,
        }
    )

for a in articles:
    print(f"Title: {a['title']}\nURL: {a['permalink']}\n")
