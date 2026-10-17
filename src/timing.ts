import type {Brief, SceneSpan, SceneType, Timing, Word} from './model';
import {SCENE_TYPES} from './model';
import {FPS} from './brand';

export const toFrames = (seconds: number, fps: number = FPS): number => Math.round(seconds * fps);

export const durationFrames = (timing: Timing, fps: number = FPS): number =>
  Math.round(timing.audio_duration * fps);

/** Type rule from the spec: first beat is the hook, last is the CTA,
 * a question mark means a question, long beats explain, short beats state a problem. */
export const ruleType = (index: number, count: number, seconds: number, headline = ''): SceneType => {
  if (index === 0) return 'hook';
  if (index === count - 1) return 'cta';
  if (headline.includes('?')) return 'question';
  if (seconds >= 5) return 'feature';
  return 'problem';
};

const SPLIT_GAP = 0.25;

export const totalSegments = (scenes: Brief['scenes']): number =>
  scenes.reduce((sum, s) => sum + (s.segments ?? 1), 0);

/** Split the word list into beats: every pause of 0.25s or more ends a beat. */
export const sceneSpans = (timing: Timing, brief: Brief): SceneSpan[] => {
  const {words} = timing;
  if (!words.length) throw new Error('timing.words is empty');
  const runs: Array<{start: number; end: number}> = [];
  let start = words[0].s;
  let end = words[0].e;
  for (let i = 1; i < words.length; i++) {
    const gap = words[i].s - words[i - 1].e;
    if (gap >= SPLIT_GAP) {
      runs.push({start, end});
      start = words[i].s;
    }
    end = words[i].e;
  }
  runs.push({start, end: timing.audio_duration});

  if (runs.length !== totalSegments(brief.scenes)) {
    throw new Error(
      `brief.scenes has ${brief.scenes.length} entries covering ${totalSegments(brief.scenes)} segments ` +
        `(${brief.scenes.map((s) => s.segments ?? 1).join('+')}) but the audio has ${runs.length} segments. ` +
        'Adjust the "segments" field of each scene so the counts match.',
    );
  }

  let used = 0;
  return brief.scenes.map((copy, i) => {
    const count = copy.segments ?? 1;
    const group = runs.slice(used, used + count);
    used += count;
    const start = group[0].start;
    const end = group[group.length - 1].end;
    const type = copy.type ?? ruleType(i, brief.scenes.length, end - start, copy.headline);
    if (!SCENE_TYPES.includes(type)) throw new Error(`unknown scene type ${String(type)}`);
    return {start, end, type, copy};
  });
};

export type SceneFrame = {
  type: SceneType;
  start: number;
  end: number;
  copy: SceneSpan['copy'];
};

/** Tile [0, total) with the scene frames: every frame belongs to exactly one scene. */
export const sceneFrames = (spans: SceneSpan[], total: number, fps: number = FPS): SceneFrame[] => {
  const frames: SceneFrame[] = spans.map((s, i) => ({
    type: s.type,
    start: i === 0 ? 0 : toFrames(s.start, fps),
    end: i === spans.length - 1 ? total : toFrames(spans[i + 1].start, fps),
    copy: s.copy,
  }));
  for (let i = 1; i < frames.length; i++) {
    if (frames[i].start !== frames[i - 1].end) {
      throw new Error(
        `scene ${i} starts at frame ${frames[i].start} but scene ${i - 1} ends at ${frames[i - 1].end}`,
      );
    }
  }
  if (frames[0].start !== 0) throw new Error('first scene must start at frame 0');
  if (frames[frames.length - 1].end !== total) {
    throw new Error(
      `last scene ends at frame ${frames[frames.length - 1].end} but the video is ${total} frames`,
    );
  }
  for (const f of frames) {
    if (f.end - f.start < 1) throw new Error(`scene ${f.type} is shorter than one frame`);
  }
  return frames;
};

export type CaptionChunk = {words: Word[]; start: number; end: number; text: string};

/** Group words into caption chunks: never more than maxWords,
 * and a pause of gapMin or more ends the chunk. */
export const groupCaptions = (
  words: Word[],
  {maxWords = 6, gapMin = 0.25}: {maxWords?: number; gapMin?: number} = {},
): CaptionChunk[] => {
  const out: CaptionChunk[] = [];
  let chunk: Word[] = [];
  const flush = (): void => {
    if (!chunk.length) return;
    out.push({
      words: chunk,
      start: chunk[0].s,
      end: chunk[chunk.length - 1].e,
      text: chunk.map((x) => x.w).join(' '),
    });
    chunk = [];
  };
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const next = words[i + 1];
    chunk.push(w);
    const pauseAfter = next ? next.s - w.e >= gapMin : false;
    if (chunk.length >= maxWords || pauseAfter) flush();
  }
  flush();
  return out;
};

/** Index of the word being spoken at time t, or -1 during a pause. */
export const activeWordIndex = (words: Word[], t: number): number =>
  words.findIndex((w) => t >= w.s && t < w.e);
