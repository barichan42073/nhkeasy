#!/usr/bin/env sh
set -eu

files="
smart_update.py
smartreader.py
jamdict_eg.py
sudachieg.py
dmerge_mp3.py
merge_mp3.py
"

git rm -- $files

git commit -m "Remove obsolete experimental processing scripts"
