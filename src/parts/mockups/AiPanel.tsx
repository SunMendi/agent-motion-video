import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {palette, shadow} from '../../brand';

/** An AI panel that types its lines, one after another. */
export const AiPanel: React.FC<{
  lines: string[];
  delay?: number;
  cps?: number;
  lineGap?: number;
  width?: number;
}> = ({lines, delay = 12, cps = 0.7, lineGap = 26, width = 420}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  void fps;
  return (
    <div
      style={{
        width,
        background: palette.surface,
        borderRadius: 20,
        border: `1px solid ${palette.line}`,
        boxShadow: shadow.pop,
        padding: 22,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <div
          style={{
            background: palette.blue,
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            padding: '4px 12px',
            borderRadius: 99,
          }}
        >
          AI
        </div>
        <div style={{fontSize: 15, color: palette.muted}}>৩ লাইনের সামারি</div>
      </div>
      {lines.map((line, i) => {
        const elapsed = frame - delay - i * lineGap;
        const visible = Math.max(0, Math.floor(elapsed * cps));
        const text = line.slice(0, visible);
        const done = visible >= line.length;
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              opacity: elapsed > 0 ? 1 : 0,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 99,
                background: palette.blue,
                marginTop: 8,
                flexShrink: 0,
              }}
            />
            <div style={{fontSize: 22, color: palette.ink, lineHeight: 1.45, minHeight: 32}}>
              {text}
              {!done && visible > 0 ? <span style={{color: palette.blue}}>|</span> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};
