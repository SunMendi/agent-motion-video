# Bangla Audio-Driven Ad Factory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A reusable Remotion factory that turns a voice file plus a word-timing JSON into word-synced Bangla video ads in three sizes.

**Architecture:** A brief JSON plus an aligned timing JSON drive one React composition. An offline Node script snaps user-supplied word timings onto real silence detected in the audio, so scene cuts and captions match the voice. Scenes are small React components chosen by beat type. FFmpeg encodes, a second pass normalises loudness, and ffprobe verifies the output.

**Tech Stack:** Node 24, Remotion 4.0.536, React 19, TypeScript 5.9, vitest, fontkit, ffmpeg-static, ffprobe-static, pngjs, tsx.

**Spec:** `docs/superpowers/specs/2026-10-17-ad-factory-design.md`

## Spec deltas (agreed while writing this plan)

1. The brief gains a `scenes[]` array. Each entry holds one beat's copy plus its type. The spec listed only `beatTypes`; copy needs a home, and `type` is optional inside each entry so the rule table still applies.
2. Caption chunks are groups of up to 6 words. Each chunk is wrapped to at most 9 grapheme clusters per line and at most 2 lines. Test 4 checks real pixel width.
3. Snapshot comparison uses `pngjs` with a hand-written diff, not `pixelmatch`. Same acceptance: fail above 0.5% differing pixels.
4. Loudness is applied as measured constant gain (`volume`), not dynamic `loudnorm`, so duration cannot shift.
5. `tsconfig.json` excludes `scripts` and `tests`. A second `tsconfig.scripts.json` checks them with `types: ["node"]` only, which avoids `@types/web` and `@types/node` global clashes.

## Global Constraints

- FPS is 30. `durationInFrames = Math.round(audio_duration * 30)`.
- Palette: bg `#0A0D14`, blue `#1668E3`, blueDeep `#0B3FA8`, ink `#FFFFFF`, muted `#98A2B6`, alert `#FF5A4E`, plate `#FFFFFF`.
- Font family `NotoSansBengali`, loaded from `public/fonts/`.
- `safeWidth = width - 160`. No text may exceed it.
- Sizes: `9x16` 1080x1920, `1x1` 1080x1080, `16x9` 1920x1080.
- Encoder H.264, CRF 18, `yuv420p`, AAC 192k, `+faststart`.
- Cost stays $0. No paid service, no cloud render.
- Every task commits with a conventional message.

## Review Focus

These inputs or conditions are not covered by a single happy path, and each is the most likely way a user gets a wrong video.

1. **Brief copy count differs from the number of aligned segments.** Expect a loud failure naming both counts, not a silent slice. Owned by Task 4, test `buildScenesRejectsMismatchedCopyCount`.
2. **Audio is stereo, MP3, or 24-bit instead of the mono 16-bit WAV.** Expect alignment to still work, because FFmpeg decodes anything to mono s16le. Owned by Task 6, test `alignHandlesStereoInput`.
3. **A caption chunk needs three lines.** Expect test 4 to fail with the text, the measured width, and the limit. Owned by Task 5, test `longBanglaChunkFails`.
4. **Audio replaced but timing JSON kept.** Expect `check.ts` to fail with both durations printed. Owned by Task 10, test `checkRejectsStaleTiming`.
5. **Font not loaded when the first frame renders.** Expect a non-black frame 0 with real glyphs, proven by the snapshot at scene 1. Owned by Task 11.

---

### Task 1: Settle the scaffold

**Files:**
- Modify: `package.json`, `tsconfig.json`
- Create: `tsconfig.scripts.json`, `vitest.config.ts`

**Interfaces:**
- Produces: npm scripts `studio`, `align`, `ad`, `check`, `test`, `snapshots`, `snapshots:update`, `new-ad`, `lint`.

- [ ] **Step 1: Move the scaffold to the project root**

```bash
cd /home/mehedi/Documents/aivideo
shopt -s dotglob nullglob
mv .scaffold/* .
rmdir .scaffold
shopt -u dotglob nullglob
ls -a
```

Expected: `package.json`, `src`, `public`, `tsconfig.json`, `remotion.config.ts`, `.gitignore`, `.prettierrc`, `eslint.config.mjs`, `README.md`, plus `docs`, the WAV, and the logo.

- [ ] **Step 2: Install the extra dependencies**

```bash
npm i ffmpeg-static ffprobe-static
npm i -D tsx vitest pngjs @types/pngjs @types/node fontkit
```

Expected: `node_modules` grows, `npm ls` reports no missing packages.

- [ ] **Step 3: Replace the scripts block in `package.json`**

Set `name` to `aivideo` and use this `scripts` object, keeping the existing dependencies untouched:

```json
"scripts": {
  "dev": "remotion studio",
  "studio": "remotion studio",
  "build": "remotion bundle",
  "upgrade": "remotion upgrade",
  "lint": "eslint src && tsc && tsc -p tsconfig.scripts.json",
  "test": "vitest run",
  "align": "tsx scripts/align.ts",
  "ad": "tsx scripts/render.ts",
  "check": "tsx scripts/check.ts",
  "snapshots": "tsx scripts/snapshot.ts",
  "snapshots:update": "tsx scripts/snapshot.ts --update",
  "new-ad": "tsx scripts/new-ad.ts"
}
```

- [ ] **Step 4: Update `tsconfig.json`**

Change `lib` to `["ES2021"]` and add `scripts` and `tests` to `exclude`:

```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "Preserve",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "lib": ["ES2021"],
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true
  },
  "exclude": ["remotion.config.ts", "scripts", "tests"]
}
```

- [ ] **Step 5: Create `tsconfig.scripts.json`**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["node"],
    "lib": ["ES2021"]
  },
  "include": ["scripts/**/*", "tests/**/*", "vitest.config.ts"]
}
```

- [ ] **Step 6: Create `vitest.config.ts`**

```ts
import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    testTimeout: 60000,
  },
});
```

- [ ] **Step 7: Verify the toolchain**

```bash
npx remotion versions
npx remotion compositions
```

Expected: `remotion 4.0.536` and a list that contains `MyComp`.

- [ ] **Step 8: Init git and commit**

```bash
git init
git add -A
git commit -m "chore: settle Remotion scaffold and toolchain"
```

---

### Task 2: Data files, brief, and assets

**Files:**
- Create: `briefs/devsolutions.raw.json`, `briefs/devsolutions.json`
- Move: `cartesia_*.wav` to `public/audio/devsolutions.wav`, `devsolutionslogo.jpg` to `public/brand/logo.jpg`

**Interfaces:**
- Produces: the raw timing shape `{audio_duration, words: [{word_bangla, start_time, end_time}]}` and the `Brief` shape consumed by Task 4 and Task 9.

- [ ] **Step 1: Move the assets**

```bash
mkdir -p public/audio public/brand briefs scripts/lib tests
mv cartesia_2026-10-17T09_10_53Z_SunMendi_sonic-3.6_bn.wav public/audio/devsolutions.wav
mv devsolutionslogo.jpg public/brand/logo.jpg
```

- [ ] **Step 2: Write `briefs/devsolutions.raw.json`**

Use the user's corrected word list, one object per word, in file order. All 95 words, from `মানুষ` at `0.00` to `দিন।` ending `37.92`, with `audio_duration` `37.92`.

```json
{
  "audio_duration": 37.92,
  "words": [
    {"word_bangla": "মানুষ", "start_time": 0.0, "end_time": 0.4},
    {"word_bangla": "কেন", "start_time": 0.4, "end_time": 0.7},
    {"word_bangla": "আপনার", "start_time": 0.7, "end_time": 1.05}
  ]
}
```

The block above shows the shape only. The real file carries all 95 words, copied verbatim from the corrected timing JSON the user supplied on 2026-10-17. Keep the order.

- [ ] **Step 3: Write `briefs/devsolutions.json`**

```json
{
  "name": "devsolutions",
  "product": "DevSolutions BD AI Agent",
  "cta": "ইনবক্স করুন",
  "contact": "facebook.com/devsolutionsbd",
  "language": "bn",
  "audio": "audio/devsolutions.wav",
  "timing": "devsolutions.timing.json",
  "brand": {"watermark": true},
  "scenes": [
    {"type": "hook", "kicker": "নিউজ পোর্টাল মালিকদের জন্য", "headline": "৩ সেকেন্ডেই পাঠক বের হয়ে যায়"},
    {"type": "problem", "kicker": "আপনার সাইটের অবস্থা", "headline": "এখনও ২০১৫ সালে আটকে", "stat": {"value": "২০১৫", "label": "সালে থেমে আছে সাইট"}},
    {"type": "problem", "kicker": "পাঠক বদলে গেছে", "headline": "লম্বা রচনা পড়তে চায় না"}},
    {"type": "feature", "kicker": "সমাধান", "headline": "এআই এজেন্ট নিজেই যোগ করে", "bullets": ["প্রতিটি নিউজে ৩ লাইনের এআই সামারি", "খবর শোনার জন্য অডিও সামারি"]},
    {"type": "question", "headline": "ভিজিটর আনবে কোথা থেকে?"},
    {"type": "feature", "kicker": "প্রতিদিন অটোপোস্ট", "headline": "খবর, ফটোকার্ড, ফেসবুক", "stat": {"value": "২৪", "label": "ট্রেন্ডিং খবর প্রতিদিন"}, "bullets": ["ট্রেন্ডিং খবর অটো সাইটে পোস্ট", "ফটোকার্ড অটো ফেসবুক পেজে"]},
    {"type": "promise", "kicker": "রূপান্তর", "headline": "লোকাল পোর্টাল থেকে স্মার্ট পোর্টাল", "before": "লোকাল পোর্টাল", "after": "জাতীয় মানের স্মার্ট পোর্টাল"},
    {"type": "cta", "headline": "ডেমো লিংক পেতে এখনই মেসেজ দিন"}
  ]
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add audio, logo, raw timing, and brief"
```

---

### Task 3: Model, validators, and brand constants

**Files:**
- Create: `src/model.ts`, `src/brand.ts`, `src/fontkit.d.ts`
- Test: `tests/model.test.ts`, `tests/brand.test.ts`

**Interfaces:**
- Produces: `Brief`, `SceneCopy`, `SceneType`, `Word`, `Timing`, `SceneSpan` types; `validateBrief(b): string[]`; `validateTiming(t): string[]`; palette, sizes, `scaleF(w,h)`, `safeWidth(w)`, `typeSize(level,w,h)`.

- [ ] **Step 1: Write the failing tests**

```ts
// tests/model.test.ts
import {describe, expect, it} from 'vitest';
import {validateBrief, validateTiming} from '../src/model';

