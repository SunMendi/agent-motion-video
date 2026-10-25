import React from 'react';
import { interpolate, Easing } from 'remotion';

interface AnimatedCursorProps {
  frame: number;
  clickFrame: number;
  x: number;
  y: number;
  color?: string;
}

export const AnimatedCursor: React.FC<AnimatedCursorProps> = ({
  frame,
  clickFrame,
  x,
  y,
  color = '#38BDF8',
}) => {
  const isClicking = frame >= clickFrame && frame <= clickFrame + 18;
  const clickElapsed = Math.max(0, frame - clickFrame);

  // Click squash
  const scale = isClicking
    ? interpolate(clickElapsed, [0, 4, 18], [1, 0.82, 1], {
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      })
    : 1;

  // Expanding ripple
  const rippleProgress = isClicking ? clickElapsed / 18 : 0;
  const rippleScale = interpolate(rippleProgress, [0, 1], [0.5, 2.4]);
  const rippleOpacity = interpolate(rippleProgress, [0, 0.3, 1], [0.8, 0.5, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 55,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      {/* Expanding Ripple Wave */}
      {isClicking && (
        <div
          style={{
            position: 'absolute',
            left: -20,
            top: -20,
            width: 40,
            height: 40,
            borderRadius: 9999,
            border: `2px solid ${color}`,
            transform: `scale(${rippleScale})`,
            opacity: rippleOpacity,
          }}
        />
      )}

      {/* Vector Pointer Arrow */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6))',
        }}
      >
        <path
          d="M3 3l7 18 3-7 7-3L3 3z"
          fill="#FFFFFF"
          stroke="#090B12"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
