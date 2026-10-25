# Current-video production procedure

## Operating rules

The agent owns creative direction and implementation.
The user supplies the intended outcome and source material.
Use the current brief for every creative decision.
Read `audio-to-visual-director.md` for the creative contract. Use `src/shared/video-layout.json` for default stage coordinates. Do not create a second competing set of design rules.

Use the existing application project.
Write current-video scene code only under `src/video/`.
Keep reusable technical components under `src/shared/`.
Keep current-video assets under `public/current/`.
Keep production records under `work/current/`.

Do not modify legacy Rust or DevSolutions compositions for a new video.
Do not use their subject matter as new-video context.

## Stage 1. Inspect the inputs

Run `npm run video:doctor` without installation.
Run `npm run video:check`.

Read the outcome, audience, language, constraints, and budget.
Read script and visual-instruction files when supplied. Set absent paths to `null` in the brief. For audio-only intake, derive wording under `work/current/script.generated.md`; do not overwrite supplied files.
Measure the recording duration.
Compare the supplied script with the recording.
Identify missing names, incorrect facts, and unclear visual ideas.

Treat the audio as the timing source.
When supplied, treat the spoken script as the intended wording. Otherwise preserve the actual recorded wording in a derived transcript.
Report disagreements between them.
Do not silently replace either source.

Write the input findings in `work/current/review.md`.
Keep an implementation checklist in `work/current/progress.md`.

## Stage 2. Propose the design

Select a visual treatment that serves the story.
Make the selection yourself.

| Story need | Useful starting treatment |
|---|---|
| Explain a mechanism | Connected vector objects and focused camera movement. |
| Demonstrate software | Actual screenshots, recordings, and readable focus regions. |
| Explain records or transactions | Paper, labels, records, and physical objects. |
| Compare options | Simple diagrams, large labels, and supported metrics. |
| Present a product | Authentic product images and controlled camera movement. |

These are starting points, not fixed templates.
Use a different treatment when the story requires it.

If references exist, inspect frames and motion from those files.
If references are absent, create original style frames.
Do not require the user to find a reference video.

Define the background, colors, fonts, illustration treatment, top captions, and motion character. Preserve approved caption typography. Use the shared stage; secondary panels are optional and must explain something useful.
Always set canvas dimensions to 9:16 vertical format (1080x1920) for mobile/reels.
Use one main focal idea at a time.
Use narration for the full explanation.
Use display text for short labels and important conclusions.

Write `work/current/direction.md`.
Write `work/current/storyboard.json` using `templates/storyboard.json` as a format guide.
Create representative style frames under `work/current/review/`, including the hardest action.
Build a rough animatic of the full recording against the proposed boards and simple primary movement. Use it to review pacing before detailed production. Store its path and the style-frame paths in the storyboard.
Propose input changes as a clear before-and-after list.
Separate factual corrections from optional creative changes.

### Visual Direction Complete

Save the direction, frames, storyboard, and rough animatic in `work/current/`.
Proceed directly to timing finalization and production without stopping for manual approval.

## Stage 3. Review and finalize speech timing

Obtain initial acoustic timing during input review so the proposed storyboard and animatic use the recording. This stage finalizes timing after approved changes; do not plan all scenes against guessed text durations.

Import supplied timestamps when available.
Otherwise, run local speech analysis.
Run `video:prepare` once the recording and brief are ready. Copy the resulting `audioSha256` from project metadata into `audio_sha256` in the reviewed transcript. Re-review timing when the recording hash changes.

The project includes `scripts/transcribe-current.py` for initial Faster-Whisper analysis.
Use its `--help` option for the arguments.
It does not install packages or download a model until transcription starts.

Keep the untouched analysis in `work/current/transcript.raw.json`.
Keep reviewed timing in `work/current/transcript.reviewed.json`.
Use this word format:

```json
{"audio_duration": 12.3, "audio_sha256": "copy prepared audioSha256", "review_status": "reviewed", "review_notes": "Describe actual review and limitations.", "words": [{"id": "w001", "w": "Example", "s": 0.4, "e": 0.9}]}
```

Check transcription differences against the recording and script.
Review technical names and uncertain Bangla words.
Do not assume matching word counts between separate transcripts.
Do not calculate claimed speech timestamps from character counts.
Do not call speech-recognition timestamps exact measurements without review.

Record manually corrected and estimated regions in the review notes.
Use reviewed phrase captions when reliable word timing is unavailable. Store phrases as `{id, text, s, e}` entries under `phrases`; leave `words` empty. Keep speech IDs stable. Do not claim review from a generated flag alone.

Run `npm run video:prepare` after the inputs are ready.
This command measures audio and writes current composition metadata.
It does not approve a storyboard or certify caption timing.

## Stage 4. Prepare assets

Create layered SVG objects when parts need separate movement.
Use real product images or screenshots when appearance matters.
Use authentic brand marks when identity matters.
Use icons for interface labels, not every main visual.
Keep illustration proportions and detail consistent.

Use free assets or existing assets within the budget.
Use paid generation only when the brief authorizes it.
Do not assume the coding model can generate image files.
When image tools are absent, use suitable SVG, supplied images, or licensed assets.

Load font files from `public/fonts/`.
Check language coverage and actual font weights.
Keep font-loading completion synchronized with rendering.

