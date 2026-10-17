export const FPS = 30;

export const palette = {
  bg: '#0A0D14',
  blue: '#1668E3',
  blueDeep: '#0B3FA8',
  ink: '#FFFFFF',
  muted: '#98A2B6',
  alert: '#FF5A4E',
  plate: '#FFFFFF',
  plateInk: '#0B1220',
} as const;

export const safe = {top: 180, bottom: 320, side: 80} as const;

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
  hook: 110,
  headline: 84,
  body: 46,
  caption: 58,
  kicker: 34,
};

export const typeSize = (level: TypeLevel, width: number, height: number): number =>
  Math.round(BASE[level] * scaleF(width, height));