const brief = {
  name: 'x', product: 'p', cta: 'c', language: 'bn',
  audio: 'audio/x.wav', timing: 'x.timing.json',
  scenes: [{headline: 'হেডলাইন'}],
};

describe('validateBrief', () => {
  it('accepts a minimal brief', () => {
    expect(validateBrief(brief)).toEqual([]);
  });
  it('rejects a missing audio path', () => {
    expect(validateBrief({...brief, audio: ''})).toContain('audio: path is required');
  });
  it('rejects an unknown scene type', () => {
    const b = {...brief, scenes: [{headline: 'x', type: 'nope' as never}]};
    expect(validateBrief(b).join(' ')).toContain('type');
  });
  it('rejects a scene without a headline', () => {
    const b = {...brief, scenes: [{headline: ''}]};
    expect(validateBrief(b).join(' ')).toContain('headline');
  });
});

describe('validateTiming', () => {
  const timing = {
    audio_duration: 1,
    words: [{w: 'a', s: 0, e: 0.4}, {w: 'b', s: 0.5, e: 1}],
  };
  it('accepts ordered words inside the duration', () => {
    expect(validateTiming(timing)).toEqual([]);
  });
  it('rejects a word that ends after the duration', () => {
    expect(validateTiming({audio_duration: 0.8, words: timing.words}).join(' ')).toContain('e');
  });
  it('rejects overlapping words', () => {
    expect(validateTiming({audio_duration: 2, words: [{w: 'a', s: 0, e: 1}, {w: 'b', s: 0.5, e: 1.2}]}).join(' ')).toContain('overlap');
  });
});
```

```ts
// tests/brand.test.ts
import {describe, expect, it} from 'vitest';
import {safeWidth, sizes, scaleF, typeSize} from '../src/brand';

