import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync, spawnSync} from 'node:child_process';

export const ACTIVE_ROOTS = ['input', 'public/current', 'src/video', 'work/current'];
export const RESTORED_FILES = {
  'brief.json': 'templates/brief.json',
  'input/script.md': 'templates/active/script.md',
  'input/visual-script.md': 'templates/active/visual-script.md',
  'src/video/MainVideo.tsx': 'templates/active/MainVideo.tsx',
  'src/video/project.json': 'templates/active/project.json',
  'work/current/progress.md': 'templates/active/progress.md',
  'work/current/approvals.md': 'templates/active/approvals.md',
  'work/current/storyboard.json': 'templates/active/storyboard.json',
  'work/current/transcript.reviewed.json': 'templates/active/transcript.reviewed.json',
};

export const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
export const writeJson = (file, data) => {
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
};

/** Reject traversal and symlinks before reading, writing, or clearing managed paths. */
export const safePath = (root, relative) => {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative) || relative.includes('\\')) {
    throw new Error(`Use a project-relative path with forward slashes: ${relative}`);
  }
  const base = fs.realpathSync(root);
  const target = path.resolve(base, relative);
  if (target === base || !target.startsWith(`${base}${path.sep}`)) {
    throw new Error(`Path is outside the workspace: ${relative}`);
  }
  let cursor = base;
  for (const part of path.relative(base, target).split(path.sep)) {
    cursor = path.join(cursor, part);
    try {
      if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error(`Symbolic link is not allowed: ${relative}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  return target;
};

export const validVideoId = (id) => typeof id === 'string'
  && /^[a-z0-9][a-z0-9-]{0,63}$/.test(id)
  && !/^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/.test(id);

const requiredFile = (root, relative, errors) => {
  try {
    const file = safePath(root, relative);
    if (!fs.statSync(file).isFile() || !fs.statSync(file).size) {
      errors.push(`Missing or empty file: ${relative}`);
      return null;
    }
    return file;
  } catch (error) {
    errors.push(error.code === 'ENOENT' ? `Missing file: ${relative}` : error.message);
    return null;
  }
};

export const validateBrief = (root) => {
  const errors = [];
  let brief;
  try { brief = readJson(safePath(root, 'brief.json')); }
  catch (error) { return {brief: null, errors: [`Cannot read brief.json: ${error.message}`]}; }
  if (!brief || typeof brief !== 'object' || Array.isArray(brief)) return {brief: null, errors: ['brief.json must contain an object.']};
  if (!validVideoId(brief.video_id)) errors.push('video_id: use a unique lowercase identifier containing letters, numbers, or hyphens.');
  for (const key of ['outcome', 'audience', 'language']) {
    if (typeof brief[key] !== 'string' || !brief[key].trim()) errors.push(`${key}: required.`);
  }
  const output = brief.output ?? {};
  for (const key of ['width', 'height']) {
    if (!Number.isInteger(output[key]) || output[key] < 2 || output[key] > 7680 || output[key] % 2) {
      errors.push(`output.${key}: use an even integer from 2 through 7680.`);
    }
  }
  if (output.width !== 1080 || output.height !== 1920) errors.push('output: new videos must use 1080x1920 (9:16).');
  if (!Number.isInteger(output.fps) || output.fps < 1 || output.fps > 120) errors.push('output.fps: use an integer from 1 through 120.');
  if (!Array.isArray(brief.references)) errors.push('references: use a list; an empty list is valid.');
  else for (const item of brief.references) requiredFile(root, item, errors);
  if (brief.approval_required_for_input_changes !== true) errors.push('approval_required_for_input_changes must remain true.');
  for (const key of ['audio_file', 'script_file', 'visual_script_file']) {
    if (key !== 'audio_file' && brief[key] == null) continue;
    const file = requiredFile(root, brief[key], errors);
    if (file && key !== 'audio_file') {
      const text = fs.readFileSync(file, 'utf8').trim();
      if (text.includes('Replace this instruction')) errors.push(`${key}: replace the initial instruction with current-video content.`);
    }
  }
  return {brief, errors};
};

export const fingerprintInputs = (root, brief) => {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(brief));
  for (const relative of [brief.audio_file, brief.script_file, brief.visual_script_file, ...(brief.references ?? [])].filter((file) => file != null)) {
    hash.update(relative);
    hash.update(fs.readFileSync(safePath(root, relative)));
  }
  return hash.digest('hex');
};

const walkFiles = (root, relative) => {
  const directory = safePath(root, relative);
  if (!fs.existsSync(directory)) return [];
  if (!fs.statSync(directory).isDirectory()) throw new Error(`Managed directory is not a directory: ${relative}`);
  const files = [];
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const child = `${relative}/${entry.name}`;
    safePath(root, child);
    if (entry.isDirectory()) files.push(...walkFiles(root, child));
    else if (entry.isFile()) files.push(child);
    else throw new Error(`Unsupported managed entry: ${child}`);
  }
  return files;
};

export const planReset = (root, {discardUnfinished = false} = {}) => {
  const files = ['brief.json', ...ACTIVE_ROOTS.flatMap((relative) => walkFiles(root, relative))]
    .filter((relative) => fs.existsSync(safePath(root, relative))).sort();
  // Validate every source and destination before any deletion.
  for (const [target, source] of Object.entries(RESTORED_FILES)) {
    safePath(root, target);
    if (!fs.statSync(safePath(root, source)).isFile()) throw new Error(`Missing reset template: ${source}`);
  }
  safePath(root, 'exports');
  let brief;
  try { brief = readJson(safePath(root, 'brief.json')); }
  catch (error) { if (!discardUnfinished) throw new Error(`Cannot inspect current brief. Repair it or explicitly discard the unfinished video. ${error.message}`); }
  const videoId = brief?.video_id ?? '';
  const changed = files.some((relative) => {
    if (relative.endsWith('/.gitkeep')) return false;
    const source = RESTORED_FILES[relative];
    return !source || !fs.readFileSync(safePath(root, relative)).equals(fs.readFileSync(safePath(root, source)));
  });
  const completed = validVideoId(videoId) && ['mp4', 'report.md'].every((ext) => {
    const file = safePath(root, `exports/${videoId}.${ext}`);
    return fs.existsSync(file) && fs.statSync(file).isFile() && fs.statSync(file).size > 0;
  });
  if (changed && !completed && !discardUnfinished) {
    throw new Error('The current video has no completed export and report. Export it first, or explicitly use --discard-unfinished.');
  }
  return {video_id: videoId, files, restore: Object.keys(RESTORED_FILES), kept_export: completed ? `exports/${videoId}.mp4` : null};
};

export const resetWorkspace = (root, options = {}) => {
  const plan = planReset(root, options);
  if (!options.apply) return plan;
  // Remove only the inspected files. Never recursively remove a managed root.
  for (const relative of plan.files) fs.unlinkSync(safePath(root, relative));
  const removeEmpty = (relative) => {
    const dir = safePath(root, relative);
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      if (entry.isDirectory()) removeEmpty(`${relative}/${entry.name}`);
    }
    if (!fs.readdirSync(dir).length && !ACTIVE_ROOTS.includes(relative)) fs.rmdirSync(dir);
  };
  for (const relative of ACTIVE_ROOTS) { removeEmpty(relative); fs.mkdirSync(safePath(root, relative), {recursive: true}); }
  for (const [target, source] of Object.entries(RESTORED_FILES)) {
    fs.mkdirSync(path.dirname(safePath(root, target)), {recursive: true});
    fs.copyFileSync(safePath(root, source), safePath(root, target));
  }
  fs.mkdirSync(safePath(root, 'input/references'), {recursive: true});
  return plan;
};

export const resolveMediaBinary = (root, kind) => {
  const explicit = process.env[kind === 'ffmpeg' ? 'VIDEO_FFMPEG' : 'VIDEO_FFPROBE'];
  if (explicit) return explicit;
  try {
    const require = createRequire(path.join(root, 'package.json'));
    const value = require(`${kind}-static`);
    const binary = typeof value === 'string' ? value : value.path;
    if (binary && fs.existsSync(binary)) return binary;
  } catch { /* Use a system binary when no compatible bundled binary exists. */ }
  return kind;
};

export const runBinary = (binary, args, options = {}) => execFileSync(binary, args, {
  encoding: 'utf8', timeout: 180000, maxBuffer: 32 * 1024 * 1024, ...options,
});

export const probeMedia = (root, file) => {
  const result = JSON.parse(runBinary(resolveMediaBinary(root, 'ffprobe'), [
    '-v', 'error', '-show_format', '-show_streams', '-of', 'json', file,
  ]));
  const video = result.streams?.find((s) => s.codec_type === 'video');
  const audio = result.streams?.find((s) => s.codec_type === 'audio');
  const rate = video?.avg_frame_rate || video?.r_frame_rate || '0/1';
  const [n, d = 1] = rate.split('/').map(Number);
  return {
    duration: Number(result.format?.duration), width: video?.width ?? 0, height: video?.height ?? 0,
    fps: d ? n / d : 0, frames: Number(video?.nb_frames) || null,
    videoCodec: video?.codec_name ?? '', audioCodec: audio?.codec_name ?? '',
    sampleRate: Number(audio?.sample_rate) || null, channels: audio?.channels ?? null,
    sizeBytes: fs.statSync(file).size,
  };
};

export const prepareProject = (root, probe = probeMedia) => {
  const {brief, errors} = validateBrief(root);
  if (errors.length) throw new Error(errors.join('\n'));
  if (fs.existsSync(safePath(root, `exports/${brief.video_id}.mp4`)) || fs.existsSync(safePath(root, `exports/${brief.video_id}.report.md`))) {
    throw new Error('This video_id already has an export. Use a unique identifier for a new video.');
  }
  const audio = probe(root, safePath(root, brief.audio_file));
  if (!audio.audioCodec || !Number.isFinite(audio.duration) || audio.duration <= 0) throw new Error('The voice file must contain a valid audio stream with a positive duration.');
  const project = {
    video_id: brief.video_id, ...brief.output, audioDuration: audio.duration,
    audioSha256: crypto.createHash('sha256').update(fs.readFileSync(safePath(root, brief.audio_file))).digest('hex'),
    durationInFrames: Math.max(1, Math.round(audio.duration * brief.output.fps)),
    inputFingerprint: fingerprintInputs(root, brief), ready: false,
  };
  writeJson(safePath(root, 'src/video/project.json'), project);
  writeJson(safePath(root, 'work/current/context.json'), {brief, project, prepared_at: new Date().toISOString()});
  return project;
};

export const requireCurrentProject = (root) => {
  const {brief, errors} = validateBrief(root);
  if (errors.length) throw new Error(errors.join('\n'));
  const project = readJson(safePath(root, 'src/video/project.json'));
  if (project.video_id !== brief.video_id || project.inputFingerprint !== fingerprintInputs(root, brief)) {
    throw new Error('The current inputs changed. Run video:prepare and review the affected approvals.');
  }
  if (project.width !== brief.output.width || project.height !== brief.output.height || project.fps !== brief.output.fps
    || !Number.isFinite(project.audioDuration) || project.audioDuration <= 0
    || project.durationInFrames !== Math.max(1, Math.round(project.audioDuration * project.fps))) {
    throw new Error('Composition metadata does not match the brief and measured duration. Run video:prepare.');
  }
  return {brief, project};
};

export const inspectOutput = (root, project, relative = 'work/current/final.mp4', {measure = true} = {}) => {
  const file = safePath(root, relative);
  const stats = probeMedia(root, file);
  const errors = [];
  if (stats.width !== project.width || stats.height !== project.height) errors.push('Output dimensions do not match the project.');
  if (Math.abs(stats.fps - project.fps) > 0.001) errors.push('Output frame rate does not match the project.');
  if (stats.frames !== project.durationInFrames) errors.push('Output frame count is missing or does not match the project.');
  if (Math.abs(stats.duration - project.audioDuration) > Math.max(0.08, 1 / project.fps)) errors.push('Output duration does not match the voice.');
  if (stats.videoCodec !== 'h264' || stats.audioCodec !== 'aac') errors.push('Output must contain H.264 video and AAC audio.');
  if (measure) {
    const result = spawnSync(resolveMediaBinary(root, 'ffmpeg'), [
      '-hide_banner', '-i', file, '-vn', '-af', 'loudnorm=I=-15:TP=-1:LRA=11:print_format=json', '-f', 'null', '-',
    ], {encoding: 'utf8', timeout: 180000, maxBuffer: 32 * 1024 * 1024});
    if (result.error || result.status !== 0) throw new Error(`Audio measurement failed: ${result.error?.message ?? result.stderr?.slice(-1000)}`);
    const report = (result.stderr ?? '').match(/\{\s*"input_i"[\s\S]*?\}/);
    if (!report) throw new Error('FFmpeg did not produce an audio loudness report.');
    const loudness = JSON.parse(report[0]);
    stats.integratedLufs = Number(loudness.input_i);
    stats.truePeakDbtp = Number(loudness.input_tp);
    stats.loudnessRangeLu = Number(loudness.input_lra);
    if (!Number.isFinite(stats.integratedLufs) || !Number.isFinite(stats.truePeakDbtp)) errors.push('Audio measurements are not finite.');
    // Workspace delivery targets, not claims about a universal platform standard.
    if (stats.integratedLufs < -16 || stats.integratedLufs > -14) errors.push('Integrated loudness is outside the workspace target of -16 to -14 LUFS.');
    if (stats.truePeakDbtp > -1) errors.push('True peak exceeds the workspace limit of -1 dBTP.');
  }
  return {ok: errors.length === 0, errors, stats};
};

/** Copy only verified media and a written report. Never replace an existing export pair. */
export const exportPair = (root, videoId) => {
  if (!validVideoId(videoId)) throw new Error('Invalid video identifier.');
  const sourceVideo = safePath(root, 'work/current/final.mp4');
  const sourceReport = safePath(root, 'work/current/report.md');
  for (const file of [sourceVideo, sourceReport]) {
    if (!fs.statSync(file).isFile() || !fs.statSync(file).size) throw new Error('A final video and written report are required.');
  }
  fs.mkdirSync(safePath(root, 'exports'), {recursive: true});
  const destinations = [safePath(root, `exports/${videoId}.mp4`), safePath(root, `exports/${videoId}.report.md`)];
  if (destinations.some((file) => fs.existsSync(file))) throw new Error('Export already exists. Use a unique video identifier.');
  fs.copyFileSync(sourceVideo, destinations[0], fs.constants.COPYFILE_EXCL);
  try { fs.copyFileSync(sourceReport, destinations[1], fs.constants.COPYFILE_EXCL); }
  catch (error) { fs.unlinkSync(destinations[0]); throw error; }
  return destinations;
};
