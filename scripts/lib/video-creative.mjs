import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {readJson, writeJson, safePath, resolveMediaBinary, runBinary} from './video-workspace.mjs';

const text = (v) => typeof v === 'string' && v.trim().length > 0;
const list = (v) => Array.isArray(v) ? v : [];
export const fileHash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

const requireMatchingRender = (root, production) => {
  const render = readJson(safePath(root, 'work/current/render-manifest.json'));
  if (render.video_id !== production.timeline.video_id || render.production_fingerprint !== production.timeline.productionFingerprint
    || render.media_sha256 !== fileHash(safePath(root, 'work/current/final.mp4'))) throw new Error('Final render is stale or untracked. Rerender after source changes before extracting or reviewing evidence.');
};

/** Checks authoring commitments, not whether the proposed visuals are good. */
export const validateCreativePlan = (board) => {
  const errors = [];
  if (board?.creative_contract_version !== 1) errors.push('Storyboard needs creative_contract_version 1. Review subject, asset, framing, and motion decisions using templates/storyboard.json; do not auto-upgrade old plans.');
  for (const shot of list(board?.shots)) {
    const name = shot.id;
    for (const field of ['added_information', 'framing', 'motion_mechanism']) {
      if (!text(shot.visual_intent?.[field])) errors.push(`${name}: visual_intent.${field} must describe this shot's visual decision.`);
    }
    if (!Array.isArray(shot.entities)) errors.push(`${name}: entities must enumerate named subjects and concrete objects (or [] for an abstract beat).`);
    for (const entity of list(shot.entities)) {
      if (!text(entity?.name) || !list(entity?.narration_ids).length || entity.narration_ids.some((id) => !list(shot.narration_ids).includes(id))) errors.push(`${name}: entities need a name and valid shot narration_ids.`);
      if (!['authentic-asset', 'illustration', 'typographic-identity'].includes(entity?.representation)) errors.push(`${name}: choose an explicit entity representation.`);
      if (!Array.isArray(entity?.asset_files) || list(entity.asset_files).some((file) => !list(shot.assets).includes(file))) errors.push(`${name}: entity asset_files must be listed in shot assets.`);
      if (entity?.representation === 'authentic-asset' && !list(entity.asset_files).length) errors.push(`${name}: authentic entity ${entity.name} requires a local source asset.`);
      if (entity?.representation !== 'authentic-asset' && !text(entity?.reason)) errors.push(`${name}: explain the illustrative or typographic representation of ${entity?.name}.`);
    }
    const labels = list(shot.body_labels);
    if ((labels.length > 3 || labels.join(' ').trim().split(/\s+/u).filter(Boolean).length > 12 || labels.some((v) => String(v).trim().split(/\s+/u).length > 4)) && !text(shot.text_exception)) errors.push(`${name}: body text exceeds the default budget; simplify it or document text_exception for review.`);
    const frames = list(shot.keyframes).map((k) => k.frame);
    if (new Set(frames).size < 3) errors.push(`${name}: declare distinct before/action/after keyframes with actual subject bounds.`);
  }
  return errors;
};

export const evidenceFrames = (shot) => {
  const duration = shot.end_frame - shot.start_frame;
  const frames = new Set([shot.start_frame, shot.start_frame + Math.floor(duration / 2), shot.end_frame - 1]);
  for (const key of list(shot.keyframes)) frames.add(shot.start_frame + key.frame);
  for (const event of list(shot.events)) {
    for (const fraction of [0, 0.25, 0.5, 0.75, 1]) frames.add(Math.min(shot.end_frame - 1, event.startFrame + Math.floor((event.endFrame - event.startFrame - 1) * fraction)));
  }
  return [...frames].filter((f) => Number.isInteger(f) && f >= shot.start_frame && f < shot.end_frame).sort((a, b) => a - b);
};

