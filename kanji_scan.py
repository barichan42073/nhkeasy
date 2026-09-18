import base64
import csv
import io
import json
import os
import re
import sys
import time
import zipfile
from google import genai
from google.genai import types
from PIL import Image, UnidentifiedImageError

# Setup SDK Clients
gemini_key = os.getenv("GEMINI_API_KEY")
groq_key = os.getenv("GROQ_API_KEY")

if not gemini_key:
    raise ValueError("GEMINI_API_KEY environment variable not found.")

gemini_client = genai.Client(api_key=gemini_key)

groq_client = None
if groq_key:
    from groq import Groq
    groq_client = Groq(api_key=groq_key)


def get_chapter_number(filename: str) -> int:
    """Extract chapter integer for natural numeric sorting (e.g., 'chapter10.jpeg' -> 10)."""
    match = re.search(r"chapter(\d+)", filename, re.IGNORECASE)
    return int(match.group(1)) if match else 999


def image_to_base64(image: Image.Image) -> str:
    """Convert PIL Image to base64 string for Groq payload."""
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")


def call_groq_vision_fallback(image: Image.Image, prompt: str) -> str:
    """Fallback handler using Groq Vision API if Gemini hits rate limits."""
    if not groq_client:
        raise RuntimeError(
            "GROQ_API_KEY not set in environment. Cannot execute fallback."
        )

    print(" -> Gemini Rate Limit hit. Switching to Groq Vision fallback...")
    base64_img = image_to_base64(image)

    system_prompt = (
        prompt
        + "\nReturn ONLY a JSON array with objects containing 'kanji', 'radical_symbol', and 'bushimei'. "
        'Example: [{"kanji": "仏", "radical_symbol": "亻", "bushimei": "にんべん"}]'
    )

    response = groq_client.chat.completions.create(
        model="llama-3.2-11b-vision-preview",  # Or 'qwen/qwen3.6-27b'
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": system_prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_img}"
                        },
                    },
                ],
            }
        ],
        temperature=0.1,
        response_format={"type": "json_object"},
    )
    return response.choices[0].message.content


def call_gemini_with_fallback(image: Image.Image, prompt: str) -> str:
    """Sends image to gemini-2.5-flash, falls back to Groq Vision if rate-limited."""
    schema = {
        "type": "ARRAY",
        "items": {
            "type": "OBJECT",
            "properties": {
                "kanji": {"type": "STRING"},
                "radical_symbol": {"type": "STRING"},
                "bushimei": {"type": "STRING"},
            },
            "required": ["kanji", "radical_symbol", "bushimei"],
        },
    }

    config = types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=schema,
    )

    try:
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[image, prompt],
            config=config,
        )
        return response.text
    except Exception as e:
        err_msg = str(e).lower()
        if (
            "429" in err_msg
            or "resourceexhausted" in err_msg
            or "quota" in err_msg
        ):
            return call_groq_vision_fallback(image, prompt)
        else:
            raise e


def process_zip_of_scans(zip_path: str, output_csv_path: str):
    prompt = """
    Look at this Japanese textbook page scan.
    1. Find the grey-shaded box/area containing Kanji characters.
    2. Extract each Kanji inside that shaded box.
    3. For each Kanji, identify its main radical symbol (部首) and its reading/name in Japanese (部首名).
    """

    all_rows = []

    with zipfile.ZipFile(zip_path, "r") as z:
        sorted_files = sorted(
            z.infolist(), key=lambda x: get_chapter_number(x.filename)
        )

        for zip_info in sorted_files:
            filename = zip_info.filename

            if zip_info.is_dir() or os.path.basename(filename).startswith("._"):
                continue

            if filename.lower().endswith((".jpg", ".jpeg")):
                chapter_num = get_chapter_number(filename)

                with z.open(zip_info) as img_file:
                    img_bytes = img_file.read()

                    try:
                        image = Image.open(io.BytesIO(img_bytes))
                        image.verify()
                        image = Image.open(io.BytesIO(img_bytes))
                    except (UnidentifiedImageError, OSError):
                        print(f"Skipping invalid file: {filename}")
                        continue

                    print(f"Processing {filename}...")

                    try:
                        response_text = call_gemini_with_fallback(image, prompt)

                        clean_json = (
                            response_text.strip()
                            .removeprefix("```json")
                            .removesuffix("```")
                            .strip()
                        )
                        data = json.loads(clean_json)

                        if isinstance(data, dict):
                            data = data.get("kanji", data.get("data", [data]))

                        for item in data:
                            radical_full = f"{item['radical_symbol']} ({item['bushimei']})"
                            all_rows.append(
                                {
                                    "Kanji": item["kanji"],
                                    "Radical": radical_full,
                                    "Chapter": chapter_num,
                                    "Source_File": filename,
                                }
                            )
                    except Exception as err:
                        print(f"Failed to process {filename}: {err}")
                        continue

                    time.sleep(1)

    all_rows.sort(key=lambda x: x["Chapter"])

    with open(
        output_csv_path, "w", newline="", encoding="utf-8-sig"
    ) as csv_file:
        fieldnames = ["Kanji", "Radical", "Chapter", "Source_File"]
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_rows)

    print(
        f"\nExtraction complete! Output saved to: {output_csv_path} ({len(all_rows)} rows)"
    )


if __name__ == "__main__":
    if len(sys.argv) >= 3:
        input_zip = sys.argv[1]
        output_csv = sys.argv[2]
    else:
        input_zip = "kanji_scans.zip"
        output_csv = "extracted_kanji.csv"

    print(f"Input ZIP:  {input_zip}")
    print(f"Output CSV: {output_csv}\n")

    process_zip_of_scans(input_zip, output_csv)
