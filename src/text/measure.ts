import type {Measure} from './wrap';
import {FONT_FAMILY} from '../fonts';

/** Width in pixels measured by the browser, so it matches what renders. */
export const browserMeasure = (sizePx: number, weight: '400' | '700'): Measure => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 2d context unavailable');
  ctx.font = `${weight} ${sizePx}px "${FONT_FAMILY}"`;
  return (text: string): number => ctx.measureText(text).width;
};
