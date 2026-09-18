from bs4 import BeautifulSoup

# Load your HTML file
file_path = "nhkeasier9789.html"

with open(file_path, "r", encoding="utf-8") as f:
    html_content = f.read()

soup = BeautifulSoup(html_content, "html.parser")

# Find and decompose (completely delete) all <rt> tags and their inner text
for rt in soup.find_all("rt"):
    rt.decompose()

# Get the cleaned text or cleaned HTML
clean_text = soup.get_text()

# Save the cleaned text to a new file
with open("cleaned_nhk9789.txt", "w", encoding="utf-8") as f:
    f.write(clean_text)

print("Successfully removed all <rt> tags!")
