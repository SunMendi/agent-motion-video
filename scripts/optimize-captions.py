import json
import hashlib
from pathlib import Path

ROOT = Path("/home/mehedi/Documents/aivideo")
in_file = ROOT / "work/current/transcript.reviewed.json"
with open(in_file, "r", encoding="utf-8") as f:
    data = json.load(f)

phrases = data["phrases"]
new_phrases = []
idx = 1

for p in phrases:
    text = p["text"].strip()
    words = text.split()
    s = p["s"]
    e = p["e"]
    duration = e - s
    
    # If phrase is short (<= 4 words) or duration <= 1.8s, keep as is
    if len(words) <= 4 or duration <= 1.8:
        new_phrases.append({
            "id": f"p{idx:03d}",
            "text": text,
            "s": s,
            "e": e
        })
        idx += 1
    else:
        # Split into chunks of 3-4 words
        chunk_size = 3 if len(words) <= 7 else 4
        chunks = []
        for i in range(0, len(words), chunk_size):
            chunks.append(words[i:i + chunk_size])
        
        # Distribute time proportionally by character count
        total_chars = sum(len(" ".join(c)) for c in chunks)
        cur_s = s
        for i, c in enumerate(chunks):
            chunk_text = " ".join(c)
            chunk_dur = duration * (len(chunk_text) / total_chars)
            cur_e = round(cur_s + chunk_dur, 2)
            if i == len(chunks) - 1:
                cur_e = e # lock to exact phrase end
            
            new_phrases.append({
                "id": f"p{idx:03d}",
                "text": chunk_text,
                "s": round(cur_s, 2),
                "e": round(cur_e, 2)
            })
            idx += 1
            cur_s = cur_e

data["phrases"] = new_phrases
data["review_notes"] = f"Optimized into {len(new_phrases)} punchy 2-4 word viral caption chunks."

with open(in_file, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Generated {len(new_phrases)} punchy short-form caption chunks (was {len(phrases)}).")
