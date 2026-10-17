import React from 'react';
import {palette} from '../../brand';
import {Lines} from './Lines';

const NAV = ['রাজনীতি', 'অর্থনীতি', 'খেলা', 'বিনোদন'];

/** A fake Bangladeshi news site page, drawn in code. */
export const NewsPage: React.FC<{
  site: string;
  accent?: string;
  dense?: boolean;
  progress?: number;
}> = ({site, accent = palette.blue, dense = false, progress = 1}) => (
  <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column'}}>
    <div
      style={{
        height: 52,
        background: accent,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 18px',
        flexShrink: 0,
      }}
    >
      <div style={{color: '#fff', fontWeight: 700, fontSize: 20, letterSpacing: 0.3}}>{site}</div>
      <div style={{display: 'flex', gap: 8}}>
        <div style={{width: 46, height: 12, borderRadius: 99, background: 'rgba(255,255,255,0.45)'}} />
        <div style={{width: 30, height: 12, borderRadius: 99, background: 'rgba(255,255,255,0.3)'}} />
      </div>
    </div>
    <div
      style={{
        display: 'flex',
        gap: 16,
        padding: '10px 18px',
        borderBottom: `1px solid ${palette.line}`,
        flexShrink: 0,
      }}
    >
      {NAV.map((n) => (
        <div key={n} style={{fontSize: 13, color: palette.muted}}>
          {n}
        </div>
      ))}
    </div>
    <div style={{flex: 1, padding: 18, overflow: 'hidden', position: 'relative'}}>
      <div
        style={{
          width: '100%',
          height: '34%',
          borderRadius: 12,
          background: `linear-gradient(120deg, ${palette.blueSoft}, #DFE7F6)`,
          marginBottom: 16,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 14,
            bottom: 14,
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.75)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 14,
            top: 14,
            width: 74,
            height: 12,
            borderRadius: 99,
            background: 'rgba(255,255,255,0.6)',
          }}
        />
      </div>
      <Lines widths={[92, 74]} height={16} gap={10} color={dense ? '#C9D2E4' : '#D7DEEC'} />
      <div style={{height: 14}} />
      <Lines
        widths={[100, 96, 88, 92, 70, 94, 60]}
        height={dense ? 9 : 11}
        gap={dense ? 7 : 9}
        color={dense ? '#E1E7F2' : '#E6EBF4'}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 6,
          background: palette.line,
        }}
      >
        <div style={{width: `${progress * 100}%`, height: '100%', background: accent}} />
      </div>
    </div>
  </div>
);
