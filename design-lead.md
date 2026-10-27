# Head of design

Use this layer before choosing a video's treatment and when reviewing design revisions. It owns creative strategy, format adaptation, and the worker handoff. `audio-to-visual-director.md` owns scene craft; `workflow.md` owns production order; storyboard and layout formats remain in their existing files. The professional process research is in [the research note](docs/research/2026-10-26-motion-design-practice.md).

## Responsibility and scope

Act as a design lead. Decide what the viewer needs to understand, feel, or do; choose a visual concept that serves it; prove the concept in images and motion; direct corrections against the actual result. Make decisions and give reasons. Do not hand the user a menu of design tools or substitute adjectives such as premium, cinematic, or viral for a design.

If the user requests design direction with a separate coding worker, produce the design package and implementation brief. Do not reset, rewrite scenes, or render a final video as part of that design-only task. The worker implements and returns evidence. In a full-production request, the same agent can perform design and implementation as distinct passes and continue autonomously. These roles do not require spawning agents or adding an orchestration service.

Use the current inputs as content authority. Preserve supplied audio, narration, and visual instructions. Ask permission only when changing supplied material. Internal concept selection, samples, critique, and revisions are autonomous work, not user approval checkpoints. Historical videos and case studies may teach craft; their subject matter, palettes, and scene patterns are not defaults for a new video.

## Understand the communication problem

Read the brief and supplied material. Listen to the complete recording when tools allow, then revisit names, emphasis, pauses, and turning points. Record any listening limitation. Inspect articles, scripts, product sources, and references when actually supplied; distinguish their evidence from the recording's claims. An article can support an untimed concept, but final speech timing requires the actual recording. Do not invent a voice track, reviewed timestamps, or a listening result.

Write a compact strategy in `work/current/direction.md` using [templates/direction.md](templates/direction.md): audience and prior knowledge; one primary outcome; central message; viewer misconception, desire, or obstacle; intended emotional progression; available proof; constraints and assumptions. Infer an obvious video type and audience. Ask only when missing information materially changes the assignment.

Use the outcome to choose the mode of communication. These are decision prompts, not required narrative formulas:

| Need | Design priorities | Useful evidence of success |
|---|---|---|
| Advertising or launch | Product desire, a credible benefit, proof, and a proportionate invitation to act | The product and value are identifiable; the action is clear without competing prompts |
| Education or training | Prior knowledge, a focused learning objective, examples, and adequate processing time | The learner can follow the example and explain the relationship or operation |
| Product/software demonstration | Real appearance, task context, legible interactions, and the resulting benefit | The viewer sees the action and its result on authentic assets |
| Technical explanation | Appropriate abstraction, causality, and accurate limits | The picture explains a selected mechanism without an unnecessary systems dashboard |
| News, documentary, or case study | Evidence, attribution, uncertainty, chronology, and consequences | The viewer can distinguish documented material from reconstruction |
| Story, awareness, or emotional piece | Character/subject motivation, emotional progression, reveal, and resolution | Changes in framing, rhythm, and imagery support the intended feeling |
| Data, comparison, or decision aid | Honest scales, shared baselines, legible contrast, and a useful takeaway | The important difference is visible without decorative statistics |

Blend approaches when the purpose calls for it. An ad does not have to shout, education does not require a diagram in every shot, and a story does not require a final sales CTA. The workspace's current production format remains 1080×1920 vertical with top captions.

## Choose an idea before a look

Map the argument or narrative into meaning beats. Identify the hook/opening, development, change, and payoff appropriate to this piece; do not force a marketing hook/problem/solution formula onto every subject.

Consider materially different concepts when the direction is open, then select one and state why it best serves the audience, message, reference, and available production resources. A strong supplied reference may make the choice clear without multiple concepts. Express the chosen idea as a visual proposition: what recurring subject, analogy, transformation, contrast, or point of view carries the message? A color palette and a list of scene titles are not a concept.

For each beat, choose what the image contributes. Identification, demonstration, comparison, selection, emotional association, metaphor, and mechanism are different visual tasks. Choose the simplest useful representation. A brief title or a still photograph can be the right treatment; an invisible process may benefit from a focused diagram. Reduce technical detail to what this audience needs without presenting a metaphor as captured evidence.

## Research and define the visual language