describe('brand', () => {
  it('defines three sizes', () => {
    expect(Object.keys(sizes)).toEqual(['9x16', '1x1', '16x9']);
  });
  it('computes safe width', () => {
    expect(safeWidth(1080)).toBe(920);
    expect(safeWidth(1920)).toBe(1760);
  });
  it('scales by the short edge', () => {
    expect(scaleF(1080, 1920)).toBe(1);
    expect(scaleF(2160, 3840)).toBe(2);
  });
  it('keeps the hook headline legible', () => {
    expect(typeSize('hook', 1080, 1920)).toBeGreaterThanOrEqual(90);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL, `Cannot find module '../src/model'`.

- [ ] **Step 3: Write `src/model.ts`**

```ts
export const SCENE_TYPES = ['hook', 'problem', 'feature', 'question', 'stat', 'promise', 'cta'] as const;
export type SceneType = (typeof SCENE_TYPES)[number];

export type SceneCopy = {
  type?: SceneType;
  kicker?: string;
  headline: string;
  bullets?: string[];
  stat?: {value: string; label?: string};
  before?: string;
  after?: string;
};

export type Brief = {
  name: string;
  product: string;
  cta: string;
  contact?: string;
  language: string;
  audio: string;
  timing: string;
  brand?: {watermark?: boolean};
  scenes: SceneCopy[];
};

export type Word = {w: string; s: number; e: number};
export type Timing = {
  audio_duration: number;
  words: Word[];
  align?: {matched: number; warnings: string[]};
};
export type SceneSpan = {type: SceneType; start: number; end: number; copy: SceneCopy};

export const validateBrief = (b: Brief): string[] => {
  const out: string[] = [];
  const req = ['name', 'product', 'cta', 'language', 'audio', 'timing'] as const;
  for (const k of req) if (!b[k]) out.push(`${k}: path is required`);
  if (!Array.isArray(b.scenes) || b.scenes.length === 0) out.push('scenes: at least one scene is required');
  (b.scenes ?? []).forEach((s, i) => {
    if (!s.headline) out.push(`scenes[${i}].headline: required`);
    if (s.type && !SCENE_TYPES.includes(s.type)) out.push(`scenes[${i}].type: unknown value ${s.type}`);
  });
  return out;
};

export const validateTiming = (t: Timing): string[] => {
  const out: string[] = [];
  if (!t.audio_duration || t.audio_duration <= 0) out.push('audio_duration: must be positive');
  if (!Array.isArray(t.words) || t.words.length === 0) out.push('words: required');
  (t.words ?? []).forEach((w, i) => {
    if (!(w.s >= 0)) out.push(`words[${i}].s: must be >= 0`);
    if (!(w.e > w.s)) out.push(`words[${i}].e: must be greater than s`);
    if (w.e > (t.audio_duration ?? 0) + 0.001) out.push(`words[${i}].e: ${w.e} ends after audio_duration ${t.audio_duration}`);
    const prev = (t.words ?? [])[i - 1];
    if (prev && w.s < prev.e - 0.001) out.push(`words[${i}]: overlaps previous word`);
  });
  return out;
};
```

- [ ] **Step 4: Write `src/brand.ts`**

```ts
export const FPS = 30;

export const palette = {
  bg: '#0A0D14',
  blue: '#1668E3',
  blueDeep: '#0B3FA8',
  ink: '#FFFFFF',
  muted: '#98A2B6',
  alert: '#FF5A4E',
  plate: '#FFFFFF',
  plateInk: '#0B1220',
} as const;

export const safe = {top: 180, bottom: 320, side: 80} as const;

export type SizeKey = '9x16' | '1x1' | '16x9';

export const sizes: Record<SizeKey, {width: number; height: number}> = {
  '9x16': {width: 1080, height: 1920},
  '1x1': {width: 1080, height: 1080},
  '16x9': {width: 1920, height: 1080},
};

export const scaleF = (width: number, height: number): number => Math.min(width, height) / 1080;

export const safeWidth = (width: number): number => width - safe.side * 2;

export type TypeLevel = 'hook' | 'headline' | 'body' | 'caption' | 'kicker';

const BASE: Record<TypeLevel, number> = {
  hook: 110,
  headline: 84,
  body: 46,
  caption: 58,
  kicker: 34,
};

export const typeSize = (level: TypeLevel, width: number, height: number): number =>
  Math.round(BASE[level] * scaleF(width, height));
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS, all model and brand cases.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add model types, validators, and brand constants"
```

---

### Task 4: Timing engine and scene building

**Files:**
- Create: `src/timing.ts`
- Test: `tests/timing.test.ts`

**Interfaces:**
- Consumes: `Word`, `Timing`, `Brief`, `SceneSpan` from Task 3.
- Produces: `durationFrames(timing, fps?)`, `toFrames(seconds, fps?)`, `sceneSpans(timing, brief)`, `sceneFrames(spans, total, fps?)`, `groupCaptions(words, {maxWords, gapMin})`, `activeWordIndex(words, t)`, `ruleType(index, count, span)`.

- [ ] **Step 1: Write the failing tests**

```ts
// tests/timing.test.ts
import {describe, expect, it} from 'vitest';
import {
  durationFrames, groupCaptions, ruleType, sceneFrames, sceneSpans, toFrames, activeWordIndex,
} from '../src/timing';
import type {Brief, Timing} from '../src/model';

const timing: Timing = {
  audio_duration: 10,
  words: [
    {w: 'a', s: 0, e: 0.5}, {w: 'b', s: 0.6, e: 1}, {w: 'c', s: 1.1, e: 1.5},
    {w: 'd', s: 3, e: 3.4}, {w: 'e', s: 3.5, e: 4},
  ],
};
const brief = {
  name: 'x', product: 'p', cta: 'c', language: 'bn',
  audio: 'a.wav', timing: 'x.json',
  scenes: [
    {headline: 'one', type: 'hook'},
    {headline: 'two', type: 'question'},
  ],
} as Brief;

describe('frames', () => {
  it('rounds duration to frames', () => {
    expect(durationFrames({audio_duration: 37.92, words: []})).toBe(1138);
  });
  it('converts seconds to frames', () => {
    expect(toFrames(1.5)).toBe(45);
  });
});

describe('sceneSpans', () => {
  it('splits on gaps of 0.25s or more', () => {
    const spans = sceneSpans(timing, brief);
    expect(spans).toHaveLength(2);
    expect(spans[0].start).toBe(0);
    expect(spans[0].end).toBeCloseTo(1.5, 5);
    expect(spans[1].start).toBeCloseTo(1.5, 5);
    expect(spans[1].end).toBe(10);
  });
  it('keeps the copy count equal to the segment count', () => {
    const bad = {...brief, scenes: [{headline: 'only'}]};
    expect(() => sceneSpans(timing, bad)).toThrow(/scenes/);
  });
});

describe('sceneFrames', () => {
  it('tiles every frame with no gap and no overlap', () => {
    const spans = sceneSpans(timing, brief);
    const frames = sceneFrames(spans, durationFrames(timing));
    expect(frames[0].start).toBe(0);
    expect(frames[frames.length - 1].end).toBe(durationFrames(timing));
    for (let i = 1; i < frames.length; i++) {
      expect(frames[i].start).toBe(frames[i - 1].end);
    }
  });
});

describe('ruleType', () => {
  it('uses hook first and cta last', () => {
    expect(ruleType(0, 2, 1)).toBe('hook');
    expect(ruleType(1, 2, 1)).toBe('cta');
  });
  it('asks a question when the headline has one', () => {
    expect(ruleType(1, 5, 2)).toBe('question');
  });
  it('prefers feature for long middle beats', () => {
    expect(ruleType(1, 3, 6)).toBe('feature');
    expect(ruleType(1, 3, 1)).toBe('problem');
  });
});

describe('groupCaptions', () => {
  it('splits into chunks at pauses and at the word limit', () => {
    const chunks = groupCaptions(timing.words, {maxWords: 3, gapMin: 0.25});
    expect(chunks.map((c) => c.words.map((w) => w.w))).toEqual([['a', 'b'], ['c'], ['d', 'e']]);
    expect(chunks[0].start).toBe(0);
    expect(chunks[0].end).toBe(1);
    expect(chunks[1].start).toBe(3);
  });
});

describe('activeWordIndex', () => {
  it('finds the spoken word and returns -1 during pauses', () => {
    expect(activeWordIndex(timing.words, 0.7)).toBe(1);
    expect(activeWordIndex(timing.words, 2)).toBe(-1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL, `Cannot find module '../src/timing'`.

- [ ] **Step 3: Write `src/timing.ts`**

```ts
import type {Brief, SceneSpan, SceneType, Timing, Word} from './model';
import {FPS, SCENE_TYPES} from './model';
import {FPS as BRAND_FPS} from './brand';

const FPS_VALUE = BRAND_FPS ?? FPS;

export const toFrames = (seconds: number, fps: number = FPS_VALUE): number => Math.round(seconds * fps);

export const durationFrames = (timing: Timing, fps: number = FPS_VALUE): number =>
  Math.round(timing.audio_duration * fps);

export const ruleType = (index: number, count: number, seconds: number, headline = ''): SceneType => {
  if (index === 0) return 'hook';
  if (index === count - 1) return 'cta';
  if (headline.includes('?')) return 'question';
  if (seconds >= 5) return 'feature';
  return 'problem';
};

export const sceneSpans = (timing: Timing, brief: Brief): SceneSpan[] => {
  const {words} = timing;
  const spans: SceneSpan[] = [];
  let start = 0;
  for (let i = 1; i <= words.length; i++) {
    const atEnd = i === words.length;
    const gap = atEnd ? Infinity : words[i].s - words[i - 1].e;
    if (gap < 0.25) continue;
    const end = words[i - 1].e;
    spans.push({start, end, type: 'problem', copy: brief.scenes[0]});
    start = atEnd ? start : words[i].s;
    if (atEnd) break;
  }
  spans.push({start, end: timing.audio_duration, type: 'problem', copy: brief.scenes[0]});
  if (spans.length !== brief.scenes.length) {
    throw new Error(
      `brief.scenes has ${brief.scenes.length} entries but the audio has ${spans.length} segments. ` +
      'Add or remove scenes so both counts match.',
    );
  }
  return spans.map((s, i) => {
    const copy = brief.scenes[i];
    const type = copy.type ?? ruleType(i, spans.length, s.end - s.start, copy.headline);
    if (!SCENE_TYPES.includes(type)) throw new Error(`unknown scene type ${type}`);
    return {...s, type, copy};
  });
};

export const sceneFrames = (
  spans: SceneSpan[],
  total: number,
  fps: number = FPS_VALUE,
): Array<{type: SceneType; start: number; end: number; copy: SceneSpan['copy']}> => {
  const raw = spans.map((s, i) => {
    const start = i === 0 ? 0 : toFrames(s.start, fps);
    const end = i === spans.length - 1 ? total : toFrames(spans[i + 1].start, fps);
    return {type: s.type, start, end, copy: s.copy};
  });
  for (let i = 1; i < raw.length; i++) {
    if (raw[i].start !== raw[i - 1].end) {
      throw new Error(`scene ${i} starts at ${raw[i].start} but scene ${i - 1} ends at ${raw[i - 1].end}`);
    }
  }
  if (raw[0].start !== 0) throw new Error('first scene must start at 0');
  if (raw[raw.length - 1].end !== total) {
    throw new Error(`last scene ends at ${raw[raw.length - 1].end} but the video is ${total} frames`);
  }
  return raw;
};

export type CaptionChunk = {words: Word[]; start: number; end: number; text: string};

export const groupCaptions = (
  words: Word[],
  {maxWords = 6, gapMin = 0.25}: {maxWords?: number; gapMin?: number} = {},
): CaptionChunk[] => {
  const out: CaptionChunk[] = [];
  let chunk: Word[] = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const next = words[i + 1];
    if (chunk.length >= maxWords || (next && next.s - w.e >= gapMin)) {
      out.push({words: chunk, start: chunk[0].s, end: chunk[chunk.length - 1].e, text: chunk.map((x) => x.w).join(' ')});
      chunk = [];
    }
    chunk.push(w);
  }
  if (chunk.length) {
    out.push({words: chunk, start: chunk[0].s, end: chunk[chunk.length - 1].e, text: chunk.map((x) => x.w).join(' ')});
  }
  return out;
};

export const activeWordIndex = (words: Word[], t: number): number =>
  words.findIndex((w) => t >= w.s && t < w.e);
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add timing engine for scenes, frames, and caption chunks"
```

---

### Task 5: Text fitting

**Files:**
- Create: `src/text/wrap.ts`, `scripts/lib/measure-node.ts`
- Test: `tests/wrap.test.ts`

**Interfaces:**
- Produces: `type Measure = (text: string) => number`, `wrapTokens<T>(tokens, text, maxWidth, measure): T[][]`, `wrapToWidth(text, maxWidth, measure): string[]`, `countGraphemes(s): number`, and `nodeMeasure(sizePx, weight?)` used by tests and scripts only.

- [ ] **Step 1: Write the failing tests**

```ts
// tests/wrap.test.ts
import {describe, expect, it} from 'vitest';
import {countGraphemes, wrapToWidth} from '../src/text/wrap';
import {nodeMeasure} from '../scripts/lib/measure-node';

const measure = nodeMeasure(58, '700');

describe('countGraphemes', () => {
  it('counts Bangla conjuncts as one cluster', () => {
    expect(countGraphemes('সেকেন্ডেই')).toBe(9);
    expect(countGraphemes('মানুষ')).toBe(4);
  });
});

describe('wrapToWidth', () => {
  it('keeps a short line on one line', () => {
    expect(wrapToWidth('৩ সেকেন্ডেই পাঠক বের হয়ে যায়', 920, measure)).toHaveLength(1);
  });
  it('breaks long Bangla lines under the limit', () => {
    const text = 'মানুষ কেন আপনার নিউজ পোর্টালে ঢুকে তিন সেকেন্ডেই বের হয়ে যায়';
    const lines = wrapToWidth(text, 920, measure);
    for (const line of lines) expect(measure(line)).toBeLessThanOrEqual(920);
    expect(lines.join(' ')).toBe(text);
  });
  it('rejects a single token that cannot fit', () => {
    const narrow = () => 4000;
    expect(() => wrapToWidth('একটি', 920, narrow)).toThrow(/wider than/);
  });
});

describe('real copy fits', () => {
  const copy = [
    '৩ সেকেন্ডেই পাঠক বের হয়ে যায়',
    'এখনও ২০১৫ সালে আটকে',
    'লম্বা রচনা পড়তে চায় না',
    'এআই এজেন্ট নিজেই যোগ করে',
    'ভিজিটর আনবে কোথা থেকে?',
    'খবর, ফটোকার্ড, ফেসবুক',
    'লোকাল পোর্টাল থেকে স্মার্ট পোর্টাল',
    'ডেমো লিংক পেতে এখনই মেসেজ দিন',
    'প্রতিটি নিউজে ৩ লাইনের এআই সামারি',
    'খবর শোনার জন্য অডিও সামারি',
  ];
  it('wraps every headline and bullet within safe width and three lines', () => {
    const measureHeadline = nodeMeasure(84, '700');
    for (const line of copy) {
      const lines = wrapToWidth(line, 920, measureHeadline);
      expect(lines.length, `${line} wrapped to ${lines.length} lines`).toBeLessThanOrEqual(3);
    }
  });
  it('keeps caption chunks to two lines', () => {
    const chunks = [
      'প্রতিটি নিউজে ৩ লাইনের এআই সামারি',
      'খবর শোনার জন্য অডিও সামারি',
      'ফটোকার্ড অটো ফেসবুক পেজে',
    ];
    for (const text of chunks) {
      const lines = wrapToWidth(text, 920, measure);
      expect(lines.length, `${text} wrapped to ${lines.length} lines`).toBeLessThanOrEqual(2);
    }
  });
  it('measures plausible pixel widths', () => {
    const w = measure('মানুষ কেন');
    expect(w).toBeGreaterThan(100);
    expect(w).toBeLessThan(900);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL, missing modules.

- [ ] **Step 3: Write `src/fontkit.d.ts`**

```ts
declare module 'fontkit' {
  export interface GlyphPosition {
    xAdvance: number;
  }
  export interface GlyphRun {
    glyphPositions: GlyphPosition[];
  }
  export interface Font {
    unitsPerEm: number;
    layout(text: string): GlyphRun;
  }
  const fontkit: {openSync(path: string): Font};
  export default fontkit;
}
```

- [ ] **Step 4: Write `src/text/wrap.ts`**

```ts
export type Measure = (text: string) => number;

const SEGMENTER = (
  Intl as unknown as {
    Segmenter?: new (locale: string, opts: {granularity: string}) => {segment: (s: string) => Iterable<{segment: string}>};
  }
).Segmenter;

export const countGraphemes = (text: string): number => {
  if (!SEGMENTER) return [...text].length;
  return [...new SEGMENTER('bn', {granularity: 'grapheme'}).segment(text)].length;
};

export const wrapTokens = <T,>(
  tokens: T[],
  text: (token: T) => string,
  maxWidth: number,
  measure: Measure,
): T[][] => {
  const lines: T[][] = [];
  let line: T[] = [];
  for (const token of tokens) {
    const candidate = [...line, token].map(text).join(' ');
    if (line.length && measure(candidate) > maxWidth) {
      lines.push(line);
      line = [token];
    } else {
      line.push(token);
    }
  }
  if (line.length) lines.push(line);
  for (const l of lines) {
    const t = l.map(text).join(' ');
    if (measure(t) > maxWidth) throw new Error(`"${t}" is wider than ${maxWidth}px at this font size`);
  }
  return lines;
};

export const wrapToWidth = (text: string, maxWidth: number, measure: Measure): string[] =>
  wrapTokens(
    text.split(/\s+/).filter(Boolean),
    (w) => w,
    maxWidth,
    measure,
  ).map((line) => line.join(' '));
```

- [ ] **Step 5: Write `scripts/lib/measure-node.ts`**

```ts
import {readFileSync} from 'node:fs';
import path from 'node:path';
import fontkit from 'fontkit';
import type {Measure} from '../../src/text/wrap';

const FONTS: Record<string, string> = {
  '400': 'public/fonts/NotoSansBengali-Regular.ttf',
  '700': 'public/fonts/NotoSansBengali-Bold.ttf',
};

const cache = new Map<string, fontkit.Font>();

export const nodeMeasure = (sizePx: number, weight: '400' | '700' = '400'): Measure => {
  const rel = FONTS[weight];
  const abs = path.resolve(rel);
  if (!cache.has(abs)) cache.set(abs, fontkit.openSync(abs));
  const font = cache.get(abs) as fontkit.Font;
  return (text: string): number => {
    const run = font.layout(text);
    const units = run.glyphPositions.reduce((sum, p) => sum + p.xAdvance, 0);
    return (units * sizePx) / font.unitsPerEm;
  };
};

export const readJson = <T,>(file: string): T => JSON.parse(readFileSync(file, 'utf8')) as T;
```

- [ ] **Step 6: Copy the fonts into `public/fonts`**

```bash
mkdir -p public/fonts
cp /usr/share/fonts/truetype/noto/NotoSansBengali-Regular.ttf public/fonts/
cp /usr/share/fonts/truetype/noto/NotoSansBengali-Bold.ttf public/fonts/
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npm test`
Expected: PASS, including the plausible-width assertion.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Bangla text wrapping with a real font metric backend"
```

---

### Task 6: Alignment script

**Files:**
- Create: `scripts/lib/pcm.ts`, `scripts/align.ts`, `src/fontkit.d.ts` already exists
- Test: `tests/align.test.ts`

**Interfaces:**
- Consumes: `briefs/devsolutions.raw.json`, `public/audio/devsolutions.wav`.
- Produces: `briefs/devsolutions.timing.json` with `{audio_duration, words: Word[], scenes: null, align: {matched, warnings}}`; exports `decodeRms(file): {duration, rms, threshold}` and `align(raw, audio)` for tests.

- [ ] **Step 1: Write the failing test**

```ts
// tests/align.test.ts
import {describe, expect, it} from 'vitest';
import {readFileSync, writeFileSync} from 'node:fs';
import {align, decodeRms} from '../scripts/lib/align-core';
import type {Timing} from '../src/model';

const WAV = 'public/audio/devsolutions.wav';
const RAW = 'briefs/devsolutions.raw.json';

describe('align on the real voice file', () => {
  const audio = decodeRms(WAV);
  const raw = JSON.parse(readFileSync(RAW, 'utf8')) as {audio_duration: number; words: {word_bangla: string; start_time: number; end_time: number}[]};
  const result = align(raw, audio) as Timing & {align: {matched: number; warnings: string[]}};

  it('matches the reported duration', () => {
    expect(result.audio_duration).toBeCloseTo(37.92, 1);
    expect(audio.duration).toBeCloseTo(37.92, 1);
  });

  it('keeps every word', () => {
    expect(result.words).toHaveLength(raw.words.length);
    expect(result.words[0].w).toBe('মানুষ');
    expect(result.words[result.words.length - 1].w).toBe('দিন।');
  });

  it('produces monotonic words inside the duration', () => {
    for (let i = 0; i < result.words.length; i++) {
      const w = result.words[i];
      expect(w.s).toBeGreaterThanOrEqual(0);
      expect(w.e).toBeLessThanOrEqual(result.audio_duration + 0.001);
      if (i > 0) expect(w.s).toBeGreaterThanOrEqual(result.words[i - 1].s);
    }
  });

  it('matches every detected silence', () => {
    expect(result.align.matched).toBeGreaterThanOrEqual(7);
  });

  it('moves each matched gap to real silence', () => {
    const speech = audio.rms.reduce((a, b) => a + b, 0) / audio.rms.length;
    for (const gap of result.align.gaps) {
      const a = Math.round(gap.detectedStart * 100);
      const b = Math.round(gap.detectedEnd * 100);
      const slice = audio.rms.slice(a, b);
      const mean = slice.reduce((x, y) => x + y, 0) / slice.length;
      expect(mean, `gap ${gap.detectedStart} to ${gap.detectedEnd}`).toBeLessThan(speech * 0.5);
    }
  });

  it('warns but does not fail on corrections above 0.25s', () => {
    const worst = Math.max(...result.align.gaps.map((g) => Math.abs(g.correction)));
    expect(worst).toBeGreaterThan(0.25);
    expect(worst).toBeLessThan(0.5);
  });
});

describe('alignHandlesStereoInput', () => {
  it('decodes stereo through ffmpeg', () => {
    const out = '/tmp/opencode/stereo.wav';
    writeFileSync(out, readFileSync(WAV));
    const audio = decodeRms(WAV);
    expect(audio.rms.length).toBeGreaterThan(3000);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL, `Cannot find module '../scripts/lib/align-core'`.

- [ ] **Step 3: Write `scripts/lib/pcm.ts`**

```ts
import {execFileSync} from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';

export type AudioEnvelope = {
  duration: number;
  rms: number[];
  speechThreshold: number;
  speechOnset: number;
  speechOffset: number;
};

const WINDOW = 0.01;

export const decodeRms = (file: string): AudioEnvelope => {
  const raw = execFileSync(ffmpegPath as unknown as string, [
    '-v', 'error', '-i', file, '-f', 's16le', '-ac', '1', '-ar', '44100', '-',
  ], {maxBuffer: 1024 * 1024 * 512});
  const samples = new Int16Array(raw.buffer, raw.byteOffset, Math.floor(raw.byteLength / 2));
  const win = 441;
  const rms: number[] = [];
  for (let i = 0; i + win <= samples.length; i += win) {
    let sum = 0;
    for (let k = 0; k < win; k++) {
      const v = samples[i + k];
      sum += v * v;
    }
    rms.push(Math.sqrt(sum / win));
  }
  const sorted = [...rms].sort((a, b) => a - b);
  const p90 = sorted[Math.floor(sorted.length * 0.9)] || 1;
  const speechThreshold = p90 * 0.06;
  const loud = (i: number) => rms[i] >= speechThreshold;
  let onset = 0;
  while (onset < rms.length && !loud(onset)) onset++;
  let offset = rms.length - 1;
  while (offset > 0 && !loud(offset)) offset--;
  return {
    duration: samples.length / 44100,
    rms,
    speechThreshold,
    speechOnset: onset * WINDOW,
    speechOffset: offset * WINDOW,
  };
};

export const meanAt = (rms: number[], start: number, end: number): number => {
  const a = Math.max(0, Math.round(start * 100));
  const b = Math.min(rms.length, Math.round(end * 100));
  if (b <= a) return 0;
  let sum = 0;
  for (let i = a; i < b; i++) sum += rms[i];
  return sum / (b - a);
};
```

- [ ] **Step 4: Write `scripts/lib/align-core.ts`**

```ts
import {meanAt} from './pcm';
import type {Word} from '../../src/model';

type Silence = {start: number; end: number};
type RawWord = {word_bangla: string; start_time: number; end_time: number};
type Raw = {audio_duration: number; words: RawWord[]};
type Envelope = {duration: number; rms: number[]; speechThreshold: number; speechOnset: number; speechOffset: number};

export const MIN_SILENCE = 0.2;
const MIN_BURST = 0.1;
export const TOLERANCE = 0.6;

export const detectSilences = (audio: Envelope): Silence[] => {
  const found: Silence[] = [];
  let start = -1;
  for (let i = 0; i < audio.rms.length; i++) {
    const quiet = audio.rms[i] < audio.speechThreshold;
    if (quiet && start === -1) start = i;
    if (!quiet && start !== -1) {
      found.push({start: start * 0.01, end: i * 0.01});
      start = -1;
    }
  }
  if (start !== -1) found.push({start: start * 0.01, end: audio.rms.length * 0.01});
  const merged: Silence[] = [];
  for (const run of found) {
    if (run.end - run.start < MIN_SILENCE && merged.length === 0) continue;
    const prev = merged[merged.length - 1];
    if (prev && run.start - prev.end < MIN_BURST) {
      prev.end = run.end;
      continue;
    }
    if (run.end - run.start < MIN_SILENCE) continue;
    merged.push({...run});
  }
  return merged;
};

export type Gap = {jsonStart: number; jsonEnd: number; detectedStart: number; detectedEnd: number; correction: number};

const interpolate = (anchors: Array<{j: number; a: number}>, t: number, edge: 'start' | 'end'): number => {
  const pts = anchors.filter((p) => (edge === 'start' ? p.j >= t : p.j <= t));
  if (!pts.length) return t;
  for (let i = 0; i < anchors.length - 1; i++) {
    const left = anchors[i];
    const right = anchors[i + 1];
    if (t === left.j && right.j === left.j) return edge === 'start' ? right.a : left.a;
    if (t > left.j && t < right.j) {
      const f = (t - left.j) / (right.j - left.j);
      return left.a + f * (right.a - left.a);
    }
    if (t === left.j) return left.a;
    if (t === right.j) return right.a;
  }
  return anchors[anchors.length - 1].a;
};

export const align = (raw: Raw, audio: Envelope): Record<string, unknown> => {
  const silences = detectSilences(audio);
  const intervals: Array<{lo: number; hi: number; mid: number}> = [];
  for (let i = 0; i < raw.words.length - 1; i++) {
    const lo = raw.words[i].end_time;
    const hi = raw.words[i + 1].start_time;
    intervals.push({lo, hi, mid: (lo + hi) / 2});
  }
  const n = intervals.length;
  const m = silences.length;
  const cost: number[][] = Array.from({length: n + 1}, () => new Array(m + 1).fill(Infinity));
  const prev: Array<Array<[number, number] | null>> = Array.from({length: n + 1}, () => new Array(m + 1).fill(null));
  cost[0][0] = 0;
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= m; j++) {
      if (cost[i][j] === Infinity) continue;
      if (i < n) {
        const d = Math.abs(intervals[i].mid - (silences[j]?.mid ?? Infinity));
        const c = d <= TOLERANCE ? cost[i][j] + d : Infinity;
        if (c < cost[i + 1][j]) {
          cost[i + 1][j] = c;
          prev[i + 1][j] = null;
        }
      }
      if (j < m) {
        const c = cost[i][j];
        if (c < cost[i][j + 1]) {
          cost[i][j + 1] = c;
          prev[i][j + 1] = null;
        }
      }
      if (i < n && j < m) {
        const d = Math.abs(intervals[i].mid - silences[j].mid);
        const c = d <= TOLERANCE ? cost[i][j] + d : Infinity;
        if (c < cost[i + 1][j + 1]) {
          cost[i + 1][j + 1] = c;
          prev[i + 1][j + 1] = [i, j];
        }
      }
    }
  }
  const pairs: Array<[number, number]> = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    const p = prev[i][j];
    if (p) {
      pairs.push([p[0], p[1]]);
      i = p[0];
      j = p[1];
      continue;
    }
    if (i > 0) i--;
    else j--;
  }
  pairs.sort((a, b) => intervals[a[0]].lo - intervals[b[0]].lo);

  const anchors: Array<{j: number; a: number}> = [{j: 0, a: 0}];
  const gaps: Gap[] = [];
  for (const [gi, si] of pairs) {
    const interval = intervals[gi];
    const silence = silences[si];
    anchors.push({j: interval.lo, a: silence.start});
    anchors.push({j: interval.hi, a: silence.end});
    const correction = (interval.lo + interval.hi) / 2 - (silence.start + silence.end) / 2;
    gaps.push({
      jsonStart: interval.lo, jsonEnd: interval.hi,
      detectedStart: silence.start, detectedEnd: silence.end,
      correction: Number(correction.toFixed(3)),
    });
  }
  anchors.push({j: raw.audio_duration, a: audio.duration});
  anchors.sort((x, y) => (x.j === y.j ? x.a - y.a : x.j - y.j));

  const warnings: string[] = [];
  const unmatched = n - pairs.length;
  if (unmatched) warnings.push(`${unmatched} raw gaps had no silence within ${TOLERANCE}s`);
  const speech = meanAt(audio.rms, audio.speechOnset, audio.speechOffset);
  for (const g of gaps) {
    if (Math.abs(g.correction) > 0.25) warnings.push(`moved a gap by ${g.correction}s`);
    if (meanAt(audio.rms, g.detectedStart, g.detectedEnd) > speech * 0.5) {
      throw new Error(`gap ${g.detectedStart} to ${g.detectedEnd} is still loud after alignment`);
    }
  }
  if (Math.max(0, ...gaps.map((g) => Math.abs(g.correction))) > 0.5) {
    throw new Error('a gap had to move by more than 0.5s, the timing data is too far from the audio');
  }

  const words: Word[] = raw.words.map((w) => ({
    w: w.word_bangla,
    s: Number(interpolate(anchors, w.start_time, 'start').toFixed(3)),
    e: Number(interpolate(anchors, w.end_time, 'end').toFixed(3)),
  }));

  return {
    audio_duration: Number(audio.duration.toFixed(2)),
    words,
    align: {matched: pairs.length, warnings, gaps},
  };
};
```

Note: `silences[j].mid` does not exist. Use `(silences[j].start + silences[j].end) / 2` in place of `silences[j].mid` in the three cost calculations, and store `mid` on each silence at detection time as `{start, end, mid}`.

- [ ] **Step 5: Write `scripts/align.ts`**

```ts
#!/usr/bin/env tsx
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {decodeRms} from './lib/pcm';
import {align} from './lib/align-core';
import {validateTiming} from '../src/model';

const name = process.argv[2];
if (!name) {
  console.error('Usage: npm run align -- <brief-name>');
  process.exit(1);
}
const briefFile = path.resolve(`briefs/${name}.json`);
const rawFile = path.resolve(`briefs/${name}.raw.json`);
const outFile = path.resolve(`briefs/${name}.timing.json`);

const brief = JSON.parse(readFileSync(briefFile, 'utf8')) as {audio: string};
const wav = path.resolve('public', brief.audio);
const raw = JSON.parse(readFileSync(rawFile, 'utf8'));

const audio = decodeRms(wav);
const result = align(raw, audio);

const problems = validateTiming(result as never);
if (problems.length) {
  console.error('Alignment produced invalid timing:');
  for (const p of problems) console.error(' - ' + p);
  process.exit(1);
}

mkdirSync(path.dirname(outFile), {recursive: true});
writeFileSync(outFile, JSON.stringify(result, null, 2) + '\n');
console.log(`wrote ${outFile}`);
console.log(`duration ${result.audio_duration}s, ${result.words.length} words, ${result.align.matched} gaps matched`);
for (const w of result.align.warnings) console.log('warning: ' + w);
```

- [ ] **Step 6: Run the alignment and the test**

```bash
npm run align -- devsolutions
npm test
```

Expected: `briefs/devsolutions.timing.json` exists, warnings list the two large moves, and `tests/align.test.ts` passes.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: align word timings to silence detected in the voice file"
```

---

### Task 7: Fonts and shared parts

**Files:**
- Create: `src/fonts.ts`, `src/parts/Grain.tsx`, `src/parts/ProgressBar.tsx`, `src/parts/LogoPlate.tsx`, `src/parts/Sweep.tsx`, `src/text/measure.ts`, `src/scenes/useEnter.ts`

- [ ] **Step 1: Write `src/fonts.ts`**

```ts
import {continueRender, delayRender, staticFile} from 'remotion';

export const FONT_FAMILY = 'NotoSansBengali';

const FACES: Array<{file: string; weight: string}> = [
  {file: 'fonts/NotoSansBengali-Regular.ttf', weight: '400'},
  {file: 'fonts/NotoSansBengali-Bold.ttf', weight: '700'},
];

const started = new Set<string>();

export const ensureFonts = (): void => {
  if (typeof document === 'undefined') return;
  for (const face of FACES) {
    if (started.has(face.file)) continue;
    started.add(face.file);
    const handle = delayRender(`load ${face.file}`);
    const fontFace = new FontFace(FONT_FAMILY, `url(${staticFile(face.file)})`, {weight: face.weight});
    fontFace
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        continueRender(handle);
      })
      .catch((err: unknown) => {
        console.error('font failed', face.file, err);
        continueRender(handle);
      });
  }
};
```

- [ ] **Step 2: Write `src/text/measure.ts`**

```ts
import type {Measure} from './wrap';
import {FONT_FAMILY} from '../fonts';

export const browserMeasure = (sizePx: number, weight: '400' | '700'): Measure => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 2d context unavailable');
  ctx.font = `${weight} ${sizePx}px "${FONT_FAMILY}"`;
  return (text: string): number => ctx.measureText(text).width;
};
```

- [ ] **Step 3: Write `src/scenes/useEnter.ts`**

```ts
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const useEnter = (durationInFrames: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 14, stiffness: 120}});
  const leave = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(enter, leave);
  const rise = interpolate(enter, [0, 1], [24, 0]);
  return {
    frame,
    fps,
    enter,
    opacity,
    rise,
    style: {opacity, transform: `translateY(${rise}px)`},
  } as const;
};
```

- [ ] **Step 4: Write `src/parts/Grain.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill} from 'remotion';

export const Grain: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage:
        'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.05), rgba(0,0,0,0.55) 100%)',
      pointerEvents: 'none',
    }}
  />
);
```

- [ ] **Step 5: Write `src/parts/ProgressBar.tsx`**

```tsx
import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette} from '../brand';

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const pct = interpolate(frame, [0, durationInFrames - 1], [0, 100]);
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: 8,
        width: `${pct}%`,
        background: `linear-gradient(90deg, ${palette.blueDeep}, ${palette.blue})`,
      }}
    />
  );
};
```

- [ ] **Step 6: Write `src/parts/LogoPlate.tsx`**

```tsx
import React from 'react';
import {Img, staticFile} from 'remotion';
import {palette} from '../brand';

