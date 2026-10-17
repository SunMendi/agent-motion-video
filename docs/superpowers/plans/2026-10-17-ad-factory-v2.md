# Ad Factory v2 — Remaining Work Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish v2: soft music bed under the voice, full re-render of all three sizes, verified outputs, updated docs.

**Architecture:** The visual redesign (light theme + product mockups) is complete and committed (`253c1bf` era commits). Remaining work adds a code-generated ambient music bed mixed in the render pipeline, then re-renders and verifies everything.

**Tech Stack:** ffmpeg-static (lavfi chord synthesis), existing `scripts/lib/ffmpeg.ts` helpers, vitest.

**Spec:** `docs/superpowers/specs/2026-10-17-ad-factory-design.md` (section 19 = v2 deltas).

## Global Constraints

- Video duration equals the voice audio duration (37.92 s, 1138 frames at 30 fps). Music must not change it.
- Loudness stays −14 LUFS on the final mix.
- Total cost $0, no cloud services.
- `npm run lint`, `npx vitest run`, `npm run snapshots` all green before the final commit.
- ASD-100 plain language in docs.

## Review Focus

- Music loud enough to fight the voice: bed must stay quiet (`MUSIC_VOLUME = 0.14`); check final mix loudness still measures near −14 LUFS after normalise.
- Duration drift from mixing/normalise: `probeFile(final).duration` must equal the raw render duration (±0.05 s).
- `--no-music` fallback: render must still work when `public/audio/<name>.music.wav` is missing.
- Snapshot baselines stale after any visual change: re-run `npm run snapshots` before committing.
- ffprobe JSON parsing on mixed files: `check.ts` must still pass for all three sizes.

---

### Task 1: Music bed generator and mix step

**Files:**
- Create: `scripts/lib/music-core.ts`, `scripts/music.ts`, `tests/music.test.ts`
- Modify: `scripts/lib/ffmpeg.ts` (add `mixAudio`), `scripts/render.ts` (mix step), `package.json` (`music` script)

**Interfaces:**
- Produces: `generateMusic(durationSec: number, outPath: string): void`, `MUSIC_VOLUME = 0.14`, `mixAudio(video, music, output, musicVolume?)`, CLI `npm run music -- <brief-name>` → `public/audio/<name>.music.wav`.

- [x] Step 1: Write failing tests (`tests/music.test.ts`: duration match, non-positive rejects, mix keeps duration + aac).
- [x] Step 2: Run `npx vitest run tests/music.test.ts` → FAIL (files missing).
- [x] Step 3: Implement `music-core.ts` (detuned F-chord sines, tremolo f=0.12 d=0.55, lowpass 700, 2 s fades), `mixAudio` in `ffmpeg.ts` (`amix duration=first normalize=0`, video stream copied), `scripts/music.ts` CLI (duration = `audio_duration + 0.2`), render.ts mix-then-normalise with `--no-music` flag.
- [x] Step 4: Run `npx vitest run tests/music.test.ts` → PASS (4 tests; bed loudness target added).
- [x] Step 5: Generate the real bed: `npm run music -- devsolutions` → `public/audio/devsolutions.music.wav` (bed -35 LUFS, voice -15 LUFS).
- [x] Step 6: Commit done (`feat: add music bed generation and mix it in the render`).

### Task 2: Re-render and verify all three sizes

**Files:** `out/devsolutions-{9x16,1x1,16x9}.mp4`

- [x] Step 1: Rendered all three sizes (~12 min).
- [x] Step 2: Check passed: 37.952 s, correct sizes, h264/aac, −14.0 LUFS on all three.
- [x] Step 3: Pause window −35 dB vs speech −14 dB: bed ~21 dB under voice, ~6 dB over floor.
- [x] Step 4: First pass at −35 LUFS was too quiet; raised `BED_LUFS` to −30 and re-mixed from the raw renders.
- [x] Step 5: `out/` untracked and clean.

### Task 3: Documentation

**Files:** `README.md`, `docs/superpowers/specs/2026-10-17-ad-factory-design.md` (section 19), `docs/superpowers/plans/2026-10-17-ad-factory.md` (checkboxes).

- [x] Step 1: README updated (music command, `--no-music`, layout field, screenshot slots, mockup look).
- [x] Step 2: Spec section 19 written (light theme, mockup parts, layouts, screenshot slots, music bed, Bangla digits).
- [x] Step 3: v1 plan already fully ticked.
- [x] Step 4: All green: 48 tests, lint clean, snapshots 0.000% differ.
- [x] Step 5: Committed (`docs: record v2 design and usage`, final tweaks in this commit).
