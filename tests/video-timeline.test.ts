import {describe, expect, it} from 'vitest';
import {captionPageAtFrame, eventProgress, musicGainAtFrame, type CaptionCue} from '../src/shared/video-timeline';

const cues: CaptionCue[] = [
  {id: 'one', text: 'প্রথম', startFrame: 15, endFrame: 30},
  {id: 'two', text: 'দ্বিতীয়', startFrame: 60, endFrame: 80},
  {id: 'three', text: 'শেষ', startFrame: 85, endFrame: 100},
];

describe('shared compiled timeline playback', () => {
  it('never replays the opening caption during gaps or after speech', () => {
    expect(captionPageAtFrame(cues, 0).cues).toEqual([]);
    expect(captionPageAtFrame(cues, 45).cues).toEqual([]);
    expect(captionPageAtFrame(cues, 100).cues).toEqual([]);
    expect(captionPageAtFrame(cues, 60).activeId).toBe('two');
  });

  it('keeps one reviewed phrase on screen when phrase timing is selected', () => {
    expect(captionPageAtFrame(cues, 65, 1).cues.map((cue) => cue.id)).toEqual(['two']);
  });

  it('produces the same event state when seeking, including exact start and end states', () => {
    const event = {id: 'transfer', startFrame: 30, endFrame: 61};
    expect(eventProgress(event, 0)).toBe(0);
    expect(eventProgress(event, 30)).toBe(0);
    expect(eventProgress(event, 45)).toBe(0.5);
    expect(eventProgress(event, 60)).toBe(1);
    expect(eventProgress(event, 100)).toBe(1);
    expect([50, 35, 50].map((frame) => eventProgress(event, frame))[0]).toBe(eventProgress(event, 50));
  });

  it('ducks during speech, anticipates entrances, and smooths short gaps', () => {
    expect(musicGainAtFrame(cues, 0, 30)).toBeCloseTo(0.1);
    expect(musicGainAtFrame(cues, 20, 30)).toBeCloseTo(0.035);
    expect(musicGainAtFrame(cues, 14, 30)).toBeLessThan(0.1);
    expect(musicGainAtFrame(cues, 82, 30)).toBeLessThan(0.06);
    expect(musicGainAtFrame(cues, 120, 30)).toBeCloseTo(0.1);
  });
});
