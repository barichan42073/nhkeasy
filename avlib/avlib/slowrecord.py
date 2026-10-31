import os
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

import pysbd
from groq import Groq
from pydub import AudioSegment

# Sentence clips quieter than this (average level, dBFS) are treated as "no
# speech": they are dropped. This removes Whisper's hallucinated outro lines
# (e.g. "thank you for watching") that it invents over trailing silence.
# NOTE: -50 is an untested starting point; skipped clips print their level so
# you can tune it. Typical speech sits around -35 to -15 dBFS.
SILENCE_DBFS = -50.0

LOUDNORM = "loudnorm=I=-16:TP=-1.5:LRA=11"

# Inputs that make ffmpeg fail are copied here so the failure can be reproduced.
FAIL_DIR = Path(tempfile.gettempdir()) / "slowrecord_failures"


def _run_ffmpeg(input_path, output_path, filters):
    """Runs ffmpeg with an audio filter chain, encoding to VBR MP3.

    Raises subprocess.CalledProcessError on failure (including a crash by
    signal, e.g. SIGABRT).
    """
    command = [
        "ffmpeg",
        "-y",  # Overwrite output files without asking
        "-i", input_path,
        "-af", ",".join(filters),
        "-c:a", "libmp3lame",
        "-q:a", "2",  # High quality VBR MP3 (0-9, 0 is best)
        output_path,
    ]
    subprocess.run(command, check=True, capture_output=True, text=True)


def _keep_failed_input(path):
    """Copies an input file that made ffmpeg fail somewhere safe for debugging."""
    try:
        FAIL_DIR.mkdir(parents=True, exist_ok=True)
        dest = FAIL_DIR / f"{int(time.time())}_{Path(path).name}"
        shutil.copy(path, dest)
        print(f"Saved failing ffmpeg input to {dest}", file=sys.stderr)
    except OSError as e:
        print(f"Could not save failing input: {e}", file=sys.stderr)


def change_speed_ffmpeg(input_path, output_path, speed=0.8):
    """Time-stretch audio without altering pitch using FFmpeg (rubberband).

    Loudness normalization is NOT done here any more; it is applied once to the
    combined audio at the end (loudnorm is unreliable on very short clips and
    aborts ffmpeg on silent ones). Raises CalledProcessError on failure.
    """
    _run_ffmpeg(input_path, output_path, [f"rubberband=tempo={speed}:pitch=1"])


def _stretched_clips(clip, speeds):
    """Returns one time-stretched AudioSegment per speed.

    If ffmpeg fails for a speed, a warning is printed, the failing input is
    kept for debugging, and the unstretched clip is used so one bad segment
    can't take down the whole run.
    """
    results = []
    with tempfile.TemporaryDirectory() as tmp_dir:
        wav_in = os.path.join(tmp_dir, "in.wav")
        clip.export(wav_in, format="wav")
        for speed in speeds:
            mp3_out = os.path.join(tmp_dir, f"out_{speed}.mp3")
            try:
                change_speed_ffmpeg(wav_in, mp3_out, speed=speed)
                results.append(AudioSegment.from_file(mp3_out))
            except subprocess.CalledProcessError as e:
                print(
                    f"WARNING: ffmpeg failed at {speed}x ({e}); using unstretched clip.",
                    file=sys.stderr,
                )
                print(f"STDERR: {e.stderr}", file=sys.stderr)
                _keep_failed_input(wav_in)
                results.append(clip)
    return results


def _normalize_and_export(audio, output_mp3_path):
    """Exports audio as MP3 with a single loudness-normalization pass.

    Falls back to a plain (un-normalized) export if the loudnorm pass fails.
    """
    with tempfile.TemporaryDirectory() as tmp_dir:
        wav_path = os.path.join(tmp_dir, "combined.wav")
        audio.export(wav_path, format="wav")
        try:
            _run_ffmpeg(wav_path, output_mp3_path, [LOUDNORM])
        except subprocess.CalledProcessError as e:
            print(
                f"WARNING: loudness normalization failed ({e}); "
                "exporting without it.",
                file=sys.stderr,
            )
            _keep_failed_input(wav_path)
            audio.export(output_mp3_path, format="mp3")


