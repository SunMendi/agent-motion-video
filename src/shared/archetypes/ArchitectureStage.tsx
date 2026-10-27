import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEMES, TYPE_SCALE, MOTION_PHYSICS } from '../design-system';

export interface ArchitectureNode {
  id: string;
  label: string;
  sublabel: string;
  status: string;
  active?: boolean;
}

export interface ArchitectureStageProps {
  title: string;
  subtitle: string;
  nodes?: ArchitectureNode[];
}

export const ArchitectureStage: React.FC<ArchitectureStageProps> = ({
  title,
  subtitle,
  nodes = [
    { id: '1', label: 'Client / App', sublabel: 'HTTP Request', status: 'Active' },
    { id: '2', label: 'API Gateway', sublabel: 'Auth & Rate Limit', status: '200 OK' },
    { id: '3', label: 'AI Agent (MCP)', sublabel: 'Tool Orchestration', status: 'Running', active: true },
    { id: '4', label: 'Vector DB', sublabel: 'Embeddings Index', status: 'Synced' },
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = THEMES.SYSTEM_ARCHITECTURE;

  const titleSpring = spring({
    frame,
    fps,
    config: MOTION_PHYSICS.smooth_presentation,
  });

  const packetProgress = (frame % 45) / 45;

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
      {/* Blueprint Title */}
      <div
        style={{
          transform: `translateY(${interpolate(titleSpring, [0, 1], [-20, 0])}px)`,
          opacity: titleSpring,
          textAlign: 'center',
          marginBottom: '44px',
        }}
      >
        <div
          style={{
            fontSize: `${TYPE_SCALE.sm}px`,
            color: theme.accent,
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          SYSTEM ARCHITECTURE
        </div>
        <h2 style={{ fontSize: `${TYPE_SCALE['2xl']}px`, fontWeight: 800, margin: 0 }}>{title}</h2>
        <p style={{ fontSize: `${TYPE_SCALE.base}px`, color: theme.textSecondary, marginTop: '8px' }}>
          {subtitle}
        </p>
      </div>

      {/* SVG Pipeline Node Graph */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {nodes.map((node, i) => {
          const nodeSpring = spring({
            frame: Math.max(0, frame - i * 8),
            fps,
            config: MOTION_PHYSICS.smooth_presentation,
          });

          return (
            <React.Fragment key={node.id}>
              {/* Node Card */}
              <div
                style={{
                  transform: `scale(${nodeSpring})`,
                  opacity: nodeSpring,
                  width: '100%',
                  maxWidth: '720px',
                  background: node.active ? theme.panel : 'rgba(16, 32, 61, 0.65)',
                  border: `2px solid ${node.active ? theme.accent : theme.panelBorder}`,
                  borderRadius: '18px',
                  padding: '20px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: node.active ? `0 0 35px ${theme.accentGlow}` : 'none',
                  zIndex: 2,
                }}
              >
                <div>
                  <div style={{ fontSize: `${TYPE_SCALE.xl}px`, fontWeight: 700, color: '#FFFFFF' }}>
                    {node.label}
                  </div>
                  <div style={{ fontSize: `${TYPE_SCALE.sm}px`, color: theme.textSecondary }}>
                    {node.sublabel}
                  </div>
                </div>

                <div
                  style={{
                    background: node.active ? theme.accent : 'rgba(255, 255, 255, 0.08)',
                    color: node.active ? '#000000' : theme.accent,
                    fontSize: `${TYPE_SCALE.xs}px`,
                    fontWeight: 700,
                    padding: '6px 16px',
                    borderRadius: '999px',
                  }}
                >
                  {node.status}
                </div>
              </div>

              {/* Connecting Pipeline Line (except after last node) */}
              {i < nodes.length - 1 && (
                <div
                  style={{
                    width: '4px',
                    height: '42px',
                    background: theme.panelBorder,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Glowing Data Packet Flowing Down */}
                  <div
                    style={{
                      position: 'absolute',
                      top: `${packetProgress * 100}%`,
                      left: '-3px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: theme.accent,
                      boxShadow: `0 0 12px ${theme.accent}`,
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
