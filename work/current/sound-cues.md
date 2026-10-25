# Sound Design and Foley Cue Map

This document catalogs all sound effects for the video.
It defines exact sound cues for each scene transition and tool reveal.

## 1. Sound Effects Library Catalog

All primary sound files stay in `public/current/sfx/`.
Shared copies also exist in `public/audio/sfx/`.

| File | Type | Duration | Size | Frequency Profile | Best Motion Design Use |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `public/current/sfx/whoosh.wav` | Air Whoosh | 0.350s | 30.9 KB | 200 Hz to 1600 Hz bandpass sweep | Fast card fly-in, rapid entry from screen edges |
| `public/current/sfx/swoosh.wav` | Transition Swoosh | 0.450s | 39.7 KB | 90 Hz sub-bass with 150 Hz to 1200 Hz curve | Scene changes, camera sweeps between tool cards |
| `public/current/sfx/click.wav` | UI Micro-Click | 0.060s | 5.3 KB | 1.8 kHz to 2.2 kHz dual impulse | Button taps, toggle switches, filter selections |
| `public/current/sfx/pop.wav` | Bubble Pop | 0.120s | 10.6 KB | 900 Hz to 200 Hz pitch drop | Badge reveals, feature pills, rating stars |
| `public/current/sfx/camera_shutter.wav` | Camera Shutter | 0.220s | 19.4 KB | 1.6 kHz to 2.4 kHz triple mechanical click | Screenshot captures, viewports, frame locks |
| `public/current/sfx/riser.wav` | Tension Riser | 0.950s | 83.8 KB | 120 Hz to 850 Hz exponential pitch build | Suspense buildup before major reveals and hooks |
| `public/current/sfx/ping.wav` | Notification Chime | 0.500s | 44.1 KB | 1318 Hz (E6) & 2637 Hz (E7) harmonics | Feature highlights, value callouts, successes |
| `public/current/sfx/thud.wav` | Solid Impact | 0.460s | 41.2 KB | 60 Hz to 140 Hz low bass thud | Heavy cards landing, bottom dock settlement |
| `public/current/sfx/scan.wav` | Telemetry Scan | 0.560s | 49.4 KB | Modulated electronic sweep | Real-time search scanning, PDF analysis |
| `public/current/sfx/meter.wav` | Metric Ticker | 0.620s | 54.7 KB | Sequential rising digital ticks | Number counting, speed metrics, token dials |
| `public/current/sfx/split.wav` | Split Comparison | 0.420s | 37.1 KB | Stereo differential whip | Before/after split reveal, toggle activations |

---

## 2. Audio Bed Integration

The composition uses two continuous audio streams alongside foley:
1. **Narration Voice**:
   - Source: `public/current/freeaai.wav`
   - Total duration: 84.96 seconds (2549 frames at 30 fps).
   - The system preserves original voice loudness and tone.
2. **Music Bed**:
   - Source: `public/audio/music-bed.mp3`
   - The engine ducks music gain under active voice segments.
   - Ducked music volume stays at 12% to 18% during narration.
   - Music volume rises to 32% during scene pauses.

---

## 3. Scene Sound Cue Mapping

The video contains 7 visual scenes across 2549 frames.
Every sound cue triggers at an exact frame with calibrated gain.

### Scene 1: Hook and Intro (Frames 0 to 360)
**Visual Focus**: 5 Secret AI Tools Hook, 3D Card Deck entrance, and scanning beam.

| Frame | Sound Effect | Gain | Duration | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| Frame 0 | `riser.wav` | 0.20 | 28 frames | Build anticipation during the initial hook sentence. |
| Frame 15 | `whoosh.wav` | 0.24 | 12 frames | Accompany the top hook pill sliding from top. |
| Frame 28 | `pop.wav` | 0.22 | 8 frames | Accent the "5 TOOLS" glowing badge pop. |
| Frame 42 | `thud.wav` | 0.22 | 14 frames | Anchor the deck of cards landing on stage. |
| Frame 60 | `scan.wav` | 0.16 | 16 frames | Emphasize the vertical scanning beam sweep. |

### Scene 2: Tool 01 — Napkin AI (Frames 360 to 780)
**Visual Focus**: Napkin AI brand card, text prompt input, AI diagram generation.

| Frame | Sound Effect | Gain | Duration | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| Frame 360 | `swoosh.wav` | 0.26 | 14 frames | Wipe scene transition into Tool 01. |
| Frame 376 | `pop.wav` | 0.20 | 8 frames | Reveal the "TOOL 01 / 05" category badge. |
| Frame 398 | `click.wav` | 0.20 | 6 frames | Simulate text prompt selection in the input panel. |
| Frame 442 | `ping.wav` | 0.22 | 15 frames | Signal the AI spark transformation. |
| Frame 485 | `click.wav` | 0.18 | 6 frames | Trigger the flow diagram node branches. |
| Frame 545 | `camera_shutter.wav` | 0.26 | 10 frames | Lock the complete visual diagram preview. |