Record file paths, sources, usage terms, and modifications in `work/current/asset-manifest.json`.
Do not label an approximate logo as an official vector.

## Stage 5. Complete the timed storyboard

Use schema version 2 from `templates/storyboard.json`. For each shot, record:

- The reviewed narration IDs and main viewer takeaway.
- The before/action/after visual states, representative keyframes with bounds, and a visual acceptance criterion.
- The visible subject and short display text.
- The required asset references.
- The entrance, main action, and exit.
- The relationship to the next shot.
- The transition duration and sound events.

Keep speech ranges separate from scene coverage.
Hold a visual through pauses when appropriate.
Account for transition overlaps without moving the narration.
Cover every frame from the start through the audio end with half-open intervals `[start_frame, end_frame)`.
Anchor visual events to reviewed speech IDs. Sound cues reference these event IDs. Keyframe positions are local to the shot; declared bounds use canvas coordinates. Asset and sound paths are project-relative source files.
Run `npm run video:compile` to write `work/current/timeline.compiled.json`. This validates timing and source files but permits missing style-frame/animatic evidence while planning. It does not authorize production. Use compiled frames for captions, actions, and sound; do not maintain separate guessed timing arrays.

## Stage 6. Render a representative sample

Implement the approved treatment in `src/video/MainVideo.tsx` and related current-video files.
Put `SceneStage` inside each timed `Sequence`, rather than relying on a centering wrapper outside the sequence. Import shared `TimedCaptions` and `TimelineAudio` once at composition level, using the compiled timeline. Convert project-relative audio paths to `public/`-relative paths for `staticFile`. Pass the brief’s music and SFX settings explicitly.
Use `eventProgress(event, absoluteFrame)` for compiled event progress; scene-local frames need the sequence start added. Pass `timeline.captionMode` to `TimedCaptions`; phrase timing uses one phrase per page. All these components live under `src/shared/` and survive reset.
Use `useCurrentFrame()`, `useVideoConfig()`, `interpolate()`, and `spring()` for rendered motion.
Use Tailwind for appearance and layout.
Use complete literal class names for Tailwind scanning.
Use inline styles for values that change with the current frame.
Do not use CSS animation, CSS transition timing, or wall-clock timers in exported scenes.

Select a representative 10–20 second range.
Include typography, a main asset, captions, a transition, narration, and sound.
Use object continuity when related shots share an object.
Render the actual sample with `npm run video:render -- --frames=START-END`.
Frame endpoints are inclusive.
The sample is written separately from the complete render.

Inspect sample frames and motion.
Inspect text at phone size.
Review the sound when available tools permit it.
Record any review that could not be performed.

### Automated Quality Gate

Run `npm run video:check-production` to verify all timing, captions, and layout bounds.
Proceed directly to the complete video render.

## Stage 7. Complete production

Implement all shots.
Vary framing when the explanation requires it.
Keep important text readable.
Keep captions separate from important visual actions. Keep full narration out of the scene body; use short labels and visible object actions. Choose a secondary area only when the explanation needs it.
Preserve Bangla character shaping.
Allow sufficient reading time.

Preserve the supplied voice recording.
Use sound effects for meaningful actions. Do not require an effect for every entrance; set cue durations and fades deliberately.
Use actual speech activity for music ducking.
Remove unnecessary repeated effects.
Do not mix the music twice.

Run `npm run video:check-production` before sample and complete renders. It checks declared geometry, not actual browser layout. Fix its errors and review warnings.
Run the project type checks and relevant tests.
Set `ready` to `true` in `src/video/project.json` after the approved composition is implemented.
This flag is a production state. It is not evidence of user approval or visual quality.
Render the complete video with `npm run video:render`.
The complete render is `work/current/final.mp4`.

## Stage 8. Verify the export

Run `npm run video:verify`.
This checks actual media metadata, duration, frame rate, codecs, loudness, and true peak.
Run `npm run video:check-motion` on the full render. Inspect any shot with three seconds of low body-stage motion and strengthen its explanatory action before delivery. This pixel check does not judge whether an animation is meaningful.
Run `npm run video:check-9x16` to verify that the rendered video adheres to the required 9:16 vertical format (1080x1920).
It does not prove creative quality or exact caption synchronization.

Inspect entrances, main actions, exits, and every scene boundary. Check actual phone-size frames for repeated body narration, tiny top-aligned artwork, unnecessary panels, and accidental dead space. Declared storyboard bounds are not proof of rendered geometry.
Check for missing images, fallback fonts, clipped text, and empty scene intervals.
Check phone-size readability and platform interface regions.
Compare preview and export at matching frames.
Check selected frames rendered independently and sequentially.
Review the complete motion and audio where tools permit it.

Add meaningful tests for timeline coverage and caption timing.
Do not use legacy passing tests as evidence for an untested new video.

Save the review evidence under `work/current/review/`.
Record actual commands and outcomes.
Keep automated measurements separate from visual and listening reviews.

## Stage 9. Deliver

Write `work/current/report.md` using `templates/report.md`.
Include actual changes, asset sources, check results, and limitations.
Identify every incomplete or unverified check.

Run `npm run video:export`.
The command verifies the media and copies the final MP4 and report into `exports/`.
It refuses to replace an existing export with the same video identifier.

Do not reset the project automatically after delivery.
Use `reset.md` when the user requests the next video.

