import {execFileSync} from 'node:child_process';
import * as ffImport from 'ffmpeg-static';

type FfmpegStatic = string | null;
const ffmpegPath = (((ffImport as unknown as {default?: FfmpegStatic}).default ??
  ffImport) as unknown) as string;

export type AudioEnvelope = {
  duration: number;
  /** RMS of each 10 ms window, in raw int16 units. */
  rms: number[];
  speechThreshold: number;
  speechOnset: number;
  speechOffset: number;
};

export const WINDOW = 0.01;
const SAMPLE_RATE = 44100;
const WIN_SAMPLES = Math.round(WINDOW * SAMPLE_RATE);

/** Decode any audio file to mono 44.1 kHz and measure 10 ms RMS windows. */
export const decodeRms = (file: string): AudioEnvelope => {
  const raw = execFileSync(
    ffmpegPath,
    ['-v', 'error', '-i', file, '-f', 's16le', '-ac', '1', '-ar', String(SAMPLE_RATE), '-'],
    {maxBuffer: 1024 * 1024 * 512},
  );
  const samples = new Int16Array(raw.buffer, raw.byteOffset, Math.floor(raw.byteLength / 2));
  const rms: number[] = [];
  for (let i = 0; i + WIN_SAMPLES <= samples.length; i += WIN_SAMPLES) {
    let sum = 0;
    for (let k = 0; k < WIN_SAMPLES; k++) {
      const v = samples[i + k];
      sum += v * v;
    }
    rms.push(Math.sqrt(sum / WIN_SAMPLES));
  }
  const sorted = [...rms].sort((a, b) => a - b);
  const p90 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.9))] || 1;
  const speechThreshold = p90 * 0.06;
  let onset = 0;
  while (onset < rms.length && rms[onset] < speechThreshold) onset++;
  let offset = rms.length - 1;
  while (offset > 0 && rms[offset] < speechThreshold) offset--;
  return {
    duration: samples.length / SAMPLE_RATE,
    rms,
    speechThreshold,
    speechOnset: onset * WINDOW,
    speechOffset: offset * WINDOW,
  };
};

/** Mean RMS over a time range, in seconds. */
export const meanAt = (rms: number[], start: number, end: number): number => {
  const a = Math.max(0, Math.round(start / WINDOW));
  const b = Math.min(rms.length, Math.round(end / WINDOW));
  if (b <= a) return 0;
  let sum = 0;
  for (let i = a; i < b; i++) sum += rms[i];
  return sum / (b - a);
};
