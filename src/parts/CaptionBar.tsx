import React from 'react';
import {palette, safeWidth, shadow, typeSize} from '../brand';
import {browserMeasure} from '../text/measure';
import {wrapTokens} from '../text/wrap';
import type {CaptionChunk} from '../timing';

/** Word-timed captions on a white pill. The spoken word is highlighted. */
export const CaptionBar: React.FC<{
  chunk: CaptionChunk | null;
  activeIndex: number;
  width: number;
  height: number;
}> = ({chunk, activeIndex, width, height}) => {
  if (!chunk) return null;
  const size = typeSize('caption', width, height);
  const measure = browserMeasure(size, '700');
  const boxWidth = safeWidth(width) - 40;
  const lines = wrapTokens(
    chunk.words,
    (word) => word.w,
    boxWidth - 60,
    measure,
  );
  if (lines.length > 2) {
    throw new Error(
      `caption "${chunk.text}" needs ${lines.length} lines at ${size}px, the limit is 2`,
    );
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: (width - boxWidth) / 2,
        bottom: Math.round(height * 0.055),
        width: boxWidth,
        background: palette.surface,
        border: `1px solid ${palette.line}`,
        boxShadow: shadow.card,
        borderRadius: 28,
        padding: '22px 30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{display: 'flex', gap: 12, flexWrap: 'nowrap', alignItems: 'center'}}>
          {line.map((word, wi) => {
            const on = chunk.words[activeIndex] === word;
            return (
              <span
                key={`${word.w}-${wi}`}
                style={{
                  fontSize: size,
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: on ? '#FFFFFF' : palette.ink,
                  background: on ? palette.blue : 'transparent',
                  borderRadius: 14,
                  padding: on ? '2px 14px' : '2px 0',
                  whiteSpace: 'nowrap',
                }}
              >
                {word.w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
