import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEMES, TYPE_SCALE, MOTION_PHYSICS } from '../design-system';

export interface CompetitorData {
  name: string;
  metricLabel: string;
  metricValue: string;
  scorePercent: number; // 0 - 100
  color: string;
  isWinner?: boolean;
}

export interface MetricBattleStageProps {
  battleTitle: string;
  competitorA?: CompetitorData;
  competitorB?: CompetitorData;
}

export const MetricBattleStage: React.FC<MetricBattleStageProps> = ({
  battleTitle,
  competitorA = {
    name: 'TRADITIONAL METHOD',
    metricLabel: 'Processing Time',
    metricValue: '4.8 Hours',
    scorePercent: 30,
    color: '#EF4444',
  },
  competitorB = {
    name: 'AI AUTOMATION AGENT',
    metricLabel: 'Processing Time',
    metricValue: '12 Seconds',
    scorePercent: 95,
    color: '#10B981',
    isWinner: true,
  },
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = THEMES.BENCHMARK_BATTLE;

  const headerSpring = spring({
    frame,
    fps,
    config: MOTION_PHYSICS.bouncy_impact,
  });

  const barProgress = interpolate(frame, [15, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const winnerSpring = spring({
    frame: Math.max(0, frame - 45),
    fps,
    config: MOTION_PHYSICS.bouncy_impact,
  });

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
        fontFamily: 'Space Grotesk, Hind Siliguri, sans-serif',
      }}
    >
      {/* Versus Hook Header */}
      <div
        style={{
          transform: `scale(${headerSpring})`,
          opacity: headerSpring,
          textAlign: 'center',
          marginBottom: '48px',
        }}
      >
        <span
          style={{
            background: theme.accent,
            color: '#FFFFFF',
            fontSize: `${TYPE_SCALE.sm}px`,
            fontWeight: 800,
            padding: '6px 18px',
            borderRadius: '999px',
            letterSpacing: '2px',
          }}
        >
          PERFORMANCE BENCHMARK
        </span>
        <h2 style={{ fontSize: `${TYPE_SCALE['3xl']}px`, fontWeight: 800, marginTop: '16px', lineHeight: 1.2 }}>
          {battleTitle}
        </h2>
      </div>

      {/* Battle Cards */}
      <div style={{ width: '100%', maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Competitor A */}
        <div
          style={{
            background: theme.panel,
            border: `2px solid ${theme.panelBorder}`,
            borderRadius: '20px',
            padding: '24px 28px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: `${TYPE_SCALE.lg}px`, fontWeight: 700, color: theme.textSecondary }}>
              {competitorA.name}
            </span>
            <span style={{ fontSize: `${TYPE_SCALE.xl}px`, fontWeight: 800, color: competitorA.color }}>
              {competitorA.metricValue}
            </span>
          </div>

          <div style={{ width: '100%', height: '14px', background: '#27272A', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${competitorA.scorePercent * barProgress}%`,
                height: '100%',
                background: competitorA.color,
                borderRadius: '999px',
              }}
            />
          </div>
        </div>

        {/* Competitor B (Winner) */}
        <div
          style={{
            background: competitorB.isWinner ? '#18241D' : theme.panel,
            border: `2px solid ${competitorB.color}`,
            borderRadius: '20px',
            padding: '24px 28px',
            boxShadow: competitorB.isWinner ? `0 0 35px rgba(16, 185, 129, 0.35)` : 'none',
            position: 'relative',
          }}
        >
          {competitorB.isWinner && (
            <div
              style={{
                transform: `scale(${winnerSpring})`,
                opacity: winnerSpring,
                position: 'absolute',
                top: '-16px',
                right: '24px',
                background: competitorB.color,
                color: '#000000',
                fontSize: `${TYPE_SCALE.xs}px`,
                fontWeight: 800,
                padding: '4px 14px',
                borderRadius: '999px',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
              }}
            >
              👑 WINNER (99% FASTER)
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: `${TYPE_SCALE.xl}px`, fontWeight: 800, color: '#FFFFFF' }}>
              {competitorB.name}
            </span>
            <span style={{ fontSize: `${TYPE_SCALE['2xl']}px`, fontWeight: 800, color: competitorB.color }}>
              {competitorB.metricValue}
            </span>
          </div>

          <div style={{ width: '100%', height: '18px', background: '#27272A', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${competitorB.scorePercent * barProgress}%`,
                height: '100%',
                background: competitorB.color,
                borderRadius: '999px',
                boxShadow: `0 0 16px ${competitorB.color}`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
