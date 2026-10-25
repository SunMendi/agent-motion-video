import React from 'react';

interface CodeLine {
  num: number;
  tokens: Array<{ text: string; color: string; isBold?: boolean }>;
  isErrorLine?: boolean;
}

interface CodeEditorWindowProps {
  filename?: string;
  badgeText?: string;
  lines: CodeLine[];
  errorBadge?: string;
  style?: React.CSSProperties;
}

export const CodeEditorWindow: React.FC<CodeEditorWindowProps> = ({
  filename = 'main.rs',
  badgeText = 'RUSTC COMPILER',
  lines,
  errorBadge,
  style,
}) => {
  return (
    <div
      style={{
        width: 880,
        backgroundColor: '#0F121C',
        borderRadius: 24,
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        boxShadow:
          '0 24px 48px -12px rgba(0, 0, 0, 0.7), 0 0 24px rgba(249, 115, 22, 0.1)',
        overflow: 'hidden',
        fontFamily: 'monospace',
        ...style,
      }}
    >
      {/* macOS Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#090B12',
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: 9999, backgroundColor: '#EF4444' }} />
          <span style={{ width: 12, height: 12, borderRadius: 9999, backgroundColor: '#F59E0B' }} />
          <span style={{ width: 12, height: 12, borderRadius: 9999, backgroundColor: '#10B981' }} />
        </div>

        <span style={{ color: '#94A3B8', fontSize: 13, fontWeight: 700 }}>
          {filename} <span style={{ color: '#F97316' }}>— {badgeText}</span>
        </span>

        <span style={{ width: 36 }} />
      </div>

      {/* Code Area */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {lines.map((line) => (
          <div
            key={line.num}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '4px 8px',
              borderRadius: 6,
              backgroundColor: line.isErrorLine
                ? 'rgba(239, 68, 68, 0.15)'
                : 'transparent',
              borderLeft: line.isErrorLine ? '3px solid #EF4444' : '3px solid transparent',
            }}
          >
            <span
              style={{
                width: 32,
                color: '#475569',
                fontSize: 14,
                userSelect: 'none',
              }}
            >
              {line.num}
            </span>
            <div style={{ display: 'flex', gap: 6, fontSize: 16 }}>
              {line.tokens.map((token, idx) => (
                <span
                  key={idx}
                  style={{
                    color: token.color,
                    fontWeight: token.isBold ? 700 : 500,
                  }}
                >
                  {token.text}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Error Callout Footer */}
      {errorBadge && (
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#1E1215',
            borderTop: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 13,
            fontWeight: 700,
            color: '#F87171',
          }}
        >
          <span>{errorBadge}</span>
          <span
            style={{
              padding: '2px 10px',
              borderRadius: 9999,
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              fontSize: 11,
              letterSpacing: '0.05em',
            }}
          >
            ZERO RUNTIME LEAK
          </span>
        </div>
      )}
    </div>
  );
};
