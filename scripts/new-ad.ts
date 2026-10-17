#!/usr/bin/env tsx
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';

/** Scaffold a new ad: a brief template plus an empty raw timing file.
 * Then: drop the voice file in public/audio, fill the raw word list,
 * and run `npm run align -- <name>`. */
const name = process.argv[2];
if (!name || !/^[a-z0-9-]+$/.test(name)) {
  console.error('Usage: npm run new-ad -- <lowercase-name>');
  process.exit(1);
}

mkdirSync('briefs', {recursive: true});
const briefFile = path.resolve('briefs', `${name}.json`);
const rawFile = path.resolve('briefs', `${name}.raw.json`);
for (const file of [briefFile, rawFile]) {
  if (existsSync(file)) {
    console.error(`${file} already exists, refusing to overwrite`);
    process.exit(1);
  }
}

writeFileSync(
  briefFile,
  JSON.stringify(
    {
      name,
      product: `${name} product`,
      cta: 'ইনবক্স করুন',
      contact: 'facebook.com/yourpage',
      language: 'bn',
      audio: `audio/${name}.wav`,
      timing: `${name}.timing.json`,
      brand: {watermark: true},
      scenes: [
        {type: 'hook', kicker: 'দর্শকদের জন্য', headline: 'প্রথম লাইন লিখুন'},
        {type: 'problem', headline: 'সমস্যা লিখুন'},
        {type: 'feature', headline: 'সমাধান লিখুন', bullets: ['এক', 'দুই']},
        {type: 'cta', headline: 'শেষ লাইন লিখুন'},
      ],
    },
    null,
    2,
  ) + '\n',
);

writeFileSync(
  rawFile,
  JSON.stringify(
    {
      audio_duration: 0,
      words: [{word_bangla: 'শব্দ', start_time: 0, end_time: 0.4}],
      _note: 'Fill this from your transcription tool: one entry per word, in spoken order.',
    },
    null,
    2,
  ) + '\n',
);

console.log(`created ${briefFile}`);
console.log(`created ${rawFile}`);
console.log('next: put the voice file in public/audio, fill the word list, then run npm run align -- ' + name);
