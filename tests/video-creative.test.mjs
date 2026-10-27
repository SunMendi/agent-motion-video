import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {validateCreativePlan, createReviewEvidence, checkCreativeReview, fileHash} from '../scripts/lib/video-creative.mjs';
import {writeJson, resolveMediaBinary, runBinary} from '../scripts/lib/video-workspace.mjs';

const plan = () => ({creative_contract_version: 1, shots: [{
  id: 's1', narration_ids: ['w1'], assets: ['public/current/product.png'], body_labels: ['Product'],
  visual_intent: {added_information: 'Actual product appearance', framing: 'Large screen crop', motion_mechanism: 'Selected option changes the result'},
  entities: [{name: 'Named product', narration_ids: ['w1'], representation: 'authentic-asset', asset_files: ['public/current/product.png']}],
  keyframes: [{frame: 0}, {frame: 15}, {frame: 29}],
}]});

test('creative contract requires specific decisions, named-subject assets, and restrained text', () => {
  assert.deepEqual(validateCreativePlan(plan()), []);
  for (const change of [
    (p) => {delete p.creative_contract_version;},
    (p) => {p.shots[0].visual_intent.added_information = '';},
    (p) => {p.shots[0].entities[0].asset_files = [];},
    (p) => {p.shots[0].entities[0].narration_ids = ['unknown'];},
    (p) => {p.shots[0].entities[0].representation = 'typographic-identity';},
    (p) => {p.shots[0].body_labels = ['This sentence repeats far too much narration'];},
    (p) => {p.shots[0].keyframes = [{frame: 0}];},
  ]) {
    const input = plan(); change(input);
    assert.ok(validateCreativePlan(input).length > 0);
  }
  const deliberate = plan();
  deliberate.shots[0].entities[0] = {name: 'Invisible mechanism', narration_ids: ['w1'], representation: 'illustration', asset_files: [], reason: 'An internal process has no photographic appearance.'};
  deliberate.shots[0].body_labels = ['An authentic interface needs this longer visible label'];
  deliberate.shots[0].text_exception = 'A cropped interface control remains readable in the phone preview.';
  assert.deepEqual(validateCreativePlan(deliberate), []);
});

test('real encoded-media evidence stays pending until reviewed and becomes invalid after changes', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'video-creative-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  fs.mkdirSync(path.join(root, 'work/current'), {recursive: true});
  const file = path.join(root, 'work/current/final.mp4');
  runBinary(resolveMediaBinary(process.cwd(), 'ffmpeg'), ['-hide_banner', '-loglevel', 'error', '-filter_threads', '1', '-f', 'lavfi', '-i', 'testsrc2=size=108x192:rate=30:duration=1', '-c:v', 'libx264', '-threads', '1', '-pix_fmt', 'yuv420p', file]);
  const production = {ok: true, errors: [], timeline: {video_id: 'test-video', productionFingerprint: 'a'.repeat(64), shots: [{id: 's1', start_frame: 0, end_frame: 30, keyframes: [{frame: 5}, {frame: 15}, {frame: 25}]}], events: [{id: 'move', shot_id: 's1', startFrame: 2, endFrame: 20}]}};
  assert.throws(() => createReviewEvidence(root, production), /render-manifest/);
  writeJson(path.join(root, 'work/current/render-manifest.json'), {video_id: 'test-video', production_fingerprint: production.timeline.productionFingerprint, media_sha256: fileHash(file)});
  const result = createReviewEvidence(root, production);
  assert.ok(result.frames >= 8);
  const review = JSON.parse(fs.readFileSync(path.join(root, result.draft)));
  assert.equal(review.shots[0].motion.status, 'pending');
  assert.equal(fs.existsSync(path.join(root, 'work/current/creative-review.json')), false);
  writeJson(path.join(root, 'work/current/creative-review.json'), review);
  assert.equal(checkCreativeReview(root, production).ok, false);
  review.review_method = 'Synthetic fixture: check encoded frame extraction and review integrity.';
  for (const category of ['text', 'framing', 'entities', 'motion']) review.shots[0][category] = {status: 'passed', notes: 'Synthetic test finding.', ...(category === 'motion' ? {method: 'frame-sequence'} : {})};
  review.audio = {status: 'unavailable', method: 'Silent test clip', notes: 'There is no audio in this fixture.'};
  writeJson(path.join(root, 'work/current/creative-review.json'), review);
  assert.equal(checkCreativeReview(root, production).ok, true);
  assert.match(checkCreativeReview(root, production).warnings.join('\n'), /listening remains incomplete/);
  const changedSource = structuredClone(production);
  changedSource.timeline.productionFingerprint = 'b'.repeat(64);
  assert.match(checkCreativeReview(root, changedSource).errors.join('\n'), /render is stale/);
  assert.throws(() => createReviewEvidence(root, changedSource), /render is stale/);
  const frameFile = path.join(root, review.shots[0].frames[0].file);
  const savedFrame = fs.readFileSync(frameFile);
  fs.appendFileSync(frameFile, 'changed');
  assert.match(checkCreativeReview(root, production).errors.join('\n'), /rendered evidence changed/);
  fs.writeFileSync(frameFile, savedFrame);
  review.issues = [{status: 'open', finding: 'Subject is too small', resolution: ''}];
  writeJson(path.join(root, 'work/current/creative-review.json'), review);
  assert.equal(checkCreativeReview(root, production).ok, false);
  review.issues = [];
  review.shots[0].frames = review.shots[0].frames.slice(1);
  writeJson(path.join(root, 'work/current/creative-review.json'), review);
  assert.match(checkCreativeReview(root, production).errors.join('\n'), /missing rendered boundary/);
  const hash = fileHash(file);
  fs.appendFileSync(file, 'new render');
  assert.notEqual(fileHash(file), hash);
  assert.match(checkCreativeReview(root, production).errors.join('\n'), /render is stale/);
});
