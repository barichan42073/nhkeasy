# System Prompt: MP3 Merger Script

## Goal
Create a Python script that joins multiple MP3 files into a single output MP3 file.

## Inputs (using `click`)

The script uses the `click` library for command-line argument parsing.

### Arguments
1. **`json_file`** (required): Path to the JSON input file containing MP3 locations.
2. **`output_file`** (optional): Desired filename for the merged MP3.
   - Defaults to the base name of `json_file` with a `.mp3` extension (e.g., `podcast.json` → `podcast.mp3`).

### Options
| Flag | Description | Default |
|---|---|---|
| `--max-urls` | Maximum number of MP3 URLs to merge | `4` |
| `--dry-run` | Parse and list URLs without downloading or merging | `False` |
| `--normalize` | Normalize audio levels across all tracks | `False` |
| `--metadata` | Path to a JSON file containing ID3 metadata for the output file | `None` |

### Usage Examples
```bash
# Basic usage
python merge_mp3.py input.json
python merge_mp3.py input.json custom_output.mp3

# Merge up to 6 URLs
python merge_mp3.py input.json --max-urls 6

# Preview which URLs would be processed
python merge_mp3.py input.json --dry-run

# Normalize audio and add metadata
python merge_mp3.py input.json --normalize --metadata meta.json
