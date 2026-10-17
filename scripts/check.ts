#!/usr/bin/env tsx
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {probeFile} from './lib/ffmpeg';
import {sizes, type SizeKey} from '../src/brand';
import type {Brief, Timing} from '../src/model';

export const DURATION_TOLERANCE = 0.05;

/** Verify that timing matches the audio and that every output file is correct.
 * Returns a list of problems; an empty list means the ad is good. */
export const checkFiles = (name: string, root = '.'): string[] => {
  const errors: string[] = [];
  const briefPath = path.join(root, 'briefs', `${name}.json`);
  const timingPath = path.join(root, 'briefs', `${name}.timing.json`);

  let brief: Brief;
  let timing: Timing;
  try {
    brief = JSON.parse(readFileSync(briefPath, 'utf8')) as Brief;
  } catch (err) {
    return [`${briefPath} cannot be read: ${String(err)}`];
  }
  try {
    timing = JSON.parse(readFileSync(timingPath, 'utf8')) as Timing;
  } catch (err) {
    return [`${timingPath} cannot be read: ${String(err)}. Run: npm run align -- ${name}`];
  }

  const wav = path.join(root, 'public', brief.audio);
  if (!existsSync(wav)) {
    errors.push(`${wav} is missing`);
    return errors;
  }
  const wavDuration = probeFile(wav).duration;
  if (Math.abs(wavDuration - timing.audio_duration) > DURATION_TOLERANCE) {
    errors.push(
      `${timingPath} says ${timing.audio_duration}s but the audio ${wav} is ${wavDuration.toFixed(2)}s. ` +
        `Run: npm run align -- ${name}`,
    );
    return errors;
  }

  for (const key of Object.keys(sizes) as SizeKey[]) {
    const file = path.join(root, 'out', `${name}-${key}.mp4`);
    if (!existsSync(file)) {
      errors.push(`${file} is missing, run: npm run ad -- ${name} --all`);
      continue;
    }
    const info = probeFile(file);
    const {width, height} = sizes[key];
    if (Math.abs(info.duration - wavDuration) > DURATION_TOLERANCE) {
      errors.push(`${key}: video is ${info.duration.toFixed(2)}s but the audio is ${wavDuration.toFixed(2)}s`);
    }
    if (info.width !== width || info.height !== height) {
      errors.push(`${key}: is ${info.width}x${info.height}, expected ${width}x${height}`);
    }
    if (info.videoCodec !== 'h264') errors.push(`${key}: video codec is ${info.videoCodec}, expected h264`);
    if (info.audioCodec !== 'aac') errors.push(`${key}: audio codec is ${info.audioCodec}, expected aac`);
  }
  return errors;
};

const isMain = process.argv[1]?.includes('check');
if (isMain) {
  const name = process.argv[2] ?? 'devsolutions';
  const errors = checkFiles(name);
  if (errors.length) {
    console.error(`output check failed for ${name}:`);
    for (const e of errors) console.error(` - ${e}`);
    process.exit(1);
  }
  console.log(`output check passed for ${name}`);
}
