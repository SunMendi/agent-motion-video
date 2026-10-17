import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette, safe, typeSize} from '../brand';
import {useEnter} from './useEnter';
import type {SceneProps} from './types';

export const Feature: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {style} = useEnter(durationInFrames);
  const wide = width > height;
  const bullets = copy.bullets ?? [];
  const step = Math.max(6, Math.floor((durationInFrames - 40) / Math.max(bullets.length, 1)));
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: wide ? 'center' : 'stretch',
        padding: safe.side,
        ...style,
      }}
    >
      <div
        style={{
          color: palette.blue,
          fontSize: typeSize('kicker', width, height),
          marginBottom: 24,
          textAlign: wide ? 'center' : 'left',
        }}
      >
        {copy.kicker}
      </div>
      <div
        style={{
          color: palette.ink,
          fontWeight: 700,
          fontSize: typeSize('headline', width, height),
          lineHeight: 1.3,
          marginBottom: 48,
          maxWidth: wide ? Math.min(width - safe.side * 2, 1400) : 'none',
          textAlign: wide ? 'center' : 'left',
        }}
      >
        {copy.headline}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
          alignItems: wide ? 'center' : 'stretch',
        }}
      >
        {bullets.map((bullet, i) => {
          const at = 20 + i * step;
          const enter = spring({frame: frame - at, fps, config: {damping: 16, stiffness: 140}});
          const leave = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={bullet}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                opacity: Math.min(enter, leave),
                transform: `translateX(${interpolate(enter, [0, 1], [-40, 0])}px)`,
              }}
            >
              <div style={{width: 14, height: 14, borderRadius: 8, background: palette.blue, flexShrink: 0}} />
              <div style={{color: palette.ink, fontSize: typeSize('body', width, height)}}>{bullet}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
