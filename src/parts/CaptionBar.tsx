import React from 'react';
import {palette, safeWidth, typeSize} from '../brand';
import {browserMeasure} from '../text/measure';
import {wrapTokens} from '../text/wrap';
import type {CaptionChunk} from '../timing';

/** Word-timed captions. The active word is highlighted,
 * the chunk switches exactly when its first word starts. */
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
    boxWidth,
    measure,
  );
  if (lines.length > 2) {
    throw new Error(
      `caption "${chunk.text}" needs ${lines.length} lines at ${size}px in ${boxWidth}px, the limit is 2`,
    );
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: (width - boxWidth) / 2,
        bottom: Math.round(height * 0.17),
        width: boxWidth,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{display: 'flex', gap: 14, flexWrap: 'nowrap'}}>
          {line.map((word, wi) => {
            const on = chunk.words[activeIndex] === word;
            return (
              <span
                key={`${word.w}-${wi}`}
                style={{
                  fontSize: size,
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: on ? palette.ink : 'rgba(255,255,255,0.7)',
                  background: on ? palette.blue : 'transparent',
                  borderRadius: 16,
                  padding: on ? '2px 16px' : '2px 0',
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
