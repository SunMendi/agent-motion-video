#!/usr/bin/env python3
"""
Data-driven Audio and Intent Analyzer.
Summarizes transcript timing, word count, keyword hints, and possible CTA location.
These are transcript-derived estimates, not listening or creative direction.
The agent chooses subjects, assets, pacing, and motion through workflow.md.
"""

import json
import os
import re
import sys
from typing import Any, Dict, List

CATEGORY_TRIGGERS = {
    "COMMERCIAL_AD": [
        "ফ্রি", "অফার", "ডাউনলোড", "ক্লিক", "ইনবক্স", "লিংক", "শেয়ার", "ডিসকাউন্ট",
        "প্রোডাক্ট", "টাকা", "কাস্টমার", "কুপন", "সীমিত", "গোপন", "সিক্রেট",
        "free", "offer", "discount", "download", "link", "buy", "deal", "secret", "save", "try", "ad"
    ],
    "TOOL_LISTICLE": [
        "১ নম্বর", "২ নম্বর", "৩ নম্বর", "৪ নম্বর", "৫ নম্বর", "নম্বর",
        "টুল", "এআই টুল", "লিস্ট", "সেরা", "তালিকা", "টুলের",
        "tool", "tools", "top 5", "top", "list", "best", "showcase"
    ],
    "SYSTEM_ARCHITECTURE": [
        "আর্কিটেকচার", "ডাটাবেজ", "সার্ভার", "মাইক্রোসার্ভিস", "এপিআই", "পাইপলাইন",
        "নেটওয়ার্ক", "ক্লাউড", "ইনফ্রাস্ট্রাকচার", "মেমোরি",
        "docker", "kubernetes", "api", "database", "backend", "system", "architecture",
        "scale", "latency", "redis", "kafka", "rag", "mcp", "pipeline", "cache"
    ],
    "CODE_TERMINAL": [
        "কোড", "ফাংশন", "সিনট্যাক্স", "টার্মিনাল", "পাইথন", "জাভাস্ক্রিপ্ট", "লাইব্রেরি",
        "ফ্রেমওয়ার্ক", "বাগ", "এরর", "রান", "ইন্সটল",
        "python", "javascript", "typescript", "rust", "function", "return", "class",
        "async", "await", "import", "def", "cli", "git", "npm", "cargo", "bash"
    ],
    "BENCHMARK_BATTLE": [
        "বনাম", "পার্থক্য", "গতি", "তুলনা", "কোনটি ভালো", "পারফর্মেন্স",
        "vs", "versus", "benchmark", "fastest", "speed", "test", "compare", "latency", "tps", "score"
    ]
}

CTA_KEYWORDS = [
    "ইনবক্স", "লিংক", "সাবস্ক্রাইব", "ডাউনলোড", "ফলো", "কমেন্ট", "শেয়ার", "ক্লিক",
    "visit", "subscribe", "follow", "comment", "share", "click", "download", "check", "try"
]

