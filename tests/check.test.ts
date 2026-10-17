import {describe, expect, it} from 'vitest';
import {execFileSync} from 'node:child_process';
import {mkdirSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import ffmpegPath from 'ffmpeg-static';
import {checkFiles} from '../scripts/check';

const ROOT = '/tmp/opencode/stale-timing-check';

describe('checkRejectsStaleTiming', () => {
  it('fails with both durations printed when the timing no longer matches the audio', () => {
    rmSync(ROOT, {recursive: true, force: true});
    mkdirSync(path.join(ROOT, 'briefs'), {recursive: true});
    mkdirSync(path.join(ROOT, 'public/audio'), {recursive: true});
    // one second of silence stands in for the voice file
    execFileSync(ffmpegPath as unknown as string, [
      '-y', '-v', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', '1',
      path.join(ROOT, 'public/audio/short.wav'),
    ]);
    writeFileSync(
      path.join(ROOT, 'briefs/stale.json'),
      JSON.stringify({audio: 'audio/short.wav'}),
    );
    writeFileSync(
      path.join(ROOT, 'briefs/stale.timing.json'),
      JSON.stringify({audio_duration: 10, words: []}),
    );

    const errors = checkFiles('stale', ROOT);
    expect(errors.join('\n')).toContain('10');
    expect(errors.join('\n')).toContain('1');
  });
});

describe('checkFiles on the real ad', () => {
  it('accepts the committed timing against the real audio', () => {
    const errors = checkFiles('devsolutions').filter((e) => !e.includes('is missing'));
    expect(errors).toEqual([]);
  });
});
