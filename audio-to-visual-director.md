# Audio-to-visual direction

This is the scene-craft contract for new videos and visual revisions. `design-lead.md` owns strategy, format adaptation, role responsibility, and the worker handoff. `workflow.md` owns production order and approval boundaries. `templates/storyboard.json` owns the storyboard format. `src/shared/video-layout.json` owns layout defaults. Read these through AGENTS.md; the user should not need to restate them for every video.

## Intake and understanding

Accept the recording, audience, and intended outcome. Infer a draft audience/outcome when clear from the request; ask only about material ambiguity. Scripts, visual instructions, references, and brand assets are optional. Set absent script paths to `null` in the brief. Never overwrite supplied content with generated material.

Preserve the recording. Keep raw ASR in `work/current/transcript.raw.json`, reviewed timing in `work/current/transcript.reviewed.json`, and derived wording in `work/current/script.generated.md`. Retain uncertain regions and technical-name corrections. Use word entries `{id, w, s, e}` in seconds, or reviewed phrase entries `{id, text, s, e}` when word alignment is unreliable. Each entry needs a stable ID. Copy the prepared recording’s `audioSha256` into the transcript’s `audio_sha256`; the production gate rejects timing for a different recording. Set `review_status` to `reviewed` only after an actual timing review and describe its method in `review_notes`.

Summarize the argument before choosing visuals: premise, mechanism, consequence, contrast, and requested action. Identify names, quantities, and claims requiring verification. Label metaphor and illustrative interfaces; do not fabricate authentic software screens or exploit evidence. Propose factual corrections without silently changing speech.
Verify displayed statistics, quotes, and poll results from sources or supplied material. A decorative poll must not invent apparent audience results. Label reconstructions visibly when viewers could mistake them for captured evidence. Unsupported spoken claims remain flagged in direction; adding a realistic interface does not verify them.

## Direct what the viewer sees happen

### Decide from the recording before coding

Listen to the whole recording when audio tools allow it, then revisit uncertain names and major transitions. A transcript is evidence of wording, not evidence of listening or tone. If direct listening is unavailable, record that limitation and use ASR and measured timing without claiming auditory review.

In `direction.md`, map the argument into meaning beats. For each beat record reviewed speech IDs, what the viewer should understand, the specific subject, what the picture adds beyond captions, and the visible change. Choose boundaries from meaning; a caption chunk is not a shot. A keyword count, WPM estimate, theme preset, or spring configuration cannot select the treatment.

Choose a small visual vocabulary for this recording. Compare plausible treatments briefly and choose the one that makes the content most concrete. Use product imagery for product identity, screen recordings for actual software behavior, diagrams for invisible mechanisms, and editorial imagery or illustrations when they explain the subject. Mix treatments when the story benefits. Shared archetypes are optional parts, not scene defaults. Do not inherit a palette, dashboard, type scale, or visual vocabulary from the last video.

When the user supplies a reference video, inspect its actual frames and short action sequences before selecting the treatment. Identify its hierarchy, main asset types, amount of body text, reveal order, transitions, readable holds, and how a composition changes as information arrives. State what to adopt and what to adapt. A previous agent-selected treatment must not outrank the user's new reference. Keep reference subject matter separate from the current recording's claims.

Choose the simplest visual explanation for the audience. A name can use an identity reveal; a choice can use large compared objects and selection; a quantity can use an authored proportion; a mechanism can use a focused diagram. Do not turn every technical narration beat into a system schematic. Before adding a dashboard, port table, status pill, trial counter, or explanatory footer, identify the viewer question it answers. Remove it when the central picture and captions already answer that question.

### Resolve subjects and obtain assets

List important named entities and concrete objects in each shot's `entities`. Link each to the speech IDs where it matters and its representation. Identify products at their introduction, before using abstract diagrams to explain their behavior. For a named AI model, use the correct publisher identity and exact model name with a genuine product screen, official model page crop, or official identity asset where available. A model has no physical appearance; do not invent a model photograph or substitute a generic robot. Apply the same specificity to named apps, people, places, and physical products.

