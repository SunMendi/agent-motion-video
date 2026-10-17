import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {palette, typeSize} from '../brand';
import {useEnter} from './useEnter';
import {CopyBlock, Stage} from './Stage';
import {Browser} from '../parts/mockups/Browser';
import {Lines} from '../parts/mockups/Lines';
import {Avatar} from '../parts/mockups/Avatar';
import type {SceneProps} from './types';

/** A wall of text. The reader scrolls fast and swipes away. */
export const LongRead: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const frame = useCurrentFrame();
  const {style} = useEnter(durationInFrames);
  const wide = width > height;
  const browserW = wide ? Math.min(width * 0.5, 720) : width - 144;
  const browserH = wide ? 320 : Math.min(height * 0.32, 430);
  const scroll = interpolate(frame, [8, durationInFrames - 14], [0, -260], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const swipe = interpolate(frame, [durationInFrames - 26, durationInFrames - 6], [0, 220], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const swipeOpacity = interpolate(
    frame,
    [durationInFrames - 26, durationInFrames - 6],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <Stage
      wide={wide}
      width={width}
      height={height}
      style={style}
      visual={
        <div style={{display: 'flex', alignItems: 'center', gap: 26, justifyContent: 'center'}}>
          <Browser url="old-portal.com.bd/long-article" width={browserW} height={browserH}>
            <div style={{position: 'absolute', inset: 0, padding: 20, overflow: 'hidden'}}>
              <div style={{transform: `translateY(${scroll}px)`}}>
                <div
                  style={{
                    height: 70,
                    borderRadius: 10,
                    background: '#E7EAF1',
                    marginBottom: 16,
                  }}
                />
                <Lines
                  widths={[100, 96, 92, 98, 88, 94, 90, 84, 96, 78, 92, 88, 96, 82]}
                  height={10}
                  gap={12}
                  color="#E3E7F0"
                />
              </div>
            </div>
          </Browser>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              transform: `translateX(${swipe}px)`,
              opacity: swipeOpacity,
            }}
          >
            <Avatar size={wide ? 78 : 96} mood="away" />
            <div
              style={{
                background: palette.alertSoft,
                color: palette.alert,
                fontWeight: 700,
                fontSize: wide ? 16 : 19,
                padding: '8px 16px',
                borderRadius: 99,
              }}
            >
              স্কিপ
            </div>
          </div>
        </div>
      }
      copy={
        <CopyBlock
          kicker={copy.kicker}
          headline={copy.headline}
          headlineSize={typeSize('headline', width, height)}
          align={wide ? 'center' : 'left'}
        />
      }
    />
  );
};
