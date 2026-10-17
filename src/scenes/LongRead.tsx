import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {palette, typeSize} from '../brand';
import {useEnter} from './useEnter';
import {CopyBlock, Stage} from './Stage';
import {Browser} from '../parts/mockups/Browser';
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
              <div style={{transform: `translateY(${scroll}px)`, display: 'flex', flexDirection: 'column', gap: 12}}>
                <div
                  style={{
                    height: 70,
                    borderRadius: 10,
                    background: 'linear-gradient(120deg, #DDE3EE, #C9D2E4)',
                    marginBottom: 6,
                  }}
                />
                {[
                  'ক্ষমতার নতুন নেতৃত্ব নিয়ে আলোচনার নতুন অধ্যায় শুরু হয়েছে দেশজুড়ে',
                  'নির্বাচনী ইশতেহার নিয়ে বিশ্লেষকদের মতামত একদম নতুন করে',
                  'বাজারে ডিজিটাল পেমেন্টের নতুন রেকর্ড গড়েছে দেশের ব্যাংকগুলো',
                  'খেলার মাঠে উঠলেন নতুন তারকা, দর্শকদে উত্তেজনা',
                  'বিশ্ব বাজারে তেলের দাম নিয়ে নতুন সিদ্ধান্ত আজ বিকেলে',
                  'শিক্ষা বোর্ডের পরীক্ষার ফল প্রকাশ আগামী সপ্তাহে',
                  'রাজধানীর যানজট কমাতে নতুন পরিকল্পনা অনুমোদিত',
                  'কৃষকদের জন্য নতুন ভর্তুকি ঘোষণা করল সরকার',
                  'তরুণদের কর্মসংস্থানে নতুন প্রকল্প শুরু হচ্ছে চট্টগ্রামে',
                  'স্বাস্থ্যসেবায় ডিজিটাল ব্যবস্থা চালু হলো সারা দেশে',
                  'পর্যটন খাতে আগন্তুক সংখ্যায় বড় উঠছে রেকর্ড',
                  'নতুন সেতুর কাজ শেষ হবে আগামী বছরের মধ্যে',
                  'বিদ্যুৎ বিলের নতুন নিয়ম কার্যকর হবে পরের মাসে',
                ].map((t, i) => (
                  <div key={i} style={{fontSize: 13, color: palette.muted, lineHeight: 1.8}}>
                    {t}
                  </div>
                ))}
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
