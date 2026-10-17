import React from 'react';
import {palette, shadow} from '../../brand';
import {Thumb} from './NewsPage';

/** A photo card: photo-like image block plus a real caption strip. */
export const PhotoCard: React.FC<{
  label: string;
  width?: number;
  height?: number;
  hue?: number;
  style?: React.CSSProperties;
}> = ({label, width = 320, height = 220, hue = 210, style}) => (
  <div
    style={{
      width,
      height,
      borderRadius: 18,
      overflow: 'hidden',
      background: palette.surface,
      border: `1px solid ${palette.line}`,
      boxShadow: shadow.card,
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
  >
    <Thumb
      width={width - 2}
      height={height - 52}
      hue={hue}
      radius={0}
      style={{borderRadius: 0}}
    />
    <div style={{padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10}}>
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 99,
          background: palette.blue,
          color: '#fff',
          fontSize: 13,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        নি
      </div>
      <div style={{minWidth: 0}}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: palette.ink,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </div>
        <div style={{fontSize: 12, color: palette.faint, marginTop: 2}}>নিউজ পোর্টাল · এইমাত্র</div>
      </div>
    </div>
  </div>
);
