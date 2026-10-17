import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {typeSize} from '../brand';
import {popStyle, useEnter} from './useEnter';
import {CopyBlock, Stage} from './Stage';
import {Browser} from '../parts/mockups/Browser';
import {NewsPage} from '../parts/mockups/NewsPage';
import {Stamp} from '../parts/mockups/Stamp';
import {Avatar} from '../parts/mockups/Avatar';
import type {SceneProps} from './types';

/** An old site, stuck in 2015, loading forever. */
export const Problem: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const frame = useCurrentFrame();
  const {style} = useEnter(durationInFrames);
  const wide = width > height;
  const browserW = wide ? Math.min(width * 0.5, 720) : width - 144;
  const browserH = wide ? 320 : Math.min(height * 0.3, 400);
  const stamp = popStyle(frame, 30, 22, 1.8);
  const stuck = interpolate(frame, [0, 30], [0, 0.2], {
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
        <div style={{position: 'relative', display: 'flex', justifyContent: 'center'}}>
          <Browser url="old-portal.com.bd" width={browserW} height={browserH}>
            <NewsPage site="পুরনো সাইট" accent="#8A93A6" dense progress={stuck} />
          </Browser>
          <div
            style={{
              position: 'absolute',
              right: wide ? -30 : -6,
              top: -26,
              transformOrigin: 'center',
              ...stamp,
            }}
          >
            <Stamp text="২০১৫" size={wide ? 62 : 78} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: wide ? -20 : -4,
              bottom: -22,
              opacity: interpolate(frame, [40, 56], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <Avatar size={wide ? 74 : 88} mood="sad" />
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
