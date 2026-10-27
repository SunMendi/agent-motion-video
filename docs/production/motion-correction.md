# Motion and composition correction for the worker

## Design finding

The user rejected `exports/ai-security-threat-rebuild.mp4`. Treat it as a failed design iteration. Preserve the recording and exported files. Continue with an unused revision identifier and the existing application. No reset is needed.

The screenshots and inspected 360×640 render frames show small horizontal diagrams in a large vertical field. For example, `tor-route.svg` is a complete 700×360 poster with 16 text nodes. `Scene04TorProxy` displays that whole poster as an image at a maximum source width of 820 pixels. Its body is therefore about 422 source pixels tall inside a 1380-pixel action stage. The large blank area is a composition decision, not a problem with the video player's black sidebars.

The code applies a 0.98→1.03 camera scale to these posters. That five-percent change does not show the route being constructed or the message moving between its nodes. The first scene does move an overlay, but its small 11–15 px source text is unreadable at phone size. `VisualScene` accepts `events` and `start` in its interface and then discards them. Its children use hardcoded local frame numbers instead of consuming compiled events. The storyboard describes more choreography than the implementation supplies.

The existing creative review also describes objects absent from its corresponding shots: the Tor shot is described as a speed comparison; the offline-enclave shot is described as a balance scale. Those findings cannot be used as acceptance evidence. Reinspect the actual result and write new observations. Adding more passing assertions or decorative motion will not repair this iteration.

## Change the construction method

Build scenes from actors, not complete poster images. Keep the appropriate existing color direction and top-caption typography. Remove the category pill, outer diagram card, miniature subheadings, and explanatory paragraphs from the primary mechanism shots. Necessary reconstruction notices should be short and legible. Important labels should start around 48–64 source pixels and be judged in the actual phone preview.

Use the shared action stage at x=64–960, y=320–1700. For the route example, place its changing subjects through roughly y=400–1580. Use the vertical direction and allow the camera/focus to follow the current actor. The connected subjects and their meaningful paths should span most of that height. A close-up may occupy the width with a purposeful crop. Do not inflate an empty wrapper or add filler to claim occupancy.

Keep a single sender, message, relay, alias, and recipient as independent inline SVG/React layers. Give them recognizable silhouettes. Use a genuine identity asset when an actual product is introduced. The existing authored “official” summary badges are not product captures; obtain primary-source identity assets or describe them honestly as authored type. Do not invent a source or verified status.

## Choreograph two sections before propagating the approach

Use these as approximate design intervals. Refine every boundary against the recording and reviewed speech IDs; do not change the audio to fit this table.

| Voice interval | Required visible change |
|---|---|
| Opening, 0–2 s | Establish one large automated sender and one message. The sender is recognizable without reading a paragraph. |
| Opening, 2–4 s | The same actor changes its presented identity. Animate the actual identity layer turning/replacing; preserve an observable link to its automated origin. |
| Opening, 4–6 s | The message leaves the sender and crosses a visible trust boundary. Its route, origin, and destination can be followed. |
| Opening, 6–8 s | The recipient receives the message. Change the recipient's state; do not merely place a delivered label over a finished diagram. |
| Opening, 8–10.4 s | Reframe/reveal the hidden origin-to-persona relationship, then carry an object into the case introduction. Avoid freezing the completed diagram for the remaining narration. |
| Concealed origin, 25.3–26.2 s | Carry the contribution/message into the new shot as a large foreground object. |
| Concealed origin, 26.2–27.5 s | Reveal the relevant route nodes and draw a connecting path; the packet travels along it. Arrange nodes vertically or on a broad diagonal rather than fitting four tiny columns into a poster. |
| Concealed origin, 27.5–29 s | The origin becomes concealed and a new account identity appears at the correct voice phrase. Keep the causal link understandable. |
| Concealed origin, 29–31 s | Focus on the claimed human identity. Let the routing context leave the focal area rather than stacking a second paragraph-heavy panel below it. |
| Concealed origin, 31–33.1 s | Transform/carry the same message into an envelope, move it to the maintainer inbox, and show receipt. No miniature email body is necessary. |

The accompanying `references/route-motion-board.svg` and PNG are conceptual composition boards. They demonstrate large actors and distinct states. They contain no authentic model/product assets, no narration timing proof, and no rendered-production approval.

## Implementation architecture

Forward `start` and `events` through `VisualScene` into each active scene. Compute the absolute frame as `start + useCurrentFrame()`. Resolve semantic event IDs and derive object progress with the existing `eventProgress` helper. Use those values for path drawing, packet travel, masking, account appearance, and receipt states. Remove duplicate hardcoded narration times once the event is wired.

An external SVG in `Img` cannot have its internal nodes animated by React props. Convert a mechanism to inline groups or separate its actors into independently controlled assets. Keep complete screenshots as image sources when demonstrating real software; crop them to the important action and animate overlays only where they explain what happened.

Create an action ledger in `work/current/direction.md`: speech ID → object → initial state → operation → resulting state → implementation/event ID. If an entry has no object change in the scene code, it is unfinished. A long scene can contain several such operations. Do not enforce arbitrary cuts or incessant movement.

Apply the same method to the cache explanation: separate VM regions, disconnected network path, shared cache cells, outgoing access operation, changed cache state, latency indicator, and receiver response. A glowing dot on a static chip poster does not explain communication.

## Inspect the proof before completing the rebuild

First implement and render the opening and concealed-origin samples. Inspect their actual frames and motion. This is an autonomous repair stage; do not ask the user to approve routine execution. Do not propagate a small-poster composition to all ten sections and inspect only at the end.

Watch the samples at 360×640 with captions covered. The viewer must be able to follow the action without reading body paragraphs. Then inspect with captions visible for clearance and distraction. Inspect each narrated operation's initial state, midpoint, contact, and resulting state. Inspect the intervals between events too; early movement does not excuse a later static hold.

If the body stops changing for several seconds, identify what the current narration requires. Add the missing action, reframe to a meaningful detail, or justify a reading hold. Do not add scanners, hazard stripes, breathing effects, or generic zoom just to satisfy a pixel-motion test.

The worker's report must cite actual frame numbers and describe the actual objects. Verify the descriptions against the images. Reuse no prior “passed” review prose. Keep structural checks, listening, and design findings separate. Complete the remainder of production only after solving these samples, then run all required checks and regenerate final evidence.

The design lead inspected source and selected rendered frames for this correction. Full continuous playback and direct audio listening remain incomplete. This document is direction for implementation, not a claim that the corrected video exists.
