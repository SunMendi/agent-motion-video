#!/usr/bin/env tsx
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {entries} from '../src/briefs';
import {durationFrames, sceneFrames, sceneSpans} from '../src/timing';
import {FPS} from '../src/brand';
import {diffRatio} from '../tests/helpers/pngdiff';

const update = process.argv.includes('--update');
const TOLERANCE = 0.005;

mkdirSync('out/stills', {recursive: true});
mkdirSync('tests/__snapshots__', {recursive: true});

const failures: string[] = [];
for (const {brief, timing} of entries) {
  const total = durationFrames(timing, FPS);
  const frames = sceneFrames(sceneSpans(timing, brief), total, FPS).map((s) => s.start);
  frames.push(total - 1);
  for (const frame of frames) {
    const id = `${brief.name}-9x16`;
    const still = path.resolve('out/stills', `${id}-${frame}.png`);
    execFileSync('npx', ['remotion', 'still', id, still, '--frame', String(frame)], {stdio: 'inherit'});
    const baseline = path.resolve('tests/__snapshots__', `${id}-${frame}.png`);
    if (update || !existsSync(baseline)) {
      writeFileSync(baseline, readFileSync(still));
      console.log(`baseline written ${path.basename(baseline)}`);
      continue;
    }
    const ratio = diffRatio(readFileSync(still), readFileSync(baseline));
    if (ratio > TOLERANCE) {
      failures.push(`${id} frame ${frame}: ${(ratio * 100).toFixed(2)}% of pixels differ (limit 0.5%)`);
    } else {
      console.log(`ok ${id} frame ${frame} (${(ratio * 100).toFixed(3)}% differ)`);
    }
  }
}

if (failures.length) {
  console.error('snapshot check failed:');
  for (const f of failures) console.error(` - ${f}`);
  console.error('run `npm run snapshots:update` if the change is intended');
  process.exit(1);
}
console.log('snapshot check passed');
