import {meanAt, WINDOW} from './pcm';
import type {AudioEnvelope} from './pcm';
import type {Word} from '../../src/model';

export type Silence = {start: number; end: number; mid: number};
export type RawWord = {word_bangla: string; start_time: number; end_time: number};
export type Raw = {audio_duration: number; words: RawWord[]};
export type AlignGap = {
  jsonStart: number;
  jsonEnd: number;
  detectedStart: number;
  detectedEnd: number;
  correction: number;
};
export type AlignResult = {
  audio_duration: number;
  words: Word[];
  align: {matched: number; warnings: string[]; gaps: AlignGap[]};
};

/** A pause is at least this long. */
export const MIN_SILENCE = 0.2;
/** Loud stretches shorter than this inside a pause are ignored. */
export const MIN_BURST = 0.1;
/** A raw gap may sit up to this far from a real pause and still match it. */
export const TOLERANCE = 0.8;
export const WARN_CORRECTION = 0.25;
export const FAIL_CORRECTION = 0.5;

/** Find the real pauses: runs below the speech threshold, long enough, merged. */
export const detectSilences = (audio: AudioEnvelope): Silence[] => {
  const runs: Array<{start: number; end: number}> = [];
  let start = -1;
  for (let i = 0; i < audio.rms.length; i++) {
    const quiet = audio.rms[i] < audio.speechThreshold;
    if (quiet && start === -1) start = i;
    if (!quiet && start !== -1) {
      runs.push({start: start * WINDOW, end: i * WINDOW});
      start = -1;
    }
  }
  if (start !== -1) runs.push({start: start * WINDOW, end: audio.rms.length * WINDOW});

  const merged: Array<{start: number; end: number}> = [];
  for (const run of runs) {
    const prev = merged[merged.length - 1];
    if (prev && run.start - prev.end < MIN_BURST) {
      prev.end = run.end;
      continue;
    }
    merged.push({...run});
  }
  return merged
    .filter((r) => r.end - r.start >= MIN_SILENCE)
    .map((r) => ({start: r.start, end: r.end, mid: (r.start + r.end) / 2}));
};

type Interval = {lo: number; hi: number; mid: number};
type Anchor = {j: number; a: number};

/** Skipping a gap or a pause must cost more than any allowed match,
 * so the solver matches whenever a pair is within tolerance. */
const SKIP_PENALTY = TOLERANCE + 0.1;

/** Match raw word gaps to real pauses. Monotonic, tolerance bounded. */
const matchGaps = (intervals: Interval[], silences: Silence[]): Array<[number, number]> => {
  const n = intervals.length;
  const m = silences.length;
  const cost: number[][] = Array.from({length: n + 1}, () => new Array<number>(m + 1).fill(Infinity));
  const move: Array<Array<'skipGap' | 'skipPause' | 'match' | null>> = Array.from(
    {length: n + 1},
    () => new Array<'skipGap' | 'skipPause' | 'match' | null>(m + 1).fill(null),
  );
  cost[0][0] = 0;
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= m; j++) {
      const c = cost[i][j];
      if (!Number.isFinite(c)) continue;
      if (i < n && c + SKIP_PENALTY < cost[i + 1][j]) {
        cost[i + 1][j] = c + SKIP_PENALTY;
        move[i + 1][j] = 'skipGap';
      }
      if (j < m && c + SKIP_PENALTY < cost[i][j + 1]) {
        cost[i][j + 1] = c + SKIP_PENALTY;
        move[i][j + 1] = 'skipPause';
      }
      if (i < n && j < m) {
        const d = Math.abs(intervals[i].mid - silences[j].mid);
        if (d <= TOLERANCE && c + d < cost[i + 1][j + 1]) {
          cost[i + 1][j + 1] = c + d;
          move[i + 1][j + 1] = 'match';
        }
      }
    }
  }
  const pairs: Array<[number, number]> = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    const mv = move[i][j];
    if (mv === 'match') {
      pairs.push([i - 1, j - 1]);
      i--;
      j--;
    } else if (mv === 'skipGap') {
      i--;
    } else if (mv === 'skipPause') {
      j--;
    } else {
      break;
    }
  }
  return pairs.reverse();
};

