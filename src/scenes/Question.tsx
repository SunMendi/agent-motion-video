import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette, safe, typeSize} from '../brand';
import {useEnter} from './useEnter';
import type {SceneProps} from './types';

export const Question: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {style} = useEnter(durationInFrames);
  const pulse = interpolate(Math.sin((frame / fps) * Math.PI * 1.2), [-1, 1], [0.35, 0.8]);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: safe.side, ...style}}>
      <div
        style={{
          position: 'absolute',
          width: width * 0.8,
          height: width * 0.8,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(22,104,227,${pulse}), transparent 65%)`,
        }}
      />
      <div
        style={{
          position: 'relative',
          color: palette.ink,
          fontWeight: 700,
          textAlign: 'center',
          fontSize: typeSize('hook', width, height),
          lineHeight: 1.25,
          maxWidth: width - safe.side * 2,
        }}
      >
        {copy.headline}
      </div>
    </AbsoluteFill>
  );
};
