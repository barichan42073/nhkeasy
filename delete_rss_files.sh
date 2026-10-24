#!/bin/bash
# This script deletes three specific files if they exist.

# Exit immediately if a command exits with a non-zero status.
set -euo pipefail

# Define the file paths. It's crucial to double-quote paths, especially those with
# spaces, special characters, or non-ASCII characters, to prevent word splitting
# and globbing issues.
FILE1="/home/nev/.local/share/nhkeasy/feed/processed_history.json"
FILE2="/home/nev/.local/share/nhkeasy/feed/articles.json"
FILE3="/home/nev/.local/share/nhkeasy/smartreader/7日ごろまで_雨が続きそう_気をつけてください_https___nhkeasier.com_story_9932_.html"

echo "Starting deletion process for specified RSS fetcher files..."

# Function to safely delete a file
delete_if_exists() {
  local file_path="$1"
  if [ -f "$file_path" ]; then
    echo "Deleting: $file_path"
    rm "$file_path"
    if [ $? -eq 0 ]; then
      echo "Successfully deleted: $(basename "$file_path")"
    else
      echo "Error deleting: $(basename "$file_path")" >&2
      # Optionally exit here if an error deleting a file is critical
      # exit 1
    fi
  else
    echo "File not found, skipping: $file_path"
  fi
}

# Call the function for each file
delete_if_exists "$FILE1"
delete_if_exists "$FILE2"
delete_if_exists "$FILE3"

echo "Deletion process complete."
