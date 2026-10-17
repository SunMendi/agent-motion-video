import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {palette, shadow} from '../../brand';
import {popStyle} from '../../scenes/useEnter';

/** An audio player widget with animated waveform bars. */
export const AudioPlayer: React.FC<{bars?: number; width?: number; delay?: number; title?: string}> = ({
  bars = 26,
  width = 460,
  delay = 0,
  title = 'অডিও সামারি',
}) => {
  const frame = useCurrentFrame();
  const pop = popStyle(frame, 30, delay);
  return (
    <div
      style={{
        width,
        background: palette.surface,
        borderRadius: 22,
        border: `1px solid ${palette.line}`,
        boxShadow: shadow.pop,
        padding: 22,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        ...pop,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 99,
          background: palette.blue,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 10px 24px rgba(22,104,227,0.35)',
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '20px solid #fff',
            borderTop: '12px solid transparent',
            borderBottom: '12px solid transparent',
            marginLeft: 6,
          }}
        />
      </div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{fontSize: 20, fontWeight: 700, color: palette.ink, marginBottom: 10}}>{title}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 4, height: 44}}>
          {new Array(bars).fill(0).map((_, i) => {
            const wave = Math.abs(Math.sin((frame - delay) / 7 + i * 0.6));
            const h = interpolate(wave, [0, 1], [8, 42]);
            return (
              <div
                key={i}
                style={{
                  width: 6,
                  height: h,
                  borderRadius: 99,
                  background: i % 4 === 0 ? palette.blue : palette.blueSoft,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
