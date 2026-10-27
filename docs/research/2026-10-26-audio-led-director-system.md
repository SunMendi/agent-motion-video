# Audio-led director system revision

Date: 2026-10-26. Scope: reusable project instructions, production helpers, templates, and tests. No current-video reset, scene rewrite, narration edit, or replacement export was performed.

## Audit findings

The requested `exports/ai-security-thread.mp4` is not present. The matching export is `exports/ai-security-threat.mp4`: 100.651 seconds, 1080×1920, 30 fps.

Inspected the encoded-media [contact sheet](evidence/2026-10-26-system-audit/contact-sheet.png) and [model-section action sequence](evidence/2026-10-26-system-audit/model-action-sequence.png). The sequence contains exact frames at 14, 16, 18, 20, 22, and 24 seconds, ordered left to right and then down. [Sampling details](evidence/2026-10-26-system-audit/index.json) distinguish these from the contact sheet's approximate sampling centers.

The body repeatedly occupies a shallow central band. Large empty regions separate it from the top captions and the bottom of the stage. Headlines paraphrase the narration while tiny interface text competes for attention. The named-model introduction is a small incident label over a reconstructed GitHub panel rather than a clear product identity shot. Across the six sampled frames, that panel's essential content stays the same; slow scaling provides little explanation of the narrated sequence. Code inspection also found an unused typing-progress variable. These observations support the user's critique; they are not a complete audiovisual review.

The existing storyboard gives each long shot one early event and declares full-stage bounds. Those declarations describe neither actual occupied space nor the later semantic changes. A nonempty style-frame/animatic file and a structurally valid event could pass without evidence that the actual render was inspected. Reconstructed code and apparent poll results also need clear provenance or illustrative labeling.

The old `autopilot.py` bypassed the intended creative process. It selected an archetype from keywords, grouped phrases around a fixed duration, inserted generic labels and empty asset lists, marked automatic transcription reviewed, and marked the project ready without implementing the promised scene routing. It also set input-change consent to false, conflicting with brief validation. The analyzer converted keyword categories into prescribed themes, springs, and cut intervals. More adjectives in the prompt would not repair these shortcuts.

## Reusable behavior now required

The coding agent follows this loop: understand the recording → review timing → map meaning beats → resolve subjects and acquire assets → choose art direction → board and animatic → implement asset actions → inspect a representative sample → render → inspect and critique actual evidence → revise failed shots → verify and export.

The director contract now requires specific subject decisions before coding. A named model should be identified with its correct name and publisher plus an appropriate authentic identity asset or product capture when available. Invisible mechanisms can use illustrations. Type-led identity is an explicit, reasoned choice. This applies to future subjects; it is not a hardcoded Claude scene.

Top captions carry the narration. Body text has a small starting budget, with documented exceptions for real interface content or intentional typography. Actual screenshot text and JSX headings must also be reviewed. Subjects are composed at phone size. State changes must explain meaning at the relevant speech anchors. Decorative zoom, pulse, and entry springs do not establish explanatory action.

`creative_contract_version: 1` extends the existing version-2 storyboard with visual intent, entity representations, local asset references, and at least three distinct state keyframes. Production checks require these decisions and an asset manifest. Existing boards are not automatically relabeled or migrated.

`video:render` records the source fingerprint and final MP4 hash in `render-manifest.json`. `video:review-evidence` requires that matching manifest, extracts actual 360×640 frames at boundaries, state keyframes, and event progression, and writes a pending draft. The agent inspects the images and motion, then records text, framing, identity, and action findings for every shot in `creative-review.json`.

`video:check-creative` rejects missing, pending, failed, incomplete, or stale visual review evidence. Source changes, asset changes, media changes, and evidence-image changes invalidate the corresponding evidence. `video:export` runs this check before media verification and export. Unavailable direct listening remains a warning and an explicit report limitation; it is never silently called passed. These commands verify evidence integrity and coverage, not artistic taste or the truthfulness of a self-authored review.

`video:autopilot` now prints the complete production task for the coding agent without mutating active files. The agent executes the workflow autonomously. The standalone Python command is a handoff helper, not a creative model or a finished-video generator. The analyzer retains transcript-derived metrics and advisory keyword hints but no longer prescribes a design. Optional shared palette/type/spring tokens no longer claim certification, and their layout alias derives from `video-layout.json`.

The local director skill no longer asks for storyboard or sample approval. Only changes to supplied narration, audio, or visual instructions require permission. Instructions and reset templates carry these rules into the next video. The current video and existing exports remain available.

## Validation

- `npm run video:test`: passed 24 Node cases and 4 timeline cases. Includes actual FFmpeg encoding/frame extraction, pending-review rejection, source/render/evidence invalidation, text and entity requirements, and reset preservation. FFmpeg subprocess execution required an unsandboxed test run after sandbox restrictions blocked subprocesses.
- `npm run video:check-9x16 -- exports/ai-security-threat.mp4`: passed, exact 1080×1920.
- Video-director skill validation: passed.
- Modified JavaScript syntax checks, Python compilation, and `git diff --check`: passed.
- Focused TypeScript check for the modified shared design-token module: passed.
- Autopilot handoff smoke test and analyzer checks against the current reviewed and raw transcript formats: passed. These did not change the active brief or transcript.
- `npm run video:check-production`: intentionally rejects the unchanged existing storyboard for missing new creative decisions, state keyframes, and asset provenance. This is expected migration behavior, not a newly completed review of that video.
- Full project TypeScript check: blocked by six existing unused scene variables in the current video. Scripts/test TypeScript check: blocked by the existing `tests/motion.test.ts` import of the deleted current-video `motion-curves` module. These unrelated active-video files were not repaired in this system task.
- The focused Vitest run reports the existing Vite configuration-loader warning while passing.

## Remaining review limits

Direct auditory listening and complete continuous playback were not performed. Wording was inspected through the existing transcript; the visual audit used extracted frames and source code. Claims in the narration were not independently fact-checked. No new full video was produced, so future creative improvement still requires observing the next production through the revised loop. No automatic “top 1%” quality score is claimed.

## Primary process references

[Ordinary Folk's process](https://www.ordinaryfolk.co/process) separates message, design, animation, and audio, with storyboards and an animatic before finished movement. [Remotion's animation documentation](https://www.remotion.dev/docs/animating-properties) supports deterministic property animation. [Remotion's agent-skills documentation](https://www.remotion.dev/docs/ai/skills) provides the current official skill-installation command; no skills or packages were installed during this task.
