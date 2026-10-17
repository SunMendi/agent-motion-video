import React from 'react';
import {AbsoluteFill} from 'remotion';
import {safe} from '../brand';

/** Shared scene layout: the visual stage on top, the copy block under it,
 * with the caption zone at the bottom kept clear. */
export const Stage: React.FC<{
  wide: boolean;
  /** Accepted for call-site symmetry; not needed by the layout itself. */
  width?: number;
  height: number;
  visual: React.ReactNode;
  copy: React.ReactNode;
  gap?: number;
  style?: React.CSSProperties;
}> = ({wide, height, visual, copy, gap = 44, style}) => (
  <AbsoluteFill
    style={{
      padding: safe.side,
      paddingTop: Math.round(height * 0.09),
      paddingBottom: Math.round(height * 0.23),
      justifyContent: 'center',
      alignItems: wide ? 'center' : 'stretch',
      gap,
      ...style,
    }}
  >
    {visual}
    {copy}
  </AbsoluteFill>
);

/** The kicker and headline block under the visual. */
export const CopyBlock: React.FC<{
  kicker?: string;
  headline: string;
  headlineSize: number;
  kickerColor?: string;
  align?: 'left' | 'center';
  maxWidth?: number;
}> = ({kicker, headline, headlineSize, kickerColor, align = 'left', maxWidth}) => (
  <div style={{textAlign: align, maxWidth}}>
    {kicker ? (
      <div
        style={{
          color: kickerColor ?? '#1668E3',
          fontWeight: 700,
          fontSize: Math.round(headlineSize * 0.36),
          letterSpacing: 1,
          marginBottom: 14,
        }}
      >
        {kicker}
      </div>
    ) : null}
    <div
      style={{
        color: '#0B1220',
        fontWeight: 700,
        fontSize: headlineSize,
        lineHeight: 1.28,
      }}
    >
      {headline}
    </div>
  </div>
);