### Scene 3: Tool 02 — Gamma App (Frames 780 to 1200)
**Visual Focus**: Gamma App card, 1-click prompt to presentation deck, slide generation.

| Frame | Sound Effect | Gain | Duration | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| Frame 780 | `swoosh.wav` | 0.26 | 14 frames | Wipe scene transition into Tool 02. |
| Frame 796 | `pop.wav` | 0.20 | 8 frames | Reveal the "TOOL 02 / 05" category badge. |
| Frame 818 | `click.wav` | 0.20 | 6 frames | Confirm presentation prompt generation. |
| Frame 855 | `whoosh.wav` | 0.22 | 12 frames | Slide the generated slide deck onto stage. |
| Frame 905 | `camera_shutter.wav` | 0.25 | 10 frames | Snap the highlighted presentation slide layout. |
| Frame 945 | `meter.wav` | 0.18 | 18 frames | Animate the dynamic analytics bar chart rise. |

### Scene 4: Tool 03 — Perplexity AI (Frames 1200 to 1620)
**Visual Focus**: Real-time AI search, web source scanning, cited answer box.

| Frame | Sound Effect | Gain | Duration | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| Frame 1200 | `swoosh.wav` | 0.26 | 14 frames | Wipe scene transition into Tool 03. |
| Frame 1216 | `pop.wav` | 0.20 | 8 frames | Reveal the "TOOL 03 / 05" category badge. |
| Frame 1238 | `click.wav` | 0.20 | 6 frames | Submit search query into the search bar. |
| Frame 1275 | `scan.wav` | 0.18 | 16 frames | Scan live web sources across arXiv and GitHub. |
| Frame 1335 | `camera_shutter.wav` | 0.26 | 10 frames | Lock the verified answer card on screen. |
| Frame 1385 | `ping.wav` | 0.22 | 15 frames | Confirm verified citation badges with checkmarks. |

### Scene 5: Tool 04 — Google NotebookLM (Frames 1620 to 2040)
**Visual Focus**: PDF document upload, AI audio discussion synthesis, live waveform.

| Frame | Sound Effect | Gain | Duration | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| Frame 1620 | `swoosh.wav` | 0.26 | 14 frames | Wipe scene transition into Tool 04. |
| Frame 1636 | `pop.wav` | 0.20 | 8 frames | Reveal the "TOOL 04 / 05" category badge. |
| Frame 1658 | `whoosh.wav` | 0.22 | 12 frames | Ingest multi-page PDF documents into the panel. |
| Frame 1715 | `scan.wav` | 0.18 | 16 frames | Process sources into structured notebook notes. |
| Frame 1765 | `ping.wav` | 0.20 | 14 frames | Start the dual-host AI podcast generation. |
| Frame 1815 | `click.wav` | 0.18 | 6 frames | Trigger the live audio waveform frequency bars. |

### Scene 6: Tool 05 — Adobe Podcast AI (Frames 2040 to 2370)
**Visual Focus**: Raw phone recording waveform, Enhance Speech switch, studio sound clarity.

| Frame | Sound Effect | Gain | Duration | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| Frame 2040 | `swoosh.wav` | 0.26 | 14 frames | Wipe scene transition into Tool 05. |
| Frame 2056 | `pop.wav` | 0.20 | 8 frames | Reveal the "TOOL 05 / 05" category badge. |
| Frame 2095 | `click.wav` | 0.24 | 6 frames | Toggle the "Enhance Speech" physical switch. |
| Frame 2110 | `split.wav` | 0.22 | 12 frames | Reveal before and after audio split wave. |
| Frame 2165 | `ping.wav` | 0.22 | 15 frames | Highlight pristine studio broadcast microphone badge. |

### Scene 7: Summary and Outro (Frames 2370 to 2549)
**Visual Focus**: Staggered summary cards of all 5 tools, save and follow call to action.

| Frame | Sound Effect | Gain | Duration | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| Frame 2370 | `riser.wav` | 0.20 | 28 frames | Build excitement into the closing recap. |
| Frame 2378 | `swoosh.wav` | 0.26 | 14 frames | Transition to the full 5-tool overview stage. |
| Frame 2415 | `thud.wav` | 0.24 | 14 frames | Drop all 5 tool cards in a compact vertical stack. |
| Frame 2455 | `pop.wav` | 0.22 | 8 frames | Pop the bookmark icon and "Save This Video" banner. |
| Frame 2495 | `ping.wav` | 0.20 | 15 frames | Finish the video with a crystal clear high chime. |

---

## 4. Loudness and Mixing Standards

We follow strict production audio guidelines:
1. **Integrated Loudness**: Target integrated loudness is −15.0 LUFS (± 1.0 LUFS).
2. **True Peak**: True peak level stays at or below −1.0 dBTP to prevent mobile speaker distortion.
3. **Sound Effect Ducking**: Voice clarity always takes priority. No sound effect overpowers speech.
4. **Gain Scaling**: Individual foley gains stay between 0.15 and 0.28.
