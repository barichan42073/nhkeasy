#!/bin/bash

# Check if an input file was provided
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <input_file> [output_file]"
    exit 1
fi

INPUT_FILE="$1"
# If no output file is provided, default to output_columns.csv
OUTPUT_FILE="${2:-output_columns.csv}"

# -d',' specifies comma as the delimiter
# -f1,2 specifies fields (columns) 1 and 2
cut -d',' -f1,2 "$INPUT_FILE" > "$OUTPUT_FILE"

echo "Done! Saved columns 1 and 2 to $OUTPUT_FILE"
