# Design review: ai-security-motion-rebuild

## Verdict and scope

Reviewed `exports/ai-security-motion-rebuild.mp4`. Its SHA256 is `26dd24cba1cab460df69a3799d21de266d90859758b53ed7345b886dcf05b6e6`, matching the current final media and render manifest. This is the newest motion rebuild, not the previous flattened-SVG export.

Verdict: needs substantial visual revision before design acceptance. The opening identity flip, traveling packet, and Tor-to-email sequence are improvements. The router now forwards events. Most remaining scenes still behave like presentation slides: three small text containers stay in fixed positions while a cursor, scanner, counter, or pulse changes. Filling the overall stage bounds has not created a dominant visual subject.

Independently decoded 60 frames from the actual export, six per shot, and inspected all ten ordered shot sequences at 360×640. Cross-checked the active scene code, compiled timeline, storyboard, and current review record. [Sample positions](../research/evidence/2026-10-26-motion-review/samples.json) and [event lookup findings](../research/evidence/2026-10-26-motion-review/event-binding-audit.json) are saved. These observations establish composition, visible states, and source/timing defects. Full continuous playback, frame-by-frame easing analysis, direct listening, and claim verification remain incomplete. No production scene or supplied audio was changed during this review.

## Priority findings

### 1. Essential event lookups silently fail

Five required lookups request names absent from their shot's events. Local fallback timing hides the error.

| Section | Requested ID | Available ID | Timing consequence |
|---|---|---|---|
| Persistence | `e06-stamp-metric` | `e06-metric-stamp` | Local fallback starts at 45.77s; compiled event starts at 46.53s. The main percentage is already visible from shot entrance regardless. |
| Sandbox escape | `e07-dns-escape` | `e07-dns-slip` | Fallback starts at 53.00s; compiled event starts at 55.37s. |
| Sandbox timer | `e07-wan-timer` | `e07-time-counter` | Fallback starts at 57.00s; compiled event starts at 60.27s. The elapsed counter runs from shot entrance independently. |
| Sandbox halt | `e07-training-halt` | `e07-freeze-lockdown` | Fallback starts at 62.33s; compiled event starts at 64.17s. |
| Cache decoding | `e08-bit-decode` | `e08-bits-decoded` | Fallback starts at 75.10s; compiled event starts at 79.13s. An independent duration-based condition also lights bits even earlier. |

`Scene02ClaudeMythos` has a valid primary route-block ID plus an unused alternate name. That alternate is not counted as a failed lookup.

Worker repair: use the declared IDs consistently. Required production events should not silently fall back to guessed frame constants. Confirm the lookup and the object's state at frames immediately before, during, and after each event.

### 2. The composition spreads small objects across a large frame

The repeated y≈200/620/1100 positioning produces three horizontal bands with large gaps. A connected bounding rectangle can span the stage while each visible actor remains small. Many essential body labels are 18–32 source pixels, approximately 6–11 pixels in a 360-pixel-wide preview. The opening sender is 270 source pixels wide, only 90 pixels on the phone preview. Most shot information still depends on reading English UI text alongside Bengali captions.

Worker repair: choose one dominant object for the current beat, make it readable, and use a close view when detail matters. Move related objects through the composition as the explanation progresses. Remove redundant header/footer cards and secondary metadata. Preserve useful negative space, but inspect the actual subject silhouette rather than its wrapper bounds.

### 3. Cosmetic motion substitutes for mechanisms

The evaluation sweep, blinking code cursor, persistence pulse, cache-bank scanner, lock pulse, and alternating CTA scales produce changing pixels. They often leave the explanatory state unchanged. The worker's report explicitly treats continuous telemetry as the solution to static holds. That explains why the motion gate can pass while the result feels static.

Worker repair: specify the operation being demonstrated and its consequence. Animate a contribution entering review, an inserted fragment appearing, a second identity branching from its origin, a request crossing a firewall, or a cable physically separating. Keep breathing/glow/scan effects subordinate. Do not add more ambient motion to resolve these findings.

