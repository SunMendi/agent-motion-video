import React from 'react';
import {palette} from '../../brand';

const NAV = ['রাজনীতি', 'অর্থনীতি', 'খেলা', 'বিনোদন', 'বিশ্ব'];

/** A photo-like image block: layered gradients and soft shapes. */
export const Thumb: React.FC<{
  width: number | string;
  height: number | string;
  hue?: number;
  radius?: number;
  style?: React.CSSProperties;
}> = ({width, height, hue = 210, radius = 10, style}) => (
  <div
    style={{
      width,
      height,
      borderRadius: radius,
      overflow: 'hidden',
      position: 'relative',
      flexShrink: 0,
      background: `linear-gradient(140deg, hsl(${hue} 65% 58%), hsl(${hue + 35} 55% 38%))`,
      ...style,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: '12%',
        top: '18%',
        width: '34%',
        height: '34%',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.35)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        right: '-12%',
        bottom: '-22%',
        width: '70%',
        height: '58%',
        borderRadius: '46%',
        background: 'rgba(0,0,0,0.16)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: '-8%',
        bottom: '-30%',
        width: '58%',
        height: '52%',
        borderRadius: '48%',
        background: 'rgba(255,255,255,0.18)',
      }}
    />
  </div>
);

/** A realistic fake news site page, drawn in code with real headlines. */
export const NewsPage: React.FC<{
  site: string;
  accent?: string;
  dense?: boolean;
  progress?: number;
  lead?: string;
  items?: string[];
}> = ({
  site,
  accent = palette.blue,
  dense = false,
  progress = 1,
  lead = 'ক্ষমতার নতুন নেতৃত্ব নিয়ে আলোচনার নতুন অধ্যায়',
  items = ['বাজারে ডিজিটাল পেমেন্টের নতুন রেকর্ড', 'খেলার মাঠে উঠলেন নতুন তারকা'],
}) => (
  <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column'}}>
    <div
      style={{
        height: 54,
        background: accent,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 18px',
        flexShrink: 0,
      }}
    >
      <div style={{color: '#fff', fontWeight: 700, fontSize: 21, letterSpacing: 0.3}}>{site}</div>
      <div
        style={{
          background: 'rgba(255,255,255,0.22)',
          borderRadius: 99,
          height: 22,
          width: 120,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 10,
          color: 'rgba(255,255,255,0.85)',
          fontSize: 12,
        }}
      >
        খুঁজুন…
      </div>
    </div>
    <div
      style={{
        display: 'flex',
        gap: 18,
        padding: '9px 18px',
        borderBottom: `1px solid ${palette.line}`,
        flexShrink: 0,
        fontSize: 13,
        color: palette.muted,
      }}
    >
      {NAV.map((n) => (
        <div key={n}>{n}</div>
      ))}
    </div>
    <div style={{flex: 1, padding: 16, overflow: 'hidden', position: 'relative'}}>
      <div style={{display: 'flex', gap: 14, marginBottom: 14}}>
        <Thumb width={dense ? 120 : 150} height={dense ? 84 : 104} hue={dense ? 220 : 210} radius={12} />
        <div style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8}}>
          <div
            style={{
              fontSize: dense ? 15 : 17,
              fontWeight: 700,
              color: dense ? palette.muted : palette.ink,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {lead}
          </div>
          <div style={{fontSize: 12, color: palette.faint}}>২ ঘণ্টা আগে · রাজনীতি</div>
          <div
            style={{
              width: dense ? '52%' : '74%',
              height: 8,
              borderRadius: 99,
              background: dense ? '#E8ECF4' : '#EDF1F8',
            }}
          />
        </div>
      </div>
      {items.map((t, i) => (
        <div
          key={t}
          style={{
            display: 'flex',
            gap: 12,
            padding: '10px 0',
            borderTop: `1px solid ${dense ? '#EEF1F6' : palette.line}`,
            alignItems: 'center',
          }}
        >
          <Thumb width={64} height={46} hue={dense ? 215 : 195 + i * 22} radius={8} />
          <div style={{flex: 1, minWidth: 0}}>
            <div
              style={{
                fontSize: dense ? 13 : 14,
                fontWeight: 600,
                color: dense ? palette.muted : palette.ink,
                lineHeight: 1.45,
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {t}
            </div>
            <div style={{fontSize: 11, color: palette.faint, marginTop: 3}}>
              {i === 0 ? '৪৫ মিনিট আগে' : '১ ঘণ্টা আগে'} · অর্থনীতি
            </div>
          </div>
        </div>
      ))}
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
