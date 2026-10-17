#!/usr/bin/env tsx
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import type {Timing} from '../src/model';
import {generateMusic} from './lib/music-core';

const name = process.argv[2];

if (!name) {
  console.error('Usage: npm run music -- <brief-name>');
  process.exit(1);
}

const briefPath = path.resolve('briefs', `${name}.json`);
const timingPath = path.resolve('briefs', `${name}.timing.json`);
if (!existsSync(briefPath) || !existsSync(timingPath)) {
  console.error(`missing ${briefPath} or ${timingPath}`);
  process.exit(1);
}

const timing = JSON.parse(readFileSync(timingPath, 'utf8')) as Timing;
const out = path.resolve('public/audio', `${name}.music.wav`);
// a touch longer than the voice so the fade finishes; the mix step trims it.
generateMusic(timing.audio_duration + 0.2, out);
console.log(`wrote ${out} (${(timing.audio_duration + 0.2).toFixed(2)}s)`);
