import {describe, expect, it} from 'vitest';
import {readFileSync} from 'node:fs';
import type {CompiledTimeline} from '../src/shared/video-timeline';

const timeline = JSON.parse(
  readFileSync('work/current/timeline.compiled.json', 'utf8'),
) as CompiledTimeline & {
  shots: Array<{id: string; start_frame: number; end_frame: number}>;
};

const duration = timeline.durationInFrames;

describe('compiled timeline for the current video', () => {
  it('covers every frame from start to audio end without gaps or overlaps', () => {
    const shots = [...timeline.shots].sort((a, b) => a.start_frame - b.start_frame);
    expect(shots[0].start_frame).toBe(0);
    expect(shots[shots.length - 1].end_frame).toBe(duration);
    for (let i = 0; i < shots.length; i++) {
      if (i > 0) {
        expect(shots[i].start_frame, 'shots must not overlap').toBe(
          shots[i - 1].end_frame,
        );
      }
      expect(shots[i].end_frame).toBeGreaterThan(shots[i].start_frame);
    }
  });

  it('keeps caption cues ordered, inside the runtime, without overlap', () => {
    const cues = [...timeline.captions].sort((a, b) => a.startFrame - b.startFrame);
    expect(cues.length).toBeGreaterThan(10);
    for (let i = 0; i < cues.length; i++) {
      expect(cues[i].endFrame).toBeGreaterThan(cues[i].startFrame);
      expect(cues[i].endFrame).toBeLessThanOrEqual(duration);
      if (i > 0) {
        expect(cues[i].startFrame, 'captions must not overlap').toBeGreaterThanOrEqual(
          cues[i - 1].endFrame,
        );
      }
    }
  });

  it('anchors every visual event inside the video runtime', () => {
    expect(timeline.events.length).toBeGreaterThan(5);
    for (const event of timeline.events) {
      expect(event.endFrame).toBeGreaterThan(event.startFrame);
      expect(event.startFrame).toBeGreaterThanOrEqual(0);
      expect(event.endFrame).toBeLessThanOrEqual(duration);
    }
  });

  it('excludes overlaps between adjacent shots and keeps shot boundaries inside the runtime', () => {
    for (const shot of timeline.shots) {
      expect(shot.start_frame).toBeGreaterThanOrEqual(0);
      expect(shot.end_frame).toBeLessThanOrEqual(duration);
    }
  });
});
