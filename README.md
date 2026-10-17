# Bangla Audio-Driven Ad Factory

Turn a voice file plus a word-timing JSON into a word-synced Bangla video ad in three sizes.
Built on [Remotion](https://remotion.dev). Everything runs on this machine. No cloud, no cost.

The first ad in here: **DevSolutions BD** — an AI agent for Bangladeshi online news portal owners.

## Commands

```bash
npm run align -- <name>          # snap word timings onto the real pauses of the audio
npm run ad -- <name>             # render the 9x16 video
npm run ad -- <name> --all       # render 9x16, 1x1 and 16x9
npm run check -- <name>          # verify duration, size and codecs of the outputs
npm test                         # all tests, including text fitting against the real font
npm run snapshots                # compare rendered frames against the stored baselines
npm run snapshots:update         # accept a new look on purpose
npm run studio                   # open the visual editor in the browser
npm run new-ad -- <name>         # scaffold the files for the next ad
```

Output files land in `out/`. The ad length always equals the voice length. For this ad: 37.92 s.

## How an ad is built

1. `briefs/<name>.raw.json` holds one entry per spoken word: text plus start and end time.
2. `npm run align -- <name>` listens to the audio, finds the real pauses, and rewrites the
   timings onto them. It writes `briefs/<name>.timing.json`. It fails loudly if the timings
   are too far from the audio.
3. `briefs/<name>.json` is the brief: product name, call to action, logo setting, and one
   `scenes[]` entry per beat with its copy.
4. `npm run ad -- <name>` renders the video and normalises the loudness to -14 LUFS.

## Making a new ad

1. Record the voice. Put the file in `public/audio/<name>.wav`.
2. Run `npm run new-ad -- <name>`. It writes a brief template and an empty raw timing file.
3. Transcribe the audio with word timings (any tool that gives word start and end times).
   Fill them into `briefs/<name>.raw.json` as
   `{"word_bangla": "...", "start_time": 0.0, "end_time": 0.4}`.
4. Write the copy in `briefs/<name>.json`. One `scenes[]` entry per beat.
   - `type` is optional. It picks the layout: hook, problem, feature, question, stat, promise, cta.
   - `segments: 2` on a scene means it covers two audio pauses. Use it when the voice stops
     mid-sentence. The counts must add up to the number of pauses, or the build fails.
5. Run `npm run align -- <name>`, then `npm run ad -- <name> --all`, then `npm run check -- <name>`.
6. Register the ad in `src/briefs.ts` so the compositions appear in the studio.

## Rules the factory enforces

- The video length equals the audio length, rounded to whole frames at 30 fps.
- Scene cuts land on real pauses in the voice, not on guessed times.
- Captions switch exactly when the spoken word starts. The spoken word is highlighted.
- No text may exceed the safe width. Long lines wrap. Wrapping is measured with the real
  font file, in tests, and with the browser, at render time.
- Captions never exceed two lines. A scene that would need three fails loudly.
- Bangla conjuncts stay whole. The font is Noto Sans Bengali, loaded from `public/fonts/`.
- The logo always sits on a white plate, because the logo file is a JPG on white.
- Every rendered frame is checked against a stored baseline. A changed look must be accepted
  on purpose with `npm run snapshots:update`.

## Files

```
briefs/            brief, raw timings, aligned timings
public/audio/      voice files
public/brand/      logos
public/fonts/      Noto Sans Bengali Regular and Bold
scripts/           align, render, check, snapshot, new-ad
src/               the composition: scenes, parts, timing engine, brand constants
tests/             unit tests plus the stored snapshot baselines
out/               rendered videos and stills (not committed)
```

## Licence note

Remotion is free for individuals and companies up to three people, including commercial use
and automation. From four people the company needs a paid Company Licence. Check
[remotion.dev/license](https://www.remotion.dev/license) before the team grows.
