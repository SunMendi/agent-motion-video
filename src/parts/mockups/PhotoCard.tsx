import React from 'react';
import {palette, shadow} from '../../brand';

/** A generated photo card: gradient image area plus a caption strip. */
export const PhotoCard: React.FC<{
  label: string;
  width?: number;
  height?: number;
  hue?: number;
  style?: React.CSSProperties;
}> = ({label, width = 320, height = 220, hue = 210, style}) => (
  <div
    style={{
      width,
      height,
      borderRadius: 18,
      overflow: 'hidden',
      background: palette.surface,
      border: `1px solid ${palette.line}`,
      boxShadow: shadow.card,
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
  >
    <div
      style={{
        flex: 1,
        background: `linear-gradient(135deg, hsl(${hue} 78% 62%), hsl(${hue + 24} 70% 44%))`,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: 16,
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'rgba(255,255,255,0.85)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          display: 'flex',
          gap: 8,
        }}
      >
        <div style={{width: 54, height: 10, borderRadius: 99, background: 'rgba(255,255,255,0.6)'}} />
        <div style={{width: 30, height: 10, borderRadius: 99, background: 'rgba(255,255,255,0.4)'}} />
      </div>
    </div>
    <div style={{padding: '12px 16px', fontSize: 17, fontWeight: 700, color: palette.ink}}>{label}</div>
  </div>
);
