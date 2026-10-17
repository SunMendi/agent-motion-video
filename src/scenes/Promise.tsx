import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {typeSize} from '../brand';
import {useEnter} from './useEnter';
import {CopyBlock, Stage} from './Stage';
import {PortalWindow} from '../parts/mockups/PortalWindow';
import type {SceneProps} from './types';

/** A local portal grows into a national quality smart portal. */
export const PromiseScene: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const frame = useCurrentFrame();
  const {style} = useEnter(durationInFrames);
  const wide = width > height;
  const grow = interpolate(frame, [16, 52], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: wide ? 30 : 18,
          }}
        >
          <div
            style={{
              opacity: interpolate(grow, [0, 1], [1, 0.35]),
              transform: `scale(${interpolate(grow, [0, 1], [1, 0.9])})`,
            }}
          >
            <PortalWindow
              name="লোকাল পোর্টাল"
              width={wide ? 300 : Math.min((width - 200) * 0.44, 380)}
              height={wide ? 190 : 220}
            />
          </div>
          <div
            style={{
              fontSize: wide ? 38 : 48,
              color: '#1668E3',
              fontWeight: 700,
              transform: `translateX(${interpolate(grow, [0, 1], [0, 10])}px)`,
            }}
          >
            →
          </div>
          <div
            style={{
              transform: `scale(${interpolate(grow, [0, 1], [0.82, 1])})`,
              opacity: interpolate(grow, [0.2, 1], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <PortalWindow
              name="স্মার্ট পোর্টাল"
              smart
              width={wide ? 420 : Math.min((width - 170) * 0.6, 560)}
              height={wide ? 250 : 300}
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
