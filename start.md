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
Read AGENTS.md, skills/video-director/SKILL.md, design-lead.md, audio-to-visual-director.md, workflow.md, and brief.json.

My audio: [path or download URL]
My outcome: [what the viewer should understand or do]
My audience: [optional if already clear]
My video type: [optional; infer from outcome]
My reference: [optional; inspect if supplied]

Inspect available tools without installation. Download supplied audio into public/current/ when needed. Complete the brief and validate inputs. Preserve my recording and supplied instructions.

Listen to the recording using available audio tools. Record listening limitations explicitly. Derive speech timing and review it; never label untouched ASR as reviewed. Understand the argument before choosing scenes. Flag uncertain words and unsupported claims. Propose content changes for approval.

First act as the design lead: choose the communication strategy and visual concept for this audience and outcome. Write the strategy, reference findings, visual language, beat map, and concrete worker brief in work/current/direction.md using templates/direction.md as a guide. Infer the video type; do not use a fixed ad formula, diagram layout, or previous video's style for every request. If I ask for design-only work with a separate worker, complete the design handoff and keep scene implementation with that worker.

Keep captions at the top and preserve approved typography. Follow the shared stage layout. Show meaningful objects and actions; do not repeat spoken sentences in body cards. Select the design yourself. Do not force every scene into a card, dashboard, or telemetry layout.

Map meaning beats to named entities, specific assets, and visible state changes. Research subjects that need authentic identity. Choose composition and motion for each beat. Create representative style frames, a timed schema-version-2 storyboard with creative_contract_version 1, and visual direction against my audio. Review the full rough animatic before detailed animation.

Compile the timeline and use shared SceneStage, TimedCaptions, and TimelineAudio components. Make routine implementation decisions. Run video:check-production and proceed directly to full render, media verification, and export.

Follow workflow.md for verification and delivery. Extract actual render evidence with video:review-evidence. Inspect phone-size composition and action sequences, complete creative-review.json, repair failed scenes, and run video:check-creative before export. These are autonomous review passes; do not stop for design approval. Report checks actually performed, including visual and listening limitations. Maintain work/current/progress.md.
```

## Automatic safeguards

`video:check` accepts audio-only briefs and requires 1080×1920 output. `video:prepare` measures audio and fingerprints supplied inputs. `video:compile` derives caption, action, and sound frames from reviewed speech IDs. `video:check-production` validates the storyboard and inspects render hazards. `video:render` runs the production gate again.

These commands do not choose good metaphors or listen. The coding agent performs those workflow stages and continues autonomously. `video:autopilot` prints this agent task; it does not generate a finished video by grouping captions. User permission is needed for changes to supplied material.

Existing videos with an older storyboard remain intact. Before another render, review and migrate their storyboard to the current template. Do not automatically re-label old plans or approvals.
