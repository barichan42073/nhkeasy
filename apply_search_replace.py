#!/usr/bin/env python3
# Usage
# cp app.py app.py.bak
# python apply_search_replace.py app.py changes.txt
# # git diff -- app.py


import sys
from pathlib import Path

if len(sys.argv) != 3:
    print(f"Usage: {sys.argv[0]} FILE BLOCKS.txt")
    sys.exit(2)

file_path = Path(sys.argv[1])
blocks_path = Path(sys.argv[2])

text = file_path.read_text()
blocks = blocks_path.read_text()

start_marker = "<<<<<<< SEARCH"
middle_marker = "======="
end_marker = ">>>>>>> REPLACE"

pos = 0
count = 0

while True:
    start = blocks.find(start_marker, pos)
    if start == -1:
        break

    search_start = start + len(start_marker)
    middle = blocks.find(middle_marker, search_start)
    end = blocks.find(end_marker, middle + len(middle_marker))

    if middle == -1 or end == -1:
        raise SystemExit("Malformed SEARCH/REPLACE block")

    old = blocks[search_start:middle]
    new = blocks[middle + len(middle_marker):end]

    # Aider's block markers normally put a newline after each marker.
    if old.startswith("\n"):
        old = old[1:]
    if new.startswith("\n"):
        new = new[1:]

    occurrences = text.count(old)

    if occurrences == 0:
        raise SystemExit(f"SEARCH text not found:\n{old}")
    if occurrences > 1:
        raise SystemExit(
            f"SEARCH text occurs {occurrences} times; refusing ambiguous replacement:\n{old}"
        )

    text = text.replace(old, new, 1)
    count += 1
    pos = end + len(end_marker)

file_path.write_text(text)
print(f"Applied {count} replacement(s) to {file_path}")

