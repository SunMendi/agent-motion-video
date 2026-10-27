# Reusable video workspace

Read [start.md](start.md) when the user starts a video.
Read [setup.md](setup.md) when the user requests environment setup.
Read [workflow.md](workflow.md) during production.
Read [design-lead.md](design-lead.md) before choosing the creative concept, briefing a worker, or reviewing design.
Read [audio-to-visual-director.md](audio-to-visual-director.md) before directing scenes, including revisions.
Read [reset.md](reset.md) when the user starts another video.

## Working rules

- Use one application project for all videos.
- Check existing tools before installation. Install only missing or incompatible requirements.
- Never install tools as part of a video reset.
- Use `brief.json` as the current video brief.
- Read only the current input files for creative context.
- Select the design. Do not require design expertise from the user.
- Use the design-lead role to choose the communication strategy and treatment for the current audience and outcome. Adapt across video types; do not inherit a universal scene template.
- Accept audio with audience and outcome. Spoken scripts and visual ideas are optional. Keep derived transcripts and direction under `work/current/`.
- Keep captions at the top. Use `src/shared/video-layout.json` and `SceneStage` for layout; do not repeat the narration as body text.
- Direct visible actions and state changes. Choose a treatment for the content; cards, telemetry, and icons are optional.
- Map narration beats to specific subjects, sourced assets, and causal actions before coding. Read the creative contract in `audio-to-visual-director.md`.
- Inspect actual rendered evidence and resolve the creative review before export. A passing structural gate is insufficient.
- Run `npm run video:check-production` before rendering. Its structural checks do not certify visual or listening quality.
- Request permission before changing supplied narration, audio, or visual instructions.
- Execute full video production autonomously without stopping for manual approval checkpoints.
- Use short sentences and direct instructions in reports.
- State which checks ran. State which checks remain incomplete.
- Produce all new videos in 9:16 vertical canvas (1080x1920) for Reels/Shorts.
- Verify 9:16 aspect ratio with npm run video:check-9x16 after generation.

## Reset boundary

Only these paths belong to the active video:

```text
brief.json
input/
public/current/
src/video/
work/current/
```

Use `npm run video:reset` to inspect the reset list.
Use `npm run video:reset -- --apply` only when the user requests a new video.

Keep `exports/`, shared code, shared fonts, packages, skills, setup records, and speech models.
Existing Rust and DevSolutions files are legacy work. They are outside the reset boundary.
Do not use legacy content as the default design for another video.

## Skills

Read [skills/video-director/SKILL.md](skills/video-director/SKILL.md) for creative production.
Use the official Remotion skills when installed. See `skills/README.md` for the installation procedure.
If the agent cannot load skills, read the Markdown files directly.

## Commands

```text
npm run video:doctor       Check the environment without installation.
npm run video:check        Validate the current brief and input files.
npm run video:prepare      Measure audio and prepare composition metadata.
npm run video:compile      Compile reviewed narration, action, and sound timing.
npm run video:check-production  Validate the timed storyboard and inspect render hazards.
npm run video:review-evidence   Extract phone-size evidence from the final render.
npm run video:check-creative    Check render-bound creative review evidence before export.
npm run video:studio       Open the current composition in Remotion Studio.
npm run video:render       Render the current composition.
npm run video:verify       Inspect the actual rendered media file.
npm run video:check-9x16   Verify that the rendered video is 9:16 vertical format (1080x1920).
npm run video:export       Keep the verified final MP4 and written report.
npm run video:reset        Show the managed reset list without deletion.
npm run video:test         Test the reusable workspace commands.
```

These commands do not authorize changes to the user's script or design instructions.