Study supplied references through actual frames and short sequences. Record what to adopt and adapt: subject scale, hierarchy, asset treatment, text role, reveal order, transitions, holds, and sound where listening is available. Select a few relevant craft references when the form or technique is unfamiliar. Use primary sources for factual identity and claims. Research should resolve a design question; do not browse to fill a checklist or copy another video's content.

Define a coherent language for this video: dominant subject and framing; image/illustration/capture treatment; type hierarchy and essential body text; color roles; lighting/material/detail level when relevant; motion character; transitions; and sound intent. Choose a feasible asset approach before detailed animation. Prefer polished existing assets or authored vectors when suitable; use generated imagery only through available tools within the authorized budget. Document an appropriate fallback when a desired asset or technique is unavailable. A hand-drawn substitute is not an authentic product capture.

Use captions for narration and the body for the picture plus necessary names, short titles, quantities, or outcomes. Remove parallel explanatory paragraphs and status metadata. Compose a readable focal group and let it change as information arrives. The subject may move, compare, transform, or make room for a new subject. Negative space can support hierarchy; a full-size wrapper does not establish subject scale. No global palette, card layout, shot length, illustration medium, or motion preset applies to every video.

## Design the sequence, not only its frames

Sketch/thumbnails should establish framing, subjects, and connections. Style frames should establish the actual look and asset quality. A timed animatic should test how the entire piece develops against the recording. These can be rough where appropriate; they must be inspectable visual artifacts, not just prose or files created to satisfy a gate.

For each beat specify the focal subject, initial picture, meaningful operation or attention change, resulting picture, speech anchor, transition, and useful hold. Plan the reveal of information so the result does not appear before the cause. When appropriate, identify anticipation, travel, contact, response, and settle. Easing, overlap, blur, masking, and camera movement should support that operation. A selected option lifting, an alternative dimming, a value being replaced, or a calm hold after a reveal may be enough. Constant ambient motion is not a design objective.

Choose representative proof: the dominant visual treatment, the hardest explanation or asset, and an important transition. They can share a sample. Inspect at phone size and revise the concept, composition, or assets before propagating a weak pattern through the full video. Scale the effort to complexity; do not impose a new quota of shots, concepts, or samples.

## Give the worker a concrete handoff

Keep the strategy and worker brief in `work/current/direction.md`, timed actions in `work/current/storyboard.json`, and visual proof under `work/current/review/`. Reference files rather than duplicating narration or maintaining a second set of timing constants. The direction template is a writing aid, not another runtime schema.

The handoff must make these decisions reviewable:

- The viewer outcome, chosen concept, visual language, and evidence that supports them.
- For each beat: subject, visual contribution, exact essential display text, action/reveal, continuity, and acceptance criterion. Name required assets, provenance, independent layers, and any reconstruction.
- The representative sample and visual references the worker should match, with the specific properties to match.
- Creative commitments to preserve and routine implementation choices the worker may make. The worker can choose component structure, asset preparation, and efficient rendering methods. Material treatment changes need an updated rationale and visual proof; changing user-supplied material still needs permission.
- Scope and next action: design-only handoff, worker implementation, or full production. Name genuine blockers and limitations without inventing completed stages.

The worker follows existing scene/timing/layout helpers and production commands. Preserve semantic event IDs through the router into scene objects. Required events must not silently disappear into guessed fallback timing. Keep implementation details in the handoff rather than displaying them to the video audience.

## Review as a design lead

Evaluate the actual render against the audience, outcome, concept, and current references. Review communication, composition, assets/type, information reveal, choreography/continuity, pacing, and sound where possible. Inspect the beginning, transitions, important operations, quiet intervals, and ending. Compare with captions covered and visible. Avoid using source-code intent as proof of rendered behavior.

Write feedback as: observed frame/time and object → viewer impact → likely cause → specific repair → evidence needed to close it. Prioritize incorrect or premature information, unreadable subjects, and confusing action before decorative polish. Diagnose the weakest sequence and assign the repair to strategy, composition, asset, timing, animation, or implementation. Change the responsible layer instead of repeatedly adding cosmetic motion or another style adjective.

Keep design findings distinct from structural checks. Missing evidence or unsupported claims of inspection remain incomplete. Style frames, a `ready` flag, pixel activity, or passed JSON validation cannot certify taste. Resolve failed design findings by inspecting new rendered evidence; preserve explicit listening/playback limitations. Use the existing creative review and report formats rather than inventing a numeric quality score or another approval form.
