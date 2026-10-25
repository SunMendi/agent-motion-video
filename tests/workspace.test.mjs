import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {
  safePath, validVideoId, validateBrief, prepareProject, requireCurrentProject,
  planReset, resetWorkspace, exportPair, RESTORED_FILES, ACTIVE_ROOTS,
} from '../scripts/lib/video-workspace.mjs';

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const fixture = (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'video-workspace-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  fs.cpSync(path.join(repository, 'templates'), path.join(root, 'templates'), {recursive: true});
  for (const [target, source] of Object.entries(RESTORED_FILES)) {
    fs.mkdirSync(path.dirname(path.join(root, target)), {recursive: true});
    fs.copyFileSync(path.join(root, source), path.join(root, target));
  }
  for (const dir of [...ACTIVE_ROOTS, 'exports', 'src/shared', 'public/fonts', 'work/setup', 'skills']) fs.mkdirSync(path.join(root, dir), {recursive: true});
  return root;
};

const current = (root, id = 'first-video') => {
  const file = path.join(root, 'brief.json');
  const brief = JSON.parse(fs.readFileSync(file, 'utf8'));
  Object.assign(brief, {video_id: id, outcome: 'Explain the mechanism.', audience: 'Junior developers', script_file: 'input/script.md', visual_script_file: 'input/visual-script.md'});
  fs.writeFileSync(file, JSON.stringify(brief));
  fs.writeFileSync(path.join(root, brief.audio_file), 'audio fixture');
  fs.writeFileSync(path.join(root, brief.script_file), 'The spoken words.');
  fs.writeFileSync(path.join(root, brief.visual_script_file), 'Select the treatment from the outcome.');
  return brief;
};

test('the empty workspace has a non-mutating reset preview', (t) => {
  const root = fixture(t);
  const before = fs.readFileSync(path.join(root, 'brief.json'));
  const result = resetWorkspace(root);
  assert.equal(result.video_id, '');
  assert.ok(result.files.includes('src/video/MainVideo.tsx'));
  assert.deepEqual(fs.readFileSync(path.join(root, 'brief.json')), before);
});

test('a current video accepts an empty reference list', (t) => {
  const root = fixture(t);
  current(root);
  assert.deepEqual(validateBrief(root).errors, []);
});

test('blank briefs cannot enter production', (t) => {
  const root = fixture(t);
  const errors = validateBrief(root).errors.join('\n');
  assert.match(errors, /video_id/);
  assert.match(errors, /outcome/);
  assert.match(errors, /audience/);
});

test('input review consent cannot be disabled in the brief', (t) => {
  const root = fixture(t);
  const brief = current(root);
  brief.approval_required_for_input_changes = false;
  fs.writeFileSync(path.join(root, 'brief.json'), JSON.stringify(brief));
  assert.match(validateBrief(root).errors.join('\n'), /approval_required/);
});

test('a directory cannot be accepted as a script file', (t) => {
  const root = fixture(t);
  const brief = current(root);
  brief.script_file = 'input';
  fs.writeFileSync(path.join(root, 'brief.json'), JSON.stringify(brief));
  assert.match(validateBrief(root).errors.join('\n'), /Missing or empty file: input/);
});

test('missing reset templates stop deletion before the first file changes', (t) => {
  const root = fixture(t);
  current(root);
  fs.unlinkSync(path.join(root, 'templates/active/MainVideo.tsx'));
  assert.throws(() => resetWorkspace(root, {apply: true, discardUnfinished: true}));
  assert.equal(fs.readFileSync(path.join(root, 'input/script.md'), 'utf8'), 'The spoken words.');
});

test('project paths reject traversal, absolute paths, and symbolic links', (t) => {
  const root = fixture(t);
  assert.throws(() => safePath(root, '../outside'), /outside/);
  assert.throws(() => safePath(root, root), /relative/);
  assert.throws(() => safePath(root, 'input\\script.md'), /forward slashes/);
  const target = path.join(root, 'src/shared');
  try { fs.symlinkSync(target, path.join(root, 'input/link'), 'dir'); }
  catch (error) { if (error.code === 'EPERM') return; throw error; }
  assert.throws(() => planReset(root, {discardUnfinished: true}), /Symbolic link/);
  assert.ok(fs.existsSync(path.join(root, 'input/script.md')));
});

test('dangling symbolic links cannot enter the reset list', (t) => {
  const root = fixture(t);
  try { fs.symlinkSync(path.join(root, 'missing'), path.join(root, 'public/current/missing')); }
  catch (error) { if (error.code === 'EPERM') return; throw error; }
  assert.throws(() => planReset(root), /Symbolic link/);
});

test('unfinished work requires an explicit discard option', (t) => {
  const root = fixture(t);
  current(root);
  assert.throws(() => resetWorkspace(root, {apply: true}), /no completed export/);
  assert.ok(fs.existsSync(path.join(root, 'public/current/voice.wav')));
});

