import {describe, expect, it} from 'vitest';
import {
  activeWordIndex,
  durationFrames,
  groupCaptions,
  ruleType,
  sceneFrames,
  sceneSpans,
  toFrames,
} from '../src/timing';
import type {Brief, Timing} from '../src/model';

const timing: Timing = {
  audio_duration: 10,
  words: [
    {w: 'a', s: 0, e: 0.5},
    {w: 'b', s: 0.6, e: 1},
    {w: 'c', s: 1.1, e: 1.5},
    {w: 'd', s: 3, e: 3.4},
    {w: 'e', s: 3.5, e: 4},
  ],
};

const brief = {
  name: 'x',
  product: 'p',
  cta: 'c',
  language: 'bn',
  audio: 'a.wav',
  timing: 'x.json',
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
    expect(spans[1].start).toBeCloseTo(3, 5);
    expect(spans[1].end).toBe(10);
  });
  it('keeps the copy count equal to the segment count', () => {
    const bad = {...brief, scenes: [{headline: 'only'}]};
    expect(() => sceneSpans(timing, bad)).toThrow(/scenes/);
  });
  it('uses the copy type when present', () => {
    expect(sceneSpans(timing, brief)[1].type).toBe('question');
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
    expect(ruleType(1, 5, 2, 'ভিজিটর আনবে কোথা থেকে?')).toBe('question');
  });
  it('prefers feature for long middle beats', () => {
    expect(ruleType(1, 3, 6)).toBe('feature');
    expect(ruleType(1, 3, 1)).toBe('problem');
  });
});

describe('groupCaptions', () => {
  it('splits into chunks at pauses and at the word limit', () => {
    const chunks = groupCaptions(timing.words, {maxWords: 3, gapMin: 0.25});
    expect(chunks.map((c) => c.words.map((w) => w.w))).toEqual([
      ['a', 'b', 'c'],
      ['d', 'e'],
    ]);
    expect(chunks[0].start).toBe(0);
    expect(chunks[0].end).toBe(1.5);
    expect(chunks[1].start).toBe(3);
  });
  it('breaks a chunk when a pause follows a word', () => {
    const words = [
      {w: 'x', s: 0, e: 0.4},
      {w: 'y', s: 1, e: 1.4},
    ];
    expect(groupCaptions(words, {maxWords: 6, gapMin: 0.25}).map((c) => c.text)).toEqual(['x', 'y']);
  });
});

describe('activeWordIndex', () => {
  it('finds the spoken word and returns -1 during pauses', () => {
    expect(activeWordIndex(timing.words, 0.7)).toBe(1);
    expect(activeWordIndex(timing.words, 2)).toBe(-1);
  });
});
