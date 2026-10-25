import json, re

with open('/tmp/whisper_transcription.json', 'r', encoding='utf-8') as f:
    whisper_segs = json.load(f)

# Load existing scenes
with open('src/data/scenesData.ts', 'r', encoding='utf-8') as f:
    ts_content = f.read()

# All 32 scene lines
lines = re.findall(r'\"voiceover_line\":\s*\"([^\"]+)\"', ts_content)

# We will create an explicit mapping of scene index -> list of whisper word tokens
# Let's inspect the exact tokens for each scene
