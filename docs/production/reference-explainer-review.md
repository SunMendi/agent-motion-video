# Design review: ai-security-reference-explainer

## Verdict and actual scope

Reviewed `exports/ai-security-reference-explainer.mp4`, SHA256 `3b6c06e9f72a51cc33ce4e5ab43627258ac9cc5a70c796b58c7da3e202f9b0c0`. It matches the current final media and render manifest. Metadata confirms 1080×1920, 30 fps, and 100.651 seconds.

Verdict: several implementation defects are repaired, but the visual treatment still misses the supplied reference. The worker enlarged interface containers and added more explanatory labels. The main illustrations remain small, much of the action is internal UI feedback, and the ending changes the narration's message.

Independently decoded and inspected 60 frames across all ten shots, including shot starts and ends. Cross-checked active source, event lookups, compiled timing, direction, and the worker's report. Verified hashes for all 162 existing review images. Evidence is under `docs/research/evidence/2026-10-26-reference-explainer-review/`; see [sampling](../research/evidence/2026-10-26-reference-explainer-review/samples.json), [audit facts](../research/evidence/2026-10-26-reference-explainer-review/audit.json), and [reference comparison](../research/evidence/2026-10-26-reference-explainer-review/reference-comparison.png).

Full continuous playback, frame-by-frame assessment of easing, direct listening, and independent verification of the narrated claims remain incomplete. No production files, recording, or export were modified by this review.

## Improvements to retain

- All required event lookups now resolve; the five missing bindings from the earlier motion rebuild are fixed.
- The code scene begins with benign code and inserts the disputed fragment at the declared event.
- The gauge progresses during its declared metric event instead of displaying the final large number throughout.
- The cable develops an actual visible gap, followed by the containment overlay.
- Frame-zero body content is visible. This is a technical improvement, although it does not require exposing all later information at once.
- The compiled timeline contains 12 sound cues. Listening is still required to judge their encoded mix and usefulness.

## Main remaining gaps

### 1. The ending changes the meaning: 89.4–100.6s

The narration asks whether AI is escaping control or whether the events are a timely warning, then invites comments and a follow. The body instead announces future AI security solutions and displays Sandbox, Code Audit, and Human Check. Those recommendations are not the narrated conclusion.

The reference's three cup cards represent actual narrated choices. Here the three-card shape has been copied into a segment with a different purpose. The active card rotates every 40 frames (about 1.33 seconds) independently of speech, so the repeated selection has no clear meaning.

Repair: compose the two actual interpretations or resolve the earlier visual motif, then present one clear comment/follow invitation at its speech anchor. Remove the unspoken solution list. Do not make a new product recommendation to justify keeping three columns.

### 2. Bigger containers still enclose small subjects

Most scenes repeat a chapter pill, a sentence-like heading, one or two white panels, small status labels, and a footer. These create several competing reading levels under the top captions. In the reference, the cup/watch/shirt and necessary price or selection are the visual explanation.

Our 840-pixel panels become 280 pixels wide at phone size, but an inner icon is often only a few dozen phone pixels. Essential source text at 18–24 pixels becomes about 6–8 pixels. Making the outer panel taller adds empty space inside it. The code terminal similarly leaves much of its height empty beneath a few tiny code lines.

Repair: make the subject itself the hero. Remove duplicate headings and explanatory footers. Use a short model/publisher identity reveal, a readable patch fragment, an independently moving message, a larger account representation, or an actual cable/server illustration. Keep only display text needed to identify the subject, amount, distinction, or result. Judge both the subject silhouette and necessary text at 360×640.

### 3. Ambient UI activity remains the main motion in long sections

The circuit pulse, synchronization dot, port-scanning beam, and cycling cache probes keep pixels active. They do not consistently develop the explanation. The sandbox remains substantially the same interface panel for approximately 18 seconds; the cache panel is present for approximately 13.5 seconds before its later state change. A moving marker cannot carry the whole interval.

Repair: develop the composition with the voice. Establish the actor and boundary, focus on the relevant operation, follow its consequence, then resolve. If the receiver or cache state changes, show how the operation causes that response. Allow a readable hold after the point lands. Preserve coherent pauses instead of treating every low-motion warning as a demand for another scanner.

### 4. The sandbox timer resets: about 59.67s

