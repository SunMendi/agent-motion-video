#!/usr/bin/env tsx
import { existsSync } from 'node:fs';
import path from 'node:path';
import { probeFile, measureLoudness } from './lib/ffmpeg';
import { SCENES, PROJECT_METADATA } from '../src/data/scenesData';

const DURATION_TOLERANCE = 0.08;

export const checkRustVideo = (targetPath = 'out/rust-reels-9x16-v2.mp4'): { ok: boolean; errors: string[]; stats: Record<string, unknown> } => {
  const errors: string[] = [];
  const stats: Record<string, unknown> = {};

  const fullPath = path.resolve(targetPath);
  if (!existsSync(fullPath)) {
    return { ok: false, errors: [`Output file not found: ${fullPath}`], stats };
  }

  const info = probeFile(fullPath);
  stats.width = info.width;
  stats.height = info.height;
  stats.fps = info.fps;
  stats.duration = info.duration;
  stats.videoCodec = info.videoCodec;
  stats.audioCodec = info.audioCodec;

  // 1. Resolution
  if (info.width !== 1080 || info.height !== 1920) {
    errors.push(`Resolution mismatch: expected 1080x1920, got ${info.width}x${info.height}`);
  }

  // 2. Frame Rate
  if (info.fps !== 30) {
    errors.push(`Frame rate mismatch: expected 30 fps, got ${info.fps}`);
  }

  // 3. Duration
  const expectedDuration = PROJECT_METADATA.total_duration_seconds;
  if (Math.abs(info.duration - expectedDuration) > DURATION_TOLERANCE) {
    errors.push(`Duration mismatch: expected ${expectedDuration}s, got ${info.duration.toFixed(2)}s`);
  }

  // 4. Codecs
  if (info.videoCodec !== 'h264') {
    errors.push(`Video codec mismatch: expected h264, got ${info.videoCodec}`);
  }
  if (info.audioCodec !== 'aac') {
    errors.push(`Audio codec mismatch: expected aac, got ${info.audioCodec}`);
  }

  // 5. Loudness and True Peak Check
  try {
    const loudness = measureLoudness(fullPath);
    stats.integratedLoudness = loudness.i;
    stats.truePeak = loudness.tp;
    stats.loudnessRange = loudness.lra;

    if (loudness.tp > 0) {
      errors.push(`Audio clipping detected: True Peak is ${loudness.tp.toFixed(1)} dBFS (must be <= 0 dBFS)`);
    }
  } catch (err) {
    errors.push(`Could not measure loudness: ${String(err)}`);
  }

  // 5. Scene Data Sanity
  if (SCENES.length !== 32) {
    errors.push(`Scene count mismatch: expected 32 scenes, found ${SCENES.length}`);
  }

  return { ok: errors.length === 0, errors, stats };
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const target = process.argv[2] ?? 'out/rust-reels-9x16-v2.mp4';
  console.log(`Checking ${target}...`);
  const result = checkRustVideo(target);
  console.log('Stats:', JSON.stringify(result.stats, null, 2));
  if (!result.ok) {
    console.error('Validation FAILED:');
    result.errors.forEach((e) => console.error(` - ${e}`));
    process.exit(1);
  }
  console.log('Validation PASSED successfully!');
}
