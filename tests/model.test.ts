import {describe, expect, it} from 'vitest';
import {validateBrief, validateTiming} from '../src/model';

const brief = {
  name: 'x',
  product: 'p',
  cta: 'c',
  language: 'bn',
  audio: 'audio/x.wav',
  timing: 'x.timing.json',
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
    words: [
      {w: 'a', s: 0, e: 0.4},
      {w: 'b', s: 0.5, e: 1},
    ],
  };
  it('accepts ordered words inside the duration', () => {
    expect(validateTiming(timing)).toEqual([]);
  });
  it('rejects a word that ends after the duration', () => {
    expect(validateTiming({audio_duration: 0.8, words: timing.words}).join(' ')).toContain('e');
  });
  it('rejects overlapping words', () => {
    expect(
      validateTiming({
        audio_duration: 2,
        words: [
          {w: 'a', s: 0, e: 1},
          {w: 'b', s: 0.5, e: 1.2},
        ],
      }).join(' '),
    ).toContain('overlap');
  });
});
