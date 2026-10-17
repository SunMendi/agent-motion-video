export const SCENE_TYPES = ['hook', 'problem', 'feature', 'question', 'stat', 'promise', 'cta'] as const;
export type SceneType = (typeof SCENE_TYPES)[number];

/** Named layouts that override the type-based scene pick. */
export const SCENE_LAYOUTS = ['longread', 'trending'] as const;
export type SceneLayout = (typeof SCENE_LAYOUTS)[number];

export type SceneCopy = {
  type?: SceneType;
  layout?: SceneLayout;
  kicker?: string;
  headline: string;
  bullets?: string[];
  stat?: {value: string; label?: string};
  before?: string;
  after?: string;
  cta?: string;
  contact?: string;
  /** How many audio pauses this scene covers. Default 1. Must sum to the audio's segment count. */
  segments?: number;
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

export type AlignGap = {
  jsonStart: number;
  jsonEnd: number;
  detectedStart: number;
  detectedEnd: number;
  correction: number;
};

export type Timing = {
  audio_duration: number;
  words: Word[];
  align?: {matched: number; warnings: string[]; gaps?: AlignGap[]};
};

export type SceneSpan = {type: SceneType; start: number; end: number; copy: SceneCopy};

export const validateBrief = (b: Brief): string[] => {
  const out: string[] = [];
  const req = ['name', 'product', 'cta', 'language', 'audio', 'timing'] as const;
  for (const k of req) if (!b[k]) out.push(`${k}: path is required`);
  if (!Array.isArray(b.scenes) || b.scenes.length === 0) {
    out.push('scenes: at least one scene is required');
  }
  (b.scenes ?? []).forEach((s, i) => {
    if (!s.headline) out.push(`scenes[${i}].headline: required`);
    if (s.type && !SCENE_TYPES.includes(s.type)) {
      out.push(`scenes[${i}].type: unknown value ${String(s.type)}`);
    }
    if (s.segments !== undefined && (!Number.isInteger(s.segments) || s.segments < 1)) {
      out.push(`scenes[${i}].segments: must be a positive integer, got ${String(s.segments)}`);
    }
    if (s.layout !== undefined && !SCENE_LAYOUTS.includes(s.layout)) {
      out.push(`scenes[${i}].layout: unknown value ${String(s.layout)}`);
    }
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
    if (w.e > (t.audio_duration ?? 0) + 0.001) {
      out.push(`words[${i}].e: ${w.e} ends after audio_duration ${t.audio_duration}`);
    }
    const prev = (t.words ?? [])[i - 1];
    if (prev && w.s < prev.e - 0.001) out.push(`words[${i}]: overlaps previous word`);
  });
  return out;
};
