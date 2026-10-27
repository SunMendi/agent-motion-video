#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {
  readJson, writeJson, safePath, validateBrief, prepareProject, resetWorkspace,
  requireCurrentProject, inspectOutput, exportPair, resolveMediaBinary, runBinary, probeMedia,
} from './lib/video-workspace.mjs';
import {checkProduction} from './lib/video-production.mjs';
import {createReviewEvidence, checkCreativeReview, fileHash} from './lib/video-creative.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'package.json'));
const [command = 'help', ...args] = process.argv.slice(2);
const flag = (name) => args.includes(name);
const entry = 'src/shared/workspace-entry.ts';

const packageInfo = (name) => {
  const file = require.resolve(`${name}/package.json`);
  return {file, ...readJson(file)};
};

const localCommand = (name, argv) => {
  const pkg = packageInfo(name);
  const bin = typeof pkg.bin === 'string' ? pkg.bin : Object.values(pkg.bin ?? {})[0];
  if (!bin) throw new Error(`${name} has no executable. Follow setup.md.`);
  runBinary(process.execPath, [path.resolve(path.dirname(pkg.file), bin), ...argv], {cwd: root, stdio: 'inherit', timeout: undefined});
};

const buildCss = () => localCommand('@tailwindcss/cli', [
  '-i', 'src/shared/workspace.css', '-o', 'src/shared/workspace.compiled.css', '--minify',
]);

const doctor = () => {
  const spec = readJson(path.join(root, 'scripts/workspace-requirements.json'));
  const checks = [];
  const add = (name, available, detail) => checks.push({name, status: available ? 'Already available' : 'Unavailable', detail});
  add('Node.js', Number(process.versions.node.split('.')[0]) >= 22, process.version);
  add('npm', Boolean(process.env.npm_execpath), process.env.npm_execpath ? 'Command started through npm.' : 'Run npm --version to verify npm.');
  let version = '';
  try { version = packageInfo('remotion').version; } catch { /* Report missing packages below. */ }
  for (const name of spec.packages) {
    try {
      const pkg = packageInfo(name);
      const compatible = !(name === 'remotion' || name.startsWith('@remotion/')) || pkg.version === version;
      add(name, compatible, `${pkg.version}${compatible ? '' : `; expected ${version}`}`);
    } catch { add(name, false, 'Not found in this project. See setup.md before installation.'); }
  }
  for (const file of spec.shared_font_files) add(file, fs.existsSync(path.join(root, file)), 'Shared local font; reset keeps this file.');
  const skillPaths = spec.remotion_skill_paths.filter((item) => fs.existsSync(path.join(root, item)));
  add('Official Remotion skills', skillPaths.length > 0, skillPaths.length ? skillPaths.join(', ') : 'Not found in the configured project locations. Check agent-global skills too.');
  add('Video director skill', fs.existsSync(path.join(root, 'skills/video-director/SKILL.md')), 'Project skill is a normal Markdown file.');
  const browserRoot = path.join(root, 'node_modules/.remotion/chrome-headless-shell');
  const findBrowser = (dir) => fs.existsSync(dir) && fs.readdirSync(dir, {withFileTypes: true}).some((e) =>
    e.isDirectory() ? findBrowser(path.join(dir, e.name)) : /^(chrome-headless-shell|chrome-headless-shell\.exe)$/.test(e.name));
  add('Render browser', Boolean(findBrowser(browserRoot)), 'Use npx remotion browser ensure only if missing.');
  if (!flag('--static')) {
    const checkBinary = (name, binary, argv) => {
      try { add(name, true, runBinary(binary, argv, {timeout: 15000}).trim().split('\n')[0]); }
      catch (error) { add(name, false, `${binary}: ${error.message.slice(0, 240)}`); }
    };
    checkBinary('Git', 'git', ['--version']);
    for (const kind of ['ffmpeg', 'ffprobe']) checkBinary(kind, resolveMediaBinary(root, kind), ['-version']);
    try {
      const result = runBinary(resolveMediaBinary(root, 'ffmpeg'), ['-hide_banner', '-filters'], {timeout: 15000});
      add('FFmpeg audio filters', ['loudnorm', 'astats', 'amix', 'sidechaincompress'].every((filter) => result.includes(filter)), 'Required filters: loudnorm, astats, amix, sidechaincompress.');
    } catch (error) { add('FFmpeg audio filters', false, error.message.slice(0, 240)); }
    const python = process.env.VIDEO_PYTHON || (fs.existsSync(path.join(root, '.venv/bin/python'))
      ? path.join(root, '.venv/bin/python') : fs.existsSync(path.join(root, '.venv/Scripts/python.exe'))
        ? path.join(root, '.venv/Scripts/python.exe') : process.platform === 'win32' ? 'py' : 'python3');
    const prefix = process.platform === 'win32' && python === 'py' ? ['-3.11'] : [];
    checkBinary('Python', python, [...prefix, '--version']);
    checkBinary('Faster-Whisper', python, [...prefix, '-c', 'import faster_whisper; print("faster-whisper import passed")']);
  }
  const report = {checked_at: new Date().toISOString(), platform: process.platform, architecture: process.arch, memoryGb: Math.round(os.totalmem() / 1024 ** 3), static_only: flag('--static'), ready: !flag('--static') && checks.every((c) => c.status === 'Already available'), checks};
  if (flag('--save')) writeJson(safePath(root, 'work/setup/environment.json'), report);
  console.log(JSON.stringify(report, null, 2));
  if (!report.ready) {
    console.log('Setup is not fully verified. No packages, tools, or models were installed.');
    process.exitCode = 1;
  }
};

