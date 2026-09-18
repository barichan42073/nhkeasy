import re
import os
import json
import webbrowser
from sudachipy import dictionary, tokenizer

# Initialize Sudachi with Mode C
tokenizer_obj = dictionary.Dictionary().create()
mode = tokenizer.Tokenizer.SplitMode.C 

# --- DATA LOADING ---
def load_jlpt_data():
    try:
        with open('jlpt_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            vocab_db = data.get("vocab", {})
            easy_kanji = set(
                data["kanji"].get("n5", "") + 
                data["kanji"].get("n4", "") + 
                data["kanji"].get("n3", "")
            )
            return vocab_db, easy_kanji
    except (FileNotFoundError, KeyError):
        return {}, set()

VOCAB_DB, EASY_KANJI_SET = load_jlpt_data()

def get_word_level(surface, base_form):
    if base_form in VOCAB_DB:
        level = VOCAB_DB[base_form].lower()
        return "hard" if level in ["n1", "n2"] else "easy"
    for char in surface:
        if '\u4e00' <= char <= '\u9faf':
            if char not in EASY_KANJI_SET:
                return "hard"
    return "easy"

def katakana_to_hiragana(text):
    return "".join([chr(ord(c) - 0x60) if "\u30a1" <= c <= "\u30f6" else c for c in text])

def contains_kanji(text):
    return bool(re.search(r'[\u4e00-\u9faf]', text))

def get_nhk_info(pos_tuple, base_form):
    """NHK uses colored text and dotted underlines for entities."""
    pos_str = "-".join(pos_tuple)
    # Green for People (人名)
    if "人名" in pos_str:
        return "color: #008800; border-bottom: 2px dotted #008800;", f"Person: {base_form}"
    # Orange/Brown for Places (地名)
    elif "地名" in pos_str or "地域" in pos_str:
        return "color: #a0522d; border-bottom: 2px dotted #a0522d;", f"Place: {base_form}"
    # Blue for Organizations (組織)
    elif "組織" in pos_str:
        return "color: #0000dd; border-bottom: 2px dotted #0000dd;", f"Organization: {base_form}"
    return None, None

def process_japanese_text(input_file, horizontal_out):
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()

        tokens = tokenizer_obj.tokenize(content, mode)
        token_map = {}
        processed_indices = set()

        for t in tokens:
            if t.begin() not in processed_indices:
                token_map[t.begin()] = t
                for i in range(t.begin(), t.end()):
                    processed_indices.add(i)

        horizontal_elements = []
        char_idx = 0
        while char_idx < len(content):
            if char_idx in token_map:
                t = token_map[char_idx]
                surface = t.surface()
                pos_tuple = t.part_of_speech()
                base = t.dictionary_form()
                
                if surface.strip() and pos_tuple[0] != "空白":
                    level = get_word_level(surface, base)
                    if contains_kanji(surface):
                        reading = katakana_to_hiragana(t.reading_form())
                        display_word = f'<ruby data-level="{level}">{surface}<rt>{reading}</rt></ruby>'
                    else:
                        display_word = surface

                    style, tooltip = get_nhk_info(pos_tuple, base)
                    styled_word = f'<span class="entity" style="{style}" title="{tooltip}">{display_word}</span>' if style else display_word
                    horizontal_elements.append(styled_word)
                else:
                    if "\n" in surface:
                        horizontal_elements.append("<br><br>")
                    else:
                        horizontal_elements.append(surface)
                char_idx = t.end()
            else:
                horizontal_elements.append(content[char_idx])
                char_idx += 1

        # --- INDENTATION FIXED HERE ---
        with open(horizontal_out, 'w', encoding='utf-8') as f:
            f.write("""<!DOCTYPE html>
<html><head><meta charset='utf-8'>
<style>
    body { 
        font-family: "Helvetica Neue", Helvetica, Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Meiryo", sans-serif;
        padding: 60px; 
        line-height: 3.5; 
        background-color: #ffffff; 
        color: #333333;
    }
    .controls { 
        background: #fdfdfd; 
        padding: 20px; 
        border-bottom: 1px solid #eee;
        margin-bottom: 40px; 
        position: sticky; 
        top: 0; 
        z-index: 100;
        text-align: center;
    }
    .reader-box { 
        font-size: 1.6rem; 
        max-width: 900px;
        margin: 0 auto;
        letter-spacing: 0.05em;
    }
    ruby { ruby-position: over; }
    rt {
        font-size: 0.5em;
        color: #1c75bb; 
        line-height: 1;
        padding-bottom: 0.2em;
    }
    .mode-none rt { visibility: hidden; }
    .mode-all rt { visibility: visible; }
    .mode-hard rt { visibility: hidden; }
    .mode-hard ruby[data-level="hard"] rt { visibility: visible; }
    .entity { font-weight: bold; text-decoration: none; }
    button { 
        padding: 8px 20px; 
        background: white; 
        border: 2px solid #ddd; 
        border-radius: 25px; 
        cursor: pointer;
        font-weight: bold;
        color: #666;
        margin: 0 5px;
        transition: all 0.2s ease;
    }
    button.active {
        background-color: #1c75bb;
        color: white;
        border-color: #1c75bb;
    }
    button:hover:not(.active) { border-color: #1c75bb; color: #1c75bb; }
</style>
<script>
    function setFurigana(mode, element) {
        document.getElementById('reader').className = 'reader-box ' + mode;
        const buttons = document.querySelectorAll('.controls button');
        buttons.forEach(btn => btn.classList.remove('active'));
        element.classList.add('active');
    }
</script>
</head><body>
    <div class="controls">
        <button onclick="setFurigana('mode-none', this)">ふりがな なし</button>
        <button class="active" onclick="setFurigana('mode-all', this)">ふりがな あり</button>
        <button onclick="setFurigana('mode-hard', this)">むずかしい だけ</button>
    </div>
    <div id="reader" class="reader-box mode-all">""")
            
            # The following two lines are now inside the 'with' block
            f.write("".join(horizontal_elements))
            f.write('</div></body></html>')        
            
        webbrowser.open('file://' + os.path.realpath(horizontal_out))

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    process_japanese_text('news.txt', 'reading.html')
