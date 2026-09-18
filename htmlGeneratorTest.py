import json
import os

def build_html(news_data):
    """
    Takes a JSON object (list of dicts) and returns a complete HTML string.
    This can be used with data directly from an API or a file.
    """
    # 1. Process Sentences into HTML
    content_html = ""
    for entry in news_data:
        jp_text = entry["japanese"]
        
        # Sort tokens by length (longest first) to prevent nested tag errors
        # e.g., '小学校' should be processed before '学校'
        sorted_tokens = sorted(entry["tokens"], key=lambda x: len(x["kanji"]), reverse=True)
        
        for token in sorted_tokens:
            # Get dict form and its specific dictionary reading for Anki
            dict_form = token.get("dict", token["kanji"])
            dict_reading = token.get("dict_reading", token["reading"])
            
            # Create the Ruby HTML with dict_reading added as 'data-dr'
            ruby = (f'<ruby class="compound" '
                    f'data-r="{token["reading"]}" '
                    f'data-m="{token["meaning"]}" '
                    f'data-d="{dict_form}" '
                    f'data-dr="{dict_reading}" '
                    f'onclick="handleVocab(event, this)">'
                    f'{token["kanji"]}<rt>{token["reading"]}</rt></ruby>')
            
            jp_text = jp_text.replace(token["kanji"], ruby)
        
        # Wrap each sentence in a div for selection
        content_html += f'<div class="sentence-wrapper" onclick="showAnalysis(\'{entry["id"]}\', this)">{jp_text}</div>\n'

    translations_map = {entry["id"]: entry["english"] for entry in news_data}

    # 2. Return the Final HTML Template String
    return f"""
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>AI News Reader</title>
    <style>
        :root {{ --primary: #2563eb; --bg: #f8fafc; --sidebar: #ffffff; --sidebar-w: 380px; }}
        body {{ font-family: 'Helvetica Neue', Arial, sans-serif; background: var(--bg); margin: 0; display: flex; height: 100vh; overflow: hidden; }}
        #main-content {{ flex: 1; margin-right: var(--sidebar-w); padding: 60px; overflow-y: auto; line-height: 2.2; font-size: 1.5rem; }}
        .hide-furigana ruby rt {{ display: none !important; }}
        .sentence-wrapper {{ cursor: pointer; padding: 12px 18px; border-radius: 12px; margin-bottom: 6px; border-left: 5px solid transparent; transition: 0.2s; }}
        .sentence-wrapper:hover {{ background: rgba(37, 99, 235, 0.05); }}
        .sentence-wrapper.active {{ background: #dbeafe; border-left-color: var(--primary); }}
        .compound {{ color: var(--primary); font-weight: 700; cursor: pointer; border-bottom: 2px solid #e2e8f0; }}
        #sidebar {{ position: fixed; right: 0; top: 0; width: var(--sidebar-w); height: 100vh; background: var(--sidebar); border-left: 1px solid #e2e8f0; display: flex; flex-direction: column; }}
        .panel {{ padding: 25px; border-bottom: 1px solid #f1f5f9; }}
        .btn-toggle {{ position: fixed; top: 20px; left: 20px; padding: 10px 22px; z-index: 1000; cursor: pointer; border-radius: 30px; font-weight: bold; transition: 0.3s; border: 2px solid #cbd5e1; background: white; color: #64748b; }}
        .btn-active {{ background: var(--primary); color: white; border-color: var(--primary); }}
        .vocab-card {{ background:#fff; padding:15px; border-radius:10px; margin-bottom:12px; border:1px solid #e2e8f0; font-size:0.95rem; }}
        .dict-tag {{ font-size: 0.7rem; color: #2563eb; background: #eff6ff; padding: 3px 8px; border-radius: 5px; font-weight: 800; }}
    </style>
</head>
<body id="reader-body" class="hide-furigana">
    <button id="furigana-btn" class="btn-toggle" onclick="toggleFurigana()">Furigana: OFF</button>
    <div id="main-content">{content_html}</div>
    <div id="sidebar">
        <div class="panel"><h3>Translation</h3><div id="analysis-content" style="color:#475569; font-style: italic;">Select a sentence...</div></div>
        <div class="panel">
            <h3 style="margin:0">Vocab List <span id="badge" style="background:var(--primary); color:white; padding:2px 10px; border-radius:12px; font-size:0.75em;">0</span></h3>
            <div style="display:flex; gap:10px; margin-top:15px;">
                <button onclick="copyVocab()" style="flex:2; padding:10px; cursor:pointer; font-weight:bold; border-radius:6px; background:white; border:1px solid #cbd5e1;">Copy for Anki (CSV)</button>
                <button onclick="clearVocab()" style="flex:1; padding:10px; cursor:pointer; background:#fee2e2; border:none; color:#dc2626; border-radius:6px;">Clear</button>
            </div>
        </div>
        <div id="list-items" style="flex:1; overflow-y:auto; padding:20px; background: #fcfcfc;"></div>
    </div>
    <script>
        const translations = {json.dumps(translations_map)};
        const vocabRegistry = new Map();

        function toggleFurigana() {{
            const body = document.getElementById('reader-body');
            const btn = document.getElementById('furigana-btn');
            body.classList.toggle('hide-furigana');
            const isHidden = body.classList.contains('hide-furigana');
            btn.innerText = isHidden ? "Furigana: OFF" : "Furigana: ON";
            btn.classList.toggle('btn-active', !isHidden);
        }}

        function showAnalysis(id, el) {{
            document.querySelectorAll('.sentence-wrapper').forEach(s => s.classList.remove('active'));
            el.classList.add('active');
            document.getElementById('analysis-content').innerText = translations[id];
        }}

        function handleVocab(event, el) {{
            event.stopPropagation();
            const word = el.childNodes[0].textContent.trim();
            if (vocabRegistry.has(word)) return;
            
            vocabRegistry.set(word, {{ 
                m: el.dataset.m, 
                d: el.dataset.d,
                dr: el.dataset.dr
            }});
            
            const card = document.createElement('div');
            card.className = "vocab-card";
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                    <strong>${{word}}</strong>
                    <span class="dict-tag">Dict: ${{el.dataset.d}}</span>
                </div>
                <div style="color:#64748b; font-size:0.85rem;">(${{el.dataset.dr}})</div>
                <div style="color:#334155; margin-top:5px;">${{el.dataset.m}}</div>
            `;
            document.getElementById('list-items').prepend(card);
            document.getElementById('badge').innerText = vocabRegistry.size;
        }}

        function clearVocab() {{ vocabRegistry.clear(); document.getElementById('list-items').innerHTML = ''; document.getElementById('badge').innerText = '0'; }}
        
        function copyVocab() {{
            if (vocabRegistry.size === 0) return;
            let csv = "";
            vocabRegistry.forEach((v, k) => {{
                csv += `"${{v.d}}","${{v.dr}}","${{v.m}}"\\n`;
            }});
            navigator.clipboard.writeText(csv).then(() => alert("Anki-ready CSV Copied!"));
        }}
    </script>
</body>
</html>
"""

if __name__ == "__main__":
    # The 'Main' logic now handles the file opening
    input_filename = "processed_news.json"
    output_filename = "reader.html"

    if os.path.exists(input_filename):
        with open(input_filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Generate the HTML string using the core function
        final_html = build_html(data)
        
        # Save to file
        with open(output_filename, "w", encoding="utf-8") as f:
            f.write(final_html)
        print(f"--- Process Complete! Open {output_filename} in your browser. ---")
    else:
        print(f"Error: {input_filename} not found.")
