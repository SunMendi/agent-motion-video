import React from 'react';
import {palette, shadow} from '../../brand';

/** A code-drawn browser window used as the frame for every fake screen. */
export const Browser: React.FC<{
  url: string;
  width: number;
  height: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  zoom?: number;
}> = ({url, width, height, children, style, zoom = 1}) => (
  <div
    style={{
      width,
      height,
      background: palette.surface,
      borderRadius: 22,
      boxShadow: shadow.card,
      border: `1px solid ${palette.line}`,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
  >
    <div
      style={{
        height: Math.round(46 * zoom),
        background: '#F2F4F9',
        borderBottom: `1px solid ${palette.line}`,
        display: 'flex',
        alignItems: 'center',
        gap: 8 * zoom,
        paddingLeft: 16 * zoom,
        flexShrink: 0,
      }}
    >
      <div style={{width: 10 * zoom, height: 10 * zoom, borderRadius: 99, background: '#FFB4A8'}} />
      <div style={{width: 10 * zoom, height: 10 * zoom, borderRadius: 99, background: '#FFD58A'}} />
      <div style={{width: 10 * zoom, height: 10 * zoom, borderRadius: 99, background: '#9BE3B4'}} />
      <div
        style={{
          marginLeft: 12 * zoom,
          flex: 1,
          height: 24 * zoom,
          background: palette.surface,
          border: `1px solid ${palette.line}`,
          borderRadius: 99,
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          fontSize: 13 * zoom,
          color: palette.faint,
          gap: 6 * zoom,
        }}
      >
        <span style={{color: palette.good}}>🔒</span>
        {url}
      </div>
    </div>
    <div style={{flex: 1, minHeight: 0, position: 'relative'}}>{children}</div>
  </div>
);
