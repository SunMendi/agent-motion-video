import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

/** A mouse pointer that moves onto the spot and clicks, with ripple rings. */
export const CursorClick: React.FC<{
  /** where the pointer lands, in px from the parent's top-left */
  to: {x: number; y: number};
  from?: {x: number; y: number};
  /** frame of the click */
  clickAt?: number;
  repeat?: number;
  size?: number;
}> = ({to, from, clickAt = 14, repeat = 0, size = 54}) => {
  const frame = useCurrentFrame();
  const start = from ?? {x: to.x + 90, y: to.y + 120};
  const first = interpolate(frame, [2, clickAt], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const looped = repeat > 0 ? (frame - 2) % repeat : frame - 2;
  const p = repeat > 0 && frame > clickAt ? 1 : first;
  const x = start.x + (to.x - start.x) * p;
  const y = start.y + (to.y - start.y) * p;
  const pressAt = repeat > 0 && frame > clickAt ? looped === 0 : frame >= clickAt && frame < clickAt + 6;
  const press = pressAt ? 0.86 : 1;
  const sinceClick = repeat > 0 && frame > clickAt ? looped : frame - clickAt;
  const ripple =
    sinceClick >= 0 && sinceClick < 22 ? interpolate(sinceClick, [0, 22], [0, 1]) : -1;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      {ripple >= 0 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: to.x - 34 - 34 * ripple,
              top: to.y - 34 - 34 * ripple,
              width: 68 + 68 * ripple,
              height: 68 + 68 * ripple,
              borderRadius: '50%',
              border: `3px solid rgba(22,104,227,${0.5 * (1 - ripple)})`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: to.x - 22 - 20 * ripple,
              top: to.y - 22 - 20 * ripple,
              width: 44 + 40 * ripple,
              height: 44 + 40 * ripple,
              borderRadius: '50%',
              border: `2px solid rgba(22,104,227,${0.35 * (1 - ripple)})`,
            }}
          />
        </>
      ) : null}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{
          position: 'absolute',
          left: x - size * 0.18,
          top: y - size * 0.12,
          transform: `scale(${press})`,
          transformOrigin: '20% 15%',
          filter: 'drop-shadow(0 4px 8px rgba(15,32,71,0.35))',
          opacity: first > 0 || repeat > 0 ? 1 : 0,
        }}
      >
        <path
          d="M5 2.5 L19.5 12.4 L12.6 13.3 L15.7 20.4 L12.7 21.7 L9.6 14.5 L5 19 Z"
          fill="#0B1220"
          stroke="#ffffff"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
