ASPECT_PATTERNS = [
    ("progressive", lambda ts, ls: "て" in ts and "いる" in ls),
    ("completion",  lambda ts, ls: "て" in ts and "しまう" in ls),
    ("preparation", lambda ts, ls: "て" in ts and "おく" in ls),
    ("change_away", lambda ts, ls: "て" in ts and "いく" in ls),
    ("change_toward", lambda ts, ls: "て" in ts and "くる" in ls),
]

POLARITY_PATTERNS = [
    ("negative", lambda ts, ls: any(x in ls for x in {"ない", "ぬ", "ず", "ん", "ません"}) or "なかっ" in ts),
    ("positive", lambda ts, ls: True),
]

TENSE_PATTERNS = [
    ("past", lambda ts, ls: "た" in ls or "た" in ts),
    ("nonpast", lambda ts, ls: True),
]

MODALITY_PATTERNS = [
    ("obligation", lambda ts, ls: "なけれ" in ts and "ば" in ts and ("なる" in ls or "いけない" in ls)),
    ("obligation", lambda ts, ls: "ない" in ls and "と" in ts and "いけない" in ls),
    ("prohibition", lambda ts, ls: "て" in ts and "は" in ts and "いけない" in ls),
    ("permission", lambda ts, ls: "て" in ts and "も" in ts and ("よい" in ls or "いい" in ts)),
    ("should", lambda ts, ls: "べき" in ls or "べし" in ls),
]

POLITENESS_PATTERNS = [
    ("polite", lambda ts, ls: "ます" in ls or "まし" in ts),
    ("plain", lambda ts, ls: True),
]
