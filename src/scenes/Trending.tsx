import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {palette, typeSize} from '../brand';
import {popStyle, useEnter} from './useEnter';
import {CopyBlock, Stage} from './Stage';
import {CardStack} from '../parts/mockups/CardStack';
import {PhotoCard} from '../parts/mockups/PhotoCard';
import {FacebookPost} from '../parts/mockups/FacebookPost';
import type {SceneProps} from './types';

const TRENDS = [
  'নির্বাচনী ইশতেহার এখনই দেখুন',
  'বাজারে ডিজিটাল পেমেন্টের নতুন রেকর্ড',
  'খেলার মাঠে নতুন তারকা',
];

/** Trending cards stack up, become a photo card, then post themselves. */
export const Trending: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const frame = useCurrentFrame();
  const {style} = useEnter(durationInFrames);
  const wide = width > height;

  const stackOut = interpolate(frame, [100, 122], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const photo = popStyle(frame, 30, 116, 0.86);
  const photoOut = interpolate(frame, [166, 186], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const post = popStyle(frame, 30, 180, 0.9);

  return (
    <Stage
      wide={wide}
      width={width}
      height={height}
      style={style}
      gap={36}
      visual={
        <div
          style={{
            position: 'relative',
            width: wide ? 640 : width - 144,
            height: wide ? 360 : Math.min(height * 0.36, 520),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2,
              opacity: stackOut,
              background: palette.blue,
              color: '#fff',
              fontWeight: 700,
              fontSize: wide ? 18 : 22,
              padding: '10px 22px',
              borderRadius: 99,
              boxShadow: '0 12px 28px rgba(22,104,227,0.3)',
            }}
          >
            প্রতিদিন ২৪টি ট্রেন্ডিং
          </div>
          <div style={{opacity: stackOut, position: 'absolute'}}>
            <CardStack titles={TRENDS} width={wide ? 560 : Math.min(width - 190, 560)} />
          </div>
          <div style={{position: 'absolute', opacity: (1 - photoOut) * photo.opacity, transform: photo.transform}}>
            <PhotoCard
              label="নির্বাচনী ইশতেহার এখনই দেখুন"
              width={wide ? 380 : Math.min(width - 200, 420)}
              height={wide ? 250 : 300}
              hue={212}
            />
          </div>
          <div style={{position: 'absolute', opacity: post.opacity, transform: post.transform}}>
            <FacebookPost
              page="নিউজ পোর্টাল"
              label="নির্বাচনী ইশতেহার এখনই দেখুন"
              width={wide ? 520 : Math.min(width - 160, 520)}
              hue={212}
            />
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
