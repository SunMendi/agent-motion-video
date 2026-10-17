import {describe, expect, it} from 'vitest';
import {safeWidth, sizes, scaleF, typeSize} from '../src/brand';

describe('brand', () => {
  it('defines three sizes', () => {
    expect(Object.keys(sizes)).toEqual(['9x16', '1x1', '16x9']);
  });
  it('computes safe width', () => {
    expect(safeWidth(1080)).toBe(920);
    expect(safeWidth(1920)).toBe(1760);
  });
  it('scales by the short edge', () => {
    expect(scaleF(1080, 1920)).toBe(1);
    expect(scaleF(2160, 3840)).toBe(2);
  });
  it('keeps the hook headline legible', () => {
    expect(typeSize('hook', 1080, 1920)).toBeGreaterThanOrEqual(90);
  });
});
