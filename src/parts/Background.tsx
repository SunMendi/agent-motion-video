import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette, shadow} from '../brand';

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drift = interpolate(Math.sin(frame / (fps * 5)), [-1, 1], [-3, 3]);
  const drift2 = interpolate(Math.cos(frame / (fps * 4)), [-1, 1], [-4, 4]);
  return (
    <div style={{position: 'absolute', inset: 0, backgroundColor: palette.bg, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${22 + drift}% 18%, rgba(22,104,227,0.10), transparent 42%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${84 - drift}% 88%, rgba(11,63,168,0.08), transparent 46%)`,
        }}
      />
      {/* slow floating orbs */}
      <div
        style={{
          position: 'absolute',
          width: 340,
          height: 340,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 32% 30%, rgba(22,104,227,0.10), rgba(22,104,227,0) 70%)',
          left: -90,
          top: 160 + drift2 * 14,
          filter: 'blur(4px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 60% 40%, rgba(11,63,168,0.08), rgba(11,63,168,0) 70%)',
          right: -140,
          bottom: 260 - drift2 * 16,
          filter: 'blur(4px)',
        }}
      />
      {/* dot grid, very light */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(15,32,71,0.055) 1.6px, transparent 1.6px)',
          backgroundSize: '46px 46px',
          backgroundPosition: `0 ${drift * 3}px`,
          maskImage: 'radial-gradient(circle at 50% 40%, black 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 40%, black 30%, transparent 85%)',
        }}
      />
    </div>
  );
};

/** A floating white panel used as the stage for the code-drawn screens. */
export const Panel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({children, style}) => (
  <div
    style={{
      background: palette.surface,
      borderRadius: 26,
      border: `1px solid ${palette.line}`,
      boxShadow: shadow.card,
      padding: 18,
      ...style,
    }}
  >
    {children}
  </div>
);