def align_words_to_pysbd_sentences(words, lang_code="ja", pause_threshold=0.8):
    """
    Combines PySBD's sentence boundaries with an acoustic pause fallback.
    If Whisper drops punctuation, this forces a split on long silences.
    """
    seg = pysbd.Segmenter(language=lang_code, clean=False)

    # 1. Reconstruct exact text output
    full_text = "".join([w["word"] for w in words])

    # 2. Segment using PySBD rules
    raw_sentences = seg.segment(full_text)

    structured_sentences = []
    word_idx = 0

    for sentence_text in raw_sentences:
        target_len = len(sentence_text.replace(" ", ""))
        if target_len == 0:
            continue

        accumulated_text = ""
        start_time = None
        end_time = None
        current_sub_words = []

        # 3. Consume words, looking for both PySBD ends AND acoustic gaps
        while word_idx < len(words) and len(accumulated_text) < target_len:
            word_obj = words[word_idx]
            word_str = word_obj["word"].replace(" ", "")

            if start_time is None:
                start_time = word_obj["start"]
            end_time = word_obj["end"]

            accumulated_text += word_str
            current_sub_words.append(word_obj["word"])

            # --- ACOUSTIC FALLBACK CHECK ---
            forced_break = False
            if word_idx < len(words) - 1:
                # Calculate time gap between this word's end and next word's start
                gap = words[word_idx + 1]["start"] - word_obj["end"]
                if gap > pause_threshold:
                    forced_break = True

            word_idx += 1

            # If we hit a forced audio break OR the end of the PySBD text block
            if forced_break or len(accumulated_text) >= target_len:
                structured_sentences.append({
                    "text": "".join(current_sub_words),
                    "start": start_time,
                    "end": end_time
                })
                # Reset tracking to capture the rest of the unpunctuated block
                start_time = None
                current_sub_words = []

    return structured_sentences


def process_news_with_pysbd(mp3_path, output_mp3_path):
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        # Raise instead of sys.exit: SystemExit is not caught by the pipeline's
        # per-article error handling and would kill the whole run.
        raise RuntimeError("GROQ_API_KEY environment variable is not set.")

    client = Groq(api_key=api_key)

    print(f"1. Transcribing '{mp3_path}' via Groq Whisper...")
    with open(mp3_path, "rb") as file:
        transcription = client.audio.transcriptions.create(
            file=(mp3_path, file.read()),
            model="whisper-large-v3-turbo",
            #model="whisper-large-v3",
            response_format="verbose_json",
            timestamp_granularities=["word"]
        )

    words = transcription.words
    if not words:
        raise RuntimeError(f"Whisper returned no words for '{mp3_path}'.")

    # Pass to the new alignment function with "ja" support
    sentences = align_words_to_pysbd_sentences(words, lang_code="ja")

    print(f"2. Detected {len(sentences)} distinct sentences using PySBD.")
    for idx, s in enumerate(sentences, 1):
        print(f"   [{idx}] {s['text']}") # Prints out the exact sentences found to verify

    original_audio = AudioSegment.from_file(mp3_path)
    combined_audio = AudioSegment.empty()
    PADDING_MS = 80
    kept = 0

    print("3. Processing sentence repetitions and 1.0x/0.8x/0.7x time-stretching...")
    for idx, sent in enumerate(sentences, 1):
        start_ms = max(0, int(sent["start"] * 1000) - PADDING_MS)
        end_ms = min(len(original_audio), int(sent["end"] * 1000) + PADDING_MS)

        sentence_clip = original_audio[start_ms:end_ms]

        # Drop empty/silent clips (usually Whisper hallucinations over silence).
        level = sentence_clip.dBFS if len(sentence_clip) else float("-inf")
        if level < SILENCE_DBFS:
            print(
                f"   [{idx}] skipped, no audible speech "
                f"({level:.1f} dBFS, {len(sentence_clip)} ms): {sent['text']}",
                file=sys.stderr,
            )
            continue
        kept += 1

        # Append 1.0x clip
        combined_audio += sentence_clip

        # 2nd repetition at 0.8x, 3rd at 0.7x
        slowed_08, slowed_07 = _stretched_clips(sentence_clip, (0.8, 0.7))
        combined_audio += slowed_08
        combined_audio += slowed_07

        # 0.5s pause between sentences
        combined_audio += AudioSegment.silent(duration=500)

    if kept == 0:
        raise RuntimeError(f"No audible speech found in '{mp3_path}'.")

    # Save output (one loudness-normalization pass over the whole recording)
    _normalize_and_export(combined_audio, output_mp3_path)
    print(f"Done! Saved repeated audio to '{output_mp3_path}'.")
