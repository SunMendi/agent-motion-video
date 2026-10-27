import layout from './video-layout.json';

/** Optional palettes and motion presets. Choose a treatment from the recording.
 * Token ratios and spring parameters do not certify design or accessibility.
 */

export interface ColorPalette {
  bg: string;
  bgSecondary: string;
  panel: string;
  panelBorder: string;
  accent: string;
  accentGlow: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  badgeBg: string;
  badgeText: string;
}

/**
 * Optional palettes. Validate contrast in the actual composition.
 */
export const THEMES: Record<string, ColorPalette> = {
  COMMERCIAL_AD: {
    bg: '#090D16',
    bgSecondary: '#111827',
    panel: '#1A2333',
    panelBorder: '#374151',
    accent: '#F59E0B', // Amber
    accentGlow: 'rgba(245, 158, 11, 0.35)',
    textPrimary: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    badgeBg: '#10B981', // Neon Emerald
    badgeText: '#064E3B',
  },
  SYSTEM_ARCHITECTURE: {
    bg: '#060B14',
    bgSecondary: '#0B1528',
    panel: '#10203D',
    panelBorder: '#1E3A8A',
    accent: '#06B6D4', // Cyan
    accentGlow: 'rgba(6, 182, 212, 0.4)',
    textPrimary: '#F0F9FF',
    textSecondary: '#BAE6FD',
    textMuted: '#7DD3FC',
    badgeBg: '#3B82F6',
    badgeText: '#EFF6FF',
  },
  CODE_TERMINAL: {
    bg: '#0D1117',
    bgSecondary: '#161B22',
    panel: '#21262D',
    panelBorder: '#30363D',
    accent: '#22C55E', // Matrix Green
    accentGlow: 'rgba(34, 197, 94, 0.35)',
    textPrimary: '#F0F6FC',
    textSecondary: '#8B949E',
    textMuted: '#6E7681',
    badgeBg: '#E3B341',
    badgeText: '#21262D',
  },
  BENCHMARK_BATTLE: {
    bg: '#050505',
    bgSecondary: '#121212',
    panel: '#1F1F1F',
    panelBorder: '#333333',
    accent: '#F43F5E', // Rose Crimson
    accentGlow: 'rgba(244, 63, 94, 0.4)',
    textPrimary: '#FFFFFF',
    textSecondary: '#E4E4E7',
    textMuted: '#A1A1AA',
    badgeBg: '#06B6D4',
    badgeText: '#083344',
  },
  MINIMAL_EDITORIAL: {
    bg: '#18181B',
    bgSecondary: '#27272A',
    panel: '#3F3F46',
    panelBorder: '#52525B',
    accent: '#EA580C', // Burnt Orange
    accentGlow: 'rgba(234, 88, 12, 0.35)',
    textPrimary: '#FAFAFA',
    textSecondary: '#D4D4D8',
    textMuted: '#A1A1AA',
    badgeBg: '#F59E0B',
    badgeText: '#451A03',
  },
};

/**
 * Legacy UI scale. Small values are not suitable for essential video text.
 * Judge rendered type at phone size; do not use a UI scale as art direction.
 */
export const TYPE_SCALE = {
  xs: 13,
  sm: 16,
  base: 20,
  md: 25,
  lg: 31,
  xl: 39,
  '2xl': 49,
  '3xl': 61,
  '4xl': 76,
  hero: 95,
} as const;

/**
 * Standard Harmonic Oscillator Spring Physics Configurations
 */
export const MOTION_PHYSICS = {
  snappy_mechanical: {
    mass: 0.5,
    stiffness: 220,
    damping: 22,
  },
  smooth_presentation: {
    mass: 1.0,
    stiffness: 110,
    damping: 18,
  },
  bouncy_impact: {
    mass: 0.8,
    stiffness: 190,
    damping: 13,
  },
} as const;

/**
 * Mobile Safe Zone Boundaries (9:16 Canvas at 1080x1920)
 * Protects layout against top platform overlays and bottom interaction buttons.
 */
export const CANVAS_SAFE_ZONE = {
  width: 1080,
  height: 1920,
  stage: {
    top: layout.action.top,
    bottom: layout.action.bottom,
    left: layout.action.left,
    right: layout.width - layout.action.right,
    contentWidth: layout.width - layout.action.left - layout.action.right,
    contentHeight: layout.action.bottom - layout.action.top,
  },
  captions: {
    top: layout.caption.top,
    height: layout.caption.height,
  },
} as const;
