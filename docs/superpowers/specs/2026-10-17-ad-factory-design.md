# Design: Bangla Audio-Driven Ad Factory

- Date: 2026-10-17
- Status: approved for writing (conversational design approved 2026-10-17)
- Owner: mehedi
- Location: `/home/mehedi/Documents/aivideo`

## 1. Problem

DevSolutions BD sells an AI agent to Bangladeshi online news portal owners. The
owner of a small or solo team cannot run a 24/7 news site and social pages.
We need video ads that win customers.

We already have one finished voice track and its word-by-word timing. We need
many more ads later, for other products, with no design skill required each time.

**Outcome:** a reusable factory in this folder. Input is a brief plus a voice
file. Output is finished MP4 files that look professional and match the audio
exactly.

## 2. Goals

1. Video length equals the audio length. Never a fixed duration.
2. Scene changes land on real pauses in the audio.
3. Word captions change exactly when the word is spoken.
4. Bangla text renders with correct conjuncts and never overflows.
5. A new ad takes one command after the brief is written.
6. Output is deterministic. Same code gives the same video.
7. Total cost stays $0 for a one-person operation.

## 3. Non-goals

- No AI-generated footage in version 1.
- No text-to-speech. The user supplies recorded audio.
- No cloud rendering (AWS Lambda).
- No web app, no multi-tenant service, no login.
- No After Effects templates.

## 4. Licensing

Remotion Free License applies: an individual or a team of up to 3 people, free
for commercial use and for automations. Rendering locally from our own code is
allowed. Server-side telemetry is voluntary for Free License users. If the
operation grows past 3 people, buy a Company License (from $25 per seat per
month, or $0.01 per render for automations).

## 5. Inputs

### 5.1 Brief (`briefs/<name>.json`)

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | slug, also the output filename |
| `product` | string | yes | shown on product beats |
| `cta` | string | yes | call to action text |
| `contact` | string | no | phone or page shown on CTA |
| `language` | string | yes | `bn` for Bangla |
| `audio` | string | yes | path to WAV or MP3 inside `public/` |
| `timing` | string | yes | path to aligned timing JSON |
| `brand` | object | no | overrides for `brand.ts` |
| `beatTypes` | array | no | override auto scene types |

### 5.2 Timing JSON (`briefs/<name>.timing.json`)

```
audio_duration: number
words: [ [word_bangla, start_time, end_time], ... ]
scenes: [ { type, start, end }, ... ]   // written by the align step
aligned: { version, threshold, gaps_matched, warnings: [...] }
```

The raw timing from the user is stored as `briefs/<name>.raw.json`. It is never
rendered directly. The align step (section 9) produces the `.timing.json`.

### 5.3 Assets (`public/`)

- `brand/logo.jpg` — DevSolutions BD logo, 1536x1024, white background.
- `audio/<name>.wav` — the voice track.
- `music/` — optional bed. Absent in version 1.

## 6. Architecture

```
aivideo/
├─ briefs/                 brief, raw timing, aligned timing
├─ public/
│  ├─ brand/logo.jpg
│  └─ audio/<name>.wav
├─ src/
│  ├─ index.ts             registerRoot
│  ├─ Root.tsx             registers one Composition per brief and size
│  ├─ brand.ts             colors, fonts, spacing, safe areas
│  ├─ timing.ts            frame <-> second math, scene building
│  ├─ Ad.tsx               composes background, scenes, captions, logo, bar
│  ├─ scenes/              one file per scene type
│  ├─ parts/               Logo, CaptionBar, ProgressBar, Grain, Card, Numeral
│  └─ text/                wrapping and measuring helpers
├─ scripts/
│  ├─ align.ts             raw timing + WAV -> aligned timing (section 9)
│  ├─ render.ts            render one brief in one or all sizes
│  ├─ check.ts             runs all automated checks (section 12)
│  └─ new-ad.ts            copies the brief template
├─ tests/                  unit tests, snapshot baselines
├─ out/                    finished MP4 files and stills
├─ docs/superpowers/specs/ this file
└─ README.md               step-by-step for a non-developer
```