/** Map a raw time to the audio timeline.
 * At a zero-width gap both anchors share the raw time:
 * a word end takes the pause start, a word start takes the pause end. */
const makeMapper = (anchors: Anchor[]): ((t: number, edge: 'start' | 'end') => number) => {
  const pts = [...anchors].sort((x, y) => (x.j === y.j ? x.a - y.a : x.j - y.j));
  return (t: number, edge: 'start' | 'end'): number => {
    const exact = pts.filter((p) => Math.abs(p.j - t) < 1e-9).map((p) => p.a);
    if (exact.length) return edge === 'start' ? exact[exact.length - 1] : exact[0];
    if (t <= pts[0].j) return pts[0].a;
    const last = pts[pts.length - 1];
    if (t >= last.j) return last.a;
    let left = pts[0];
    for (const p of pts) {
      if (p.j < t) left = p;
      else break;
    }
    const right = pts[pts.indexOf(left) + 1];
    const f = (t - left.j) / (right.j - left.j);
    return left.a + f * (right.a - left.a);
  };
};

/** Snap user word timings onto the real pauses of the audio file. */
export const align = (raw: Raw, audio: AudioEnvelope): AlignResult => {
  const silences = detectSilences(audio);
  const intervals: Interval[] = [];
  for (let i = 0; i < raw.words.length - 1; i++) {
    const lo = raw.words[i].end_time;
    const hi = raw.words[i + 1].start_time;
    intervals.push({lo, hi, mid: (lo + hi) / 2});
  }

  const pairs = matchGaps(intervals, silences);

  const anchors: Anchor[] = [{j: 0, a: 0}];
  const gaps: AlignGap[] = [];
  for (const [gi, si] of pairs) {
    const interval = intervals[gi];
    const silence = silences[si];
    anchors.push({j: interval.lo, a: silence.start});
    anchors.push({j: interval.hi, a: silence.end});
    gaps.push({
      jsonStart: Number(interval.lo.toFixed(3)),
      jsonEnd: Number(interval.hi.toFixed(3)),
      detectedStart: Number(silence.start.toFixed(3)),
      detectedEnd: Number(silence.end.toFixed(3)),
      correction: Number((interval.mid - silence.mid).toFixed(3)),
    });
  }
  anchors.push({j: raw.audio_duration, a: audio.duration});
  const map = makeMapper(anchors);

  const warnings: string[] = [];
  const unmatched = intervals.length - pairs.length;
  if (unmatched > 0) warnings.push(`${unmatched} raw gaps had no pause within ${TOLERANCE}s`);
  const speech = meanAt(audio.rms, audio.speechOnset, audio.speechOffset);
  for (const g of gaps) {
    if (Math.abs(g.correction) > WARN_CORRECTION) {
      warnings.push(
        `moved a gap near ${g.jsonStart}s by ${g.correction}s (json ${g.jsonStart}-${g.jsonEnd} -> audio ${g.detectedStart}-${g.detectedEnd})`,
      );
    }
    const loud = meanAt(audio.rms, g.detectedStart, g.detectedEnd);
    if (loud > speech * 0.5) {
      throw new Error(
        `gap ${g.detectedStart}-${g.detectedEnd} is still loud after alignment (mean ${Math.round(loud)} vs speech ${Math.round(speech)})`,
      );
    }
  }
  const worst = Math.max(0, ...gaps.map((g) => Math.abs(g.correction)));
  if (worst > FAIL_CORRECTION) {
    throw new Error(
      `a gap had to move by ${worst}s, more than the ${FAIL_CORRECTION}s limit. The word timings are too far from the audio.`,
    );
  }

  const words: Word[] = raw.words.map((w) => ({
    w: w.word_bangla,
    s: Number(map(w.start_time, 'start').toFixed(3)),
    e: Number(map(w.end_time, 'end').toFixed(3)),
  }));

  return {
    audio_duration: Number(audio.duration.toFixed(2)),
    words,
    align: {matched: pairs.length, warnings, gaps},
  };
};
