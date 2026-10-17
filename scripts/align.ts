#!/usr/bin/env tsx
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {decodeRms} from './lib/pcm';
import {align} from './lib/align-core';
import type {Raw} from './lib/align-core';
import {validateTiming} from '../src/model';
import type {Timing} from '../src/model';

const name = process.argv[2];
if (!name) {
  console.error('Usage: npm run align -- <brief-name>');
  process.exit(1);
}

const briefFile = path.resolve(`briefs/${name}.json`);
const rawFile = path.resolve(`briefs/${name}.raw.json`);
const outFile = path.resolve(`briefs/${name}.timing.json`);

const brief = JSON.parse(readFileSync(briefFile, 'utf8')) as {audio: string};
const raw = JSON.parse(readFileSync(rawFile, 'utf8')) as Raw;
const wav = path.resolve('public', brief.audio);

const audio = decodeRms(wav);
console.log(
  `audio ${wav}: ${audio.duration.toFixed(2)}s, speech ${audio.speechOnset.toFixed(2)}s to ${audio.speechOffset.toFixed(2)}s`,
);

const result = align(raw, audio);

const problems = validateTiming(result as Timing);
if (problems.length) {
  console.error('Alignment produced invalid timing:');
  for (const p of problems) console.error(' - ' + p);
  process.exit(1);
}

mkdirSync(path.dirname(outFile), {recursive: true});
writeFileSync(outFile, JSON.stringify(result, null, 2) + '\n');
console.log(`wrote ${outFile}`);
console.log(
  `duration ${result.audio_duration}s, ${result.words.length} words, ${result.align.matched} of ${raw.words.length - 1} gaps matched`,
);
for (const w of result.align.warnings) console.log(`warning: ${w}`);
