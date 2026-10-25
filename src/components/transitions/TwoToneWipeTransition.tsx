import React from 'react';
import { interpolate, Easing } from 'remotion';

interface TwoToneWipeProps {
  progress: number; // 0 to 1
  accentColor?: string;
  fillColor?: string;
}

export const TwoToneWipe: React.FC<TwoToneWipeProps> = ({
  progress,
  accentColor = '#F97316',
  fillColor = '#090A10',
}) => {
  if (progress <= 0 || progress >= 1) return null;

  // The accent stripe leads slightly ahead of the fill
  const accentProgress = interpolate(progress, [0, 0.85], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const fillProgress = interpolate(progress, [0.15, 1], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 60,
        overflow: 'hidden',
      }}
    >
      {/* 1. Leading Accent Stripe */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: `${accentProgress}%`,
          backgroundColor: accentColor,
          boxShadow: `0 -10px 40px ${accentColor}`,
        }}
      />

      {/* 2. Trailing Full Canvas Fill */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: `${fillProgress}%`,
          backgroundColor: fillColor,
        }}
      />
    </div>
  );
};
