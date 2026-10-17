import {spawnSync} from 'node:child_process';
import {mkdirSync, renameSync} from 'node:fs';
import {dirname, join} from 'node:path';
import * as ffImport from 'ffmpeg-static';
import {measureLoudness} from './ffmpeg';

const asString = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'path' in (value as Record<string, unknown>)) {
    return String((value as Record<string, unknown>).path);
  }
  throw new Error('could not resolve the bundled ffmpeg binary');
};

const ffmpegBin = asString((ffImport as {default?: unknown}).default ?? ffImport);

/** Bed loudness in the final voice + music mix. 20 dB under the voice. */
export const BED_LUFS = -35;

/** Mix ratio for the bed. The bed is normalised at generation, so 1.0 is correct. */
export const MUSIC_VOLUME = 1.0;

/**
 * Generate a soft ambient pad (detuned chord, slow tremolo, lowpass, fades)
 * with ffmpeg only. Exactly `durationSec` long.
 */
export const generateMusic = (durationSec: number, outPath: string): void => {
  if (!(durationSec > 0)) throw new Error(`music duration must be positive, got ${durationSec}`);
  mkdirSync(dirname(outPath), {recursive: true});
  const d = durationSec.toFixed(3);
  const fade = Math.min(2, durationSec / 3).toFixed(3);
  const off = Math.max(0, durationSec - Number(fade)).toFixed(3);
  const chord = [174.6, 175.4, 220.2, 261.9, 329.9];
  const inputs = chord.flatMap((f) => ['-f', 'lavfi', '-i', `sine=frequency=${f}:duration=${d}`]);
  const mix = chord.map((_, i) => `[${i}:a]`).join('');
  const filter =
    `${mix}amix=inputs=${chord.length}:duration=longest,tremolo=f=0.12:d=0.55,` +
    `lowpass=f=700,volume=0.35,afade=t=in:st=0:d=${fade},afade=t=out:st=${off}:d=${fade}[a]`;
  const res = spawnSync(
    ffmpegBin,
    ['-y', ...inputs, '-filter_complex', filter, '-map', '[a]', '-ac', '2', '-ar', '44100', outPath],
    {maxBuffer: 1024 * 1024 * 16, encoding: 'utf8'},
  );
  if (res.status !== 0) {
    throw new Error(`ffmpeg exited ${res.status} while generating music: ${res.stderr?.slice(-600)}`);
  }
  // bring the bed to a fixed loudness so the mix level is predictable
  const {i} = measureLoudness(outPath);
  const gain = BED_LUFS - i;
  const tmp = join(dirname(outPath), '.bed-gain.wav');
  const gainRes = spawnSync(
    ffmpegBin,
    ['-y', '-i', outPath, '-af', `volume=${gain.toFixed(2)}dB`, '-ac', '2', '-ar', '44100', tmp],
    {maxBuffer: 1024 * 1024 * 16, encoding: 'utf8'},
  );
  if (gainRes.status !== 0) {
    throw new Error(`ffmpeg exited ${gainRes.status} while gaining music: ${gainRes.stderr?.slice(-600)}`);
  }
  renameSync(tmp, outPath);
};
