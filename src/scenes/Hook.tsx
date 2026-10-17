import React from 'react';
import {AbsoluteFill} from 'remotion';
import {palette, safe, typeSize} from '../brand';
import {useEnter} from './useEnter';
import type {SceneProps} from './types';

export const Hook: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const {style} = useEnter(durationInFrames);
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: safe.side, ...style}}>
      <div
        style={{
          color: palette.alert,
          fontSize: typeSize('kicker', width, height),
          letterSpacing: 2,
          marginBottom: 28,
        }}
      >
        {copy.kicker}
      </div>
      <div
        style={{
          color: palette.ink,
          fontWeight: 700,
          fontSize: typeSize('hook', width, height),
          lineHeight: 1.25,
          maxWidth: width - safe.side * 2,
        }}
      >
        {copy.headline}
      </div>
      <div style={{height: 10, width: 220, background: palette.alert, marginTop: 40, borderRadius: 6}} />
    </AbsoluteFill>
  );
};