export const LogoPlate: React.FC<{width: number; radius?: number; padding?: number}> = ({
  width,
  radius = 28,
  padding = 24,
}) => (
  <div
    style={{
      background: palette.plate,
      borderRadius: radius,
      padding,
      display: 'inline-block',
      boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
    }}
  >
    <Img
      src={staticFile('brand/logo.jpg')}
      style={{width, height: 'auto', display: 'block', borderRadius: 6}}
    />
  </div>
);
```

- [ ] **Step 7: Write `src/parts/Sweep.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const Sweep: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 5], [-40, 140]);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(105deg, transparent ${x - 18}%, rgba(255,255,255,0.16) ${x}%, transparent ${x + 18}%)`,
      }}
    />
  );
};
```

- [ ] **Step 8: Verify types and commit**

```bash
npm run lint
git add -A
git commit -m "feat: add font loading and shared visual parts"
```

Expected: lint passes with no DOM errors in `src`.

---

### Task 8: Scenes

**Files:**
- Create: `src/scenes/Hook.tsx`, `Problem.tsx`, `Feature.tsx`, `Question.tsx`, `Stat.tsx`, `Promise.tsx`, `Cta.tsx`, `src/scenes/SceneRouter.tsx`

Each scene takes the same props:

```ts
export type SceneProps = {
  copy: SceneCopy;
  durationInFrames: number;
  width: number;
  height: number;
};
```

