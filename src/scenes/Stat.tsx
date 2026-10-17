import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette, safe, typeSize} from '../brand';
import {useEnter} from './useEnter';
import type {SceneProps} from './types';

export const Stat: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {style} = useEnter(durationInFrames);
  const enter = spring({frame: frame - 10, fps, config: {damping: 18, stiffness: 90}});
  const digits = (copy.stat?.value ?? '').split('');
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: safe.side, ...style}}>
      <div style={{display: 'flex', gap: 8}}>
        {digits.map((d, i) => (
          <span
            key={`${d}-${i}`}
            style={{
              color: palette.blue,
              fontWeight: 700,
              fontSize: typeSize('hook', width, height) * 1.6,
              opacity: interpolate(enter, [i / (digits.length + 1), 1], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            {d}
          </span>
        ))}
      </div>
      <div style={{color: palette.muted, fontSize: typeSize('body', width, height), marginTop: 24}}>
        {copy.stat?.label ?? copy.headline}
      </div>
    </AbsoluteFill>
  );
};