def analyze_transcript(transcript_path: str) -> Dict[str, Any]:
    with open(transcript_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    audio_duration = float(data.get("audio_duration", 0))
    phrases = data.get("phrases", [])
    words = data.get("words", [])

    # If phrases exist, analyze phrases; otherwise fallback to words
    text_blocks = []
    if phrases:
        for p in phrases:
            text_blocks.append({"text": p.get("text", ""), "start": float(p.get("s", 0)), "end": float(p.get("e", 0))})
    elif words:
        for w in words:
            text_blocks.append({"text": w.get("w", ""), "start": float(w.get("s", 0)), "end": float(w.get("e", 0))})

    elif data.get("segments"):
        for segment in data["segments"]:
            text_blocks.append({"text": segment.get("text", ""), "start": float(segment.get("start", 0)), "end": float(segment.get("end", 0))})

    if not text_blocks:
        raise ValueError("Transcript has no readable phrases or words.")

    # Calculate real word counts
    full_text = " ".join([b["text"] for b in text_blocks])
    all_words = full_text.split()
    total_words = len(all_words)
    speaking_minutes = audio_duration / 60.0 if audio_duration > 0 else 1.0
    wpm = round(total_words / speaking_minutes, 1) if speaking_minutes > 0 else 0

    # Calculate pause distribution
    pauses: List[Dict[str, float]] = []
    for i in range(len(text_blocks) - 1):
        gap = text_blocks[i+1]["start"] - text_blocks[i]["end"]
        if gap > 0.35: # Audible pauses > 350ms
            pauses.append({"start": text_blocks[i]["end"], "end": text_blocks[i+1]["start"], "duration": round(gap, 2)})

    total_pause_duration = sum([p["duration"] for p in pauses])
    pause_ratio = round(total_pause_duration / audio_duration, 3) if audio_duration > 0 else 0

    # Hook analysis (first 4 seconds or first 2 blocks)
    hook_blocks = [b for b in text_blocks if b["start"] < 4.0]
    hook_text = " ".join([b["text"] for b in hook_blocks])
    hook_words = len(hook_text.split())
    hook_duration = hook_blocks[-1]["end"] if hook_blocks else 4.0
    hook_wpm = round((hook_words / (hook_duration / 60.0)), 1) if hook_duration > 0 else 0

    # Keyword matching and scoring
    category_scores: Dict[str, int] = {k: 0 for k in CATEGORY_TRIGGERS}
    lower_full_text = full_text.lower()
    for cat, triggers in CATEGORY_TRIGGERS.items():
        for trigger in triggers:
            count = len(re.findall(re.escape(trigger.lower()), lower_full_text))
            category_scores[cat] += count

    # Call to action detection in the last 25% of audio
    cta_threshold = audio_duration * 0.75
    closing_blocks = [b for b in text_blocks if b["start"] >= cta_threshold]
    closing_text = " ".join([b["text"] for b in closing_blocks]).lower()
    has_cta = any(re.search(re.escape(k), closing_text) for k in CTA_KEYWORDS)

    # Determine primary archetype
    sorted_cats = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)
    primary_category = sorted_cats[0][0] if sorted_cats[0][1] > 0 else "UNCLASSIFIED"

    result = {
        "audio_duration_seconds": round(audio_duration, 2),
        "total_words": total_words,
        "words_per_minute": wpm,
        "pause_count": len(pauses),
        "total_pause_seconds": round(total_pause_duration, 2),
        "pause_ratio": pause_ratio,
        "hook_analysis": {
            "hook_duration_seconds": round(hook_duration, 2),
            "hook_word_count": hook_words,
            "hook_wpm": hook_wpm,
            "text": hook_text
        },
        "has_call_to_action": has_cta,
        "category_scores": category_scores,
        "detected_archetype": primary_category,
        "interpretation": "Advisory transcript keyword hint only. The agent must choose visual treatment from meaning, subjects, and available assets.",
        "measurement_source": "Transcript timestamps and text; no waveform or direct listening analysis.",
        "review_status": data.get("review_status", "unreviewed")
    }
    return result

def main():
    transcript_file = "work/current/transcript.reviewed.json"
    if not os.path.exists(transcript_file):
        transcript_file = "work/current/transcript.raw.json"

    if not os.path.exists(transcript_file):
        print(f"Error: Transcript file not found at {transcript_file}")
        sys.exit(1)

    print(f"[1/3] Reading real audio transcript from: {transcript_file}")
    analysis = analyze_transcript(transcript_file)

    output_file = "work/current/analysis.json"
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(analysis, f, indent=2, ensure_ascii=False)

    print(f"[2/3] Transcript-derived estimates:")
    print(f"      - Duration: {analysis['audio_duration_seconds']}s")
    print(f"      - Speaking Tempo: {analysis['words_per_minute']} WPM")
    print(f"      - Pause Ratio: {analysis['pause_ratio'] * 100:.1f}% ({analysis['pause_count']} pauses)")
    print(f"      - Hook Tempo: {analysis['hook_analysis']['hook_wpm']} WPM")
    print(f"      - Detected Archetype: {analysis['detected_archetype']}")
    print(f"[3/3] Successfully wrote analysis data to: {output_file}")

if __name__ == "__main__":
    main()
