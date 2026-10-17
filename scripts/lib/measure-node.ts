import {readFileSync} from 'node:fs';
import path from 'node:path';
import * as fontkitImport from 'fontkit';
import type {Font} from 'fontkit';
import type {Measure} from '../../src/text/wrap';

type Fontkit = {openSync(p: string): Font};

// fontkit ships as CommonJS; bundlers and vitest disagree on the default shape.
const fontkit = ((fontkitImport as unknown as {default?: Fontkit}).default ??
  (fontkitImport as unknown as Fontkit)) as Fontkit;

const FONTS: Record<string, string> = {
  '400': 'public/fonts/NotoSansBengali-Regular.ttf',
  '700': 'public/fonts/NotoSansBengali-Bold.ttf',
};

const cache = new Map<string, fontkit.Font>();

/** Width in pixels of `text` drawn at `sizePx`, measured from the real font file.
 * Scripts and tests only: the browser uses canvas measureText instead. */
export const nodeMeasure = (sizePx: number, weight: '400' | '700' = '400'): Measure => {
  const abs = path.resolve(FONTS[weight]);
  if (!cache.has(abs)) cache.set(abs, fontkit.openSync(abs));
  const font = cache.get(abs) as fontkit.Font;
  return (text: string): number => {
    const run = font.layout(text);
    const units = run.positions.reduce((sum, p) => sum + p.xAdvance, 0);
    return (units * sizePx) / font.unitsPerEm;
  };
};

export const readJson = <T>(file: string): T => JSON.parse(readFileSync(file, 'utf8')) as T;