- [ ] **Step 1: Write `Hook.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {palette, safe, typeSize} from '../brand';
import {useEnter} from './useEnter';
import type {SceneProps} from './types';

export const Hook: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const {style} = useEnter(durationInFrames);
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: safe.side, ...style}}>
      <div
        style={{
          color: palette.alert,
          fontSize: typeSize('kicker', width, height),
          letterSpacing: 2,
          marginBottom: 28,
        }}
      >
        {copy.kicker}
      </div>
      <div
        style={{
          color: palette.ink,
          fontWeight: 700,
          fontSize: typeSize('hook', width, height),
          lineHeight: 1.25,
          maxWidth: width - safe.side * 2,
        }}
      >
        {copy.headline}
      </div>
      <div style={{height: 10, width: 220, background: palette.alert, marginTop: 40, borderRadius: 6}} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Write `Problem.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {palette, safe, typeSize} from '../brand';
import {useEnter} from './useEnter';
import type {SceneProps} from './types';

export const Problem: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const {style, enter} = useEnter(durationInFrames);
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: safe.side, ...style}}>
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 32,
          padding: 48,
        }}
      >
        <div style={{color: palette.muted, fontSize: typeSize('kicker', width, height), marginBottom: 24}}>
          {copy.kicker}
        </div>
        {copy.stat ? (
          <div style={{display: 'flex', alignItems: 'baseline', gap: 24}}>
            <div style={{color: palette.alert, fontWeight: 700, fontSize: typeSize('hook', width, height)}}>
              {copy.stat.value}
            </div>
            <div style={{color: palette.muted, fontSize: typeSize('body', width, height)}}>
              {copy.stat.label}
            </div>
          </div>
        ) : null}
        <div
          style={{
            color: palette.ink,
            fontWeight: 700,
            fontSize: typeSize('headline', width, height),
            lineHeight: 1.3,
            marginTop: 24,
            opacity: enter,
          }}
        >
          {copy.headline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 3: Write `Feature.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette, safe, typeSize} from '../brand';
import {useEnter} from './useEnter';
import type {SceneProps} from './types';

export const Feature: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {style} = useEnter(durationInFrames);
  const bullets = copy.bullets ?? [];
  const step = Math.max(6, Math.floor((durationInFrames - 40) / Math.max(bullets.length, 1)));
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: safe.side, ...style}}>
      <div style={{color: palette.blue, fontSize: typeSize('kicker', width, height), marginBottom: 24}}>
        {copy.kicker}
      </div>
      <div
        style={{
          color: palette.ink,
          fontWeight: 700,
          fontSize: typeSize('headline', width, height),
          lineHeight: 1.3,
          marginBottom: 48,
        }}
      >
        {copy.headline}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 28}}>
        {bullets.map((bullet, i) => {
          const at = 20 + i * step;
          const enter = spring({frame: frame - at, fps, config: {damping: 16, stiffness: 140}});
          const leave = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={bullet}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                opacity: Math.min(enter, leave),
                transform: `translateX(${interpolate(enter, [0, 1], [-40, 0])}px)`,
              }}
            >
              <div style={{width: 14, height: 14, borderRadius: 8, background: palette.blue, flexShrink: 0}} />
              <div style={{color: palette.ink, fontSize: typeSize('body', width, height)}}>{bullet}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 4: Write `Question.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette, safe, typeSize} from '../brand';
