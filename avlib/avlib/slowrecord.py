import os
import sys
import tempfile
import subprocess # Added for FFmpeg calls
import pysbd
from groq import Groq
from pydub import AudioSegment

def change_speed_ffmpeg(input_path, output_path, speed=0.8):
    """Time-stretch audio without altering pitch and apply loudness normalization using FFmpeg."""
    command = [
        "ffmpeg",
        "-y", # Overwrite output files without asking
        "-i", input_path,
        "-af",
        f"rubberband=tempo={speed}:pitch=1,loudnorm=I=-16:TP=-1.5:LRA=11",
        "-c:a", "libmp3lame",
        "-q:a", "2", # High quality VBR MP3 (0-9, 0 is best)
        output_path
    ]
    
    try:
        subprocess.run(command, check=True, capture_output=True, text=True)
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg command failed with error: {e}", file=sys.stderr)
        print(f"STDOUT: {e.stdout}", file=sys.stderr)
        print(f"STDERR: {e.stderr}", file=sys.stderr)
        sys.exit(1)

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
        print("Error: GROQ_API_KEY environment variable is not set.", file=sys.stderr)
        sys.exit(1)

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
    
    # Pass to the new alignment function with "ja" support
    sentences = align_words_to_pysbd_sentences(words, lang_code="ja")
    
    print(f"2. Detected {len(sentences)} distinct sentences using PySBD.")
    for idx, s in enumerate(sentences, 1):
        print(f"   [{idx}] {s['text']}") # Prints out the exact sentences found to verify

    original_audio = AudioSegment.from_file(mp3_path)
    combined_audio = AudioSegment.empty()
    PADDING_MS = 80 

    print("3. Processing sentence repetitions and 1.0x/0.8x/0.7x time-stretching...")
    for idx, sent in enumerate(sentences, 1):
        start_ms = max(0, int(sent["start"] * 1000) - PADDING_MS)
        end_ms = min(len(original_audio), int(sent["end"] * 1000) + PADDING_MS)

        sentence_clip = original_audio[start_ms:end_ms]
        
        # Append 1.0x clip
        combined_audio += sentence_clip

        # Time-stretch 2nd repetition to 0.8x
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_in, \
             tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp_out:
            
            sentence_clip.export(tmp_in.name, format="wav")
            change_speed_ffmpeg(tmp_in.name, tmp_out.name, speed=0.8)
            
            slowed_clip_08 = AudioSegment.from_file(tmp_out.name)
            combined_audio += slowed_clip_08
            
            # Time-stretch 3rd repetition to 0.7x
            # Re-export to tmp_in in case tmp_out was overwritten or for clarity
            sentence_clip.export(tmp_in.name, format="wav") 
            change_speed_ffmpeg(tmp_in.name, tmp_out.name, speed=0.7)
            
            slowed_clip_07 = AudioSegment.from_file(tmp_out.name)
            combined_audio += slowed_clip_07

            os.remove(tmp_in.name)
            os.remove(tmp_out.name)

        # 0.5s pause between sentences
        combined_audio += AudioSegment.silent(duration=500)

    # Save output
    combined_audio.export(output_mp3_path, format="mp3")
    print(f"Done! Saved repeated audio to '{output_mp3_path}'.")

