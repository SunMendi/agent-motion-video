export type Measure = (text: string) => number;

type SegmenterCtor = new (
  locale: string,
  opts: {granularity: string},
) => {segment: (s: string) => Iterable<{segment: string}>};

const SEGMENTER = (Intl as unknown as {Segmenter?: SegmenterCtor}).Segmenter;

/** Count user-perceived characters. Bangla conjuncts count as one. */
export const countGraphemes = (text: string): number => {
  if (!SEGMENTER) return [...text].length;
  return [...new SEGMENTER('bn', {granularity: 'grapheme'}).segment(text)].length;
};

/** Greedy word wrap against a real width measure. Throws when one word cannot fit. */
export const wrapTokens = <T>(
  tokens: T[],
  getText: (token: T) => string,
  maxWidth: number,
  measure: Measure,
): T[][] => {
  const lines: T[][] = [];
  let line: T[] = [];
  for (const token of tokens) {
    const candidate = [...line, token].map(getText).join(' ');
    if (line.length && measure(candidate) > maxWidth) {
      lines.push(line);
      line = [token];
    } else {
      line.push(token);
    }
  }
  if (line.length) lines.push(line);
  for (const l of lines) {
    const t = l.map(getText).join(' ');
    if (measure(t) > maxWidth) {
      throw new Error(`"${t}" is wider than ${maxWidth}px at this font size, lower the font size`);
    }
  }
  return lines;
};

export const wrapToWidth = (text: string, maxWidth: number, measure: Measure): string[] =>
  wrapTokens(
    text.split(/\s+/).filter(Boolean),
    (w) => w,
    maxWidth,
    measure,
  ).map((line) => line.join(' '));
