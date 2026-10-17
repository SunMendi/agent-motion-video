import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

/** Four-frame light sweep that plays over a hard scene cut. */
export const Sweep: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 5], [-40, 140]);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(105deg, transparent ${x - 18}%, rgba(255,255,255,0.16) ${x}%, transparent ${x + 18}%)`,
      }}
    />
  );
};
