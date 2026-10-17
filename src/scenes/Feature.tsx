import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {palette, typeSize} from '../brand';
import {useEnter, wipe} from './useEnter';
import {CopyBlock, Stage} from './Stage';
import {Browser} from '../parts/mockups/Browser';
import {NewsPage} from '../parts/mockups/NewsPage';
import {AiPanel} from '../parts/mockups/AiPanel';
import {AudioPlayer} from '../parts/mockups/AudioPlayer';
import type {SceneProps} from './types';

/** The agent writes the summary, then speaks the news. */
export const Feature: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const frame = useCurrentFrame();
  const {style} = useEnter(durationInFrames);
  const wide = width > height;
  const browserW = wide ? Math.min(width * 0.42, 620) : width - 144;
  const browserH = wide ? 300 : Math.min(height * 0.24, 330);

  const panelIn = interpolate(frame, [18, 44], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // the audio player lands on the real pause in the voice at 15.77s
  const playerIn = wipe(frame, 126, 142);

  return (
    <Stage
      wide={wide}
      width={width}
      height={height}
      style={style}
      gap={34}
      visual={
        <div
          style={{
            display: 'flex',
            flexDirection: wide ? 'row' : 'column',
            alignItems: 'center',
            gap: 30,
            justifyContent: 'center',
          }}
        >
          <div style={{position: 'relative'}}>
            <Browser url="newsportal.com.bd/রাজনীতি" width={browserW} height={browserH}>
              <NewsPage site="নিউজ পোর্টাল" />
            </Browser>
            <div
              style={{
                position: 'absolute',
                right: wide ? -110 : -8,
                top: wide ? 26 : 36,
                transform: `translateX(${panelIn * 120}px)`,
                opacity: 1 - panelIn,
              }}
            >
              <AiPanel
                lines={['ক্ষমতার নতুন নেতৃত্ব নিয়ে আলোচনা', 'নির্বাচনী ইশতেহার এখনই দেখুন', '৩ লাইনে সম্পূর্ণ খবর']}
                width={wide ? 360 : Math.min(width - 180, 420)}
              />
            </div>
          </div>
          <div
            style={{
              opacity: playerIn,
              transform: `translateY(${(1 - playerIn) * 26}px)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <AudioPlayer width={wide ? 420 : Math.min(width - 144, 480)} delay={142} />
            <div
              style={{
                background: palette.blueSoft,
                color: palette.blue,
                fontWeight: 700,
                fontSize: wide ? 16 : 19,
                padding: '8px 18px',
                borderRadius: 99,
              }}
            >
              খবর শুনে নিন
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
