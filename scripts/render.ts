#!/usr/bin/env tsx
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {sizes, type SizeKey} from '../src/brand';
import {normalise} from './lib/ffmpeg';

const name = process.argv[2];
const all = process.argv.includes('--all');
const only = (process.argv.find((a) => a.startsWith('--size=')) ?? '').split('=')[1] as SizeKey | undefined;

if (!name) {
  console.error('Usage: npm run ad -- <brief-name> [--all] [--size=9x16]');
  process.exit(1);
}

const keys: SizeKey[] = only ? [only] : all ? (Object.keys(sizes) as SizeKey[]) : ['9x16'];
mkdirSync('out', {recursive: true});

for (const key of keys) {
  if (!(key in sizes)) {
    console.error(`unknown size ${key}, expected one of ${Object.keys(sizes).join(', ')}`);
    process.exit(1);
  }
  const id = `${name}-${key}`;
  const raw = path.resolve('out', `${id}.raw.mp4`);
  const final = path.resolve('out', `${id}.mp4`);
  console.log(`rendering ${id}`);
  execFileSync('npx', ['remotion', 'render', id, raw, '--codec', 'h264', '--crf', '18'], {
    stdio: 'inherit',
  });
  normalise(raw, final);
  console.log(`wrote ${final}`);
}
