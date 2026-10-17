import {describe, expect, it} from 'vitest';
import {execFileSync} from 'node:child_process';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import ffmpegPath from 'ffmpeg-static';
import {align, detectSilences} from '../scripts/lib/align-core';
import {decodeRms, meanAt} from '../scripts/lib/pcm';
import type {Timing} from '../src/model';

const WAV = 'public/audio/devsolutions.wav';
const RAW = 'briefs/devsolutions.raw.json';

type Raw = {audio_duration: number; words: {word_bangla: string; start_time: number; end_time: number}[]};

describe('align on the real voice file', () => {
  const audio = decodeRms(WAV);
  const raw = JSON.parse(readFileSync(RAW, 'utf8')) as Raw;
  const result = align(raw, audio) as Timing & {align: {matched: number; warnings: string[]; gaps: Array<{correction: number}>}};

  it('reports the real audio duration', () => {
    expect(audio.duration).toBeCloseTo(37.92, 1);
    expect(result.audio_duration).toBeCloseTo(37.92, 1);
  });

  it('detects the eight speech pauses', () => {
    const silences = detectSilences(audio);
    expect(silences.length).toBe(8);
    expect(silences[0].start).toBeGreaterThan(3.5);
    expect(silences[0].start).toBeLessThan(4.5);
  });

  it('keeps every word in order', () => {
    expect(result.words).toHaveLength(raw.words.length);
    expect(result.words[0].w).toBe('মানুষ');
    expect(result.words[result.words.length - 1].w).toBe('দিন।');
    for (let i = 0; i < result.words.length; i++) {
      const w = result.words[i];
      expect(w.s).toBeGreaterThanOrEqual(0);
      expect(w.e).toBeLessThanOrEqual(result.audio_duration + 0.001);
      if (i > 0) expect(w.s).toBeGreaterThanOrEqual(result.words[i - 1].s);
    }
  });

  it('matches nearly every detected silence', () => {
    expect(result.align.matched).toBeGreaterThanOrEqual(7);
    expect(result.align.matched).toBeLessThanOrEqual(detectSilences(audio).length);
  });

  it('lands every matched gap on real silence', () => {
    const speech = meanAt(audio.rms, audio.speechOnset, audio.speechOffset);
    for (const gap of result.align.gaps) {
      const mean = meanAt(audio.rms, gap.detectedStart, gap.detectedEnd);
      expect(mean, `gap ${gap.detectedStart} to ${gap.detectedEnd} is not quiet`).toBeLessThan(speech * 0.5);
    }
  });

  it('warns loudly on big moves but stays under the failure limit', () => {
    const worst = Math.max(...result.align.gaps.map((g) => Math.abs(g.correction)));
    expect(worst, 'a correction should be big enough to warn').toBeGreaterThan(0.25);
    expect(worst, 'a correction must not exceed the 0.5s failure limit').toBeLessThan(0.5);
    expect(result.align.warnings.length).toBeGreaterThan(0);
  });

  it('moves the two misplaced pauses the most', () => {
    const byJsonStart = [...result.align.gaps].sort((a, b) => a.jsonStart - b.jsonStart);
    const corrections = byJsonStart.map((g) => Math.abs(g.correction));
    expect(Math.max(...corrections)).toBeLessThan(0.5);
  });
});

describe('alignHandlesStereoInput', () => {
  it('decodes stereo through ffmpeg without changing the analysis', () => {
    mkdirSync('/tmp/opencode', {recursive: true});
    const stereo = '/tmp/opencode/devsolutions-stereo.wav';
    execFileSync(ffmpegPath as unknown as string, [
      '-y', '-v', 'error', '-i', WAV, '-ac', '2', stereo,
    ]);
    writeFileSync(stereo + '.exists', '1');
    const decoded = decodeRms(stereo);
    expect(decoded.duration).toBeCloseTo(37.92, 1);
    expect(decoded.rms.length).toBeGreaterThan(3000);
    expect(detectSilences(decoded).length).toBe(8);
  });
});
