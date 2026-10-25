import React from 'react';

export const THEME = {
  bg: '#0B0F17',
  panel: '#131E31',
  panelAlt: '#1A2740',
  panelLight: '#203250',
  border: '#243752',
  borderActive: '#38BDF8',
  blue: '#38BDF8',
  cyan: '#06B6D4',
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  purple: '#A855F7',
  indigo: '#6366F1',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  fontBengali: 'Hind Siliguri, Noto Sans Bengali, sans-serif',
  fontLatin: 'Space Grotesk, sans-serif',
  fontCode: 'JetBrains Mono, monospace',
};

export const clamp = (x: number, min = 0, max = 1): number => Math.max(min, Math.min(max, x));

export const easeOutCubic = (x: number): number => {
  const p = clamp(x);
  return 1 - Math.pow(1 - p, 3);
};

export const easeInOutCubic = (x: number): number => {
  const p = clamp(x);
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
};

export const ease = (x: number): number => {
  const p = clamp(x);
  return p * p * (3 - 2 * p);
};

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const progress = (frame: number, start: number, duration: number): number => {
  if (duration <= 0) return 1;
  return clamp((frame - start) / duration);
};

/** Shared SVG Text component with strict font fallbacks */
export const SvgText: React.FC<{
  x: number;
  y: number;
  size?: number;
  weight?: number | string;
  fill?: string;
  anchor?: 'start' | 'middle' | 'end';
  opacity?: number;
  fontFamily?: string;
  letterSpacing?: number;
  children: React.ReactNode;
}> = ({
  x,
  y,
  size = 48,
  weight = 700,
  fill = THEME.textPrimary,
  anchor = 'start',
  opacity = 1,
  fontFamily = THEME.fontBengali,
  letterSpacing,
  children,
}) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    opacity={opacity}
    fill={fill}
    style={{
      fontFamily,
      fontSize: size,
      fontWeight: weight,
      letterSpacing: letterSpacing ? `${letterSpacing}px` : undefined,
    }}
  >
    {children}
  </text>
);

/** Shared SVG Card Panel */
export const SvgPanel: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  radius?: number;
  opacity?: number;
}> = ({
  x,
  y,
  width,
  height,
  fill = THEME.panel,
  stroke = THEME.border,
  strokeWidth = 3,
  radius = 28,
  opacity = 1,
}) => (
  <rect
    x={x}
    y={y}
    width={width}
    height={height}
    rx={radius}
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    opacity={opacity}
  />
);

/** Reusable scene top badge showing tool number and category */
export const SvgToolBadge: React.FC<{
  number: string;
  category: string;
  accent?: string;
  opacity?: number;
}> = ({number, category, accent = THEME.blue, opacity = 1}) => (
  <g opacity={opacity}>
    <rect x={60} y={70} width={220} height={56} rx={28} fill={THEME.panelAlt} stroke={accent} strokeWidth={3} />
    <text
      x={170}
      y={106}
      textAnchor="middle"
      fill={accent}
      style={{fontFamily: THEME.fontLatin, fontSize: 24, fontWeight: 800, letterSpacing: 2}}
    >
      {number}
    </text>
    <rect x={300} y={70} width={536} height={56} rx={28} fill={THEME.panel} stroke={THEME.border} strokeWidth={2} />
    <text
      x={568}
      y={106}
      textAnchor="middle"
      fill={THEME.textSecondary}
      style={{fontFamily: THEME.fontLatin, fontSize: 22, fontWeight: 700, letterSpacing: 1}}
    >
      {category}
    </text>
  </g>
);
