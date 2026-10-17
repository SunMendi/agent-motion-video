import React from 'react';
import {AbsoluteFill} from 'remotion';
import {palette, safe, typeSize} from '../brand';
import {useEnter} from './useEnter';
import type {SceneProps} from './types';

export const Problem: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const {style, enter} = useEnter(durationInFrames);
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: safe.side, ...style}}>
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 32,
          padding: 48,
        }}
      >
        <div style={{color: palette.muted, fontSize: typeSize('kicker', width, height), marginBottom: 24}}>
          {copy.kicker}
        </div>
        {copy.stat ? (
          <div style={{display: 'flex', alignItems: 'baseline', gap: 24, flexWrap: 'wrap'}}>
            <div style={{color: palette.alert, fontWeight: 700, fontSize: typeSize('hook', width, height)}}>
              {copy.stat.value}
            </div>
            <div style={{color: palette.muted, fontSize: typeSize('body', width, height)}}>
              {copy.stat.label}
            </div>
          </div>
        ) : null}
        <div
          style={{
            color: palette.ink,
            fontWeight: 700,
            fontSize: typeSize('headline', width, height),
            lineHeight: 1.3,
            marginTop: 24,
            opacity: enter,
          }}
        >
          {copy.headline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