### 4. Results appear before their causes

The malicious code line is already present at 19.60s, before the narration reaches the malware phrase around 22.22s; the event mainly changes its highlight. The 95% result is visible at 43.40s, before the number is spoken around 46.52s. Cache bits are already accumulating at 70.63s, well before the compiled decode event at 79.13s. The offline enclave is visibly sealed before the narrated disconnection and containment sequence unfolds.

Worker repair: stage the actual information reveal. Changing a border or scale at a speech anchor does not synchronize content that was already onscreen. Show a meaningful initial state, perform the cause, then reveal the consequence.

### 5. Contact and continuity are incomplete

In the opening, the packet stops at local y=860 while the recipient card is centered at local y=1120. The recipient later changes to compromised, but the packet does not visibly enter that card. It retains a transit label until it fades into an explanatory banner. Most section boundaries then cut to a fresh independent card layout, losing the object continuity promised in direction.

Worker repair: align the traveling object's endpoint with an actual receiving aperture. Transfer, absorb, open, or transform it at contact. Let the destination react then. Preserve a contribution, account, boundary, or packet into a related next shot where that improves understanding.

## Shot findings and required action

| Time | Finding | Required visual correction |
|---|---|---|
| 0–10.4s | The persona flip and crossing are real improvements. Sender and labels remain small; delivery has no physical contact. | Enlarge the active actor, simplify metadata, and finish message entry/receipt. |
| 10.4–19.3s | A custom model card sits between an institute header and route status. Scanning and trial counts dominate the motion. | Use sourced identity clearly, then demonstrate a route being attempted and blocked. Remove decorative trial telemetry. |
| 19.3–25.3s | The malicious line is already visible. A scanner and cursor animate around a largely static code panel. | Show the original contribution, insert the disputed fragment at the speech anchor, then carry it toward pending review. |
| 25.3–33.1s | Strongest improvement: a packet follows a broad route and an envelope is dispatched. The account portion collapses into a small central text card. | Keep a large focal identity during the transition and make the handoff into the inbox continuous and legible. |
| 33.1–43.1s | Second identity eventually appears, but most of the interval repeats a small root/card layout with a cycling dot and audit counter. | Bring the suspicious fragment into focus, show the reviewer isolating it, then branch the second identity visibly from the same origin. |
| 43.1–49.7s | The percentage dominates, but the beat mostly pulses and the result is visible early. | Show a warning encountering the continuing attempt, then reveal the sourced proportion at its anchor. Remove redundant summary cards. |
| 49.7–67.8s | An 18-second shot retains a port-filter dashboard and timer. Several event IDs fail. | Build a visible sandbox boundary, move the request through a specific outlet, establish the outside region, then animate the shutdown response. |
| 67.8–81.2s | Banks scan and bits illuminate, but the VMs, cache, and decoder remain separate rows. Decoding starts early. | Trace VM-A operation → changed cache cell → changed measured delay → VM-B response. Use a few large cells rather than eight tiny telemetry tiles. |
| 81.2–89.4s | A plug icon and status text change to severed; a sealed vault card pulses. No actual cable separates. | Draw the connection as a controllable object, separate its ends, then close the boundary around the retained agent objects. |
| 89.4–100.6s | Several question/answer cards repeat text while their scales oscillate. | Resolve the previous visual motif, present the two interpretations briefly, then one focused engagement action. |

## Direction for the next worker pass

Fix required event IDs and early content reveals first. Then solve the malicious-contribution, sandbox, and cache shots as actual operation sequences. Inspect them with captions covered before propagating their construction. Reduce body text and repeated three-card layouts. Resolve delivery/contact in the opening and routing examples.

Do not change the palette again or introduce another motion preset. Keep the technical checks, but require the worker's new review to identify the actual operation and consequence in each rendered sequence. The current blanket resolution claiming that continuous telemetry eliminated the design issue is not supported by the inspected result.

This is a review and worker repair brief. No new implementation, corrected render, full audio review, or aesthetic certification is claimed.
