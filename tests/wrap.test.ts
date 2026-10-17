import {describe, expect, it} from 'vitest';
import {countGraphemes, wrapToWidth} from '../src/text/wrap';
import {nodeMeasure} from '../scripts/lib/measure-node';

const caption = nodeMeasure(58, '700');
const headline = nodeMeasure(84, '700');

describe('countGraphemes', () => {
  it('counts plain letters one by one', () => {
    expect(countGraphemes('abc')).toBe(3);
  });
  it('counts Bangla conjuncts as one cluster', () => {
    expect(countGraphemes('মানুষ')).toBe(3);
    expect(countGraphemes('সেকেন্ডেই')).toBe(4);
  });
  it('never counts more clusters than code points', () => {
    for (const s of ['মানুষ', 'সেকেন্ডেই', 'প্রতিটি']) {
      expect(countGraphemes(s)).toBeLessThanOrEqual([...s].length);
    }
  });
});

describe('wrapToWidth', () => {
  it('keeps a short line on one line', () => {
    expect(wrapToWidth('লম্বা রচনা পড়তে চায় না', 920, headline)).toHaveLength(1);
  });
  it('breaks long Bangla lines under the limit', () => {
    const text = 'মানুষ কেন আপনার নিউজ পোর্টালে ঢুকে তিন সেকেন্ডেই বের হয়ে যায় জানেন?';
    const lines = wrapToWidth(text, 920, caption);
    for (const line of lines) expect(caption(line)).toBeLessThanOrEqual(920);
    expect(lines.join(' ')).toBe(text);
  });
  it('rejects a single token that cannot fit', () => {
    const narrow = (): number => 4000;
    expect(() => wrapToWidth('একটি', 920, narrow)).toThrow(/wider than/);
  });
});

describe('real copy fits', () => {
  const headlines = [
    '৩ সেকেন্ডেই পাঠক বের হয়ে যায়',
    'এখনও ২০১৫ সালে আটকে',
    'লম্বা রচনা পড়তে চায় না',
    'এআই এজেন্ট নিজেই যোগ করে',
    'ভিজিটর আনবে কোথা থেকে?',
    'খবর, ফটোকার্ড, ফেসবুক',
    'লোকাল পোর্টাল থেকে স্মার্ট পোর্টাল',
    'ডেমো লিংক পেতে এখনই মেসেজ দিন',
    'প্রতিটি নিউজে ৩ লাইনের এআই সামারি',
    'খবর শোনার জন্য অডিও সামারি',
  ];
  it('wraps every headline and bullet within safe width and three lines', () => {
    for (const line of headlines) {
      const lines = wrapToWidth(line, 920, headline);
      expect(lines.length, `${line} wrapped to ${lines.length} lines`).toBeLessThanOrEqual(3);
    }
  });
  it('keeps caption chunks to two lines', () => {
    const chunks = [
      'প্রতিটি নিউজে ৩ লাইনের এআই সামারি',
      'খবর শোনার জন্য অডিও সামারি',
      'ফটোকার্ড অটো ফেসবুক পেজে',
      'ডেমো লিংক পেতে এখনই মেসেজ দিন',
    ];
    for (const text of chunks) {
      const lines = wrapToWidth(text, 880, caption);
      expect(lines.length, `${text} wrapped to ${lines.length} lines`).toBeLessThanOrEqual(2);
    }
  });
  it('measures plausible pixel widths', () => {
    const w = caption('মানুষ কেন');
    expect(w).toBeGreaterThan(100);
    expect(w).toBeLessThan(900);
  });
});
