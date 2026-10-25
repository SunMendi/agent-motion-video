import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

interface SceneCutTransitionProps {
  type?: 'orange-sweep' | 'cyan-sweep' | 'shockwave' | 'glitch';
}

export const SceneCutTransition: React.FC<SceneCutTransitionProps> = ({ type = 'orange-sweep' }) => {
  const frame = useCurrentFrame();

  // 10-frame transition duration (0 to 10)
  const sweepX = interpolate(frame, [0, 9], [-80, 180]);
  const opacity = interpolate(frame, [0, 4, 9], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isCyan = type === 'cyan-sweep';
  const colorRgb = isCyan ? '6, 182, 212' : '249, 115, 22';

  if (type === 'shockwave') {
    const scale = interpolate(frame, [0, 9], [0.3, 3]);
    const shockOpacity = interpolate(frame, [0, 2, 9], [0, 0.9, 0]);
    return (
      <AbsoluteFill className="pointer-events-none flex items-center justify-center overflow-hidden z-40">
        <div
          style={{
            transform: `scale(${scale})`,
            opacity: shockOpacity,
            borderColor: `rgba(${colorRgb}, 0.9)`,
            boxShadow: `0 0 60px rgba(${colorRgb}, 0.8)`,
          }}
          className="w-96 h-96 rounded-full border-8"
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill className="pointer-events-none overflow-hidden z-40">
      {/* High-tech diagonal laser sweep blade */}
      <div
        style={{
          opacity,
          background: `linear-gradient(110deg, transparent ${sweepX - 35}%, rgba(${colorRgb}, 0.15) ${sweepX - 15}%, rgba(${colorRgb}, 0.9) ${sweepX}%, rgba(255, 255, 255, 0.95) ${sweepX + 4}%, rgba(${colorRgb}, 0.9) ${sweepX + 8}%, rgba(${colorRgb}, 0.15) ${sweepX + 25}%, transparent ${sweepX + 45}%)`,
        }}
        className="w-full h-full absolute inset-0"
      />

      {/* Subtle flash bloom */}
      <div
        style={{
          opacity: opacity * 0.4,
          backgroundColor: `rgba(${colorRgb}, 0.5)`,
        }}
        className="w-full h-full absolute inset-0 mix-blend-screen"
      />
    </AbsoluteFill>
  );
};
