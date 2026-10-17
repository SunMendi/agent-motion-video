import React from 'react';
import {palette, shadow} from '../../brand';
import {PhotoCard} from './PhotoCard';

/** A Facebook page post mock with reactions. */
export const FacebookPost: React.FC<{page: string; label: string; width?: number; hue?: number}> = ({
  page,
  label,
  width = 480,
  hue = 210,
}) => (
  <div
    style={{
      width,
      background: palette.surface,
      borderRadius: 20,
      border: `1px solid ${palette.line}`,
      boxShadow: shadow.pop,
      padding: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}
  >
    <div style={{display: 'flex', alignItems: 'center', gap: 12, minWidth: 0}}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 99,
          background: palette.blue,
          color: '#fff',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {page.slice(0, 1)}
      </div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{fontSize: 18, fontWeight: 700, color: palette.ink}}>{page}</div>
        <div style={{fontSize: 14, color: palette.faint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          এইমাত্র পোস্ট করা হয়েছে
        </div>
      </div>
      <div
        style={{
          flexShrink: 0,
          whiteSpace: 'nowrap',
          background: '#E4F7EE',
          color: palette.good,
          fontSize: 14,
          fontWeight: 700,
          padding: '6px 12px',
          borderRadius: 99,
        }}
      >
        অটো
      </div>
    </div>
    <PhotoCard label={label} width={width - 36} height={200} hue={hue} />
    <div style={{display: 'flex', gap: 20, fontSize: 16, color: palette.muted}}>
      <span>👍 ১২৮</span>
      <span>💬 ২৪</span>
      <span>↗ শেয়ার</span>
    </div>
  </div>
);
