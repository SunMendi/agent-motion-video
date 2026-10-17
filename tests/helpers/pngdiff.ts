import {PNG} from 'pngjs';

/** Fraction of pixels that differ by more than the threshold on any channel. */
export const diffRatio = (a: Buffer, b: Buffer): number => {
  const p1 = PNG.sync.read(a);
  const p2 = PNG.sync.read(b);
  if (p1.width !== p2.width || p1.height !== p2.height) {
    throw new Error(`size mismatch ${p1.width}x${p1.height} vs ${p2.width}x${p2.height}`);
  }
  let diff = 0;
  for (let i = 0; i < p1.data.length; i += 4) {
    const d = Math.max(
      Math.abs(p1.data[i] - p2.data[i]),
      Math.abs(p1.data[i + 1] - p2.data[i + 1]),
      Math.abs(p1.data[i + 2] - p2.data[i + 2]),
    );
    if (d > 8) diff++;
  }
  return diff / (p1.width * p1.height);
};
