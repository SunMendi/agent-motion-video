import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEMES, TYPE_SCALE, MOTION_PHYSICS } from '../design-system';

export interface ProductAdStageProps {
  toolNumber?: string;
  toolName: string;
  tagline: string;
  problemText: string;
  solutionText: string;
  badgeText?: string;
  logoSrc?: string;
}

export const ProductAdStage: React.FC<ProductAdStageProps> = ({
  toolNumber = '01',
  toolName,
  tagline,
  problemText,
  solutionText,
  badgeText = '100% FREE',
  logoSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = THEMES.COMMERCIAL_AD;

  const headerSpring = spring({
    frame,
    fps,
    config: MOTION_PHYSICS.bouncy_impact,
  });

  const cardSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: MOTION_PHYSICS.bouncy_impact,
  });

  const badgeScale = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: MOTION_PHYSICS.bouncy_impact,
  });

  const pulse = Math.sin(frame / 6) * 4;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 40px',
        color: theme.textPrimary,
        fontFamily: 'Hind Siliguri, Space Grotesk, sans-serif',
      }}
    >
      {/* Top Header Pill */}
      <div
        style={{
          transform: `scale(${headerSpring})`,
          opacity: headerSpring,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: theme.panel,
          border: `2px solid ${theme.panelBorder}`,
          borderRadius: '999px',
          padding: '12px 32px',
          boxShadow: `0 8px 32px ${theme.accentGlow}`,
          marginBottom: '36px',
        }}
      >
        <span
          style={{
            background: theme.accent,
            color: '#000000',
            fontWeight: 800,
            fontSize: `${TYPE_SCALE.sm}px`,
            padding: '4px 12px',
            borderRadius: '999px',
          }}
        >
          {toolNumber}
        </span>
        {logoSrc && (
          <img
            src={logoSrc}
            alt={toolName}
            style={{ width: '38px', height: '38px', objectFit: 'contain' }}
          />
        )}
        <span style={{ fontSize: `${TYPE_SCALE.xl}px`, fontWeight: 800, letterSpacing: '-0.5px' }}>
          {toolName}
        </span>
      </div>

      {/* Main Tagline */}
      <h2
        style={{
          fontSize: `${TYPE_SCALE['3xl']}px`,
          fontWeight: 800,
          textAlign: 'center',
          lineHeight: 1.25,
          marginBottom: '40px',
          color: theme.textPrimary,
          textShadow: `0 4px 20px ${theme.accentGlow}`,
        }}
      >
        {tagline}
      </h2>

      {/* Problem vs Solution Split Card */}
      <div
        style={{
          transform: `translateY(${interpolate(cardSpring, [0, 1], [40, 0])}px)`,
          opacity: cardSpring,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* The Problem Box */}
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderLeft: '6px solid #EF4444',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ color: '#EF4444', fontSize: `${TYPE_SCALE.sm}px`, fontWeight: 700, marginBottom: '6px' }}>
            সমস্যা / THE PAIN POINT
          </div>
          <div style={{ fontSize: `${TYPE_SCALE.lg}px`, color: theme.textSecondary, lineHeight: 1.4 }}>
            {problemText}
          </div>
        </div>

        {/* The Solution Box */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.12)',
            borderLeft: '6px solid #10B981',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 30px rgba(16, 185, 129, 0.15)',
          }}
        >
          <div style={{ color: '#10B981', fontSize: `${TYPE_SCALE.sm}px`, fontWeight: 700, marginBottom: '6px' }}>
            সমাধান / THE SOLUTION
          </div>
          <div style={{ fontSize: `${TYPE_SCALE.xl}px`, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.35 }}>
            {solutionText}
          </div>
        </div>
      </div>

      {/* High-Impact Badge */}
      {badgeText && (
        <div
          style={{
            transform: `scale(${badgeScale}) translateY(${pulse}px)`,
            opacity: badgeScale,
            marginTop: '44px',
            background: theme.badgeBg,
            color: theme.badgeText,
            fontSize: `${TYPE_SCALE.md}px`,
            fontWeight: 800,
            padding: '12px 32px',
            borderRadius: '999px',
            letterSpacing: '1px',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
          }}
        >
          {badgeText}
        </div>
      )}
    </div>
  );
};