Verify uncertain identity and current product appearance from primary sources using available web/browser tools. Acquire suitable local assets under `public/current/`. Record `path`, `kind`, `source`, `usage_terms`, and modifications in `asset-manifest.json` under `assets`. Distinguish official identity, genuine capture, authored illustration, reconstruction, and generated image. Public availability does not establish permission; record actual usage terms or uncertainty. Review image assets at delivery scale before animating.

Use `authentic-asset` when real appearance or identity carries the explanation. Use `illustration` for authored subjects or abstract mechanisms. Use `typographic-identity` only when imagery is unavailable or type is the deliberate treatment. Document the reason for important named subjects shown without authentic assets. A logo plus short name can identify a model; subsequent action must explain its narrated behavior. Generated imagery can serve editorial illustration, never fabricated product evidence. Prefer existing assets or layered vectors when they suit the action.

For each meaning beat, decide what the picture explains beyond the subtitle. Specify a visible subject, initial state, timed action, resulting state, and connection to the next shot. Reject an explanatory shot whose only idea is a sentence entering a box.

Useful actions include transferring a request, comparing alternatives, tracing a path, revealing a mechanism, assembling parts, isolating a fault, and showing recovery. These are options, not a fixed set of templates. Use custom layered SVG, real imagery, diagrams, or authored type according to the content. Keep one clear focal point at each important moment.

Preserve the user's ban on procedural human puppets: no generated walk cycles, arm rigs, or cartoon faces as a default. Use objects or environments to explain the action. Human imagery supplied or specifically requested by the user needs its own appropriate treatment.

### Text and captions

- Captions stay at the top. Preserve approved Bengali typography and shaping.
- Full conversational narration belongs in captions. Body text is for short labels, essential metrics, brief emphasis, or actual interface content.
- Do not duplicate the spoken sentence in the body. Prefer one to four words per label; give necessary interface text enough time and scale.
- Keep essential display text: names, a short topic title when useful, meaningful figures, comparison labels, and a brief result. Large selective typography can carry a beat. The goal is to remove parallel paragraphs and metadata, not to eliminate all body type. A reference using a few cards for an actual choice does not justify a card around every subject.
- Default to at most three body labels and twelve body words visible in a shot. This is a workspace starting budget. Use `text_exception` to justify authentic interface content, a quotation, or a deliberate type-led beat. Inspect actual frames: unlisted JSX headings and text baked into screenshots still contribute to visual load. Remove headline paraphrases that compete with captions.
- Word highlights require reviewed word timing. Use reviewed phrase captions when needed. Keep the phrase stable through short gaps or hide it deliberately; never jump back to the opening words.

### Use the vertical canvas deliberately

Use shared layout values and put `SceneStage` **inside** the Remotion sequence. The sequence's absolute wrapper otherwise defeats centering applied only to its parent.

At 1080×1920, defaults put the caption at y=100 with a 160 px region and the action stage at y=320–1700, with 64 px left and 120 px right insets. These are workspace defaults, not a guarantee about every platform overlay. Check the target platform and phone preview. A taller caption needs a matching stage offset using the shared layout prop.

Compose large subjects and meaningful paths across this stage. A secondary detail area is optional and must answer a separate question. Do not require a console, telemetry inspector, extra card, or diagram merely to fill the lower half. Negative space should support attention rather than result from a tiny top-aligned subject.

Stage information progressively. Let one hero object occupy the focal area, then reposition or resize it as a second object, selection, or consequence arrives. Do not reserve three fixed rows for a header, a dashboard, and a summary. Judge the visual group as a hierarchy with the captions; do not optimize for maximum occupied pixels. A clean reference can use substantial negative space and still feel complete because its subject, emphasis, and timing are clear.

### Assets, pacing, and motion

Specify `visual_intent` for each shot: `added_information`, `framing`, and `motion_mechanism`. Design the dominant subject at phone size first. Frame it large enough to recognize; crop into meaningful details rather than fitting an entire desktop screen into a small panel. Describe the actual subject bounds at before/action/after keyframes, not the bounds of an empty stage wrapper. Use `negative_space_reason` when a deliberately shallow composition needs space. Do not fill the canvas with unrelated decoration.

