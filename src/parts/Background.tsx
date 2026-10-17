import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette} from '../brand';

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drift = interpolate(Math.sin(frame / (fps * 4)), [-1, 1], [-6, 6]);
  return (
    <AbsoluteFill style={{backgroundColor: palette.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${50 + drift}% 30%, rgba(22,104,227,0.35), transparent 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${30 - drift}% 85%, rgba(11,63,168,0.35), transparent 50%)`,
        }}
      />
    </AbsoluteFill>
  );
};
