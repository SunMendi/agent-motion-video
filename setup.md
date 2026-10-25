# Environment setup procedure

## Purpose

Prepare this project on a supported laptop. Keep the same project for later videos.

Run setup only when requirements are missing or incompatible.
Do not reinstall working tools for each video.
This document does not install anything by itself.

## 1. Inspect the existing environment

Run this command from the project root:

```bash
npm run video:doctor
```

If Node.js is missing, install a supported Node.js LTS release first.
Prefer Node.js 24 LTS. Keep a compatible installed LTS release.

The command checks package versions, tools, skills, fonts, and the render browser.
It does not install packages or download models.
Use `--save` to save the check outside the active-video folders:

```bash
npm run video:doctor -- --save
```

Use these result labels in a setup report:

| Result | Meaning |
|---|---|
| Already available | The required item works without installation. |
| Installed | The agent installed a missing item. |
| Repaired | The agent corrected an incompatible item. |
| Unavailable | The item is missing, blocked, or unverified. |

A package directory alone does not prove that a tool works.
Check the exact failure before changing the environment.

## 2. Check laptop support

Identify the operating system and processor architecture.
Check the requirements for the installed Remotion version.
Use CPU rendering first. Reduce render concurrency when memory is limited.

Check these tools:

```text
node --version
npm --version
git --version
ffmpeg -version
ffprobe -version
```

Check Python with `python3 --version` on macOS or Linux.
Check Python with `py -3.11 --version` on Windows.
Keep another compatible Python version when speech analysis works.

Use official installation instructions when a system tool is missing:

- Node.js: https://nodejs.org/en/download
- Python: https://www.python.org/downloads/
- Git: https://git-scm.com/downloads
- FFmpeg: https://ffmpeg.org/download.html
- Remotion requirements: https://www.remotion.dev/docs/

The project can use its existing bundled FFmpeg and FFprobe binaries.
Test their filters before adding another installation.
Keep the selected binary paths in the setup report.

## 3. Check JavaScript packages

Inspect `package.json` and `package-lock.json`.
Keep installed packages when their versions are compatible.

For a copied project without dependencies, use:

```bash
npm ci
```

Do not run `npm ci` when the existing dependency tree is already complete.
It replaces that dependency tree.

The complete target package list is in `scripts/workspace-requirements.json`.
The current project may not contain all target packages yet.

| Group | Packages |
|---|---|
| Video | `react`, `react-dom`, `remotion`, `@remotion/cli` |
| Media | `@remotion/media` |
| Transitions | `@remotion/transitions` |
| Fonts | `@remotion/fonts` |
| Text | `@remotion/layout-utils`, `@remotion/captions` |
| Tailwind | `tailwindcss`, `@remotion/tailwind-v4` |
| Data | `zod` |
| Icons | `lucide-react` |
| Review sheets | `sharp` |
| Development | `typescript`, `tsx`, `vitest` |

Add only missing Remotion packages with `npx remotion add <package>`.
This command selects a version compatible with the installed Remotion packages.
Pin all Remotion packages to the same exact version.
Do not upgrade the complete project to resolve an unrelated missing package.

For example, if every listed package below is missing, use:

```bash
npx remotion add @remotion/fonts @remotion/layout-utils @remotion/captions @remotion/tailwind-v4 zod
npm install --save-exact sharp
```

These are installation examples. Do not execute them when the packages are already available.
Keep `@remotion/player` for the existing browser application.
Use Remotion Studio for the reusable current-video preview.

## 4. Check Tailwind

This project already has a Tailwind CLI build and a Vite integration.
The current-video commands compile `src/shared/workspace.css` before Studio or rendering.
That file explicitly scans the current-video and shared-component folders.
Do not edit `src/shared/workspace.compiled.css` by hand.

Run:

```bash
npm run video:css
```

Use this existing build route until the Remotion Tailwind integration is installed and verified.
If the agent adopts `@remotion/tailwind-v4`, configure the Remotion bundler too.
A Vite plugin alone does not configure the Remotion export.
Remove duplicate CSS processing only after the replacement passes the render test.

Use Tailwind for layout, spacing, colors, and typography.
Use Remotion frame values for animation.
Do not use `animate-*`, CSS transitions, or wall-clock timers in exported scene content.

Official integration: https://www.remotion.dev/docs/tailwind-v4/overview

## 5. Prepare local speech analysis

First, check for an existing compatible environment containing `faster-whisper`.
Keep that environment when it works. Record its Python executable path.

If no compatible environment exists, create one.

macOS or Linux:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install faster-whisper
```

Windows:

```powershell
py -3.11 -m venv .venv
.venv\Scripts\python.exe -m pip install faster-whisper
```

Use the multilingual `small` model initially.
Use `device="cpu"` and `compute_type="int8"` initially.
Enable word timestamps.
Review uncertain Bangla words and technical names.

The first transcription may download model files.
Keep the model cache between videos.
Record the working Python package versions after verification.

Official source: https://github.com/SYSTRAN/faster-whisper

## 6. Prepare skills

The local video-director skill is already part of this project.
Read `skills/video-director/SKILL.md`.
It does not require a marketplace installation.

Check for official Remotion skills before installation.
If missing, use the procedure in `skills/README.md`.
Do not reinstall skills for each video.

## 7. Prepare the render browser

Check for the browser managed by Remotion.
If missing, run:

```bash
npx remotion browser ensure
```

Install documented Linux system libraries when required.
Do not replace the managed browser with an arbitrary Chrome version.

## 8. Verify the environment

Run the workspace tests:

```bash
npm run video:test
```

Render the setup sample:

```bash
npm run video:smoke
```

The sample uses Tailwind, a local font, an image, generated audio, and frame-based motion.
The command writes its sample and verification results under `work/setup/`.
It does not change `brief.json` or the active video.

Inspect the exported sample frames.
Check that the font, image, styles, motion, and audio exist.
Record visual checks separately from automated media checks.

Run the saved readiness check again:

```bash
npm run video:doctor -- --save
```

Report any missing requirement accurately.
Do not describe an unperformed render test as passed.