`Scene07OpenAISandbox.tsx:54` calculates elapsed seconds as `(frame % 300) / 30`. The display therefore wraps back to zero after ten local seconds. Independent samples show about 7.23s at 56.90s and 0.83s at 60.50s. It is an arbitrary repeating counter in a passage discussing 2.5 hours, with no narration explaining the reset or the displayed reaction-time measurement.

Repair: remove this counter or deliberately represent the narrated duration at its event. Do not display invented live measurement to satisfy a motion check. The scan calculation on line 57 also repeats every 20 frames; its rapid sweep is decoration, not a timeline of the event.

### 5. The percentage reveal still leaks its result: 43.1–46.5s

The main gauge sits at 0% before the metric event, while the always-visible description below already says 95%. This both reveals the intended result early and gives the frame two conflicting numeric readings. The description is also too small to be useful at phone size.

Repair: use the warning and continued attempt as the initial visual. Reveal the proportion at the speech anchor. If counting is used, keep it a brief intelligible transition and expose the explanatory label with the result. Remove the paragraph that duplicates the claim throughout.

### 6. Unexplained controls add claims to the story

The model-introduction shot animates a safety-guardrail toggle from ON to OFF on local frames 30–70, independently of the narration events. The passage introduces an evaluator, model, and challenge; it does not establish a literal safety-disable interface. The cache shot also adds secret-key and nanosecond details. These can look like authentic evidence, while the current manifest does not substantiate them with direct source captures or measurements.

Repair: preserve identity and the operation the narration needs. Remove unsupported specificity or label a necessary reconstruction clearly and source its factual claims. A short exact model name and suitable genuine identity asset will explain the introduction more cleanly than an invented control panel. Do not change the supplied voice as part of this repair.

### 7. Reference transition and composition logic were not carried through

The implementation uses separate sequences with direct cuts and nearly identical scene arrangements. The report says full-screen wipes were removed because they occluded the start of a shot. A deliberate transition can cover incoming content while it establishes the next section; that is different from a missing frame or asset. The reference uses this intentionally at major section boundaries.

Repair: choose a small transition vocabulary and use it where the story changes. Design the outgoing/incoming compositions together. Preserve a message, account, patch, or boundary across related beats where useful. Fix actual missing content while retaining purposeful staging. Do not reveal every layer at frame zero merely to avoid an empty start.

## Shot-specific worker actions

| Time | Retain | Repair next |
|---|---|---|
| 0–10.4s | Identity changes and packet transit | Enlarge the meaningful identity/message artwork; remove the repeating headline and metadata; make receipt readable without a large status panel |
| 10.4–19.3s | Named model and blocked route | Simplify identity presentation; remove the unsupported safety toggle; show one route attempt and consequence |
| 19.3–25.3s | On-cue code insertion | Crop to a few large readable code/patch elements; reduce empty terminal interior and complete the pending-review handoff |
| 25.3–33.1s | Route sequence and eventual sent state | Use the message as a continuous subject; replace tiny routing/email paragraphs with visible concealment and delivery |
| 33.1–43.1s | Second account appears after discovery | Reveal the shared-origin relationship through connecting/splitting actors, rather than a permanently visible spoiler footer and repeating dot |
| 43.1–49.7s | Anchored gauge movement | Eliminate the 0%/95% conflict and unnecessary paragraph; make the warning-to-persistence relationship visible |
| 49.7–67.8s | DNS escape and lockdown stages | Remove/reset-free meaningful duration, reduce the dashboard shell, and give the boundary crossing a clear inside/outside relation |
| 67.8–81.2s | Correct decoding event binding | Show sender operation → one shared state → receiver response; reduce micro-labels, probing loops, and unsupported numerical detail |
| 81.2–89.4s | Visible cable separation | Make the connection and enclosure the actual hero artwork; reduce the room dashboard and redundant footer |
| 89.4–100.6s | One eventual follow invitation | Replace the unspoken three-solution list with the narration's actual question and remove arbitrary cycling selection |

## Next pass priority

First repair the ending's message, looping timer, and contradictory gauge frame. Then redesign the sandbox or cache sample as a few large illustrative actors before propagating the treatment. Compare that sample with the reference's actual object scale, text hierarchy, staged emphasis, and meaningful outcome. Keep working timing/cable/insertion repairs.

The saved creative-review method contains the literal word `undefined`, and its notes still accept continuous scanning as successful choreography. Matching hashes show the evidence belongs to this file; they do not show the design meets the requested reference. Write fresh findings against the new frames and resolve the specific issues above before calling the next iteration accepted. Avoid calling structural checks a quality certification.
