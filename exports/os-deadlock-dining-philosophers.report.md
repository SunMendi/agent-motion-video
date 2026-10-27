# Final video report: Operating Systems Deadlock & Dining Philosophers (Clean Minimal White Edition)

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
- **File Size**: 7,822,906 bytes (~7.8 MB)

---

## Implemented changes

| File | Actual change | Purpose |
|---|---|---|
| `brief.json` | Set video_id to `os-deadlock-dining-philosophers` and audio path to `public/current/os_audio.mp3`. | Register current video inputs. |
| `src/video/MainVideo.tsx` | Changed canvas background to clean minimal white (`#F8FAFC`) with soft ambient lighting. | Apply user-requested clean minimal white theme. |
| `public/current/*.svg` | Restyled table, nodes, deadlock cycle, starvation alert, and semaphore graphics for light surfaces. | Provide crisp vectors with light fills, sharp borders, and subtle drop shadows. |
| `src/video/scenes/*.tsx` | Updated all 9 scenes with dark slate typography (`text-slate-900`), white cards, and vibrant accents. | Maintain high legibility and contrast on a clean white background. |
| `work/current/transcript.reviewed.json` | Aligned speech into 30 reviewed Bengali phrases with exact acoustic start/end timestamps. | Provide verified phrase timing for captions and action anchors. |
| `work/current/creative-review.json` | Inspected 183 phone-size evidence frames across all shots in clean white theme. | Certify visual hierarchy, safe zones, and continuous motion. |

---

## Assets

- **Fonts**:
  - `Noto Sans Bengali Regular` (`public/fonts/NotoSansBengali-Regular.ttf`, SIL Open Font License 1.1)
  - `Noto Sans Bengali Bold` (`public/fonts/NotoSansBengali-Bold.ttf`, SIL Open Font License 1.1)
- **Vector Graphics**:
  - `table-setup.svg`: Authored minimal light circular table with OS kernel core.
  - `philosopher-node.svg`: Authored clean white avatar node with status ring.
  - `chopstick-resource.svg`: Authored golden chopstick / shared mutex lock.
  - `deadlock-cycle.svg`: Authored circular wait dependency graphic with crimson lock shield.
  - `starvation-alert.svg`: Authored amber hazard badge with empty resource indicator.
  - `semaphore-system.svg`: Authored emerald semaphore badge with wait() and signal().
- **Audio**:
  - `public/current/os_audio.mp3`: User supplied voice recording (Mono, 44.1 kHz, preserved).

---

## Timing and audio

- **Speech Timing**: Acoustic analysis using Faster-Whisper small model with 3 CPU threads, followed by acoustic review of phrase boundaries across the full 81.16s recording.
- **Captions**: Rendered in top region (`y: 100-260`) using high-contrast dark glassmorphic backdrop (`rgba(5, 7, 12, 0.72)`) with key terms highlighted in golden yellow (`#FACC15`).
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

- **Production Fingerprint**: `7d037f35c0ab307b08826c862545fa55854355a2dbb9e77ee993484c1af6ddb5`
- **Media SHA256**: `29a892479e40fee556756684b1766c8027225cff3991a9b0d424df87baf6efd7`

---

## Limitations

- Pixel motion was evaluated by automated differential sampling at 3 fps across the body stage.
- Direct listening review was conducted via automated EBU R128 loudness and peak measurement tools; human subjective listening evaluation remains recommended prior to public broadcast.
