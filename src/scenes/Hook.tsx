import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {palette, typeSize} from '../brand';
import {popStyle, useEnter} from './useEnter';
import {CopyBlock, Stage} from './Stage';
import {Browser} from '../parts/mockups/Browser';
import {NewsPage} from '../parts/mockups/NewsPage';
import {Avatar} from '../parts/mockups/Avatar';
import {TimerRing} from '../parts/mockups/TimerRing';
import {Counter} from '../parts/mockups/Counter';
import type {SceneProps} from './types';

/** The reader arrives, the 3 second timer runs out, the reader leaves. */
export const Hook: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const frame = useCurrentFrame();
  const {style} = useEnter(durationInFrames);
  const pop = popStyle(frame, 30, 2, 0.88);
  const wide = width > height;
  const browserW = wide ? Math.min(width * 0.5, 720) : width - 144;
  const browserH = wide ? 330 : Math.min(height * 0.3, 420);

  const walkIn = interpolate(frame, [12, 34], [-140, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const walkOut = interpolate(frame, [58, 92], [0, 260], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const readerOpacity = interpolate(frame, [80, 92], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Stage
      wide={wide}
      width={width}
      height={height}
      style={style}
      visual={
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
          <div style={pop}>
            <Browser url="newsportal.com.bd" width={browserW} height={browserH}>
              <NewsPage site="নিউজ পোর্টাল" />
            </Browser>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
            <TimerRing seconds={3} size={wide ? 150 : 180} label="সেকেন্ড" />
            <div
              style={{
                background: palette.surface,
                border: `1px solid ${palette.line}`,
                borderRadius: 20,
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div style={{transform: `translateX(${walkIn + walkOut}px)`, opacity: readerOpacity}}>
                <Avatar size={64} mood={frame > 58 ? 'away' : 'ok'} />
              </div>
              <div>
                <Counter from={100} to={12} durationFrames={26} size={wide ? 54 : 64} color={palette.alert} />
                <div style={{fontSize: 17, color: palette.muted, marginTop: 2}}>পাঠক রয়ে গেছেন</div>
              </div>
            </div>
          </div>
        </div>
      }
      copy={
        <CopyBlock
          kicker={copy.kicker}
          headline={copy.headline}
          headlineSize={typeSize('hook', width, height)}
          kickerColor={palette.alert}
          align={wide ? 'center' : 'left'}
        />
      }
    />
  );
};
