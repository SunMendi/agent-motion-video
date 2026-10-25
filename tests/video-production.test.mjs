import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {compileStoryboard, checkProduction} from '../scripts/lib/video-production.mjs';
import {prepareProject, writeJson} from '../scripts/lib/video-workspace.mjs';

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const layout = JSON.parse(fs.readFileSync(path.join(repository, 'src/shared/video-layout.json')));
const sample = () => ({
  project: {video_id: 'test-video', fps: 30, audioDuration: 10, audioSha256: 'a'.repeat(64), durationInFrames: 300},
  layout: structuredClone(layout),
  transcript: {audio_duration: 10, audio_sha256: 'a'.repeat(64), review_status: 'reviewed', review_notes: 'Fixture timing review.', words: [
    {id: 'w1', w: 'The request travels to the gateway', s: 1, e: 2},
    {id: 'w2', w: 'Read', s: 8, e: 10},
  ]},
  board: {schema_version: 2, video_id: 'test-video', shots: [{
    id: 's1', start_frame: 0, end_frame: 300, narration_ids: ['w1', 'w2'],
    viewer_takeaway: 'Requests move to a receiver.', subject: 'Request envelope', visual_mode: 'metaphor',
    states: {before: 'Envelope at client', action: 'Travel to receiver', after: 'Envelope opened'},
    body_labels: ['Request'], assets: [], next_shot_connection: 'Hold for the ending',
    keyframes: [{frame: 30, focal_point: 'Envelope', bounds: {x: 64, y: 320, width: 800, height: 1200}}],
    events: [{id: 'transfer', anchor_id: 'w1', offset_frames: 3, duration_frames: 30, action: 'Envelope travels'}],
    sound_cues: [{event_id: 'transfer', purpose: 'Contact', file: 'public/current/contact.wav', duration_frames: 15, gain: 0.2, fade_out_frames: 5}],
    acceptance_criteria: ['Same envelope reaches the receiver.'],
  }]},
});

test('compiler derives captions, visual actions, and sound from the same reviewed anchor', () => {
  const result = compileStoryboard(sample());
  assert.deepEqual(result.errors, []);
  assert.equal(result.timeline.captions[0].startFrame, 30);
  assert.equal(result.timeline.events[0].startFrame, 33);
  assert.equal(result.timeline.soundCues[0].startFrame, 33);
});

test('coverage gaps, collisions, unknown anchors, and stale audio cannot pass production', () => {
  for (const change of [
    (s) => {s.board.shots[0].start_frame = 2;},
    (s) => {s.board.shots[0].end_frame = 200;},
    (s) => {s.board.shots[0].keyframes[0].bounds.y = 100;},
    (s) => {s.board.shots[0].events[0].anchor_id = 'missing';},
    (s) => {s.board.shots[0].events[0].duration_frames = 400;},
    (s) => {s.transcript.audio_sha256 = 'b'.repeat(64);},
    (s) => {s.transcript.words[1].s = 1.5;},
    (s) => {s.layout.action.top = 100;},
  ]) {
    const input = sample();
    change(input);
    assert.equal(compileStoryboard(input).ok, false);
  }
});

test('body narration duplication is rejected and shallow artwork triggers a review warning', () => {
  const input = sample();
  input.board.shots[0].body_labels = ['The request travels to the gateway'];
  input.board.shots[0].keyframes[0].bounds.height = 200;
  const result = compileStoryboard(input);
  assert.match(result.errors.join('\n'), /repeats most/);
  assert.match(result.warnings.join('\n'), /lower action area/);
});

test('reviewed phrases compile without fabricating word timings', () => {
  const input = sample();
  input.transcript.phrases = input.transcript.words.map(({w, ...token}) => ({...token, text: w}));
  input.transcript.words = [];
  const result = compileStoryboard(input);
  assert.equal(result.ok, true);
  assert.equal(result.timeline.captionMode, 'phrase');
});

test('production gate requires evidence, honors audio settings, and detects render hazards', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'video-production-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const brief = {video_id: 'test-video', audience: 'Students', outcome: 'Understand requests', language: 'bn-BD', audio_file: 'public/current/voice.wav', references: [], output: {width: 1080, height: 1920, fps: 30}, audio: {sound_effects: true}, approval_required_for_input_changes: true};
  writeJson(path.join(root, 'brief.json'), brief);
  fs.mkdirSync(path.join(root, 'public/current'), {recursive: true});
  fs.writeFileSync(path.join(root, brief.audio_file), 'test audio');
  fs.writeFileSync(path.join(root, 'public/current/contact.wav'), 'effect');
  const project = prepareProject(root, () => ({audioCodec: 'wav', duration: 10}));
  const input = sample();
  input.transcript.audio_sha256 = project.audioSha256;
  Object.assign(input.board, {transcript_file: 'work/current/transcript.reviewed.json', layout_file: 'src/shared/video-layout.json', style_frames: [], animatic_file: null});
  writeJson(path.join(root, 'work/current/storyboard.json'), input.board);
  writeJson(path.join(root, 'work/current/transcript.reviewed.json'), input.transcript);
  writeJson(path.join(root, 'src/shared/video-layout.json'), input.layout);
  fs.mkdirSync(path.join(root, 'public/fonts'), {recursive: true});
  fs.writeFileSync(path.join(root, 'public/fonts/HindSiliguri-Bold.ttf'), 'fixture font');
  assert.equal(checkProduction(root, {requireEvidence: false}).ok, true);
  assert.equal(checkProduction(root).ok, false);
  fs.writeFileSync(path.join(root, 'work/current/direction.md'), 'Direction');
  fs.writeFileSync(path.join(root, 'work/current/frame.png'), 'fixture evidence');
  fs.writeFileSync(path.join(root, 'work/current/animatic.mp4'), 'fixture evidence');
  Object.assign(input.board, {style_frames: ['work/current/frame.png'], animatic_file: 'work/current/animatic.mp4'});
  writeJson(path.join(root, 'work/current/storyboard.json'), input.board);
  assert.equal(checkProduction(root).ok, true);
  fs.writeFileSync(path.join(root, 'src/video/BadScene.tsx'), 'const style = {transition: "all 1s"};');
  assert.match(checkProduction(root).errors.join('\n'), /frame-derived/);
  fs.writeFileSync(path.join(root, 'src/video/BadScene.tsx'), 'const SceneStage = () => <p>Explain transition: all 1s and Math.random() here.</p>; // transition: "all 1s"');
  assert.equal(checkProduction(root).ok, true, 'tutorial text and comments must not be mistaken for animation code');
  brief.audio.sound_effects = false;
  writeJson(path.join(root, 'brief.json'), brief);
  prepareProject(root, () => ({audioCodec: 'wav', duration: 10}));
  assert.match(checkProduction(root).errors.join('\n'), /sound_effects=false/);
});
