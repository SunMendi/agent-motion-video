# Final Video Report: bangla-ai-token-cost

## Output

- Video identifier: `bangla-ai-token-cost`
- Final file path: `work/current/final.mp4`
- Dimensions: 1080 x 1920 pixels (9:16 vertical format)
- Frame rate: 30.0 fps
- Frame count: 2,645 frames
- Duration: 88.2 seconds
- Video format: H.264 (yuv420p)
- Audio format: AAC (Stereo, 96000 Hz, 192 kbps)
- Integrated loudness: -14.54 LUFS (target: -15 LUFS)
- True peak: -4.19 dBTP (limit: -1.0 dBTP)
- Loudness range: 3.4 LU
- File size: 4,262,543 bytes (4.26 MB)

## Implemented changes

| File | Actual change | Purpose |
|---|---|---|
| `brief.json` | Configured video brief for bangla-ai-token-cost | Define project requirements and constraints |
| `work/current/transcript.reviewed.json` | Reconstructed 23 Bengali phrases with exact timestamps | Provide clean authentic Bengali captions |
| `work/current/storyboard.json` | Created schema version 2 storyboard with 9 timed shots | Plan visual narrative and sound cues |
| `src/video/MainVideo.tsx` | Implemented complete 9-shot sequence composition | Render continuous 1080x1920 video with top captions |
| `src/video/VisualScenes.tsx` | Created 9 modular vector scenes across 896x1380 stage | Provide full vertical motion graphics without dead space |
| `src/shared/TimedCaptions.tsx` | Mounted top-aligned karaoke caption capsules | Display captions cleanly at top safe zone |
| `src/shared/TimelineAudio.tsx` | Synchronized voice, ducked music, and sound cues | Deliver balanced audio mix with automated ducking |

## Assets

- Bengali Fonts: `Hind Siliguri` (Bold, SemiBold, Medium, Regular)
- Latin Display Font: `Space Grotesk`
- Monospace Font: `JetBrains Mono`
- Voice Recording: `public/current/bangla.wav` (88.16s)
- Ambient Music: `public/audio/music-bed.mp3`
- Sound Effects:
  - `public/audio/sfx/whooshes/fast-whoosh-01.mp3`
  - `public/audio/sfx/impacts/heavy-thud-01.mp3`
  - `public/audio/sfx/pops/bubble-pop-01.mp3`
  - `public/audio/sfx/ui/dial-tick-soft-01.mp3`

## Timing and audio

- Faster-Whisper extracted acoustic word timestamps from the raw recording.
- Reviewer consolidated split fragments into 23 authentic Bengali phrases.
- 9 visual shots align to speech pauses.
- TimelineAudio ducks the music bed automatically during speech segments.
- Sound effects trigger on verified event keyframes.
- Audio normalized to -14.54 LUFS and -4.19 dBTP.

## Verification

| Check | Actual result | Evidence path |
|---|---|---|
| Project preparation | Passed (88.16s, 2,645 frames) | `src/video/project.json` |
| Production gate checks | Passed (0 errors, 0 warnings) | `npm run video:check-production` |
| TypeScript check | Passed (0 errors) | `npx tsc --noEmit` |
| Tailwind CSS build | Passed | `npm run video:css` |
| 9:16 vertical check | Passed (1080x1920) | `npm run video:check-9x16` |
| Media verification | Passed (-14.54 LUFS, -4.19 dBTP) | `npm run video:verify` |

## Limitations

- Actual token splitting counts vary across different LLM tokenizer architectures.
- The 3X and 5X numbers serve as an illustration. They do not represent a fixed penalty for every prompt.
