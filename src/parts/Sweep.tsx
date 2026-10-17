import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

/** A diagonal blade wipe across the hard scene cut. */
export const Sweep: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 5], [-55, 155]);
  const blade = (offset: number, alpha: number, w = 26) => {
    const p = x + offset;
    return (
      <AbsoluteFill
        style={{
          background: `linear-gradient(100deg, transparent ${p - w}%, rgba(22,104,227,${alpha}) ${p}%, transparent ${p + w}%)`,
        }}
      />
    );
  };
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {blade(14, 0.07, 34)}
      {blade(0, 0.16, 20)}
      {blade(-12, 0.5, 4)}
    </AbsoluteFill>
  );
};
