import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {safe} from '../brand';
import {Kinetic} from '../text/Kinetic';

/** Shared scene layout: a slowly pushing camera over the visual and the copy,
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
}> = ({wide, height, visual, copy, gap = 44, style}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  // slow push in, then a touch faster at the end of the beat
  const cam = interpolate(frame, [0, durationInFrames], [1, 1.045], {
    extrapolateRight: 'clamp',
  });
  void fps;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: safe.side,
        paddingTop: Math.round(height * 0.09),
        paddingBottom: Math.round(height * 0.23),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: wide ? 'center' : 'stretch',
          gap,
          width: '100%',
          transform: `scale(${cam})`,
          transformOrigin: 'center 42%',
        }}
      >
        {visual}
        {copy}
      </div>
    </div>
  );
};

/** The kicker and headline block under the visual. */
export const CopyBlock: React.FC<{
  kicker?: string;
  headline: string;
  headlineSize: number;
  kickerColor?: string;
  align?: 'left' | 'center';
  maxWidth?: number;
}> = ({kicker, headline, headlineSize, kickerColor, align = 'left', maxWidth}) => {
  const frame = useCurrentFrame();
  const kickerWipe = interpolate(frame, [2, 14], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{textAlign: align, maxWidth}}>
      {kicker ? (
        <div
          style={{
            color: kickerColor ?? '#1668E3',
            fontWeight: 700,
            fontSize: Math.round(headlineSize * 0.36),
            letterSpacing: 1,
            marginBottom: 14,
            clipPath: `inset(0 ${100 - kickerWipe}% 0 0)`,
            whiteSpace: 'nowrap',
            display: 'inline-block',
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div style={{lineHeight: 1.28}}>
        <Kinetic
          text={headline}
          size={headlineSize}
          color="#0B1220"
          align={align}
        />
      </div>
    </div>
  );
};