/** Actual encoded-media evidence. This creates a pending review, never a passed review. */
export const createReviewEvidence = (root, production) => {
  if (!production.ok) throw new Error(`Production plan must pass first:\n${production.errors.join('\n')}`);
  requireMatchingRender(root, production);
  const timeline = production.timeline;
  const media = 'work/current/final.mp4';
  const mediaHash = fileHash(safePath(root, media));
  // Immutable per-render directory keeps earlier evidence reviewable after revisions.
  const directory = `work/current/review/rendered-${mediaHash.slice(0, 16)}`;
  fs.mkdirSync(safePath(root, directory), {recursive: true});
  const shots = timeline.shots.map((shot) => ({...shot, events: timeline.events.filter((e) => e.shot_id === shot.id)}));
  const frames = [...new Set(shots.flatMap(evidenceFrames))].sort((a, b) => a - b);
  const selector = frames.map((f) => `eq(n\\,${f})`).join('+');
  runBinary(resolveMediaBinary(root, 'ffmpeg'), ['-hide_banner', '-loglevel', 'error', '-y', '-threads', '1', '-filter_threads', '1', '-i', safePath(root, media), '-vf', `select=${selector},scale=360:640`, '-fps_mode', 'vfr', '-threads', '1', '-start_number', '0', path.join(safePath(root, directory), '%06d.png')]);
  const entries = frames.map((frame, i) => {
    const file = `${directory}/${String(i).padStart(6, '0')}.png`;
    return {frame, file, sha256: fileHash(safePath(root, file))};
  });
  const pending = () => ({status: 'pending', notes: ''});
  const review = {
    schema_version: 1, video_id: timeline.video_id,
    production_fingerprint: timeline.productionFingerprint, media_file: media, media_sha256: mediaHash,
    review_method: '',
    shots: shots.map((shot) => ({
      shot_id: shot.id, frames: evidenceFrames(shot).map((frame) => entries.find((e) => e.frame === frame)),
      text: pending(), framing: pending(), entities: pending(), motion: {...pending(), method: ''},
    })),
    audio: {...pending(), method: ''}, issues: [],
  };
  writeJson(safePath(root, 'work/current/creative-review.draft.json'), review);
  return {draft: 'work/current/creative-review.draft.json', directory, frames: frames.length, instructions: 'Inspect actual frames and motion. Complete creative-review.json with findings. No review was performed by this command.'};
};

/** Evidence integrity and review coverage. Assertions do not establish aesthetic quality. */
export const checkCreativeReview = (root, production) => {
  const errors = [...production.errors];
  const warnings = [];
  try {
    const review = readJson(safePath(root, 'work/current/creative-review.json'));
    const timeline = production.timeline;
    if (!production.ok || !timeline) throw new Error('Production checks must pass before creative evidence can be verified.');
    requireMatchingRender(root, production);
    if (review.schema_version !== 1 || review.video_id !== timeline.video_id) errors.push('Creative review schema or video identity does not match.');
    if (review.production_fingerprint !== timeline.productionFingerprint) errors.push('Creative review is stale: production code, assets, or plan changed.');
    if (review.media_file !== 'work/current/final.mp4' || review.media_sha256 !== fileHash(safePath(root, 'work/current/final.mp4'))) errors.push('Creative review does not match the final rendered media.');
    if (!text(review.review_method)) errors.push('Describe how the actual rendered evidence was inspected.');
    const shotIds = new Set(timeline.shots.map((s) => s.id));
    const seen = new Set();
    for (const item of list(review.shots)) {
      if (!shotIds.has(item.shot_id) || seen.has(item.shot_id)) errors.push(`Unexpected or duplicate creative review shot: ${item.shot_id}.`);
      seen.add(item.shot_id);
    }
    for (const shot of timeline.shots) {
      const item = list(review.shots).find((s) => s.shot_id === shot.id);
      if (!item) { errors.push(`${shot.id}: missing rendered creative review.`); continue; }
      for (const category of ['text', 'framing', 'entities', 'motion']) {
        if (item[category]?.status !== 'passed' || !text(item[category]?.notes)) errors.push(`${shot.id}: ${category} needs a passed review with specific findings.`);
      }
      if (!['playback', 'frame-sequence'].includes(item.motion?.method)) errors.push(`${shot.id}: motion review must name playback or frame-sequence inspection.`);
      const expected = evidenceFrames({...shot, events: timeline.events.filter((e) => e.shot_id === shot.id)});
      const actual = list(item.frames).map((f) => f.frame);
      if (expected.some((f) => !actual.includes(f))) errors.push(`${shot.id}: missing rendered boundary, state, or action frames.`);
      for (const frame of list(item.frames)) {
        if (!Number.isInteger(frame.frame) || frame.frame < shot.start_frame || frame.frame >= shot.end_frame || !frame.file?.startsWith('work/current/review/')) errors.push(`${shot.id}: invalid rendered evidence frame.`);
        else if (fileHash(safePath(root, frame.file)) !== frame.sha256) errors.push(`${shot.id}: rendered evidence changed: ${frame.file}.`);
      }
    }
    if (!['passed', 'unavailable'].includes(review.audio?.status) || !text(review.audio?.method) || !text(review.audio?.notes)) errors.push('Audio review must report passed or unavailable, its method, and findings/limitations. Failed or pending audio is unresolved.');
    if (review.audio?.status === 'unavailable') warnings.push(`Direct listening remains incomplete: ${review.audio.notes}`);
    if (!Array.isArray(review.issues)) errors.push('Creative review issues must be an array.');
    for (const issue of list(review.issues)) {
      if (issue.status !== 'resolved' || !text(issue.finding) || !text(issue.resolution)) errors.push('Resolve each creative issue and document its finding and fix.');
    }
  } catch (error) { errors.push(`Creative review evidence required: ${error.message}`); }
  return {ok: errors.length === 0, errors, warnings, coverage: 'Review coverage, media/source hashes, and evidence integrity only. The reviewing agent must judge the actual imagery, motion, and sound.'};
};
