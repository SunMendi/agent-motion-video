import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import ffmpeg from 'ffmpeg-static';

const root = process.cwd();
const video = path.join(root, 'work/current/final.mp4');
const timeline = JSON.parse(fs.readFileSync(path.join(root, 'work/current/timeline.compiled.json'), 'utf8'));
const sampleFps = 3;
const width = 180;
const height = 280;
const frameBytes = width * height;
const changeThreshold = 12;
const motionFloor = 0.002;

const result = spawnSync(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-i', video,
  '-vf', `fps=${sampleFps},crop=920:1430:80:320,scale=${width}:${height},format=gray`,
  '-f', 'rawvideo', '-'
], {maxBuffer: 64 * 1024 * 1024});
if (result.status !== 0) throw new Error(result.stderr.toString() || 'Could not decode video for motion check.');

const pixels = result.stdout;
const count = Math.floor(pixels.length / frameBytes);
if (count < 2) throw new Error('Motion check decoded fewer than two frames.');
const changed = [];
for (let frame = 1; frame < count; frame++) {
  let changedPixels = 0;
  const previous = (frame - 1) * frameBytes;
  const current = frame * frameBytes;
  for (let pixel = 0; pixel < frameBytes; pixel++) {
    if (Math.abs(pixels[current + pixel] - pixels[previous + pixel]) > changeThreshold) changedPixels++;
  }
  changed.push(changedPixels / frameBytes);
}

const findings = timeline.shots.map((shot) => {
  const from = Math.ceil(shot.start_frame / timeline.fps * sampleFps) + 1;
  const to = Math.min(changed.length, Math.floor(shot.end_frame / timeline.fps * sampleFps) - 1);
  let longest = 0;
  let run = 0;
  let start = from;
  let longestStart = from;
  for (let i = from; i < to; i++) {
    if (changed[i] < motionFloor) {
      if (run === 0) start = i;
      run++;
      if (run > longest) { longest = run; longestStart = start; }
    } else run = 0;
  }
  return {shot: shot.id, longestLowMotionSeconds: Number((longest / sampleFps).toFixed(2)), startsAtSeconds: Number((longestStart / sampleFps).toFixed(2))};
});
const fails = findings.filter((finding) => finding.longestLowMotionSeconds >= 3);
console.log(JSON.stringify({ok: fails.length === 0, note: 'Body-stage pixel motion at 3 fps. This flags long holds; it does not judge whether movement is meaningful.', findings}, null, 2));
if (fails.length) process.exitCode = 1;
