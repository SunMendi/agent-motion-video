import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette} from '../../brand';
import {toBangla} from '../../text/bn';

/** A countdown ring. `seconds` long, drawn as an SVG arc. */
export const TimerRing: React.FC<{seconds?: number; size?: number; label?: string}> = ({
  seconds = 3,
  size = 200,
  label,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const total = seconds * fps;
  const progress = interpolate(frame, [0, total], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const left = Math.max(1, Math.ceil(seconds - frame / fps));
  const r = size / 2 - size * 0.08;
  const c = 2 * Math.PI * r;
  return (
    <div style={{width: size, height: size, position: 'relative'}}>
      <svg width={size} height={size} style={{transform: 'rotate(-90deg)'}}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={palette.line} strokeWidth={size * 0.07} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={palette.alert}
          strokeWidth={size * 0.07}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * progress}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: palette.ink,
        }}
      >
        <div style={{fontSize: size * 0.34, fontWeight: 700, lineHeight: 1}}>{toBangla(left)}</div>
        {label ? (
          <div style={{fontSize: size * 0.1, color: palette.muted, marginTop: 6}}>{label}</div>
        ) : null}
      </div>
    </div>
  );
};
