# Input review

- Audio: `public/current/bangla.wav`, mono PCM, 44.1 kHz, 88.16 s. SHA-256 `f7e99139796f4b57e9c305331781f676ec6e122748e96543ebdbc168f9445f60`.
- No supplied script, visual script, or reference for this video. The current brief contains the requested outcome and audience.
- Raw Faster-Whisper analysis has 23 acoustic segments but poor romanized Bengali wording. Phrase captions are manually reconstructed from that analysis; they should not be represented as certified verbatim speech. Direct listening verification was unavailable to the agent.
- A separate 20 ms RMS scan found 15 silence candidates of at least 220 ms. The longest was 21.08–22.14 s. See `work/current/pauses.json`. These are energy-based candidates, not phonetic word boundaries. Some raw ASR phrase spans include leading silence of up to about one second. Caption synchronization remains approximate.
- The narration's apparent three-times and four-to-five-times statements are not generally valid across models. The recording is preserved. Visuals use illustrative, model-dependent language and no fixed price.
- `npm run video:check` passed. `npm run video:prepare` passed with the measured audio hash and 2645 frames. `npm run video:doctor` found the core project packages and browser, but sandbox subprocess checks reported EPERM and several optional packages are absent. Existing tools cover this production.
