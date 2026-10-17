import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {palette, safe, typeSize} from '../brand';
import {useEnter} from './useEnter';
import {LogoPlate} from '../parts/LogoPlate';
import type {SceneProps} from './types';

export const Cta: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const frame = useCurrentFrame();
  const {style} = useEnter(durationInFrames);
  const beat = interpolate(Math.sin(frame / 6), [-1, 1], [1, 1.06]);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: safe.side, ...style}}>
      <LogoPlate width={Math.round(width * 0.5)} />
      <div
        style={{
          color: palette.ink,
          fontWeight: 700,
          textAlign: 'center',
          fontSize: typeSize('headline', width, height),
          marginTop: 56,
          lineHeight: 1.3,
          maxWidth: width - safe.side * 2,
        }}
      >
        {copy.headline}
      </div>
      <div
        style={{
          marginTop: 48,
          background: palette.blue,
          color: palette.ink,
          fontWeight: 700,
          fontSize: typeSize('body', width, height),
          padding: '26px 56px',
          borderRadius: 999,
          transform: `scale(${beat})`,
          boxShadow: '0 20px 50px rgba(22,104,227,0.45)',
        }}
      >
        {copy.cta ?? 'ইনবক্স করুন'}
      </div>
      {copy.contact ? (
        <div style={{color: palette.muted, fontSize: typeSize('kicker', width, height), marginTop: 32}}>
          {copy.contact}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
