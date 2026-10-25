import {describe, expect, it} from 'vitest';
import {execFileSync} from 'node:child_process';
import {mkdtempSync} from 'node:fs';
import {join} from 'node:path';
import ffmpegPath from 'ffmpeg-static';
import {generateMusic, MUSIC_VOLUME, BED_LUFS} from '../scripts/lib/music-core';
import {measureLoudness, mixAudio, probeFile} from '../scripts/lib/ffmpeg';

const bin = typeof ffmpegPath === 'string' ? ffmpegPath : String(((ffmpegPath as unknown) as {path: string}).path);

describe('music bed', () => {
  it('matches the requested duration', () => {
    const dir = mkdtempSync(join('/tmp/opencode', 'music-'));
    const out = join(dir, 'bed.wav');
    generateMusic(3, out);
    expect(probeFile(out).duration).toBeCloseTo(3, 1);
  });

  it('rejects a non-positive duration', () => {
    expect(() => generateMusic(0, '/tmp/opencode/never.wav')).toThrow(/positive/);
  });

  it('normalises the bed to the target loudness', () => {
    const dir = mkdtempSync(join('/tmp/opencode', 'music-'));
    const out = join(dir, 'bed.wav');
    generateMusic(3, out);
    expect(measureLoudness(out).i).toBeGreaterThan(BED_LUFS - 1.5);
    expect(measureLoudness(out).i).toBeLessThan(BED_LUFS + 1.5);
  });

  it('mixes the bed under the voice without changing duration', () => {
    const dir = mkdtempSync(join('/tmp/opencode', 'mix-'));
    const voice = join(dir, 'voice.mp4');
    const mixed = join(dir, 'mixed.mp4');
    const bed = join(dir, 'bed.wav');
    // a two second clip: blue frames plus a sine "voice" track
    execFileSync(bin, [
      '-y',
      '-f', 'lavfi', '-i', 'color=c=blue:s=64x64:d=2',
      '-f', 'lavfi', '-i', 'sine=frequency=440:duration=2',
      '-map', '0:v', '-map', '1:a',
      '-c:v', 'libx264', '-c:a', 'aac', voice,
    ]);
    generateMusic(2.4, bed);
    mixAudio(voice, bed, mixed, MUSIC_VOLUME);
    const probe = probeFile(mixed);
    expect(probe.duration).toBeCloseTo(2, 1);
    expect(probe.audioCodec).toBe('aac');
  });
});
