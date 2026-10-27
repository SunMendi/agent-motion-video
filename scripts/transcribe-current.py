#!/usr/bin/env python3
"""Generate raw ASR word estimates. This script never installs its dependencies."""
import argparse
import hashlib
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--model', default='small', help='Multilingual Faster-Whisper model name or local model path.')
    parser.add_argument('--language', help='Language code, such as bn. Default: brief.json language.')
    parser.add_argument('--overwrite', action='store_true', help='Explicitly replace the previous raw analysis.')
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent
    brief = json.loads((root / 'brief.json').read_text(encoding='utf-8'))
    relative = Path(brief['audio_file'])
    audio = (root / relative).resolve()
    if relative.is_absolute() or root not in audio.parents or not audio.is_file():
        parser.error('audio_file must identify an existing file inside the project.')
    target = root / 'work/current/transcript.raw.json'
    target.parent.mkdir(parents=True, exist_ok=True)
    if root not in target.resolve().parents or any(p.is_symlink() for p in [target, target.parent, target.parent.parent]):
        parser.error('The raw transcript destination must not contain symbolic links.')
    if target.exists() and not args.overwrite:
        parser.error('Raw analysis already exists. Use --overwrite only when replacement is intended.')
    try:
        import av
        _orig_open = av.open
        def _compat_open(*args, **kwargs):
            kwargs.pop('metadata_errors', None)
            return _orig_open(*args, **kwargs)
        av.open = _compat_open
        from faster_whisper import WhisperModel
    except ImportError:
        parser.error('faster-whisper is unavailable in this Python environment. Follow setup.md.')
    language = args.language or brief.get('language', '').split('-')[0] or None
    model = WhisperModel(args.model, device='cpu', compute_type='int8', cpu_threads=3)
    segments, info = model.transcribe(
        str(audio),
        language=language,
        word_timestamps=True,
        vad_filter=True,
        condition_on_previous_text=False,
    )
    words = []
    raw_segments = []
    for segment in segments:
        print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}", flush=True)
        raw_segments.append({'start': segment.start, 'end': segment.end, 'text': segment.text})
        for word in segment.words or []:
            words.append({'id': f'w{len(words) + 1:06d}', 'w': word.word.strip(), 's': word.start, 'e': word.end, 'probability': word.probability})
    if not words:
        parser.error('Speech analysis returned no words. Inspect the recording.')
    audio_sha256 = hashlib.sha256(audio.read_bytes()).hexdigest()
    data = {
        'audio_duration': info.duration,
        'audio_sha256': audio_sha256,
        'review_status': 'unreviewed',
        'review_notes': '',
        'words': words,
        'segments': raw_segments,
        'provenance': {
            'tool': 'faster-whisper', 'model': args.model, 'device': 'cpu', 'compute_type': 'int8',
            'audio_sha256': audio_sha256,
            'language': info.language, 'timing_status': 'unreviewed-asr-estimates',
        },
    }
    target.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Saved {len(words)} raw word estimates to {target.relative_to(root)}.')
    print('Review uncertain words and timing before creating transcript.reviewed.json.')


if __name__ == '__main__':
    main()
