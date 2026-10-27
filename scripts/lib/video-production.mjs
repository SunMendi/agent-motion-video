import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import ts from 'typescript';
import {readJson, safePath, requireCurrentProject} from './video-workspace.mjs';
import {validateCreativePlan} from './video-creative.mjs';

const text = (value) => typeof value === 'string' && value.trim().length > 0;
const list = (value) => Array.isArray(value) ? value : [];
const normalized = (value) => String(value ?? '').normalize('NFC').replace(/[^\p{L}\p{N}]+/gu, '').toLowerCase();

/** Compile from reviewed speech IDs; never estimate acoustic timings from text length. */
export const compileStoryboard = ({board, transcript, layout, project}) => {
  const errors = [];
  const warnings = [];
  const events = [];
  const captions = [];
  const shots = list(board?.shots);
  if (board?.schema_version !== 2) errors.push('Use schema_version 2 from templates/storyboard.json; legacy storyboards need review, not automatic conversion.');
  if (board?.video_id !== project.video_id) errors.push('Storyboard video_id does not match the current project.');
  if (transcript?.review_status !== 'reviewed' || !text(transcript?.review_notes)) errors.push('Transcript needs an actual timing review, review_status=reviewed, and review_notes.');
  if (!/^[a-f0-9]{64}$/.test(transcript?.audio_sha256 ?? '') || transcript.audio_sha256 !== project.audioSha256) errors.push('Reviewed timing must reference the prepared audio_sha256. Run video:prepare and review timing for this recording.');
  if (!Number.isFinite(transcript?.audio_duration) || Math.abs(transcript.audio_duration - project.audioDuration) > 0.08) errors.push('Reviewed transcript duration does not match the measured recording.');
  const action = layout?.action;
  const caption = layout?.caption;
  const validLayout = layout?.width === 1080 && layout?.height === 1920
    && [action?.top, action?.bottom, action?.left, action?.right, caption?.top, caption?.height, caption?.left, caption?.right].every(Number.isFinite)
    && caption.top >= 0 && caption.height > 0 && caption.top + caption.height <= action.top
    && action.bottom > action.top && action.bottom <= layout.height
    && action.left >= 0 && action.right >= 0 && action.left + action.right < layout.width
    && caption.left >= 0 && caption.right >= 0 && caption.left + caption.right < layout.width;
  if (!validLayout) errors.push('Layout must define non-overlapping top captions and a valid action stage on a 1080x1920 canvas.');

  const tokens = list(transcript?.words).length ? list(transcript.words) : list(transcript?.phrases);
  if (!tokens.length) errors.push('Reviewed transcript must contain timed words or phrases with stable IDs.');
  const byId = new Map();
  let previousEnd = 0;
  for (const token of tokens) {
    if (!text(token?.id) || byId.has(token.id)) errors.push('Transcript IDs must be nonempty and unique.');
    if (!text(token?.w ?? token?.text) || !Number.isFinite(token?.s) || !Number.isFinite(token?.e)
      || token.s < 0 || token.e <= token.s || token.e > project.audioDuration + 0.04 || token.s < previousEnd - 0.001) {
      errors.push(`Invalid or overlapping reviewed speech timing: ${token?.id ?? '(no ID)'}.`);
      continue;
    }
    if (token.s - previousEnd > 1.5) warnings.push(`Speech gap before ${token.id} exceeds 1.5 seconds. Confirm silence or missing transcript coverage.`);
    previousEnd = token.e;
    byId.set(token.id, token);
    captions.push({id: token.id, text: token.w ?? token.text, startFrame: Math.round(token.s * project.fps), endFrame: Math.max(Math.round(token.s * project.fps) + 1, Math.round(token.e * project.fps))});
  }
  if (tokens.length && previousEnd < project.audioDuration - 1.5) warnings.push('Transcript ends more than 1.5 seconds before the recording. Review for missing speech or document the trailing silence.');

  if (!shots.length) errors.push('Storyboard has no shots.');
  let cursor = 0;
  const ids = new Set();
  const eventIds = new Set();
  for (const shot of shots) {
    const name = shot?.id ?? '(no ID)';
    if (!text(shot?.id) || ids.has(shot.id)) errors.push(`Shot IDs must be nonempty and unique: ${name}.`);
    ids.add(shot?.id);
    const validRange = Number.isInteger(shot?.start_frame) && Number.isInteger(shot?.end_frame)
      && shot.start_frame === cursor && shot.end_frame > shot.start_frame && shot.end_frame <= project.durationInFrames;
    if (!validRange) errors.push(`${name}: shots must cover every frame once, in order, using [start_frame, end_frame).`);
    cursor = shot?.end_frame;
    for (const field of ['viewer_takeaway', 'subject', 'visual_mode', 'next_shot_connection']) {
      if (!text(shot?.[field])) errors.push(`${name}: ${field} is required.`);
    }
    for (const field of ['before', 'action', 'after']) if (!text(shot?.states?.[field])) errors.push(`${name}: states.${field} must explain a visible state or action.`);
    if (!list(shot?.acceptance_criteria).some(text)) errors.push(`${name}: add a concrete visual acceptance criterion.`);
    const narrationIds = list(shot?.narration_ids);
    if (!narrationIds.length) errors.push(`${name}: reference reviewed narration IDs.`);
    for (const id of narrationIds) if (!byId.has(id)) errors.push(`${name}: unknown narration ID ${id}.`);
    const spoken = normalized(narrationIds.map((id) => byId.get(id)?.w ?? byId.get(id)?.text ?? '').join(' '));
    if (!Array.isArray(shot?.body_labels) || shot.body_labels.some((label) => !text(label))) errors.push(`${name}: body_labels must be an array of nonempty short strings (or []).`);
    for (const label of list(shot?.body_labels)) {
      if (typeof label !== 'string') continue;
      if (label.trim().split(/\s+/u).length > 4) warnings.push(`${name}: body label exceeds four words; inspect at phone size.`);
      const clean = normalized(label);
      if (clean.length >= 20 && spoken.includes(clean) && clean.length >= spoken.length * 0.65) errors.push(`${name}: body text repeats most of the narration; direct a visual action instead.`);
    }
    const keyframes = list(shot?.keyframes);
    if (!keyframes.length) errors.push(`${name}: declare representative keyframes and artwork bounds.`);
    for (const keyframe of keyframes) {
      if (!Number.isInteger(keyframe?.frame) || keyframe.frame < 0 || keyframe.frame >= shot.end_frame - shot.start_frame || !text(keyframe?.focal_point)) errors.push(`${name}: keyframes need local frame positions and a focal point.`);
      const b = keyframe?.bounds;
      if (!b || ![b.x, b.y, b.width, b.height].every(Number.isFinite) || b.width <= 0 || b.height <= 0) errors.push(`${name}: invalid declared artwork bounds.`);
      else if (validLayout) {
        if (b.x < action.left || b.x + b.width > layout.width - action.right || b.y < action.top || b.y + b.height > action.bottom) errors.push(`${name}: declared artwork overlaps captions or falls outside the action stage.`);
        if (b.height < (action.bottom - action.top) * 0.45) warnings.push(`${name}: shallow artwork bounds; inspect whether the lower action area is unintentionally empty.`);
      }
    }
    if (!Array.isArray(shot?.assets)) errors.push(`${name}: assets must list project-relative source files (or []).`);
    const shotEvents = list(shot?.events);
    if (!shotEvents.length) errors.push(`${name}: add a narration-anchored visual event; a hold can document its attention purpose.`);
    for (const event of shotEvents) {
      if (!text(event?.id) || eventIds.has(event.id)) errors.push(`${name}: event IDs must be nonempty and globally unique.`);
      eventIds.add(event?.id);
      const anchor = byId.get(event?.anchor_id);
      const edge = event?.anchor_edge ?? 'start';
      const offset = event?.offset_frames ?? 0;
      if (!anchor || !narrationIds.includes(event?.anchor_id) || !['start', 'end'].includes(edge) || !Number.isInteger(offset) || !Number.isInteger(event?.duration_frames) || event.duration_frames <= 0 || !text(event?.action)) {
        errors.push(`${name}: invalid narration anchor, action, offset, or duration for event ${event?.id}.`);
        continue;
      }
      const startFrame = Math.round((edge === 'end' ? anchor.e : anchor.s) * project.fps) + offset;
      if (startFrame < shot.start_frame || startFrame + event.duration_frames > shot.end_frame) errors.push(`${name}: event ${event.id} extends outside its shot.`);
      events.push({...event, shot_id: shot.id, startFrame, endFrame: startFrame + event.duration_frames});
    }
    for (const cue of list(shot?.sound_cues)) {
      if (!shotEvents.some((event) => event?.id === cue?.event_id) || !text(cue?.file) || !text(cue?.purpose)
        || !Number.isFinite(cue?.gain) || cue.gain < 0 || cue.gain > 1 || !Number.isInteger(cue?.duration_frames) || cue.duration_frames <= 0) errors.push(`${name}: sound cues need an event_id, purpose, file, gain in [0,1], and positive duration_frames.`);
    }
  }
  if (cursor !== project.durationInFrames) errors.push('Storyboard does not end at the measured composition end.');
  const soundCues = shots.flatMap((shot) => list(shot?.sound_cues).flatMap((cue) => {
    const event = events.find((item) => item.id === cue?.event_id && item.shot_id === shot.id);
    if (!event) return [];
    const offset = cue.offset_frames ?? 0;
    const fade = cue.fade_out_frames ?? 0;
    const startFrame = event.startFrame + offset;
    if (!Number.isInteger(offset) || !Number.isInteger(fade) || fade < 0 || fade > cue.duration_frames || startFrame < 0 || startFrame + cue.duration_frames > project.durationInFrames) errors.push(`${shot.id}: sound cue offset, fade, or coverage is invalid.`);
    return [{...cue, startFrame}];
  }));
  return {ok: errors.length === 0, errors, warnings, timeline: {schema_version: 2, video_id: project.video_id, fps: project.fps, durationInFrames: project.durationInFrames, captionMode: list(transcript?.words).length ? 'word' : 'phrase', shots, captions, events, soundCues}};
};

