import React from 'react';
import {palette} from '../../brand';

/** A red rubber stamp that slams in. Pass an animation style from `popStyle`. */
export const Stamp: React.FC<{text: string; size?: number; style?: React.CSSProperties}> = ({
  text,
  size = 92,
  style,
}) => (
  <div
    style={{
      border: `6px solid ${palette.alert}`,
      borderRadius: 14,
      color: palette.alert,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.1,
      padding: '10px 26px',
      transformOrigin: 'center',
      background: 'rgba(255,255,255,0.6)',
      boxShadow: 'inset 0 0 0 3px rgba(255,90,78,0.18)',
      ...style,
    }}
  >
    {text}
  </div>
);
