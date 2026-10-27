# Agent Motion Video

> An open-source workspace for coding agents to generate motion graphics videos with Remotion.

## Reusable workspace

Use [setup.md](setup.md) to check the environment before installation.
Use [start.md](start.md) to start a video with any coding agent.
Supply audio, audience, and outcome. The agent fills in [brief.json](brief.json); scripts and visual ideas are optional.
The [design-lead layer](design-lead.md) chooses the communication strategy and visual concept for each video, then briefs and reviews the worker. It supports different purposes such as advertising, education, demonstration, documentary, and storytelling without assigning them one fixed visual template. Use [templates/direction.md](templates/direction.md) for the current direction and worker handoff. Design-only scope keeps scene implementation with the user's worker.
Creative direction follows [audio-to-visual-director.md](audio-to-visual-director.md). Captions stay at the top. Shared stage, caption, audio, and timing helpers survive reset.
Run `npm run video:compile` to derive the timeline from reviewed speech IDs.
Run `npm run video:check-production` before rendering; the render command runs this gate too.
The coding agent chooses specific subjects and assets from the recording, directs their actions, and reviews the actual render. After rendering, run `npm run video:review-evidence`, inspect its phone-size frames and action sequences, and complete `work/current/creative-review.json`. Run `npm run video:check-creative` before export. Export requires current review evidence; this is an autonomous critique stage, not a user approval checkpoint.
`npm run video:autopilot -- --audio PATH --outcome TEXT` prints the task for the coding agent. It does not fabricate reviewed ASR, choose scenes from keyword presets, or claim to implement scene code.
Use `--role design` for a head-of-design handoff, `--role worker` to implement the current direction, or the default `--role production` for both passes. Optional `--video-type` and repeatable `--reference` arguments provide context without selecting a fixed template. The helper prints instructions; the coding agent executes them.
Older storyboards need a reviewed migration to schema version 2 before another render. Existing exports are kept.
The agent follows [workflow.md](workflow.md) after the review steps.
Use [reset.md](reset.md) for the next video in the same project.

Run `npm run video:doctor` to inspect missing requirements without installation.
Run `npm run video:test` to test the workspace controls without new dependencies.

The `video:*` commands use a separate Remotion entry point in this application.
The existing Rust and DevSolutions compositions remain available through the original commands.

The sections below describe the original DevSolutions ad factory.

Turn a voice file plus a word-timing JSON into a word-synced Bangla video ad in three sizes.
Built on [Remotion](https://remotion.dev). Everything runs on this machine. No cloud, no cost.

The first ad in here: **DevSolutions BD** — an AI agent for Bangladeshi online news portal owners.

## Commands

```bash
npm run align -- <name>          # snap word timings onto the real pauses of the audio
npm run music -- <name>          # generate the music bed under the voice
npm run ad -- <name>             # render the 9x16 video
npm run ad -- <name> --all       # render 9x16, 1x1 and 16x9
npm run ad -- <name> --no-music  # render without the music bed
npm run check -- <name>          # verify duration, size and codecs of the outputs
npm test                         # all tests, including text fitting against the real font
npm run snapshots                # compare rendered frames against the stored baselines
npm run snapshots:update         # accept a new look on purpose
npm run studio                   # open the visual editor in the browser
npm run new-ad -- <name>         # scaffold the files for the next ad
```

Output files land in `out/`. The ad length always equals the voice length. For this ad: 37.92 s.

The look is light and clean. Each scene shows a product mockup built in code: browser
windows, news pages, AI panels, audio players, trending cards, Facebook posts. Real
product screenshots can replace the mockups later. Drop them into `public/screens/`.

The music bed is a soft pad made with ffmpeg. It sits 20 dB under the voice and never
changes the length. If it sounds wrong, render with `--no-music`.

## How an ad is built

1. `briefs/<name>.raw.json` holds one entry per spoken word: text plus start and end time.
2. `npm run align -- <name>` listens to the audio, finds the real pauses, and rewrites the
   timings onto them. It writes `briefs/<name>.timing.json`. It fails loudly if the timings
   are too far from the audio.
3. `briefs/<name>.json` is the brief: product name, call to action, logo setting, and one
   `scenes[]` entry per beat with its copy.
4. `npm run ad -- <name>` renders the video and normalises the loudness to -14 LUFS.

## Making a new ad

1. Record the voice. Put the file in `public/audio/<name>.wav`.
2. Run `npm run new-ad -- <name>`. It writes a brief template and an empty raw timing file.
3. Transcribe the audio with word timings (any tool that gives word start and end times).
   Fill them into `briefs/<name>.raw.json` as
   `{"word_bangla": "...", "start_time": 0.0, "end_time": 0.4}`.
4. Write the copy in `briefs/<name>.json`. One `scenes[]` entry per beat.
   - `type` is optional. It picks the layout: hook, problem, feature, question, stat, promise, cta.
   - `segments: 2` on a scene means it covers two audio pauses. Use it when the voice stops
     mid-sentence. The counts must add up to the number of pauses, or the build fails.
   - `layout` is optional. It picks a special layout for that scene: longread or trending.
     Use it when two scenes share the same `type` but need different visuals.
5. Run `npm run align -- <name>`, then `npm run music -- <name>`,
   then `npm run ad -- <name> --all`, then `npm run check -- <name>`.
6. Register the ad in `src/briefs.ts` so the compositions appear in the studio.

## Rules the factory enforces

- The video length equals the audio length, rounded to whole frames at 30 fps.
- Scene cuts land on real pauses in the voice, not on guessed times.
- Captions switch exactly when the spoken word starts. The spoken word is highlighted.
- No text may exceed the safe width. Long lines wrap. Wrapping is measured with the real
  font file, in tests, and with the browser, at render time.
- Captions never exceed two lines. A scene that would need three fails loudly.
- Bangla conjuncts stay whole. The font is Noto Sans Bengali, loaded from `public/fonts/`.
- The logo always sits on a white plate, because the logo file is a JPG on white.
- Every rendered frame is checked against a stored baseline. A changed look must be accepted
  on purpose with `npm run snapshots:update`.

## Files

```
briefs/            brief, raw timings, aligned timings
public/audio/      voice files and generated music beds
public/brand/      logos
public/fonts/      Noto Sans Bengali Regular and Bold
public/screens/    optional product screenshots (empty for now)
scripts/           align, music, render, check, snapshot, new-ad
src/               the composition: scenes, mockup parts, timing engine, brand constants
tests/             unit tests plus the stored snapshot baselines
out/               rendered videos and stills (not committed)
```

## Licence note

Remotion is free for individuals and companies up to three people, including commercial use
and automation. From four people the company needs a paid Company Licence. Check
[remotion.dev/license](https://www.remotion.dev/license) before the team grows.
