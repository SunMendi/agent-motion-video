import React from 'react';
import {palette, shadow} from '../../brand';
import {Thumb} from './NewsPage';

/** A news portal window with real headlines. `smart` adds the modern look. */
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
        background: smart ? palette.blue : '#9AA3B5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 14px',
        flexShrink: 0,
      }}
    >
      <div style={{fontSize: 15, fontWeight: 700, color: '#fff'}}>{name}</div>
      <div style={{display: 'flex', gap: 6}}>
        <div style={{width: 26, height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.5)'}} />
        <div style={{width: 16, height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.35)'}} />
      </div>
    </div>
    <div style={{flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 11, overflow: 'hidden'}}>
      <div style={{display: 'flex', gap: 12}}>
        <Thumb
          width={smart ? '52%' : '44%'}
          height={smart ? 78 : 62}
          hue={smart ? 210 : 218}
          radius={10}
        />
        <div style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 7}}>
          <div
            style={{
              fontSize: smart ? 14 : 13,
              fontWeight: 700,
              color: palette.ink,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {smart ? 'ক্ষমতার নতুন নেতৃত্ব নিয়ে আলোচনা' : 'সাধারণ শিরোনাম এখানে থাকে'}
          </div>
          <div style={{fontSize: 11, color: palette.faint}}>২ ঘণ্টা আগে</div>
        </div>
      </div>
      {['বাজারে ডিজিটাল পেমেন্টের রেকর্ড', 'খেলার মাঠে নতুন তারকা'].map((t, i) => (
        <div key={t} style={{display: 'flex', gap: 10, alignItems: 'center'}}>
          <Thumb width={44} height={32} hue={198 + i * 20} radius={6} />
          <div
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: smart ? 12 : 11,
              color: smart ? palette.ink : palette.muted,
              fontWeight: smart ? 600 : 400,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {t}
          </div>
        </div>
      ))}
      {smart ? (
        <div style={{display: 'flex', gap: 8, marginTop: 'auto'}}>
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
        <div
          style={{
            marginTop: 'auto',
            height: 8,
            width: '44%',
            borderRadius: 99,
            background: '#EDEFF4',
          }}
        />
      )}
    </div>
  </div>
);
