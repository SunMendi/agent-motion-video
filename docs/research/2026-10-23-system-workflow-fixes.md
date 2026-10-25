# Reusable video system changes

Date: 2026-10-23. Scope: shared instructions, intake, reset templates, scene layout, timing helpers, and production checks. Current video scenes, supplied inputs, exports, and approval records were not rewritten.

## What changed

1. Connected AGENTS.md and the video-director skill to audio-to-visual-director.md. start.md, workflow.md, and prompt.md now use the same creative contract. The prompt file points to maintained instructions instead of duplicating a competing procedure.
2. Preserved the user's recent ban on repeated conversational body text and the useful motion-path/state-change approach. Removed mandatory cards, fixed archetypes, fixed shot lengths, obligatory telemetry, and effects on every entrance. The director must choose visible actions for the meaning of each shot.
3. Made spoken and visual scripts optional. Missing paths are null or omitted. Validation and input fingerprinting support audio-only briefs. Supplied files still receive normal validation and are never replaced by generated wording.
4. Added a shared 1080×1920 layout and SceneStage mounted inside each Sequence. Top captions and action bounds share one source. TimedCaptions loads the local Bengali font, uses deterministic highlighting, supports word or phrase pages, and hides during timing gaps instead of replaying the opening words.
5. Added TimelineAudio and pure timing helpers. Music ducking follows reviewed speech, including smooth anticipation/release and continuous timing across music loops. Sound effects use event timing, declared durations, and fades rather than a fixed truncation window. Supporting audio remains optional.
6. Added schema-version-2 storyboard and reviewed-transcript reset templates. Shots describe narration references, before/action/after states, representative bounds, visual events, continuity, and acceptance criteria. Raw ASR now produces stable IDs and an audio hash while retaining an unreviewed status.
7. Added video:compile and video:check-production. Captions, action frames, and sound frames derive from the same reviewed speech IDs. Recording hashes prevent stale timing from passing after a recording replacement. Compile can run before visual evidence exists; sample and complete renders require nonempty direction, style-frame, and animatic files.
8. Render now runs the production gate. Its checks cover frame coverage, known anchors, event/cue bounds, declared layout collisions, short-label warnings, obvious narration duplication in declared labels, referenced files, disabled SFX, and common render hazards. TypeScript syntax inspection avoids mistaking tutorial strings/comments for animation code. These checks cannot inspect actual browser geometry, judge a metaphor, establish listening quality, or authenticate a user approval.
9. Enforced exact 1080×1920 dimensions during intake and the media aspect check. Removed the legacy Tesla exception from the current verification command. Historical exports remain preserved.
10. Updated reset behavior and tests. Shared helpers, fonts, packages, setup records, skills, and exports survive reset. Reset is still only authorized when starting another video. The reset regression now compares restored files in an isolated fixture rather than incorrectly comparing templates against the user's active video.

## Maintained files

- Routing and instructions: AGENTS.md, start.md, workflow.md, prompt.md, audio-to-visual-director.md, reset.md, README.md, skills/video-director/SKILL.md.
- Runtime and commands: package.json, scripts/video-workspace.mjs, scripts/lib/video-workspace.mjs, scripts/lib/video-production.mjs, scripts/transcribe-current.py.
- Shared helpers: src/shared/video-layout.json, SceneStage.tsx, TimedCaptions.tsx, TimelineAudio.tsx, video-timeline.ts.
- Authoring/reset templates: templates/brief.json, templates/storyboard.json, templates/report.md, templates/active/MainVideo.tsx, script.md, visual-script.md, progress.md, storyboard.json, transcript.reviewed.json.
- Regression coverage: tests/workspace.test.mjs, tests/video-production.test.mjs, tests/video-timeline.test.ts, tests/helpers/video-stage-entry.tsx.

## Verification

- npm run video:test passed: 22 workspace/production cases and 4 timeline-helper cases. Cases cover audio-only input, stale recording hashes, missing/invalid timing, frame gaps, invalid event anchors, caption collisions, duplicate body narration, evidence requirements, audio settings, reset preservation, silent caption gaps, phrase fallback, deterministic seeking, and music envelopes.
- UI and scripts TypeScript checks passed after adding the shared font loader.
- Video-director skill validation passed.
- Transcription script syntax and template JSON parsing passed. ASR/model inference was not executed.
- A synthetic Remotion still rendered and was visually inspected with real Bengali font loading. It verifies the Sequence/SceneStage geometry and top-caption separation. Evidence: work/setup/video-stage-probe.png, a 360×640 scaled preview of a 1080×1920 test composition. It is a technical test, not the approved creative sample for the current video.
- npm run video:check passed for the current brief.
- The updated video:check-9x16 passed for the existing 1080×1920 final and intentionally rejected the 720×1280 reference, confirming exact-dimension enforcement.
- JavaScript syntax checks and git diff --check passed.
- npm run video:reset ran in preview mode only and showed the new restore templates. No active reset was applied.
- npm run video:check-production correctly rejected the current PHP storyboard because it uses the legacy schema. No migration, content approval, or new render is implied.

## How future videos start

Give the agent: “Follow start.md. Audio: [path or URL]. Outcome: [what viewers should understand/do]. Audience: [audience].” Scripts, visual ideas, and references are optional. The agent performs transcription/review, visual direction, boards, style frames, animatic, compilation, and sample preparation using the maintained workflow.

The user still reviews the storyboard and animated sample. These are the existing creative checkpoints, not extra technical decisions. Tests and flags do not replace approval.

For an older current video, use a new revision identifier if its previous identifier is already exported, prepare its metadata, and review a migration to schema version 2 before another render. Preserve the existing audio and user fixes; do not silently reinterpret old approvals as permission for a changed storyboard.

## Remaining limits

No new full video was rendered. Continuous audiovisual playback, listening, actual mixed-audio measurement, and a creative PHP sample were not performed for this system change. Real scene geometry and asset quality still require rendered inspection. Render speed was not benchmarked; no performance improvement is claimed. Vite reports an existing configuration-loader warning during the passing focused Vitest run.