const render = () => {
  const {project} = requireCurrentProject(root);
  if (!project.ready) throw new Error('The current composition is not marked ready. Complete the scene implementation first.');
  const frameArg = args.find((arg) => arg.startsWith('--frames='));
  if (args.some((arg) => !arg.startsWith('--frames='))) throw new Error('Only --frames=START-END is accepted by video:render.');
  if (frameArg) {
    const match = /^--frames=(\d+)-(\d+)$/.exec(frameArg);
    if (!match || Number(match[1]) > Number(match[2]) || Number(match[2]) >= project.durationInFrames) throw new Error('Frame range must lie inside the current composition.');
  }
  const production = checkProduction(root);
  if (!production.ok) throw new Error(`Production checks failed:\n${production.errors.join('\n')}\nRun video:check-production and review the listed artifacts.`);
  for (const warning of production.warnings) console.warn(warning);
  writeJson(safePath(root, 'work/current/timeline.compiled.json'), production.timeline);
  buildCss();
  const output = frameArg ? 'work/current/sample.mp4' : 'work/current/final.mp4';
  const file = safePath(root, output);
  fs.mkdirSync(path.dirname(file), {recursive: true});
  // Use 2 cores by default; use max 3 cores if system load is light (< 1.5), leaving cores free for user work
  const totalCores = os.cpus().length;
  const load1m = os.loadavg()[0];
  const autoCores = (totalCores >= 4 && load1m < 1.5) ? 3 : 2;
  const concurrency = process.env.VIDEO_CONCURRENCY || String(Math.min(3, Math.max(2, autoCores)));
  console.log(`Rendering with ${concurrency} CPU cores (reserving remaining cores for other tasks)...`);
  localCommand('@remotion/cli', ['render', entry, 'current-video', file, '--codec=h264', '--crf=18', '--audio-codec=aac', '--audio-bitrate=192k', `--concurrency=${concurrency}`, ...(frameArg ? [frameArg] : [])]);
  if (!frameArg) writeJson(safePath(root, 'work/current/render-manifest.json'), {
    video_id: project.video_id, production_fingerprint: production.timeline.productionFingerprint,
    media_sha256: fileHash(file),
  });
  console.log(`Rendered ${output}. Inspect the actual result before approval or delivery.`);

  try {
    const stats = probeMedia(root, file);
    const isNineSixteen = stats.width > 0 && stats.height > 0 && Math.abs((stats.width / stats.height) - (9 / 16)) < 0.01;
    if (!isNineSixteen) {
      console.warn(`\n⚠️  [ASPECT RATIO CHECK] Video rendered at ${stats.width}x${stats.height}. Required format is 9:16 vertical (1080x1920).\n`);
    } else {
      console.log(`\n✓ [ASPECT RATIO CHECK] Video confirmed 9:16 vertical format (${stats.width}x${stats.height}).\n`);
    }
  } catch {
    // Probing error handled
  }
};

const verify = () => {
  const {project} = requireCurrentProject(root);
  if (!project.ready) throw new Error('The current composition is not marked ready. Complete the implementation before delivery.');
  const result = inspectOutput(root, project);
  const isNineSixteen = result.stats.width > 0 && result.stats.height > 0 && Math.abs((result.stats.width / result.stats.height) - (9 / 16)) < 0.01;
  result.stats.isNineSixteen = isNineSixteen;
  if (!isNineSixteen || result.stats.width !== 1080 || result.stats.height !== 1920) {
    result.errors.push(`Output dimensions are ${result.stats.width}x${result.stats.height}. All new videos must be 9:16 vertical format (e.g. 1080x1920).`);
    result.ok = false;
  }
  writeJson(safePath(root, 'work/current/verification.json'), result);
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) throw new Error('Export verification failed. Inspect work/current/verification.json.');
  return project;
};

