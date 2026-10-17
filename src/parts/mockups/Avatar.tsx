import React from 'react';
import {palette} from '../../brand';

/** A simple person glyph. Mood tints the background circle. */
export const Avatar: React.FC<{size?: number; mood?: 'ok' | 'sad' | 'away'; style?: React.CSSProperties}> = ({
  size = 96,
  mood = 'ok',
  style,
}) => {
  const bg = mood === 'sad' ? palette.alertSoft : mood === 'away' ? '#EEF1F7' : palette.blueSoft;
  const fg = mood === 'sad' ? palette.alert : mood === 'away' ? palette.faint : palette.blue;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 99,
        background: bg,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        style={{
          width: size * 0.34,
          height: size * 0.34,
          borderRadius: 99,
          background: fg,
          position: 'absolute',
          top: size * 0.18,
        }}
      />
      <div
        style={{
          width: size * 0.62,
          height: size * 0.38,
          borderRadius: `${size * 0.31}px ${size * 0.31}px 0 0`,
          background: fg,
        }}
      />
    </div>
  );
};
