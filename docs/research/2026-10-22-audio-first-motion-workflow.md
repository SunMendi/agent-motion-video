# Audio-first motion production: research and workspace audit

Date: 2026-10-22. Scope: the three user-supplied exports, current production architecture, and published professional practice. This is a research recommendation, not an implemented pipeline or a code-diff review. No production approval is implied.

## Main recommendation

Keep Remotion. Add a director stage that produces a reviewed transcript, meaning-based beats, a visual treatment, storyboard, and an audio animatic before detailed animation. Compile captions, visual actions, and sound from one timing source. More effects or more agents alone will not solve weak visual explanation.

The user should be able to supply only audio. Internally, the system must still understand, research, direct, design, animate, mix, and critique. Preserve the two existing approval points: proposed storyboard and representative animated sample. Preserve supplied narration and visual constraints unless changes are approved.

## Evidence from supplied exports

Measured using ffprobe, not copied from previous reports:

| Export | Duration | Resolution | FPS |
|---|---:|---|---:|
| tesla-flying-car-v1.mp4 | 81.771 s | 1920×1080 | 30 |
| php2shell-vulnerability-alert-v4.mp4 | 110.300 s | 1080×1920 | 30 |
| WhatsApp.mp4 | 41.620 s | 720×1280 | 30 |

Sixteen evenly spaced frames were extracted from each file. The sheets are in [audio-first-motion-evidence](audio-first-motion-evidence/). They support observations about composition and changes in visual state; they do not prove smooth animation, precise synchronization, or sound quality. The Tesla export is landscape. Future videos must follow the workspace's 1080×1920 requirement while retaining useful storytelling principles.

Tesla's sampled frames show specific explanatory objects: a car trajectory, balloon, air reservoir, height ruler, acceleration display, pressure indicator, and timeline. Its visual representations change with the concept. This is the useful reference principle; it does not require copying its palette or subject matter.

PHP v4 repeatedly uses outlined panels, diagram rows, headings, badges, captions, and small explanatory labels. These compete for attention at reduced phone size. The bank metaphor has a recognizable set, characters, envelope, and paper, but still retains several small labels around the action. A stronger treatment would isolate the important action and reveal detail only when needed. This is a creative judgment from sampled frames, not a claim that the full video is static or every label is unreadable.

WhatsApp is a filename, not an attribution to its creator. The reference shows a marketing explainer with large type, blue emphasis, coffee-price comparisons, watches, and a shirt discount. It demonstrates a clearer hierarchy and a smaller number of competing elements. Learn its hierarchy and progressive disclosure; do not assume permission to reuse its assets. Its toolchain cannot be identified from the MP4.

The visual specialist also inspected individual frames: PHP at 52.94 s shows the bank handoff competing with the top subtitle, background detail, and mapping labels; PHP at 86.03 s shows the patch announcement inside nested panels and status labels. The reference at 19.98 s emphasizes a selected watch with a green arrow/price while fading the alternative. These observations support simplifying attention and progressive disclosure. They do not establish motion or listening quality.

## Verified architecture gaps

1. **Audio-only input is not supported.** `start.md` requires both scripts. `scripts/lib/video-workspace.mjs:84` validates audio, spoken script, and visual script as required files; line 97 fingerprints all three. Add an explicit audio-only mode. Generated transcripts and visual scripts must be derived artifacts rather than fake user-supplied inputs.
2. **Timing sources disagree.** `work/current/transcript.reviewed.json` has 15 word timings ending at 6.56 s for 110.29 s of audio, followed by scene-level information. `src/video/scenesConfig.ts` independently defines caption and scene frames. Scene 8 begins at 93.8 s in the reviewed record versus frame 2729 (90.967 s) in code; scene 9 begins at 99.9 s versus frame 2907 (96.9 s). This proves conflicting records, not an audible sync error without playback.
3. **Captions do not consume reviewed timing.** `src/video/components/Captions.tsx` reads `ALL_PHRASES` from scene configuration. Updating the reviewed transcript does not regenerate captions.
4. **Actions have another timing source.** `src/video/scenes/Scene05BankHandoff.tsx` uses literal local frames for camera changes, contact, flap opening, and paper extraction. Anchor these actions to semantic events compiled from reviewed narration.
5. **Sound is disabled intentionally in this brief.** `brief.json` sets music and sound effects to false; `AudioMixer.tsx` plays only the voiceover. Future default sound direction must respect each brief. Do not treat this configuration as a mixer defect.
6. **The existing instructions already contain good creative requirements.** `workflow.md` calls for style frames, layered SVG, object continuity, meaningful sound, and review. The improvement is to make their outputs concrete, mandatory, and independently reviewable.