const check9x16 = () => {
  const targetRelative = args.find((arg) => !arg.startsWith('--')) || 'work/current/final.mp4';
  const file = safePath(root, targetRelative);
  if (!fs.existsSync(file)) {
    throw new Error(`Media file not found: ${targetRelative}. Render the video before checking aspect ratio.`);
  }
  const stats = probeMedia(root, file);
  if (!stats.width || !stats.height) {
    throw new Error(`Failed to probe video dimensions for ${targetRelative}.`);
  }
  const ratio = stats.width / stats.height;
  const targetRatio = 9 / 16;
  const isNineSixteen = Math.abs(ratio - targetRatio) < 0.01;
  const isStandard1080x1920 = stats.width === 1080 && stats.height === 1920;

  const report = {
    file: targetRelative,
    width: stats.width,
    height: stats.height,
    aspectRatio: `${stats.width}:${stats.height}`,
    ratioDecimal: Number(ratio.toFixed(4)),
    targetRatio: '9:16 (0.5625)',
    isNineSixteen,
    isStandard1080x1920,
    status: isNineSixteen && isStandard1080x1920 ? 'PASSED' : 'FAILED',
  };

  console.log(JSON.stringify(report, null, 2));
  if (!isNineSixteen || !isStandard1080x1920) {
    throw new Error(`Aspect ratio check FAILED: ${targetRelative} has dimensions ${stats.width}x${stats.height} (ratio ${ratio.toFixed(4)}). Must be 1080x1920 (9:16).`);
  }
  console.log(`Aspect ratio check PASSED: ${targetRelative} is valid 9:16 vertical format (${stats.width}x${stats.height}).`);
};

const smoke = () => {
  buildCss();
  const tone = safePath(root, 'public/workspace-smoke/tone.wav');
  const samples = 44100;
  const wav = Buffer.alloc(44 + samples * 2);
  wav.write('RIFF', 0); wav.writeUInt32LE(36 + samples * 2, 4); wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(44100, 24); wav.writeUInt32LE(88200, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
  wav.write('data', 36); wav.writeUInt32LE(samples * 2, 40);
  for (let i = 0; i < samples; i++) wav.writeInt16LE(Math.round(3000 * Math.sin(2 * Math.PI * 440 * i / samples)), 44 + i * 2);
  fs.writeFileSync(tone, wav);
  const file = safePath(root, 'work/setup/sample.mp4');
  fs.mkdirSync(path.dirname(file), {recursive: true});
  localCommand('@remotion/cli', ['render', entry, 'workspace-setup', file, '--codec=h264', '--audio-codec=aac', '--concurrency=1']);
  const media = probeMedia(root, file);
  const passed = media.width === 640 && media.height === 640 && media.fps === 30 && media.videoCodec === 'h264' && media.audioCodec === 'aac';
  writeJson(safePath(root, 'work/setup/smoke.json'), {passed, media, visual_review: 'Not performed by this command.', audio_review: 'Not performed by this command.'});
  if (!passed) throw new Error('Setup sample media check failed.');
  console.log('Setup sample media check passed. Inspect work/setup/sample.mp4 for appearance and sound.');
};

try {
  if (command === 'doctor') doctor();
  else if (command === 'check') {
    const {errors} = validateBrief(root);
    if (errors.length) throw new Error(errors.join('\n'));
    console.log('Current brief and input-file checks passed. Creative review is still required.');
  } else if (command === 'check-production' || command === 'compile') {
    const result = checkProduction(root, {requireEvidence: command !== 'compile'});
    const {timeline, ...report} = result;
    console.log(JSON.stringify(report, null, 2));
    if (!result.ok) throw new Error('Production checks failed. Correct the listed artifacts; do not invent approvals or timing reviews.');
    if (command === 'compile') {
      writeJson(safePath(root, 'work/current/timeline.compiled.json'), timeline);
      console.log('Compiled the reviewed timeline. This does not approve production.');
    }
  } else if (command === 'prepare') console.log(JSON.stringify(prepareProject(root), null, 2));
  else if (command === 'css') buildCss();
  else if (command === 'studio') { buildCss(); localCommand('@remotion/cli', ['studio', entry]); }
  else if (command === 'render') render();
  else if (command === 'verify') verify();
  else if (command === 'export') {
    const creative = checkCreativeReview(root, checkProduction(root));
    console.log(JSON.stringify(creative, null, 2));
    if (!creative.ok) throw new Error('Creative review is incomplete or stale. Inspect rendered evidence, resolve findings, and run video:check-creative.');
    const project = verify();
    console.log('Saved:', exportPair(root, project.video_id).map((file) => path.relative(root, file)).join(', '));
  } else if (command === 'review-evidence') {
    console.log(JSON.stringify(createReviewEvidence(root, checkProduction(root)), null, 2));
  } else if (command === 'check-creative') {
    const result = checkCreativeReview(root, checkProduction(root));
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) throw new Error('Creative evidence checks failed. Complete the actual review; do not manufacture passing findings.');
  } else if (command === 'smoke') smoke();
  else if (command === 'check-9x16' || command === 'check-aspect') check9x16();
  else if (command === 'reset') {
    if (args.some((arg) => !['--apply', '--discard-unfinished'].includes(arg))) throw new Error('Reset accepts only --apply and --discard-unfinished.');
    const result = resetWorkspace(root, {apply: flag('--apply'), discardUnfinished: flag('--discard-unfinished')});
    console.log(JSON.stringify(result, null, 2));
    console.log(flag('--apply') ? 'Current-video files were reset. Exports and setup were kept.' : 'Preview only. No files were changed.');
  } else {
    console.log('Commands: doctor [--static] [--save], check, prepare, compile, check-production, review-evidence, check-creative, css, studio, render [--frames=START-END], verify, export, check-9x16 [file], smoke, reset [--apply] [--discard-unfinished]');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
