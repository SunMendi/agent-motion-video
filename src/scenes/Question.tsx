import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette, typeSize} from '../brand';
import {useEnter} from './useEnter';
import {CopyBlock, Stage} from './Stage';
import {Chips} from '../parts/mockups/Chips';
import {PortalWindow} from '../parts/mockups/PortalWindow';
import type {SceneProps} from './types';

/** Where will the visitors come from? Sources point at the portal. */
export const Question: React.FC<SceneProps> = ({copy, durationInFrames, width, height}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {style} = useEnter(durationInFrames);
  const wide = width > height;
  const pulse = interpolate(Math.sin((frame / fps) * Math.PI * 1.4), [-1, 1], [0.4, 1]);

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
            flexDirection: wide ? 'row' : 'column',
            alignItems: 'center',
            gap: 26,
            justifyContent: 'center',
          }}
        >
          <Chips
            items={[
              {label: 'ফেসবুক', tone: 'blue'},
              {label: 'গুগল', tone: 'muted'},
              {label: 'সরাসরি', tone: 'muted'},
            ]}
            fontSize={wide ? 18 : 22}
            style={{justifyContent: 'center'}}
          />
          <div
            style={{
              fontSize: wide ? 40 : 52,
              color: palette.faint,
              fontWeight: 700,
              transform: 'rotate(-8deg)',
            }}
          >
            →
          </div>
          <div style={{position: 'relative'}}>
            <PortalWindow name="আপনার পোর্টাল" width={wide ? 340 : Math.min(width - 200, 420)} height={wide ? 200 : 230} />
            <div
              style={{
                position: 'absolute',
                right: -18,
                top: -22,
                width: wide ? 64 : 76,
                height: wide ? 64 : 76,
                borderRadius: 99,
                background: palette.surface,
                border: `3px solid ${palette.blue}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: palette.blue,
                fontWeight: 700,
                fontSize: wide ? 34 : 40,
                opacity: pulse,
                boxShadow: '0 12px 28px rgba(22,104,227,0.25)',
              }}
            >
              ?
            </div>
          </div>
        </div>
      }
      copy={
        <CopyBlock
          headline={copy.headline}
          headlineSize={typeSize('hook', width, height)}
          align="center"
          maxWidth={width - 144}
        />
      }
    />
  );
};
