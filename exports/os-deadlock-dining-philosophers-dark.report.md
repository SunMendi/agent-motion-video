# Final video report: Operating Systems Deadlock & Dining Philosophers

## Output

- **Video Identifier**: `os-deadlock-dining-philosophers`
- **Output File**: `work/current/final.mp4`
- **Dimensions**: 1080 × 1920 (9:16 vertical format)
- **Frame Rate**: 30 fps
- **Duration**: 81.20 seconds (2435 frames)
- **Video Codec**: H.264 (`avc1`, High Profile, yuv420p)
- **Audio Codec**: AAC stereo (96 kHz, 192 kbps)
- **Integrated Loudness**: -15.26 LUFS (Target: -16 to -14 LUFS)
- **True Peak**: -1.16 dBTP (Target: <= -1.0 dBTP)
- **Loudness Range**: 2.5 LU
- **File Size**: 8,554,331 bytes (~8.5 MB)

---

## Implemented changes

| File | Actual change | Purpose |
|---|---|---|
| `brief.json` | Set video_id to `os-deadlock-dining-philosophers` and audio path to `public/current/os_audio.mp3`. | Register current video inputs. |
| `work/current/transcript.reviewed.json` | Aligned speech into 30 reviewed Bengali phrases with exact acoustic start/end timestamps. | Provide verified phrase timing for captions and action anchors. |
| `work/current/direction.md` | Defined creative strategy, cyber-banquet concept, color roles, and beat map. | Establish visual direction and worker specifications. |
| `work/current/storyboard.json` | Structured 9 timed shots covering all 2435 frames with exact keyframes and events. | Timed storyboard adhering to schema v2 and creative contract v1. |
| `public/current/*.svg` | Created 6 custom layered SVGs (`table-setup`, `philosopher-node`, `chopstick-resource`, `deadlock-cycle`, `starvation-alert`, `semaphore-system`). | Production vector assets for dining table, nodes, mutex resources, and alerts. |
| `src/video/scenes/*.tsx` | Implemented 9 dedicated scene components with Remotion spring and frame-derived animations. | Render the complete visual explanation with continuous motion. |
| `src/video/MainVideo.tsx` | Composed sequences, mounted `TimedCaptions` with phrase highlights, and wired `TimelineAudio`. | Central video composition entry point. |
| `work/current/creative-review.json` | Inspected 183 phone-size evidence frames across all shots and documented specific findings. | Formal creative review gate certification. |

---

## Assets

- **Fonts**:
  - `Noto Sans Bengali Regular` (`public/fonts/NotoSansBengali-Regular.ttf`, SIL Open Font License 1.1)
  - `Noto Sans Bengali Bold` (`public/fonts/NotoSansBengali-Bold.ttf`, SIL Open Font License 1.1)
- **Vector Graphics**:
  - `table-setup.svg`: Authored circular table with OS kernel core.
  - `philosopher-node.svg`: Authored tech avatar node with glowing status ring.
  - `chopstick-resource.svg`: Authored metallic chopstick / shared mutex lock.
  - `deadlock-cycle.svg`: Authored circular wait dependency graphic with lock.
  - `starvation-alert.svg`: Authored amber hazard badge with empty resource indicator.
  - `semaphore-system.svg`: Authored hexagonal semaphore badge with wait() and signal().
- **Audio**:
  - `public/current/os_audio.mp3`: User supplied voice recording (Mono, 44.1 kHz, preserved).

---

## Timing and audio

- **Speech Timing**: Acoustic analysis using Faster-Whisper small model with 3 CPU threads, followed by acoustic review of phrase boundaries across the full 81.16s recording.
- **Captions**: Rendered in top region (`y: 100-260`) using glassmorphic backdrop (`rgba(5, 7, 12, 0.72)`) with key terms highlighted in golden yellow (`#FACC15`).
- **Loudness Normalization**: EBU R128 dynamic normalization applied to voice track to achieve -15.26 LUFS and -1.16 dBTP true peak without clipping.

---

## Verification

| Check | Actual result | Evidence path |
|---|---|---|
| Environment Doctor | All core tools and fonts verified | `video:doctor` |
| Brief & Intake | Passed validation with 1080x1920 9:16 target | `brief.json` |
| Timing & Storyboard Compile | 0 errors, 0 warnings; exact frame coverage [0, 2435) | `work/current/timeline.compiled.json` |
| Production Pre-check | Passed structural, event, and layout checks | `video:check-production` |
| Full Video Render | 2435 frames rendered at 30 fps with 3 CPU cores | `work/current/final.mp4` |
| Media Verification | Valid H.264/AAC, -15.26 LUFS, -1.16 dBTP | `work/current/verification.json` |
| 9:16 Aspect Ratio Check | Exactly 1080x1920 (0.5625 ratio) PASSED | `video:check-9x16` |
| Pixel Motion Check | 0 shots with low motion >= 3.0s PASSED | `video:check-motion` |
| Creative Review Evidence | 183 phone-size frames extracted and verified | `work/current/creative-review.json` |
| Creative Review Gate | Passed all shot checks against media hash | `video:check-creative` |

- **Production Fingerprint**: `2a7ef8a5c8b5ef1be0c1b37ae7951a9a7df274031a5a9fa086d3d583f6da5c44`
- **Media SHA256**: `28643b3476b38e4eb6035b848ccb7b2dfc60d35b5d5c5bef1f92bfc5d478ebd1`

---

## Limitations

- Pixel motion was evaluated by automated differential sampling at 3 fps across the body stage.
- Direct listening review was conducted via automated EBU R128 loudness and peak measurement tools; human subjective listening evaluation remains recommended prior to public broadcast.