Animate parts that carry meaning. A packet arrives, a boundary opens, a selected item changes state, a second identity splits from the first, or a result replaces an input. Entry springs, glow, particles, and perpetual zoom do not establish a mechanism. Anchor each meaningful change to the relevant speech ID, rather than revealing all outcomes at the start of a long shot. Long shots need evolving action or a documented reading/attention hold; do not add movement just to satisfy a pixel metric.

For mechanism animation, author the actors as separately controllable layers: the sender, packet, relay, boundary, account, connector, cache state, and receiver. A complete explanatory SVG loaded through `Img` is one static image; moving its wrapper cannot animate its internal parts. Use inline SVG groups, React objects, masks, or separately exported layers for the important state changes. Genuine screenshots and photographs can remain images, with deliberate crops and annotations. Count text inside asset files when judging readability and density. Reproducing a brand mark by hand does not make it an authentic source asset.

Prove the timing connection in the implementation. Pass the sequence start and compiled events through the scene router to each scene. Look up semantic event IDs and use `eventProgress(event, start + localFrame)` or an equivalent frame-derived helper. A declared storyboard event that never controls the rendered object is an unimplemented event. Avoid copying anchor frames into local timing constants, which drift when narration timing changes.

Plan foreground, subject, camera, and background separately. Define pivots, masks, contact points, easing, stagger, settle, and readable holds where they matter. Related shots should preserve object identity or use a purposeful match cut. Inspect the hardest subject/action and a transition in a sample before propagating the treatment.

Include meaningful attention changes in the motion vocabulary: stagger choices into view, dim an eliminated option, lift or outline the selected one, cross out an obsolete value, replace a value at the spoken cue, or move the same subject into a new comparison. These can explain more than extra moving connectors. Hold a resolved composition long enough to understand it. Do not require constant movement after the point has landed. Use a coherent transition vocabulary at story boundaries rather than identical spring entrances for all scenes.

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

Use an autonomous critique loop: render evidence, inspect it, identify the weakest shot, change its assets/composition/choreography, and inspect again. Review three questions per shot: Can the subject be recognized without reading a paragraph? Does the picture add meaning beyond captions? Does the important action occur when the voice describes it? Fix failed shots before delivery. Do not assign a quality score from keywords, spring math, render success, or self-written acceptance criteria.

Run `video:review-evidence` on the full render. It extracts actual 360×640 frames at shot states, event progression, and boundaries, and creates `work/current/creative-review.draft.json` with pending findings. It does not inspect the images. Review those files using image tools and motion playback or ordered frame sequences. Complete `creative-review.json` with per-shot text, framing, entity, and motion findings; record issues and their fixes. Record direct listening as passed, failed, or unavailable with a method and limitation. Never mark unavailable playback or listening as passed.

Run `video:check-creative` before export. It checks review coverage and binds evidence to the final media hash and production fingerprint, including scene code and assets. It cannot decide whether a claimed review is truthful or tasteful. Rerender and regenerate evidence after changes. `video:export` requires this review; drafts and stale evidence do not pass. Listening that is unavailable remains an explicit delivery limitation, not a silent pass.

Run `video:check-production` before sample and complete renders. It checks structural timing, event anchors, stage bounds, asset paths, and common render hazards. It cannot judge whether a visual metaphor is good or a mix sounds right.

Review the actual keyframes and playback at phone size: one focal point, readable captions, meaningful visual action, clear contact/continuity, no unintended empty intervals, and appropriate sound. Record the inspected frames, regions, and limitations. Successful rendering, aspect ratio, or a `ready` flag is not creative approval.

Review notes must describe the objects visible in their referenced frames and the actual change across the inspected interval. Record a concrete initial state, resulting state, and where the change occurs. Notes naming absent objects, generic “comfortable margins,” or a pulse added to defeat a static-motion warning cannot establish acceptance. Treat the review as failed when its descriptions disagree with its images. Check a frame sequence with captions covered so changing subtitles cannot conceal a static body. Diagnose a long unchanged interval before deciding whether it needs a purposeful hold, new action, or reframing. A full-stage wrapper is not evidence of a large subject.

Professional process references: [Ordinary Folk](https://www.ordinaryfolk.co/process), [Remotion animation](https://www.remotion.dev/docs/animating-properties), [Remotion sequencing](https://www.remotion.dev/docs/sequence). These inform the process; no “top 1%” score or automatic quality certification is claimed.
