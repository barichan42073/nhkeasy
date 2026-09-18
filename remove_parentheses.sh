#!/bin/bash

# Check if an input file was provided
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <input_file> [output_file]"
    echo "To modify the file in-place, pass only one argument."
    exit 1
fi

INPUT_FILE="$1"

# If an output file is specified, save the clean version there
if [ -n "$2" ]; then
    OUTPUT_FILE="$2"
    # sed command breakdown:
    # s/\([[:space:]]*//g -> removes '(' and any trailing spaces
    # s/)//g              -> removes ')'
    sed 's/([[:space:]]*//g; s/)//g' "$INPUT_FILE" > "$OUTPUT_FILE"
    echo "Cleaned content saved to $OUTPUT_FILE"
else
    # If no output file is specified, edit the file in-place (-i)
    # Note: On macOS, use sed -i '' instead of sed -i
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' 's/([[:space:]]*//g; s/)//g' "$INPUT_FILE"
    else
        sed -i 's/([[:space:]]*//g; s/)//g' "$INPUT_FILE"
    fi
    echo "File '$INPUT_FILE' modified in-place."
fi
