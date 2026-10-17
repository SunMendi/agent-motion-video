import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {palette, safe, typeSize} from '../brand';
import {useEnter} from './useEnter';
import type {SceneProps} from './types';

export const PromiseScene: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const frame = useCurrentFrame();
  const {style} = useEnter(durationInFrames);
  const sweep = interpolate(frame, [10, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const card = (dim: boolean, grow: number): React.CSSProperties => ({
    flex: 1,
    minWidth: 0,
    opacity: dim ? interpolate(sweep, [0, 1], [1, 0.45]) : interpolate(sweep, [0, 1], [0.45, 1]),
    transform: `scale(${1 + grow * sweep})`,
    background: dim ? 'rgba(255,255,255,0.04)' : 'rgba(22,104,227,0.18)',
    border: `1px solid ${dim ? 'rgba(255,255,255,0.08)' : 'rgba(22,104,227,0.5)'}`,
    borderRadius: 28,
    padding: 40,
    color: palette.ink,
    fontWeight: 700,
    fontSize: typeSize('body', width, height),
    lineHeight: 1.4,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: safe.side, ...style}}>
      <div style={{color: palette.muted, fontSize: typeSize('kicker', width, height), marginBottom: 24}}>
        {copy.kicker}
      </div>
      <div
        style={{
          color: palette.ink,
          fontWeight: 700,
          fontSize: typeSize('headline', width, height),
          marginBottom: 48,
          lineHeight: 1.3,
        }}
      >
        {copy.headline}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
        <div style={card(true, -0.04)}>{copy.before}</div>
        <div style={{color: palette.blue, fontSize: typeSize('headline', width, height)}}>{'→'}</div>
        <div style={card(false, 0.04)}>{copy.after}</div>
      </div>
    </AbsoluteFill>
  );
};