test('reset keeps completed exports, setup, skills, fonts, and legacy videos', (t) => {
  const root = fixture(t);
  current(root);
  for (const file of ['exports/first-video.mp4', 'exports/first-video.report.md', 'src/shared/keep.ts',
    'public/fonts/keep.ttf', 'skills/keep.md', 'work/setup/keep.json', 'package.json', 'public/rust-reels-9x16-v2.mp4']) {
    fs.writeFileSync(path.join(root, file), 'keep');
  }
  fs.writeFileSync(path.join(root, 'src/video/old-scene.tsx'), 'old subject and logos');
  fs.mkdirSync(path.join(root, 'public/current/images'), {recursive: true});
  fs.writeFileSync(path.join(root, 'public/current/images/old.svg'), 'old image');
  fs.writeFileSync(path.join(root, 'work/current/transcript.reviewed.json'), 'old timing');
  resetWorkspace(root, {apply: true});
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'brief.json'))).video_id, '');
  assert.equal(fs.existsSync(path.join(root, 'src/video/old-scene.tsx')), false);
  assert.equal(fs.existsSync(path.join(root, 'public/current/voice.wav')), false);
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'work/current/transcript.reviewed.json'))).review_status, 'unreviewed');
  for (const file of ['exports/first-video.mp4', 'exports/first-video.report.md', 'src/shared/keep.ts',
    'public/fonts/keep.ttf', 'skills/keep.md', 'work/setup/keep.json', 'package.json', 'public/rust-reels-9x16-v2.mp4']) {
    assert.equal(fs.readFileSync(path.join(root, file), 'utf8'), 'keep');
  }
  current(root, 'second-video');
  assert.deepEqual(validateBrief(root).errors, []);
});

test('audio measurement sets the duration and input changes invalidate prepared context', (t) => {
  const root = fixture(t);
  const brief = current(root);
  const project = prepareProject(root, () => ({duration: 12.34, audioCodec: 'pcm_s16le'}));
  assert.equal(project.durationInFrames, 370);
  assert.equal(project.ready, false);
  assert.equal(requireCurrentProject(root).project.video_id, brief.video_id);
  fs.appendFileSync(path.join(root, brief.script_file), ' A revised sentence.');
  assert.throws(() => requireCurrentProject(root), /inputs changed/);
});

test('composition metadata cannot silently disagree with the brief', (t) => {
  const root = fixture(t);
  current(root);
  const project = prepareProject(root, () => ({duration: 12.34, audioCodec: 'pcm_s16le'}));
  project.fps = 60;
  fs.writeFileSync(path.join(root, 'src/video/project.json'), JSON.stringify(project));
  assert.throws(() => requireCurrentProject(root), /metadata does not match/);
});

test('exports never overwrite a completed video identifier', (t) => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'work/current/final.mp4'), 'final video fixture');
  fs.writeFileSync(path.join(root, 'work/current/report.md'), '# Actual report\nReview limitations.');
  exportPair(root, 'first-video');
  assert.throws(() => exportPair(root, 'first-video'), /already exists/);
  assert.equal(fs.readFileSync(path.join(root, 'exports/first-video.mp4'), 'utf8'), 'final video fixture');
});

test('reserved or unsafe video identifiers are rejected', () => {
  for (const id of ['', '../one', 'one/two', 'CON', 'con', 'lpt1', 'one two', 'A']) assert.equal(validVideoId(id), false);
  assert.equal(validVideoId('rust-explainer-2'), true);
});

test('reset restores current templates instead of comparing them to an active video', (t) => {
  const root = fixture(t);
  current(root);
  resetWorkspace(root, {apply: true, discardUnfinished: true});
  for (const [target, source] of Object.entries(RESTORED_FILES)) {
    assert.deepEqual(fs.readFileSync(path.join(root, target)), fs.readFileSync(path.join(root, source)), target);
  }
});

test('audio-only intake prepares successfully and fingerprints the recording without scripts', (t) => {
  const root = fixture(t);
  const brief = current(root);
  brief.script_file = null;
  delete brief.visual_script_file;
  fs.writeFileSync(path.join(root, 'brief.json'), JSON.stringify(brief));
  fs.unlinkSync(path.join(root, 'input/script.md'));
  assert.deepEqual(validateBrief(root).errors, []);
  const project = prepareProject(root, () => ({duration: 10, audioCodec: 'pcm_s16le'}));
  assert.match(project.audioSha256, /^[a-f0-9]{64}$/);
  assert.equal(requireCurrentProject(root).project.video_id, brief.video_id);
  fs.appendFileSync(path.join(root, brief.audio_file), 'changed recording');
  assert.throws(() => requireCurrentProject(root), /inputs changed/);
});

test('new output cannot silently become landscape or nonstandard vertical', (t) => {
  const root = fixture(t);
  const brief = current(root);
  for (const output of [{width: 1920, height: 1080, fps: 30}, {width: 720, height: 1280, fps: 30}]) {
    brief.output = output;
    fs.writeFileSync(path.join(root, 'brief.json'), JSON.stringify(brief));
    assert.match(validateBrief(root).errors.join('\n'), /1080x1920/);
  }
});