### Data flow

```
raw timing JSON + WAV
        │
        ▼
  scripts/align.ts ──► briefs/<name>.timing.json (aligned words + scenes)
        │
briefs/<name>.json ──► Root.tsx (Composition props)
        │
        ▼
   Ad.tsx ──► background ─► scenes ─► caption bar ─► logo ─► progress bar
        │                              ▲
        └── audio track ───────────────┘ (frame from useCurrentFrame)
        │
        ▼
  npx remotion render ──► PNG frames + audio ──► FFmpeg ──► out/<name>-9x16.mp4
```

### Module responsibilities

| Module | Does | Depends on |
|---|---|---|
| `brand.ts` | constants only. No logic | nothing |
| `timing.ts` | convert seconds to frames, build scene list | none (pure) |
| `text/` | wrap Bangla text, measure width | `@remotion/layout-utils` |
| `parts/*` | presentational, one job each | `brand.ts` |
| `scenes/*` | one visual beat each | `parts`, `brand` |
| `Ad.tsx` | layout and ordering only | `scenes`, `parts`, `timing` |
| `scripts/align.ts` | offline, Node only, no React | `ffmpeg-static` for probe |

Rules: no module reads a file at render time. All data arrives through
Composition props. `scripts/` never imports from `src/scenes` or `src/parts`.

## 7. Timing model

- Frame rate: **30 fps**. Frame duration 33.33 ms.
- `durationInFrames = Math.round(audio_duration * 30)`. For 37.92 s that is
  **1138 frames**.
- Scene boundaries come from aligned word gaps, not from fixed beats.
- `scene.startFrame = Math.round(scene.start * 30)`.
- A scene ends where the next scene starts. No gaps, no overlaps, no drift.

Every caption word uses its own `[start, end]`. The caption bar highlights the
word where `start <= frame/fps < end`.

## 8. Visual design

### 8.1 Brand

| Token | Value | Source |
|---|---|---|
| `bg` | `#0A0D14` | dark base, blue reads better on it |
| `blue` | `#1668E3` | logo blue |
| `blueDeep` | `#0B3FA8` | logo gradient end |
| `ink` | `#FFFFFF` | headline |
| `muted` | `#98A2B6` | body, kickers |
| `alert` | `#FF5A4E` | problem beats only |
| `plate` | `#FFFFFF` | logo plate, the logo JPG has a white background |

Logo rule: never place the JPG on a dark background. Always sit it on a white
rounded plate with 24 px padding. Two logo treatments: corner watermark
(small, 12% opacity, always on) and end-card logo (large, centered).

### 8.2 Type

Font: `Noto Sans Bengali`, installed at
`/usr/share/fonts/truetype/noto/NotoSansBengali-{Regular,Bold}.ttf`.

| Level | Size (9:16) | Weight |
|---|---|---|
| Hook headline | 96 px | Bold |
| Beat headline | 76 px | Bold |
| Body | 46 px | Regular |
| Caption word | 58 px | Bold |
| Kicker / label | 34 px | Regular |

Bangla rule: max 2 caption lines, max 9 grapheme clusters per line. Headlines
wrap to max 3 lines. All sizes scale by `min(width, height) / 1080` so 1:1 and
16:9 stay proportional.

### 8.3 Composition layers, bottom to top

1. Background: slow gradient mesh in brand blue, dark base.
2. Grain and vignette, static, 6% opacity.
3. Scene content, one per beat.
4. Caption bar, bottom third, inside the safe area.
5. Logo watermark, top-left.
6. Progress bar, top, one pixel of blue that fills across the whole video.

### 8.4 Scene types

| Type | Used for | Visual |
|---|---|---|
| `hook` | opening question | large type, alert accent, fast push in |
| `problem` | pain beats | dark card, old-UI mock, red mark |
| `feature` | product capabilities | news card mock, bullets spring in, icons |
| `question` | bridge question | centered type, pulse, blue glow |
| `stat` | numbers like 24, 2015 | count-up numeral, ring chart |
| `promise` | transformation | left/right before-after, arrow sweep |
| `cta` | final action | white logo plate, contact, pulsing button |

