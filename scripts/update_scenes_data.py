import json

with open('briefs/rust.timing.json', 'r', encoding='utf-8') as f:
    timing = json.load(f)

# Load existing scenesData.ts
with open('src/data/scenesData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# We can re-generate the SCENES array in scenesData.ts cleanly with the measured words and exact start/end frames
from build_measured_timing import all_scenes_words_times

# Load existing scenes data to preserve metadata, headline_bn, category_label, sound_cues
import re
scenes_match = re.search(r'export const SCENES: Scene\[\] = (\[[\s\S]*?\]);\s*$', content)
if not scenes_match:
    print("Could not match SCENES in scenesData.ts")
    exit(1)

# Parse existing SCENES
existing_scenes = json.loads(scenes_match.group(1))
assert len(existing_scenes) == 32

for idx, (words, times) in enumerate(all_scenes_words_times):
    scene = existing_scenes[idx]
    scene_words = []
    for w, (s, e) in zip(words, times):
        scene_words.append({
            "w": w,
            "s": round(s, 3),
            "e": round(e, 3)
        })
    scene["words"] = scene_words
    # Exact speech start and end
    speech_start = scene_words[0]["s"]
    speech_end = scene_words[-1]["e"]
    
    # In scenesData, start_time_sec is speech_start
    # For scene 1, it's 0.0
    scene["start_time_sec"] = round(speech_start, 2)
    scene["end_time_sec"] = round(speech_end, 2)
    scene["duration_sec"] = round(speech_end - speech_start, 2)
    scene["start_frame"] = round(speech_start * 30)
    scene["end_frame"] = round(speech_end * 30)
    scene["duration_frames"] = scene["end_frame"] - scene["start_frame"]

# S32 extends through 123.2s / 3696 frames
existing_scenes[0]["start_time_sec"] = 0.0
existing_scenes[0]["start_frame"] = 0
existing_scenes[31]["end_time_sec"] = 123.2
existing_scenes[31]["end_frame"] = 3696
existing_scenes[31]["duration_sec"] = round(123.2 - existing_scenes[31]["start_time_sec"], 2)
existing_scenes[31]["duration_frames"] = 3696 - existing_scenes[31]["start_frame"]

# Re-serialize
new_scenes_json = json.dumps(existing_scenes, ensure_ascii=False, indent=2)
prefix = content[:scenes_match.start(1)]
new_content = prefix + new_scenes_json + ";\n"

with open('src/data/scenesData.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated src/data/scenesData.ts with measured speech timestamps!")
