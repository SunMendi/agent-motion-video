import React from 'react';
import {palette} from '../../brand';

/** Grey placeholder bars that read as body text. Widths are percentages. */
export const Lines: React.FC<{
  widths: number[];
  height?: number;
  gap?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({widths, height = 12, gap = 10, color = palette.line, style}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap, ...style}}>
    {widths.map((w, i) => (
      <div
        key={i}
        style={{width: `${w}%`, height, borderRadius: 99, background: color, flexShrink: 0}}
      />
    ))}
  </div>
);
