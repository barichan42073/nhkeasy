#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

# Navigate to your project directory (adjust if needed)
cd "$(dirname "$0")"

# Activate your virtual environment if you use one
if [ -d ".venv" ]; then
  source .venv/bin/activate
fi

echo "--- Starting Pipeline ---"
# Pass any arguments received by this script directly to pipeline.py
python3 pipeline.py "$@"

echo "--- Publishing to Nginx ---"
# Sync local data directory to /var/www/html
# -a: archive mode, -v: verbose, -r: recursive
#rsync -av --exclude='feed/' /home/nev/.local/share/nhkeasy/ /var/www/html/
rsync -av --exclude='feed/' --exclude='staging/' --exclude='smartreader/' \
  --exclude='epubs/' --exclude='combined_slowed.mp3' --exclude='audio/' --exclude='vocabulary/' --exclude='*.apkg' \
  /home/nev/.local/share/nhkeasy/ /var/www/html/

echo "--- Success! Published to http://localhost ---"
