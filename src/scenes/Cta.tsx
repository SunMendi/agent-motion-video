import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {palette, typeSize} from '../brand';
import {popStyle, useEnter} from './useEnter';
import {CopyBlock, Stage} from './Stage';
import {InboxThread} from '../parts/mockups/InboxThread';
import type {SceneProps} from './types';

/** Send a message, get the demo link. */
export const Cta: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const frame = useCurrentFrame();
  const {style} = useEnter(durationInFrames);
  const wide = width > height;
  const pop = popStyle(frame, 30, 8, 0.94);
  const beat = interpolate(Math.sin(frame / 7), [-1, 1], [1, 1.04]);

  return (
    <Stage
      wide={wide}
      width={width}
      height={height}
      style={style}
      gap={28}
      visual={
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={pop}>
            <InboxThread
              question="ডেমো লিংক পেতে চাই"
              answer="লিংক পাঠানো হলো ✓"
              width={wide ? 520 : Math.min(width - 140, 560)}
            />
          </div>
        </div>
      }
      copy={
        <div style={{textAlign: 'center', maxWidth: width - 144}}>
          <CopyBlock
            headline={copy.headline}
            headlineSize={typeSize('headline', width, height)}
            align="center"
          />
          <div
            style={{
              marginTop: 26,
              display: 'inline-flex',
              background: palette.blue,
              color: '#fff',
              fontWeight: 700,
              fontSize: typeSize('body', width, height),
              padding: '20px 46px',
              borderRadius: 999,
              transform: `scale(${beat})`,
              boxShadow: '0 16px 38px rgba(22,104,227,0.35)',
            }}
          >
            {copy.cta ?? 'ইনবক্স করুন'}
          </div>
          {copy.contact ? (
            <div
              style={{
                marginTop: 20,
                color: palette.muted,
                fontSize: typeSize('kicker', width, height) + 4,
              }}
            >
              {copy.contact}
            </div>
          ) : null}
        </div>
      }
    />
  );
};