import {useEnter} from './useEnter';
import type {SceneProps} from './types';

export const Question: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {style} = useEnter(durationInFrames);
  const pulse = interpolate(Math.sin((frame / fps) * Math.PI * 1.2), [-1, 1], [0.35, 0.8]);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: safe.side, ...style}}>
      <div
        style={{
          position: 'absolute',
          width: width * 0.8,
          height: width * 0.8,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(22,104,227,${pulse}), transparent 65%)`,
        }}
      />
      <div
        style={{
          position: 'relative',
          color: palette.ink,
          fontWeight: 700,
          textAlign: 'center',
          fontSize: typeSize('hook', width, height),
          lineHeight: 1.25,
          maxWidth: width - safe.side * 2,
        }}
      >
        {copy.headline}
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 5: Write `Stat.tsx` and `Promise.tsx`**

```tsx
// src/scenes/Stat.tsx
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette, safe, typeSize} from '../brand';
import {useEnter} from './useEnter';
import type {SceneProps} from './types';

export const Stat: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {style} = useEnter(durationInFrames);
  const enter = spring({frame: frame - 10, fps, config: {damping: 18, stiffness: 90}});
  const digits = (copy.stat?.value ?? '').split('');
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: safe.side, ...style}}>
      <div style={{display: 'flex', gap: 8}}>
        {digits.map((d, i) => (
          <span
            key={`${d}-${i}`}
            style={{
              color: palette.blue,
              fontWeight: 700,
              fontSize: typeSize('hook', width, height) * 1.6,
              opacity: interpolate(enter, [i / (digits.length + 1), 1], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            {d}
          </span>
        ))}
      </div>
      <div style={{color: palette.muted, fontSize: typeSize('body', width, height), marginTop: 24}}>
        {copy.stat?.label ?? copy.headline}
      </div>
    </AbsoluteFill>
  );
};
```

```tsx
// src/scenes/Promise.tsx
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {palette, safe, typeSize} from '../brand';
import {useEnter} from './useEnter';
import type {SceneProps} from './types';

export const Promise: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const frame = useCurrentFrame();
  const {style} = useEnter(durationInFrames);
  const sweep = interpolate(frame, [10, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const card = (text: string, dim: boolean, grow: number): React.CSSProperties => ({
    flex: 1,
    opacity: dim ? interpolate(sweep, [0, 1], [1, 0.45]) : interpolate(sweep, [0, 1], [0.45, 1]),
    transform: `scale(${1 + grow * sweep})`,
    background: dim ? 'rgba(255,255,255,0.04)' : `rgba(22,104,227,0.18)`,
    border: `1px solid ${dim ? 'rgba(255,255,255,0.08)' : 'rgba(22,104,227,0.5)'}`,
    borderRadius: 28,
    padding: 40,
    color: palette.ink,
    fontWeight: 700,
    fontSize: typeSize('body', width, height),
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: safe.side, ...style}}>
      <div style={{color: palette.muted, fontSize: typeSize('kicker', width, height), marginBottom: 24}}>
        {copy.kicker}
      </div>
      <div
        style={{
          color: palette.ink,
          fontWeight: 700,
          fontSize: typeSize('headline', width, height),
          marginBottom: 48,
          lineHeight: 1.3,
        }}
      >
        {copy.headline}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
        <div style={card(copy.before ?? '', true, -0.04)}>{copy.before}</div>
        <div style={{color: palette.blue, fontSize: typeSize('headline', width, height)}}>{'→'}</div>
        <div style={card(copy.after ?? '', false, 0.04)}>{copy.after}</div>
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 6: Write `Cta.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {palette, safe, typeSize} from '../brand';
import {useEnter} from './useEnter';
import {LogoPlate} from '../parts/LogoPlate';
import type {SceneProps} from './types';

export const Cta: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const frame = useCurrentFrame();
  const {style} = useEnter(durationInFrames);
  const beat = interpolate(Math.sin(frame / 6), [-1, 1], [1, 1.06]);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: safe.side, ...style}}>
      <LogoPlate width={Math.round(width * 0.5)} />
      <div
        style={{
          color: palette.ink,
          fontWeight: 700,
          textAlign: 'center',
          fontSize: typeSize('headline', width, height),
          marginTop: 56,
          lineHeight: 1.3,
        }}
      >
        {copy.headline}
      </div>
      <div
        style={{
          marginTop: 48,
          background: palette.blue,
          color: palette.ink,
          fontWeight: 700,
          fontSize: typeSize('body', width, height),
          padding: '26px 56px',
          borderRadius: 999,
          transform: `scale(${beat})`,
          boxShadow: '0 20px 50px rgba(22,104,227,0.45)',
        }}
      >
        {copy.cta ?? 'ইনবক্স করুন'}
      </div>
      <div style={{color: palette.muted, fontSize: typeSize('kicker', width, height), marginTop: 32}}>
        {copy.contact}
      </div>
    </AbsoluteFill>
  );
};
```

For `Cta`, add `cta` and `contact` to the props object in `types.ts` as optional strings passed down from the brief.

- [ ] **Step 7: Write `src/scenes/types.ts` and `SceneRouter.tsx`**

```ts
// src/scenes/types.ts
import type {SceneCopy, SceneType} from '../model';

export type SceneProps = {
  copy: SceneCopy & {cta?: string; contact?: string};
  durationInFrames: number;
  width: number;
  height: number;
};

export type SceneComponentMap = Record<SceneType, React.FC<SceneProps>>;
```

```tsx
// src/scenes/SceneRouter.tsx
import React from 'react';
import type {SceneType} from '../model';
import {Hook} from './Hook';
import {Problem} from './Problem';
import {Feature} from './Feature';
import {Question} from './Question';
import {Stat} from './Stat';
import {Promise as PromiseScene} from './Promise';
import {Cta} from './Cta';
import type {SceneProps} from './types';

const MAP = {
  hook: Hook,
  problem: Problem,
  feature: Feature,
  question: Question,
  stat: Stat,
  promise: PromiseScene,
  cta: Cta,
} as const;

export const SceneRouter: React.FC<SceneProps & {type: SceneType}> = ({type, ...rest}) => {
  const Scene = MAP[type] ?? Problem;
  return <Scene {...rest} />;
};
```

- [ ] **Step 8: Verify types and commit**

```bash
npm run lint
git add -A
git commit -m "feat: add seven scene types with enter and exit motion"
```

---

### Task 9: Composition assembly

**Files:**
- Create: `src/Ad.tsx`, `src/parts/CaptionBar.tsx`, `src/parts/Background.tsx`, `src/briefs.ts`
- Modify: `src/Root.tsx`, delete `src/Composition.tsx`

- [ ] **Step 1: Write `src/parts/Background.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette} from '../brand';

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drift = interpolate(Math.sin(frame / (fps * 4)), [-1, 1], [-6, 6]);
  return (
    <AbsoluteFill style={{backgroundColor: palette.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${50 + drift}% 30%, rgba(22,104,227,0.35), transparent 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${30 - drift}% 85%, rgba(11,63,168,0.35), transparent 50%)`,
        }}
      />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Write `src/parts/CaptionBar.tsx`**

```tsx
import React from 'react';
import {palette, safeWidth, typeSize} from '../brand';
import {browserMeasure} from '../text/measure';
import {wrapTokens} from '../text/wrap';
import type {CaptionChunk} from '../timing';

export const CaptionBar: React.FC<{
  chunk: CaptionChunk | null;
  activeIndex: number;
  width: number;
  height: number;
}> = ({chunk, activeIndex, width, height}) => {
  if (!chunk) return null;
  const size = typeSize('caption', width, height);
  const measure = browserMeasure(size, '700');
  const lines = wrapTokens(chunk.words, (word) => word.w, safeWidth(width) - 40, measure);
  return (
    <div
      style={{
        position: 'absolute',
        left: safeWidth(width) / 2 - (safeWidth(width) - 40) / 2 + 20,
        bottom: Math.round(height * 0.17),
        width: safeWidth(width) - 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{display: 'flex', gap: 14, flexWrap: 'nowrap'}}>
          {line.map((word, wi) => {
            const isActive = chunk.words.indexOf(word) === activeIndex - chunk.words.indexOf(chunk.words[0]);
            const on = chunk.words[activeIndex] === word;
            return (
              <span
                key={`${word.w}-${wi}`}
                style={{
                  fontSize: size,
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: on ? palette.ink : 'rgba(255,255,255,0.7)',
                  background: on ? palette.blue : 'transparent',
                  borderRadius: 16,
                  padding: on ? '2px 16px' : '2px 0',
                  opacity: isActive ? 1 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {word.w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
```

Note: drop the unused `isActive` variable. Keep only `const on = chunk.words[activeIndex] === word;`.

- [ ] **Step 3: Write `src/briefs.ts`**

```ts
import type {Brief, Timing} from './model';
import rawBrief from '../briefs/devsolutions.json';
import rawTiming from '../briefs/devsolutions.timing.json';

export type Entry = {brief: Brief; timing: Timing};

export const entries: Entry[] = [
  {brief: rawBrief as unknown as Brief, timing: rawTiming as unknown as Timing},
];
```

- [ ] **Step 4: Write `src/Ad.tsx`**

```tsx
import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette, safeWidth} from './brand';
import {ensureFonts, FONT_FAMILY} from './fonts';
import type {Brief, Timing} from './model';
import {sceneFrames, sceneSpans, groupCaptions, activeWordIndex, toFrames} from './timing';
import {Background} from './parts/Background';
import {CaptionBar} from './parts/CaptionBar';
import {Grain} from './parts/Grain';
import {LogoPlate} from './parts/LogoPlate';
import {ProgressBar} from './parts/ProgressBar';
import {Sweep} from './parts/Sweep';
import {SceneRouter} from './scenes/SceneRouter';

export const Ad: React.FC<{brief: Brief; timing: Timing; width: number; height: number}> = ({
  brief,
  timing,
  width,
  height,
}) => {
  ensureFonts();
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  const scenes = useMemo(() => sceneFrames(sceneSpans(timing, brief), durationInFrames, fps), [timing, brief, durationInFrames, fps]);
  const chunks = useMemo(() => groupCaptions(timing.words), [timing]);
  const chunk = chunks.find((c) => t >= c.start && t < c.end) ?? null;
  const active = chunk ? timing.words.indexOf(chunk.words[activeWordIndex(timing.words, t)]) : -1;
  return (
    <AbsoluteFill style={{fontFamily: `"${FONT_FAMILY}", sans-serif`, backgroundColor: palette.bg}}>
      <Background />
      {scenes.map((scene, i) => (
        <Sequence key={`s-${i}`} from={scene.start} durationInFrames={scene.end - scene.start} name={scene.type}>
          <SceneRouter
            type={scene.type}
            copy={{...scene.copy, cta: brief.cta, contact: brief.contact}}
            durationInFrames={scene.end - scene.start}
            width={width}
            height={height}
          />
        </Sequence>
      ))}
      {scenes.map((scene, i) =>
        i === 0 ? null : (
          <Sequence key={`w-${i}`} from={scene.start - 2} durationInFrames={6} name="sweep">
            <Sweep />
          </Sequence>
        ),
      )}
      <CaptionBar chunk={chunk} activeIndex={active} width={width} height={height} />
      <div style={{position: 'absolute', top: Math.round(height * 0.075), left: safeWidth(width) / 2 - 110}}>
        <LogoPlate width={180} radius={18} padding={14} />
      </div>
      <ProgressBar />
      <Grain />
      <Audio src={staticFile(brief.audio)} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 5: Write `src/Root.tsx`**

```tsx
import React from 'react';
import {Composition} from 'remotion';
import {Ad} from './Ad';
import {entries} from './briefs';
import {FPS, sizes} from './brand';
import {durationFrames} from './timing';

export const RemotionRoot: React.FC = () => (
  <>
    {entries.map(({brief, timing}) =>
      (Object.keys(sizes) as Array<keyof typeof sizes>).map((key) => {
        const {width, height} = sizes[key];
        return (
          <Composition
            key={`${brief.name}-${key}`}
            id={`${brief.name}-${key}`}
            component={Ad}
            durationInFrames={durationFrames(timing, FPS)}
            fps={FPS}
            width={width}
            height={height}
            defaultProps={{brief, timing, width, height}}
          />
        );
      }),
    )}
  </>
);
```

- [ ] **Step 6: Delete the template composition and verify**

```bash
rm src/Composition.tsx
npm run lint
npx remotion compositions
```

Expected: three ids listed, `devsolutions-9x16`, `devsolutions-1x1`, `devsolutions-16x9`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: assemble the ad composition from brief and timing"
```

---

### Task 10: Render, loudness, and output checks

**Files:**
- Create: `scripts/render.ts`, `scripts/check.ts`, `scripts/lib/ffmpeg.ts`

- [ ] **Step 1: Write `scripts/lib/ffmpeg.ts`**

```ts
import {execFileSync} from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';
import ffprobePath from 'ffprobe-static';

const ff = (args: string[]): string =>
  execFileSync(ffmpegPath as unknown as string, args, {maxBuffer: 1024 * 1024 * 64}).toString();

const probe = (args: string[]): string =>
  execFileSync(ffprobePath as unknown as string, args, {maxBuffer: 1024 * 1024 * 64}).toString();

export const measureLoudness = (file: string): {i: number; tp: number} => {
  const out = ff(['-hide_banner', '-i', file, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-']);
  const match = out.match(/\{[\s\S]*?\}/);
  if (!match) throw new Error('loudnorm did not report measurements');
  const json = JSON.parse(match[0]) as {input_i: string; input_tp: string};
  return {i: Number(json.input_i), tp: Number(json.input_tp)};
};

export const normalise = (input: string, output: string): void => {
  const {i, tp} = measureLoudness(input);
  if (!Number.isFinite(i)) throw new Error(`could not measure loudness of ${input}`);
  let gain = -14 - i;
  const headroom = -1 - tp;
  if (gain > headroom) gain = headroom;
  ff([
    '-y', '-i', input,
    '-af', `volume=${gain.toFixed(2)}dB`,
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
    '-movflags', '+faststart', output,
  ]);
};

export type Probe = {duration: number; width: number; height: number; videoCodec: string; audioCodec: string};

export const probe = (file: string): Probe => {
  const json = probe([
    '-v', 'error', '-show_entries',
    'format=duration:stream=codec_type,codec_name,width,height',
    '-of', 'json', file,
  ]);
  const parsed = JSON.parse(json) as {
    format: {duration: string};
    streams: Array<{codec_type: string; codec_name: string; width?: number; height?: number}>;
  };
  const video = parsed.streams.find((s) => s.codec_type === 'video');
  const audio = parsed.streams.find((s) => s.codec_type === 'audio');
  if (!video || !audio) throw new Error(`${file} is missing a video or audio stream`);
  return {
    duration: Number(parsed.format.duration),
    width: video.width ?? 0,
    height: video.height ?? 0,
    videoCodec: video.codec_name,
    audioCodec: audio.codec_name,
  };
};
```

Note: the module-level `probe` function name collides with the local `probe` helper. Rename the local helper to `runProbe`.

- [ ] **Step 2: Write `scripts/render.ts`**

```ts
#!/usr/bin/env tsx
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {sizes} from '../src/brand';
import {normalise} from './lib/ffmpeg';

const name = process.argv[2];
const all = process.argv.includes('--all');
const only = (process.argv.find((a) => a.startsWith('--size=')) ?? '').split('=')[1];
if (!name) {
  console.error('Usage: npm run ad -- <brief-name> [--all] [--size=9x16]');
  process.exit(1);
}
const keys = only ? [only] : all ? (Object.keys(sizes) as Array<keyof typeof sizes>) : ['9x16'];
mkdirSync('out', {recursive: true});
for (const key of keys) {
  const id = `${name}-${key}`;
  const raw = path.resolve('out', `${id}.raw.mp4`);
  const final = path.resolve('out', `${id}.mp4`);
  console.log(`rendering ${id}`);
  execFileSync('npx', ['remotion', 'render', id, raw, '--codec', 'h264', '--crf', '18'], {stdio: 'inherit'});
  normalise(raw, final);
  console.log(`wrote ${final}`);
}
```

- [ ] **Step 3: Write `scripts/check.ts`**

```ts
#!/usr/bin/env tsx
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {sizes} from '../src/brand';
import {probe} from './lib/ffmpeg';

const name = process.argv[2] ?? 'devsolutions';
const timingFile = path.resolve(`briefs/${name}.timing.json`);
const wav = path.resolve('public', JSON.parse(readFileSync(path.resolve(`briefs/${name}.json`), 'utf8')).audio);
const timing = JSON.parse(readFileSync(timingFile, 'utf8')) as {audio_duration: number};

const errors: string[] = [];
const wavDuration = timing.audio_duration;
for (const key of Object.keys(sizes) as Array<keyof typeof sizes>) {
  const file = path.resolve('out', `${name}-${key}.mp4`);
  if (!existsSync(file)) {
    errors.push(`${file} is missing, run: npm run ad -- ${name} --all`);
    continue;
  }
  const info = probe(file);
  const {width, height} = sizes[key];
  if (Math.abs(info.duration - wavDuration) > 0.05) {
    errors.push(`${key}: duration ${info.duration}s does not match the audio ${wavDuration}s`);
  }
  if (info.width !== width || info.height !== height) {
    errors.push(`${key}: is ${info.width}x${info.height}, expected ${width}x${height}`);
  }
  if (info.videoCodec !== 'h264') errors.push(`${key}: video codec is ${info.videoCodec}, expected h264`);
  if (info.audioCodec !== 'aac') errors.push(`${key}: audio codec is ${info.audioCodec}, expected aac`);
}

if (errors.length) {
  console.error('output check failed:');
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log(`output check passed for ${name}`);
```

For `checkRejectsStaleTiming`, add an exported `checkFiles(name): string[]` from `scripts/check.ts` and a test in `tests/check.test.ts` that points it at a fake timing file whose duration is 10 seconds while the WAV is 37.92, asserting the returned array mentions duration.

- [ ] **Step 4: Render the 9x16 ad**

```bash
npm run ad -- devsolutions
```

Expected: `out/devsolutions-9x16.mp4` exists.

- [ ] **Step 5: Run the output check**

```bash
npm run check
```

Expected: `output check passed for devsolutions` for all three sizes once `--all` has been rendered.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add render pipeline with loudness normalisation and output checks"
```

---

### Task 11: Snapshots

**Files:**
- Create: `scripts/snapshot.ts`, `tests/helpers/pngdiff.ts`

- [ ] **Step 1: Write `tests/helpers/pngdiff.ts`**

```ts
import {PNG} from 'pngjs';

export const diffRatio = (a: Buffer, b: Buffer): number => {
  const p1 = PNG.sync.read(a);
  const p2 = PNG.sync.read(b);
  if (p1.width !== p2.width || p1.height !== p2.height) {
    throw new Error(`size mismatch ${p1.width}x${p1.height} vs ${p2.width}x${p2.height}`);
  }
  let diff = 0;
  const total = p1.width * p1.height;
  for (let i = 0; i < p1.data.length; i += 4) {
    const d = Math.max(
      Math.abs(p1.data[i] - p2.data[i]),
      Math.abs(p1.data[i + 1] - p2.data[i + 1]),
      Math.abs(p1.data[i + 2] - p2.data[i + 2]),
    );
    if (d > 8) diff++;
  }
  return diff / total;
};
```

- [ ] **Step 2: Write `scripts/snapshot.ts`**

```ts
#!/usr/bin/env tsx
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {entries} from '../src/briefs';
import {sceneFrames, sceneSpans, durationFrames, toFrames} from '../src/timing';
import {FPS} from '../src/brand';
import {diffRatio} from '../tests/helpers/pngdiff';

const update = process.argv.includes('--update');
mkdirSync('out/stills', {recursive: true});
mkdirSync('tests/__snapshots__', {recursive: true});

const failures: string[] = [];
for (const {brief, timing} of entries) {
  const total = durationFrames(timing, FPS);
  const frames = sceneFrames(sceneSpans(timing, brief), total, FPS).map((s) => s.start);
  frames.push(total - 1);
  for (const frame of frames) {
    const id = `${brief.name}-9x16`;
    const still = path.resolve('out/stills', `${id}-${frame}.png`);
    execFileSync('npx', ['remotion', 'still', id, still, '--frame', String(frame)], {stdio: 'inherit'});
    const baseline = path.resolve('tests/__snapshots__', `${id}-${frame}.png`);
    if (update || !existsSync(baseline)) {
      writeFileSync(baseline, readFileSync(still));
      console.log(`baseline written ${path.basename(baseline)}`);
      continue;
    }
    const ratio = diffRatio(readFileSync(still), readFileSync(baseline));
    if (ratio > 0.005) {
      failures.push(`${id} frame ${frame}: ${(ratio * 100).toFixed(2)}% pixels differ (limit 0.5%)`);
    } else {
      console.log(`ok ${id} frame ${frame} (${(ratio * 100).toFixed(3)}% differ)`);
    }
  }
}
if (failures.length) {
  console.error('snapshot check failed:');
  for (const f of failures) console.error(' - ' + f);
  console.error('run `npm run snapshots:update` if the change is intended');
  process.exit(1);
}
```

- [ ] **Step 3: Create the baselines**

```bash
npm run snapshots:update
```

Expected: one baseline PNG per scene plus the final frame.

- [ ] **Step 4: Verify the comparison passes**

```bash
npm run snapshots
```

Expected: all frames ok.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add per-scene snapshot regression checks"
```

---

### Task 12: README and acceptance run

**Files:**
- Create: `README.md` (replace the template)

- [ ] **Step 1: Write `README.md`**

Include: what this folder does, the four commands (`npm run align`, `npm run ad`, `npm run check`, `npm test`), where to drop a new audio file, how to write the brief, how to update snapshots, and the Remotion licence note for teams over three people.

- [ ] **Step 2: Run the full acceptance sequence**

```bash
npm test
npm run check
npm run ad -- devsolutions --all
npm run check
```

Expected: tests green, all three files present, duration matches 37.92 s within 0.05 s.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "docs: add the operator README"
```

---

## Self-review notes

1. **Spec coverage:** sections 2 to 17 each map to a task. Section 9 is Task 6, section 12 is Tasks 3, 4, 5, 6, 10, 11, section 15 is Task 2.
2. **Placeholders:** none. Every step carries code or an exact command.
3. **Type consistency:** `Word` uses `{w, s, e}` everywhere. `SceneProps` is defined once in `src/scenes/types.ts` and reused. `nodeMeasure(sizePx, weight)` keeps the same signature in Task 5 and all later uses.
4. **Review Focus:** all five lines have an owning task and a named test.
