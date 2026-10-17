import React from 'react';
import {palette, shadow} from '../../brand';

/** Rounded chips in a row. Used for traffic sources and tags. */
export const Chips: React.FC<{
  items: Array<{label: string; tone?: 'blue' | 'muted' | 'alert' | 'good'}>;
  gap?: number;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({items, gap = 12, fontSize = 20, style}) => (
  <div style={{display: 'flex', gap, flexWrap: 'wrap', ...style}}>
    {items.map((item) => {
      const tone =
        item.tone === 'alert'
          ? {bg: palette.alertSoft, fg: palette.alert}
          : item.tone === 'good'
            ? {bg: '#E4F7EE', fg: palette.good}
            : item.tone === 'muted'
              ? {bg: '#EEF1F7', fg: palette.muted}
              : {bg: palette.blueSoft, fg: palette.blue};
      return (
        <div
          key={item.label}
          style={{
            background: tone.bg,
            color: tone.fg,
            fontWeight: 700,
            fontSize,
            padding: `${Math.round(fontSize * 0.45)}px ${Math.round(fontSize * 0.9)}px`,
            borderRadius: 99,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: shadow.soft,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{width: 8, height: 8, borderRadius: 99, background: tone.fg}} />
          {item.label}
        </div>
      );
    })}
  </div>
);