const sourceFiles = (directory) => fs.existsSync(directory) ? fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  if (entry.isSymbolicLink()) throw new Error(`Symbolic link in scene source: ${file}`);
  return entry.isDirectory() ? sourceFiles(file) : /\.(tsx?|jsx?|css|json)$/.test(entry.name) && !entry.name.endsWith('.compiled.css') ? [file] : [];
}) : [];

const renderHazards = (code, file) => {
  if (file.endsWith('.css')) return code.split('\n').flatMap((line, index) => /(?:^|[;{])\s*(?:transition|animation)(?:-[a-z]+)?\s*:|@keyframes\b/.test(line) ? [index + 1] : []);
  const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const lines = new Set();
  const visit = (node) => {
    const property = ts.isPropertyAssignment(node) && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name))
      && ['transition', 'animation'].includes(node.name.text)
      && (ts.isStringLiteralLike(node.initializer) || ts.isTemplateExpression(node.initializer));
    const call = ts.isCallExpression(node) && (
      ts.isIdentifier(node.expression) && ['setTimeout', 'setInterval'].includes(node.expression.text)
      || ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.expression)
        && node.expression.expression.text === 'Math' && node.expression.name.text === 'random'
    );
    if (property || call) lines.add(source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1);
    ts.forEachChild(node, visit);
  };
  visit(source);
  return [...lines];
};

