import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {palette} from '../../brand';
import {toBangla} from '../../text/bn';

/** A number that counts from `from` to `to` over `durationFrames`. */
export const Counter: React.FC<{
  from: number;
  to: number;
  durationFrames?: number;
  size?: number;
  suffix?: string;
  color?: string;
}> = ({from, to, durationFrames = 30, size = 110, suffix = '', color = palette.ink}) => {
  const frame = useCurrentFrame();
  const value = Math.round(
    interpolate(frame, [10, 10 + durationFrames], [from, to], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  return (
    <span style={{fontSize: size, fontWeight: 700, color, lineHeight: 1}}>
      {toBangla(value)}
      {suffix}
    </span>
  );
};
