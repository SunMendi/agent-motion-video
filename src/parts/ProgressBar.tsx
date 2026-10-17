import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette} from '../brand';

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const pct = interpolate(frame, [0, durationInFrames - 1], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: 8,
        width: `${pct}%`,
        background: `linear-gradient(90deg, ${palette.blueDeep}, ${palette.blue})`,
      }}
    />
  );
};