## What published professional practice supports

Ordinary Folk describes message discovery, visual treatment, storyboard, animation, and audio. Sound is considered throughout, with composers working from an animatic. [Studio process](https://www.ordinaryfolk.co/process)

School of Motion describes placing storyboards against voiceover/music and adding simple motion to evaluate pacing before detailed animation. [Project workflow](https://schoolofmotion.com/blog/guide-completing-motion-design-project)

BUCK's Coda project publishes early design exploration and separate strategy, storyboard, design, 2D/3D, editing, and sound credits. It is evidence of coordinated specialties, not a universal staffing requirement. [Coda case study](https://buck.co/work/coda-everything-evolves)

Ordinary Folk's published production teaching names Photoshop, Illustrator, Cinema 4D, and After Effects. Its public project files include AE and JSX rigs. These support reusable authored motion systems. They do not establish what created the user's reference. [Production course](https://schoolofmotion.com/courses/a-motion-design-masterpiece), [project files](https://www.ordinaryfolk.co/play)

There is no objective ranking here that certifies a “top 1%” workflow. These are documented practices from established studios and practitioner education. The architecture below is a synthesis for this workspace.

## Proposed production sequence

| Stage | Required artifact | Decision/check |
|---|---|---|
| Intake | Audio hash, duration, language, constraints | Preserve original audio; infer a draft audience/outcome and flag material ambiguity |
| Speech analysis | Raw transcript, reviewed words/phrases, uncertainty notes | Review names, numbers, Bangla/English switching; never invent acoustic timing |
| Content understanding | Argument summary, entities, claims, meaning-based beats | What does the viewer need to understand, feel, or do? |
| Research | Claim/source ledger | Separate spoken claims from verified facts; flag corrections without rewriting speech |
| Direction | Chosen treatment and visual grammar | Choose literal demonstration, evidence, diagram, or metaphor by communication need |
| Storyboard | Timed shot table and representative finished frames | Each shot must explain a specific relationship or change |
| Rough animatic | Full audio with boards and simple primary movement | Test pacing, holds, transitions, and comprehension; include in storyboard review |
| Approval 1 | Actual user approval tied to artifact versions | No detailed production before approval |
| Asset production | Layered asset files and manifest | Consistent geometry, silhouettes, typography, sources, anchors, states |
| Motion and sound | Compiled event timeline and cue sheet | Meaningful action; continuity; narration remains intelligible |
| Sample | Representative 10–20 seconds including hardest action | Inspect actual motion, captions, transition, voice, and sound |
| Approval 2 | Actual sample approval | No full render before approval |
| Finish | Full render, creative review, technical verification | Check whole video and all boundaries; export 1080×1920 |

## One timeline contract

Keep authoritative times in milliseconds. Store the audio SHA-256 and a schema version. Derive frame intervals once using a documented rounding convention and half-open intervals. Keep visual coverage distinct from speech boundaries so scenes can hold through pauses.

Each word or phrase needs: stable ID, spoken text, display text if different, start/end, timing source, and review status. Keep model scores separate from human review; do not call all scores calibrated confidence.

Each meaning beat needs: transcript IDs, purpose, viewer takeaway, relevant claims, and emotional role.

Each shot needs: beat IDs, visible subject, visual mode, before/action/after states, camera target, display text, caption region, assets, connection to next shot, and acceptance criteria.

Each action needs: stable event ID, a narration or previous-event anchor, offset, duration, object, and state change. SFX reference the same action ID. For example, paper contact triggers both the ownership transfer and the paper-contact sound.

Each asset needs: named movable groups, pivots, bounds, z-order, masks, attachment anchors, states, source, license, and phone-scale preview.

Suggested derived files under `work/current/`: `content-map.json`, `claims.json`, `transcript.reviewed.json`, `storyboard.json`, `asset-manifest.json`, `sound-cues.json`, and `timeline.compiled.json`. These are proposals, not files currently implemented.

## Asset and motion standard

SVG is a format, not a quality grade. Require a deliberate silhouette, consistent stroke/perspective, a controlled detail level, named layers, and clean contact points. Adobe's preparation guidance supports separating artwork into named groups/layers according to intended movement. [Prepare vector artwork](https://www.adobe.com/learn/after-effects/web/prepare-vector-for-animation)

Use authentic images or screenshots when identity matters, custom diagrams for mechanisms, and designed metaphor where it clarifies the content. Generated images may help with textures or illustrations; clean them up and verify them before production. Avoid automatically converting every noun into a stock icon.

Use a purposeful vocabulary: reveal, transfer, compare, trace, assemble, transform, isolate, resolve. Match easing, anticipation, settle, and secondary motion to the object and idea. An identical spring on every element is not art direction.

Remotion should retain deterministic, frame-derived animation. Avoid CSS transition timing in exports. Path morphing is available when a shape transformation communicates something useful. [Animation](https://www.remotion.dev/docs/animating-properties), [path interpolation](https://www.remotion.dev/docs/paths/interpolate-path)

For the bank example, maintain one logical envelope. Switch attachment from visitor hand to counter to receptionist while preserving world coordinates. Target the camera at the letter when its contents become important. The return to the real technical mechanism must distinguish the metaphor from evidence about the vulnerability.

## Speech and sound

Benchmark the installed Faster-Whisper setup on representative Bangla with English technical terms before adding tools. Faster-Whisper supports word timestamps and configurable VAD. [Official repository](https://github.com/SYSTRAN/faster-whisper)

WhisperX can add phoneme alignment, but language/model and dictionary coverage need validation. Do not assume English alignment quality transfers to Bengali or mixed-language names. If reliable word timing is unavailable, use reviewed phrase captions. [WhisperX documentation](https://github.com/m-bain/whisperX), [alignment model mapping](https://github.com/m-bain/whisperX/blob/main/whisperx/alignment.py)

Spot sound cues during storyboard/animatic work. Record their purpose, event anchor, source/license, gain, duration, fade, and priority. Use paper sounds for paper actions, a controlled confirmation for resolution, and silence where the narration needs attention. Do not put a whoosh on every caption. Prioritize speech, use short ducking envelopes when needed, and inspect both loudness and actual intelligibility. No fixed LUFS target by itself proves a good mix.

In a firsthand interview, Sono Sanctus describe auditioning music against picture, supporting voiceover, matching the story arc, and using Pro Tools and Soundly. Zelig publishes a process of sonic concepts, iteration, contextual testing, and delivery. These are useful models for deliberate sound direction. [Sono Sanctus interview](https://schoolofmotion.com/blog/sono-sanctus-podcast-podcast), [Zelig process](https://www.zeligsound.com/process)

Existing FFmpeg tooling can provide loudness measurement and sidechain processing. Fairlight is an optional finishing environment for editing and mixing against picture. [FFmpeg filters](https://www.ffmpeg.org/ffmpeg-filters.html), [Fairlight](https://www.blackmagicdesign.com/products/davinciresolve/fairlight)

## Tools and implementation order

Keep the installed Remotion, FFmpeg/ffprobe, fonts, and speech environment. Illustrator, Figma, or Inkscape are possible asset-authoring tools; After Effects is useful for hand-authored specialist motion; Cinema 4D or Blender is appropriate when actual 3D solves a visual need. A DAW/editor may help sound review, but adding all these tools is not a prerequisite. No installation was performed for this audit.

Implement in this order:

1. Audio-only intake, provenance, and complete reviewed timing.
2. Shared timeline compiler for captions, scenes, actions, and sound anchors.
3. Meaning-based director output, style frames, and full rough animatic.
4. Layered asset contracts and reusable motion primitives.
5. Sound cue planning and voice-first mix.
6. Independent creative review plus technical regression checks.

Use specialized agents for content/timing, direction, assets, motion, sound, and critique when useful. One director owns the final visual grammar. Every agent receives the same accepted content map and asset/timing contracts. More parallel agents should not produce conflicting styles or independent timestamps.

## Acceptance and coverage

Reject a shot if its visual purpose is only “looks futuristic,” its meaning depends on tiny labels, or its objects have no clear causal relationship. Evaluate phone-size hierarchy, factual/metaphorical clarity, caption dwell time, contact continuity, timing at important words, transition readability, and audio intelligibility. A scoring rubric is a review aid, not an automatic certificate of professional quality.

Completed: five specialist research/review tasks; current workflow and selected implementation inspection; metadata probing of all three supplied exports; sixteen-frame contact sheets per export; source-based timing comparison; primary-source research. `npm run video:check-9x16` passed for `work/current/final.mp4` after its bundled ffprobe required execution outside the sandbox.

Not completed: direct listening, uninterrupted audiovisual playback, frame-by-frame motion review, current security-claim verification, a new render, a prototype of the proposed pipeline, or new implementation tests. Contact sheets cannot establish these. The older export reports were read as historical claims, not accepted as proof of creative quality.

Production source, supplied audio, brief, storyboard, and approvals were not edited. Only this research report and its evidence copies were added.
