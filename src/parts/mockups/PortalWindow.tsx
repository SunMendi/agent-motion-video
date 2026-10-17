import React from 'react';
import {palette, shadow} from '../../brand';
import {Lines} from './Lines';

/** A news portal window. `smart` adds the modern look and check badges. */
export const PortalWindow: React.FC<{
  name: string;
  smart?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}> = ({name, smart = false, width = 460, height = 300, style}) => (
  <div
    style={{
      width,
      height,
      background: palette.surface,
      borderRadius: 18,
      border: `1px solid ${palette.line}`,
      boxShadow: smart ? shadow.pop : shadow.soft,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      opacity: smart ? 1 : 0.92,
      ...style,
    }}
  >
    <div
      style={{
        height: 40,
        background: smart ? palette.blue : '#DFE3EC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 14px',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: smart ? '#fff' : palette.muted,
        }}
      >
        {name}
      </div>
      {smart ? (
        <div style={{display: 'flex', gap: 6}}>
          <div style={{width: 26, height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.5)'}} />
          <div style={{width: 16, height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.35)'}} />
        </div>
      ) : null}
    </div>
    <div style={{flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 12}}>
      <div style={{display: 'flex', gap: 10}}>
        <div
          style={{
            flex: smart ? 1.6 : 1,
            height: smart ? 74 : 54,
            borderRadius: 10,
            background: smart
              ? `linear-gradient(120deg, ${palette.blueSoft}, #D9E6FB)`
              : '#E7EAF1',
          }}
        />
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 8}}>
          <Lines widths={[100, 80, smart ? 90 : 60]} height={9} gap={7} />
        </div>
      </div>
      <Lines widths={[96, 88, 92, 70]} height={8} gap={7} />
      {smart ? (
        <div style={{display: 'flex', gap: 10, marginTop: 'auto'}}>
          {['এআই সামারি', 'অডিও', 'অটোপোস্ট'].map((tag) => (
            <div
              key={tag}
              style={{
                background: palette.blueSoft,
                color: palette.blue,
                fontSize: 12,
                fontWeight: 700,
                padding: '5px 10px',
                borderRadius: 99,
              }}
            >
              ✓ {tag}
            </div>
          ))}
        </div>
      ) : (
        <div style={{width: '46%', marginTop: 'auto'}}>
          <Lines widths={[100, 64]} height={8} gap={6} color="#EDEFF4" />
        </div>
      )}
    </div>
  </div>
);
