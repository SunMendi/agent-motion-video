export const FPS = 30;

export const palette = {
  bg: '#F4F6FB',
  surface: '#FFFFFF',
  line: '#E3E8F2',
  blue: '#1668E3',
  blueDeep: '#0B3FA8',
  blueSoft: '#E8F0FD',
  ink: '#0B1220',
  muted: '#5B6478',
  faint: '#A6AFC2',
  alert: '#FF5A4E',
  alertSoft: '#FFE9E7',
  good: '#12B76A',
  plate: '#FFFFFF',
} as const;

export const shadow = {
  card: '0 18px 44px rgba(15, 32, 71, 0.10)',
  soft: '0 8px 22px rgba(15, 32, 71, 0.08)',
  pop: '0 26px 60px rgba(15, 32, 71, 0.16)',
} as const;

export const safe = {top: 150, bottom: 300, side: 80} as const;

export type SizeKey = '9x16' | '1x1' | '16x9';

export const sizes: Record<SizeKey, {width: number; height: number}> = {
  '9x16': {width: 1080, height: 1920},
  '1x1': {width: 1080, height: 1080},
  '16x9': {width: 1920, height: 1080},
};

export const scaleF = (width: number, height: number): number => Math.min(width, height) / 1080;

export const safeWidth = (width: number): number => width - safe.side * 2;

export type TypeLevel = 'hook' | 'headline' | 'body' | 'caption' | 'kicker';

const BASE: Record<TypeLevel, number> = {
  hook: 92,
  headline: 72,
  body: 40,
  caption: 52,
  kicker: 30,
};

export const typeSize = (level: TypeLevel, width: number, height: number): number =>
  Math.round(BASE[level] * scaleF(width, height));
