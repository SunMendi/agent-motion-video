import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEMES, TYPE_SCALE, MOTION_PHYSICS } from '../design-system';

export interface CodeTerminalStageProps {
  filename?: string;
  command: string;
  codeLines: string[];
  outputMessage?: string;
}

export const CodeTerminalStage: React.FC<CodeTerminalStageProps> = ({
  filename = 'workflow.py',
  command = 'uv run main.py --agent',
  codeLines = [
    'from agent import AutonomousEngineer',
    'engineer = AutonomousEngineer(model="deepseek-r1")',
    'result = engineer.generate_architecture(brief)',
    'print(f"Workflow status: {result.status}")',
  ],
  outputMessage = '✓ Architecture compiled in 184ms',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = THEMES.CODE_TERMINAL;

  const terminalSpring = spring({
    frame,
    fps,
    config: MOTION_PHYSICS.snappy_mechanical,
  });

  // Typewriter effect on the command
  const typedCharCount = Math.floor(interpolate(frame, [10, 35], [0, command.length], { extrapolateRight: 'clamp' }));
  const displayedCommand = command.slice(0, typedCharCount);
  const showCursor = Math.floor(frame / 8) % 2 === 0;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 32px',
        fontFamily: 'JetBrains Mono, monospace',
      }}
    >
      {/* Terminal Window Frame */}
      <div
        style={{
          transform: `scale(${terminalSpring})`,
          opacity: terminalSpring,
          width: '100%',
          maxWidth: '820px',
          background: theme.bg,
          border: `2px solid ${theme.panelBorder}`,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: `0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px ${theme.accentGlow}`,
        }}
      >
        {/* Terminal Header Bar */}
        <div
          style={{
            background: theme.panel,
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${theme.panelBorder}`,
          }}
        >
          {/* Mac Window Control Dots */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#EF4444' }} />
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#F59E0B' }} />
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#10B981' }} />
          </div>

          <div style={{ color: theme.textSecondary, fontSize: `${TYPE_SCALE.xs}px` }}>
            {filename}
          </div>

          <div style={{ color: theme.accent, fontSize: `${TYPE_SCALE.xs}px`, fontWeight: 700 }}>
            bash
          </div>
        </div>

        {/* Terminal Content Body */}
        <div style={{ padding: '28px', color: theme.textPrimary, fontSize: `${TYPE_SCALE.sm}px`, lineHeight: 1.6 }}>
          {/* Prompt line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <span style={{ color: theme.accent, fontWeight: 700 }}>$</span>
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{displayedCommand}</span>
            {showCursor && <span style={{ width: '10px', height: '20px', background: theme.accent }} />}
          </div>

          {/* Code lines */}
          <div
            style={{
              background: theme.bgSecondary,
              padding: '20px',
              borderRadius: '12px',
              border: `1px solid ${theme.panelBorder}`,
              marginBottom: '20px',
            }}
          >
            {codeLines.map((line, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '18px' }}>
                <span style={{ color: theme.textMuted, width: '24px', textAlign: 'right', userSelect: 'none' }}>
                  {idx + 1}
                </span>
                <span style={{ color: line.includes('def ') || line.includes('import ') ? '#F43F5E' : '#E2E8F0' }}>
                  {line}
                </span>
              </div>
            ))}
          </div>

          {/* Execution Output */}
          {frame > 35 && (
            <div
              style={{
                color: theme.accent,
                fontWeight: 700,
                fontSize: `${TYPE_SCALE.base}px`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {outputMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