Each scene type accepts `{ headline, kicker, bullets, stat, accent }`. The
align script assigns a type to each scene from a rule table; the brief can
override it with `beatTypes`.

### 8.5 Motion rules

- Enter with `spring()` (damping 14, stiffness 120).
- Exit inside the last 6 frames of the scene.
- Text enters by 24 px rise plus fade, 0.4 s.
- Bullets stagger by 5 frames.
- Scene cut: 4-frame light sweep across the screen. No crossfade, because a
  crossfade hides the cut and speech changes on the cut.
- No animation longer than 1.2 s. Nothing may still be moving when the voice
  stops for the next word.

## 9. Alignment step (the fix for the timing problem)

`scripts/align.ts`

**Why:** verified against the real WAV. The raw timing places two scene
boundaries 0.40 to 0.50 s late. Captions must not be late.

**Algorithm**

1. Decode the WAV to PCM. Mono, 10 ms windows, RMS per window.
2. Threshold = 6% of the 90th-percentile RMS. Windows below it are silence.
3. Merge silence runs shorter than 0.20 s into the surrounding speech. Keep
   silence runs of 0.20 s or longer as detected gaps `S`.
4. Build raw gaps `G` from the word list: `G = [w[i].end, w[i+1].start]` where
   the difference is 0.25 s or more.
5. Match `G` to `S` monotonically, nearest first, tolerance 1.0 s. Use a
   dynamic program over the two sequences; cost is absolute time distance.
   Unmatched raw gaps are kept as-is and reported as warnings.
6. Build anchors: raw gap start maps to detected silence start, raw gap end
   maps to detected silence end. Add anchor `(0, speech_onset)` and
   `(audio_duration, audio_duration)`.
7. Linearly interpolate every word time between neighbouring anchors. Clamp to
   `[0, audio_duration]`.
8. Post-checks. Fail the run if any of these is true:
   - word order is not strictly increasing,
   - a word starts before 0 or ends after `audio_duration`,
   - a matched gap still has mean RMS above 50% of speech RMS,
   - more than 2 raw gaps are unmatched.
9. Derive scenes from the aligned gaps. Write `briefs/<name>.timing.json`.

**Report printed:** detected gaps, matched pairs with raw vs detected time,
final residual per gap, warnings, and the word count before and after.

**Why this beats re-transcribing:** the Bangla words stay exactly as written by
the user. No ASR model download. No risk of wrong word splitting. The audio is
used only as the clock.

## 10. Audio

- Voice is the master track: `<Audio src={staticFile(brief.audio)} />`.
- No music in version 1. The hook therefore starts immediately.
- If a music file is added later: volume 0.10, ducked to 0.04 while the voice
  is active, driven by the aligned word gaps.
- After render, pass the file through FFmpeg `loudnorm` to `-14 LUFS` with
  `faststart` for web playback.

## 11. Rendering

| Size | Resolution | Use |
|---|---|---|
| `9x16` | 1080x1920 | Reels, Shorts, TikTok, Facebook Stories |
| `1x1` | 1080x1080 | Facebook feed |
| `16x9` | 1920x1080 | YouTube pre-roll |

Encoder: H.264, `yuv420p`, CRF 18, AAC 192k, `+faststart`.

Safe areas (relative): top 180 px and bottom 320 px in 9:16 stay clear of
platform UI; sides 80 px. In 1:1 and 16:9 the caption bar and logo move in
proportion.

`safeWidth = width - 2 * 80`. Every headline, caption line, and bullet must
measure at or under `safeWidth`. Test 4 and test 5 use this exact value.

Concurrency: Remotion default. Expected render for 1138 frames at 1080x1920 is
1 to 3 minutes per size on this machine.

## 12. Testing

