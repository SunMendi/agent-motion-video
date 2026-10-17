import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette, shadow} from '../brand';

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drift = interpolate(Math.sin(frame / (fps * 5)), [-1, 1], [-3, 3]);
  return (
    <AbsoluteFill style={{backgroundColor: palette.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${22 + drift}% 18%, rgba(22,104,227,0.10), transparent 42%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${84 - drift}% 88%, rgba(11,63,168,0.08), transparent 46%)`,
        }}
      />
    </AbsoluteFill>
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
