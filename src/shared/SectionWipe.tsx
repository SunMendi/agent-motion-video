import React from 'react';
import { interpolate } from 'remotion';

export interface SectionWipeProps {
  frame: number;
}

/**
 * Clean dual-tone section sweep transition inspired by the WhatsApp reference video.
 * Runs during the first 14 frames of a new story chapter.
 */
export const SectionWipe: React.FC<SectionWipeProps> = ({ frame }) => {
  if (frame >= 14) return null;

  const tealX = interpolate(frame, [0, 11], [0, -100], { extrapolateRight: 'clamp' });
  const orangeX = interpolate(frame, [0, 13], [0, -100], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 90,
        overflow: 'hidden',
      }}
    >
      {/* Warm orange secondary panel */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#E75B36',
          transform: `translateX(${orangeX}%)`,
        }}
      />
      {/* Deep teal primary panel */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#167F97',
          transform: `translateX(${tealX}%)`,
        }}
      />
    </div>
  );
};