| # | Test | Tool | Fails when |
|---|---|---|---|
| 1 | Brief schema | unit | a required field is missing or wrong type |
| 2 | Timing invariants | unit | words overlap, go out of range, or scenes have gaps |
| 3 | Scene frame math | unit | scene frames do not tile the whole video |
| 4 | Caption fit | unit, `measureText` | a caption line is wider than the safe width (below) |
| 5 | Headline fit | unit, `measureText` | a wrapped headline exceeds 3 lines |
| 6 | Alignment residual | unit, runs on the real WAV | a gap is still misaligned after alignment |
| 7 | Still snapshots | `remotion still` + `pixelmatch` | frames differ from the approved baseline |
| 8 | Output check | `ffprobe-static` | duration, size, or audio stream is wrong |

Test runner: `vitest`. Commands:

```
npm test            tests 1-6
npm run snapshots   tests 7 (writes baselines on first run, updates with --update)
npm run check       tests 1-8, the command I run before every claim
```

Test 7 renders frames at the first frame of every scene plus the last frame.
That covers every scene type without rendering the full video.

## 13. Commands

```
npm run studio                      preview in the browser
npm run align -- devsolutions       raw timing + WAV -> aligned timing
npm run ad -- devsolutions          render 9x16
npm run ad -- devsolutions --all    render all three sizes
npm run new-ad -- <name>            create a brief from the template
npm test                            unit tests
npm run check                       everything
```

## 14. Error handling

| Condition | Behaviour |
|---|---|
| Audio file missing | exit 1, print the expected path |
| Timing JSON missing | exit 1, print the `align` command to run |
| Word starts after `audio_duration` | alignment fails, print the word |
| Caption too wide | test 4 fails, prints text, measured width, limit |
| Logo missing | exit 1. Never a silent placeholder |
| Residual gap error above 0.25 s | warning printed; above 0.5 s, fail |
| Render crash | Remotion prints the frame and the error, no partial file kept |

## 15. First delivery

Scope of version 1: one product, one voice track, three output sizes.

Brief `devsolutions` with these scenes, times from the aligned timing:

| # | Time | Type | Headline |
|---|---|---|---|
| 1 | 0.00–4.10 | hook | মানুষ কেন আপনার নিউজ পোর্টালে ঢুকে তিন সেকেন্ডেই বের হয়ে যায়? |
| 2 | 4.50–8.00 | problem | আপনার সাইট এখনও ২০১৫ সালেই আটকে আছে |
| 3 | 8.40–11.10 | problem | এখনকার পাঠকরা লম্বা রচনা পড়তে চায় না |
| 4 | 11.45–19.75 | feature | তিন লাইনের এআই সামারি + অডিও সামারি |
| 5 | 20.20–21.95 | question | আর ভিজিটর আনবে কোথা থেকে? |
| 6 | 22.35–30.80 | feature | প্রতিদিন ২৪টা ট্রেন্ডিং খবর + ফটোকার্ড |
| 7 | 31.25–35.80 | promise | লোকাল পোর্টাল থেকে জাতীয় মানের স্মার্ট পোর্টাল |
| 8 | 36.15–37.92 | cta | ডেমো লিংক পেতে এখনই মেসেজ দিন |

Times above are the raw values. The align step recomputes them from the real
audio and its output wins.

## 16. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Bangla overflow | text cut off | test 4 and 5 fail before render |
| Remotion Chrome download fails | cannot render | needs network once, then cached |
| System `ffprobe` missing (verified: absent) | cannot check output | use `ffprobe-static` from npm |
| System `ffmpeg` present but no `ffprobe` | same | `ffmpeg-static` for encode, `ffprobe-static` for checks |
| Render is slow | long feedback loop | preview in Studio, stills for review, full render only at the end |
| Alignment still imperfect | captions slightly off | warning printed with residual, manual fix possible in the brief |
| Remotion license changes | cost | monitor. Free License covers this use case today |

## 17. Acceptance criteria

1. `npm run check` passes with all 8 tests green.
2. `out/devsolutions-9x16.mp4` duration equals the WAV duration within 0.05 s.
3. Every scene change lands within 0.10 s of a real pause in the audio.
4. Every caption word switches on the frame its speech begins.
5. No Bangla line overflows the safe area in any size.
6. The video plays with correct audio, correct 1080x1920 size, H.264.
7. The README alone is enough for a non-developer to make the next ad.