/** Read-only gate. Source inspection is advisory evidence, not browser geometry verification. */
export const checkProduction = (root, {requireEvidence = true} = {}) => {
  try {
    const {brief, project} = requireCurrentProject(root);
    const board = readJson(safePath(root, 'work/current/storyboard.json'));
    if (board?.schema_version !== 2) throw new Error('Current storyboard is legacy. Review and migrate it using templates/storyboard.json (schema_version 2) before a new render. Do not automatically reinterpret old approvals.');
    const transcript = readJson(safePath(root, board.transcript_file));
    const layout = readJson(safePath(root, board.layout_file));
    const result = compileStoryboard({board, transcript, layout, project});
    const dependencies = new Set(['work/current/storyboard.json', board.transcript_file, board.layout_file]);
    for (const relative of ['src/fonts.ts', 'src/index.css', 'remotion.config.ts', 'package.json']) {
      if (fs.existsSync(safePath(root, relative))) dependencies.add(relative);
    }
    const requireFile = (relative) => {
      try {
        const file = safePath(root, relative);
        if (!fs.statSync(file).isFile() || !fs.statSync(file).size) throw new Error('not a nonempty file');
        dependencies.add(relative);
      } catch (error) { result.errors.push(`Missing or invalid production file ${relative}: ${error.message}`); }
    };
    if (requireEvidence) {
      result.errors.push(...validateCreativePlan(board));
      requireFile('work/current/direction.md');
      requireFile('work/current/asset-manifest.json');
      try {
        const manifest = readJson(safePath(root, 'work/current/asset-manifest.json'));
        if (!Array.isArray(manifest.assets)) throw new Error('assets must be an array');
        for (const asset of manifest.assets) requireFile(asset.path);
        for (const file of new Set(list(board.shots).flatMap((shot) => list(shot.assets)))) {
          const asset = manifest.assets.find((item) => item.path === file);
          if (!asset || !['kind', 'source', 'usage_terms'].every((field) => text(asset[field]))) result.errors.push(`Asset ${file} needs kind, source, and usage_terms in asset-manifest.json.`);
        }
      } catch (error) { result.errors.push(`Asset provenance review required: ${error.message}`); }
      if (!list(board.style_frames).length) result.errors.push('Create representative style frames before production.');
      for (const file of list(board.style_frames)) requireFile(file);
      requireFile(board.animatic_file);
    }
    if (!text(layout?.typography?.captionFile)) result.errors.push('Layout must name the local caption font file relative to public/.');
    else requireFile(`public/${layout.typography.captionFile}`);
    for (const shot of list(board.shots)) {
      for (const file of list(shot?.assets)) requireFile(file);
      if (brief.audio?.sound_effects === false && list(shot?.sound_cues).length) result.errors.push(`${shot.id}: sound cues conflict with sound_effects=false.`);
      for (const cue of list(shot?.sound_cues)) {
        if (!cue?.file?.startsWith('public/')) result.errors.push(`${shot.id}: sound assets must live under public/.`);
        requireFile(cue?.file);
      }
    }
    const sources = [...sourceFiles(safePath(root, 'src/video')), ...sourceFiles(safePath(root, 'src/shared'))];
    for (const file of sources) {
      dependencies.add(path.relative(root, file));
      const code = fs.readFileSync(file, 'utf8');
      for (const line of renderHazards(code, file)) result.errors.push(`${path.relative(root, file)}:${line}: possible nondeterministic animation; use frame-derived motion or review this finding before production.`);
    }
    if (!sources.some((file) => file.startsWith(path.join(root, 'src/video') + path.sep) && /\bSceneStage\b/.test(fs.readFileSync(file, 'utf8')))) result.warnings.push('Current scene code does not use the shared SceneStage. Inspect sequence layout and actual artwork bounds.');
    const hash = crypto.createHash('sha256').update(project.inputFingerprint);
    for (const relative of [...dependencies].sort()) {
      const file = safePath(root, relative);
      if (fs.existsSync(file) && fs.statSync(file).isFile()) hash.update(relative).update(fs.readFileSync(file));
    }
    result.timeline.productionFingerprint = hash.digest('hex');
    result.ok = result.errors.length === 0;
    result.coverage = 'Structural timing, creative-plan fields, declared bounds, referenced files, and source hazards only. Actual visual playback, subject recognition, composition, and listening remain agent review responsibilities.';
    return result;
  } catch (error) {
    return {ok: false, errors: [error.message], warnings: [], timeline: null};
  }
};
