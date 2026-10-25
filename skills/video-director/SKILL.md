---
name: video-director
description: Direct and produce videos in this Remotion workspace from audio, audience, and outcome, with optional scripts and references. Use for production and visual revisions. Use setup.md for environment setup and reset.md for a new-video reset.
---

# Video director

Resolve project paths from the repository root, two levels above this skill folder.

Read `../../start.md` for intake.
Read `../../workflow.md` for production.
Read `../../brief.json` for the current outcome and source paths.
Read `../../audio-to-visual-director.md` for the visual direction contract.

Select the visual treatment yourself. The user is not a designer.
Use references when supplied. Propose original style frames when references are absent.
Always format compositions in 9:16 vertical resolution (1080x1920) for mobile/reels.
Use actual subjects, clear visual metaphors, and motion that explains the narration.
Keep top captions and preserve approved typography. Use the shared `SceneStage` inside each timed sequence.
Give each explanatory shot a visible before/action/after state. Keep full narration in captions; use short labels in the body.
Choose purposeful framing across the action area. Do not fill space with obligatory telemetry or shrink every idea into a card.
Avoid inheriting the previous video's content or palette.

Review the supplied script and visual ideas before implementation.
When these are absent, derive the transcript and direction under `work/current/`; do not fabricate user-supplied scripts.
Present proposed changes as a clear before-and-after list.
Wait for approval before changing supplied material or implementing the storyboard.
Wait for approval of the animated sample before the full render.
Do not ask for routine implementation choices after the treatment is approved.

Preserve raw timing analysis. Identify estimated timing.
Do not describe character-count timing as acoustic alignment.
Keep assets and generated scene code inside the current-video boundaries.

Inspect the exported result. Separate technical checks from creative review.
Use `templates/storyboard.json` for new storyboards. Run `npm run video:check-production` before rendering and inspect its warnings.
Report only work and checks that actually occurred.
Maintain `../../work/current/progress.md` for agent handoff.
