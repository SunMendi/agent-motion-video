# Start a video

Use this application for every video. Read `setup.md` only for environment setup, and `reset.md` when starting another video. Do not reset during a revision.

## User inputs

Supply the audio file and intended outcome. Add the audience when it is not obvious. Spoken scripts, visual instructions, and references are optional. The agent completes `brief.json`; the user does not need to write a visual script or choose design tools.

- Put recordings under `public/current/`.
- Set `script_file` and `visual_script_file` to `null` when absent. Otherwise name the actual supplied files.
- Keep supplied scripts under `input/` and references in the brief.
- Keep generated transcripts, timing, direction, boards, and review records under `work/current/`.
- Keep new scene code under `src/video/`; use shared components that survive reset.

## Agent prompt

```text
Read AGENTS.md, skills/video-director/SKILL.md, audio-to-visual-director.md, workflow.md, and brief.json.

My audio: [path or download URL]
My outcome: [what the viewer should understand or do]
My audience: [optional if already clear]

Inspect available tools without installation. Download supplied audio into public/current/ when needed. Complete the brief and validate inputs. Preserve my recording and supplied instructions.

Derive reviewed speech timing and a proposed visual direction. Understand the argument before choosing scenes. Flag uncertain words and unsupported claims. Propose content changes for approval.

Keep captions at the top and preserve approved typography. Follow the shared stage layout. Show meaningful objects and actions; do not repeat spoken sentences in body cards. Select the design yourself. Do not force every scene into a card, dashboard, or telemetry layout.

Create representative style frames, a timed schema-version-2 storyboard, and visual direction against my audio.

Compile the timeline and use shared SceneStage, TimedCaptions, and TimelineAudio components. Make routine implementation decisions. Run video:check-production and proceed directly to full render, media verification, and export.

Follow workflow.md for verification and delivery. Report checks actually performed, including visual and listening limitations. Maintain work/current/progress.md.
```

## Automatic safeguards

`video:check` accepts audio-only briefs and requires 1080×1920 output. `video:prepare` measures audio and fingerprints supplied inputs. `video:compile` derives caption, action, and sound frames from reviewed speech IDs. `video:check-production` validates the storyboard and inspects render hazards. `video:render` runs the production gate again.

These commands do not transcribe, choose good metaphors, listen, or approve work. The agent performs those workflow stages using available tools and the actual user review points.

Existing videos with an older storyboard remain intact. Before another render, review and migrate their storyboard to the current template. Do not automatically re-label old plans or approvals.
