# Audio-to-visual direction

This is the creative contract for new videos and visual revisions. `workflow.md` owns production order and approvals. `templates/storyboard.json` owns the storyboard format. `src/shared/video-layout.json` owns layout defaults. Read these through AGENTS.md; the user should not need to restate them for every video.

## Intake and understanding

Accept the recording, audience, and intended outcome. Infer a draft audience/outcome when clear from the request; ask only about material ambiguity. Scripts, visual instructions, references, and brand assets are optional. Set absent script paths to `null` in the brief. Never overwrite supplied content with generated material.

Preserve the recording. Keep raw ASR in `work/current/transcript.raw.json`, reviewed timing in `work/current/transcript.reviewed.json`, and derived wording in `work/current/script.generated.md`. Retain uncertain regions and technical-name corrections. Use word entries `{id, w, s, e}` in seconds, or reviewed phrase entries `{id, text, s, e}` when word alignment is unreliable. Each entry needs a stable ID. Copy the prepared recording’s `audioSha256` into the transcript’s `audio_sha256`; the production gate rejects timing for a different recording. Set `review_status` to `reviewed` only after an actual timing review and describe its method in `review_notes`.

Summarize the argument before choosing visuals: premise, mechanism, consequence, contrast, and requested action. Identify names, quantities, and claims requiring verification. Label metaphor and illustrative interfaces; do not fabricate authentic software screens or exploit evidence. Propose factual corrections without silently changing speech.

## Direct what the viewer sees happen

For each meaning beat, decide what the picture explains beyond the subtitle. Specify a visible subject, initial state, timed action, resulting state, and connection to the next shot. Reject an explanatory shot whose only idea is a sentence entering a box.

Useful actions include transferring a request, comparing alternatives, tracing a path, revealing a mechanism, assembling parts, isolating a fault, and showing recovery. These are options, not a fixed set of templates. Use custom layered SVG, real imagery, diagrams, or authored type according to the content. Keep one clear focal point at each important moment.

Preserve the user's ban on procedural human puppets: no generated walk cycles, arm rigs, or cartoon faces as a default. Use objects or environments to explain the action. Human imagery supplied or specifically requested by the user needs its own appropriate treatment.

### Text and captions

- Captions stay at the top. Preserve approved Bengali typography and shaping.
- Full conversational narration belongs in captions. Body text is for short labels, essential metrics, brief emphasis, or actual interface content.
- Do not duplicate the spoken sentence in the body. Prefer one to four words per label; give necessary interface text enough time and scale.
- Word highlights require reviewed word timing. Use reviewed phrase captions when needed. Keep the phrase stable through short gaps or hide it deliberately; never jump back to the opening words.

### Use the vertical canvas deliberately

Use shared layout values and put `SceneStage` **inside** the Remotion sequence. The sequence's absolute wrapper otherwise defeats centering applied only to its parent.

At 1080×1920, defaults put the caption at y=100 with a 160 px region and the action stage at y=320–1700, with 64 px left and 120 px right insets. These are workspace defaults, not a guarantee about every platform overlay. Check the target platform and phone preview. A taller caption needs a matching stage offset using the shared layout prop.

Compose large subjects and meaningful paths across this stage. A secondary detail area is optional and must answer a separate question. Do not require a console, telemetry inspector, extra card, or diagram merely to fill the lower half. Negative space should support attention rather than result from a tiny top-aligned subject.

### Assets, pacing, and motion

Design an asset's silhouette, proportions, perspective, strokes, states, layers, pivots, and attachment anchors before animating it. SVG validity alone does not establish illustration quality. Use authentic identity assets when needed and record source/license information.

Choose boundaries from meaning and refine them using reviewed speech and pauses. Do not force every shot to last 2.5–4.5 seconds or require silence for every visual cut. A continuous shot can contain several meaningful state changes. Preserve readable holds and object continuity.

Use `useCurrentFrame()`, `useVideoConfig()`, `interpolate()`, and `spring()` for deterministic motion. Do not use CSS transitions, CSS keyframes, wall-clock timers, or unseeded randomness. Give anticipation, contact, settle, and camera movement a communication purpose. Continuous zoom, breathing glow, and identical bounce are not required. Prefer transforms/opacity and profile large filters or repeated vector detail before optimizing them.

### Sound

Respect the brief's music and SFX switches. Spot cues by semantic action and contact events, not by every caption or panel entrance. Intentional silence is valid. Keep a small coherent sound palette and record source/license, gain, duration, fade, and purpose. Anchor cues to storyboard event IDs.

Use speech activity to control supporting music and smooth its envelopes. Do not truncate every effect to one fixed duration. Listen to the encoded mix; measurements cannot establish intelligibility. Workspace delivery checks target -16 to -14 LUFS and true peak no higher than -1 dBTP. These are local targets, not universal platform rules.

## Required creative outputs

1. `work/current/direction.md`: content understanding, chosen visual grammar, caption treatment, asset approach, sound direction, and claims/uncertainties.
2. `work/current/storyboard.json`: schema version 2, complete half-open frame coverage `[start_frame, end_frame)`, reviewed narration references, before/action/after states, staged keyframes, short body labels, timed events, continuity, and acceptance criteria. Start from the shared template. Events reference transcript IDs plus frame offsets; derive their frames from that source.
3. `work/current/review/`: representative style frames, including the hardest action, and a full rough animatic against the recording. Review pacing before detailed asset animation.

Produce these creative artifacts and proceed directly into timeline compilation, Remotion scene implementation, automated production checks, full rendering, and export without stopping for manual approval checkpoints.

### Timing fields

An event has `id`, `anchor_id`, optional `anchor_edge` (`start` or `end`, default `start`), optional `offset_frames` (default 0), positive `duration_frames`, and a visible `action`. The anchor must be one of the shot's `narration_ids`. The compiler derives absolute event frames; keyframe `frame` values are local to the shot.

An optional sound cue has `event_id`, project-relative `file` under `public/`, `purpose`, linear `gain` from 0 to 1, and positive `duration_frames`. Optional `offset_frames` and `fade_out_frames` default to 0. Keep gain, source duration, and fade deliberate. The event anchors the cue; do not copy a guessed scene-start time.

`video:compile` writes `timeline.compiled.json` from reviewed timing and the storyboard. It can run before style frames and an animatic exist; `video:check-production` and rendering require those evidence files. Import the compiled timeline into scene code and use the shared helpers; no application service or new project is needed.

## Review gates

Run `video:check-production` before sample and complete renders. It checks structural timing, event anchors, stage bounds, asset paths, and common render hazards. It cannot judge whether a visual metaphor is good or a mix sounds right.

Review the actual keyframes and playback at phone size: one focal point, readable captions, meaningful visual action, clear contact/continuity, no unintended empty intervals, and appropriate sound. Record the inspected frames, regions, and limitations. Successful rendering, aspect ratio, or a `ready` flag is not creative approval.

Professional process references: [Ordinary Folk](https://www.ordinaryfolk.co/process), [Remotion animation](https://www.remotion.dev/docs/animating-properties), [Remotion sequencing](https://www.remotion.dev/docs/sequence). These inform the process; no “top 1%” score or automatic quality certification is claimed.
