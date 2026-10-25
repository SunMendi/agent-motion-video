#!/usr/bin/env tsx
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { checkRustVideo } from './check-rust';

const isPilot = process.argv.includes('--pilot');
const framesArg = process.argv.find((a) => a.startsWith('--frames='));

mkdirSync('out', { recursive: true });
mkdirSync('public', { recursive: true });

const outFile = isPilot
  ? path.resolve('out/rust-reels-pilot.mp4')
  : path.resolve('out/rust-reels-9x16-v2.mp4');

console.log(`Starting render for composition "rust-reels" -> ${outFile}`);

const remotionArgs = [
  'remotion',
  'render',
  'rust-reels',
  outFile,
  '--codec',
  'h264',
  '--crf',
  '18',
  '--audio-codec',
  'aac',
];

if (isPilot) {
  // 19s to 34s = frames 570 to 1020 (Scenes 7 to 10: Car Analogy, Steering, Engine, Compute)
  remotionArgs.push('--frames=570-1020');
  console.log('Rendering pilot: frames 570-1020 (19.0s - 34.0s: Car Analogy & Engine)');
} else if (framesArg) {
  remotionArgs.push(framesArg);
  console.log(`Rendering custom frame range: ${framesArg}`);
}

execFileSync('npx', remotionArgs, {
  stdio: 'inherit',
});

console.log(`Render completed: ${outFile}`);

// If full render, copy to public for browser download and run validation
if (!isPilot && !framesArg) {
  const publicOut = path.resolve('public/rust-reels-9x16-v2.mp4');
  copyFileSync(outFile, publicOut);
  console.log(`Copied output to ${publicOut} for browser preview download`);

  console.log('Running validation on final render...');
  const result = checkRustVideo(outFile);
  console.log('Validation Stats:', JSON.stringify(result.stats, null, 2));

  if (!result.ok) {
    console.error('Validation errors encountered:');
    result.errors.forEach((e) => console.error(` - ${e}`));
    process.exit(1);
  }
  console.log('All checks passed! Video is broadcast-ready.');
}
