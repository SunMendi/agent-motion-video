import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

/** Words rise out of a mask, one after another. Kinetic headline type. */
export const Kinetic: React.FC<{
  text: string;
  size: number;
  color?: string;
  delayStep?: number;
  weight?: number;
  align?: 'left' | 'center';
  style?: React.CSSProperties;
}> = ({text, size, color = '#0B1220', delayStep = 3, weight = 700, align = 'left', style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  return (
    <span style={{display: 'inline', ...style}}>
      {words.map((w, i) => {
        const s = spring({frame: frame - 4 - i * delayStep, fps, config: {damping: 14, stiffness: 210}});
        return (
          <span
            key={`${w}-${i}`}
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              verticalAlign: 'bottom',
              paddingBottom: Math.round(size * 0.12),
              marginBottom: -Math.round(size * 0.12),
              marginRight: i < words.length - 1 ? Math.round(size * 0.26) : 0,
              textAlign: align,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - s) * 100}%) rotate(${(1 - s) * 4}deg)`,
                opacity: Math.min(1, s * 1.5),
                fontSize: size,
                fontWeight: weight,
                color,
                lineHeight: 1.28,
                whiteSpace: 'nowrap',
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </span>
  );
};
