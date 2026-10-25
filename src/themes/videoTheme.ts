export interface VideoTheme {
  id: string;
  name: string;
  canvas: {
    bg: string;
    gridPattern: string;
    ambientGlowPrimary: string;
    ambientGlowSecondary: string;
  };
  cards: {
    bg: string;
    border: string;
    shadow: string;
    badgeBg: string;
    badgeText: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    accentBlue: string;
    accentOrange: string;
    accentGreen: string;
    accentRed: string;
  };
  subtitles: {
    pillBg: string;
    pillBorder: string;
    pillShadow: string;
    textColorUpcoming: string;
    textColorPast: string;
    textColorActive: string;
    activeTextGlow: string;
  };
  roadmap: {
    activeSegmentBg: string;
    inactiveSegmentBg: string;
  };
  sceneTransition: {
    accentEdgeColor: string;
    wipeFillColor: string;
  };
}

export const CLEAN_LIGHT_THEME: VideoTheme = {
  id: 'clean-light',
  name: 'Clean Light Explainer',
  canvas: {
    bg: '#F8F9FA',
    gridPattern:
      'radial-gradient(circle at 1.5px 1.5px, rgba(15, 23, 42, 0.08) 1.5px, transparent 0)',
    ambientGlowPrimary: 'rgba(234, 88, 12, 0.07)', // Soft Rust orange warmth
    ambientGlowSecondary: 'rgba(37, 99, 235, 0.06)', // Soft Royal blue coolness
  },
  cards: {
    bg: '#FFFFFF',
    border: 'rgba(15, 23, 42, 0.08)',
    shadow:
      '0 20px 40px -12px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.04)',
    badgeBg: '#EFF6FF',
    badgeText: '#1D4ED8',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    muted: '#94A3B8',
    accentBlue: '#2563EB',
    accentOrange: '#EA580C',
    accentGreen: '#059669',
    accentRed: '#DC2626',
  },
  subtitles: {
    pillBg: 'rgba(255, 255, 255, 0.96)',
    pillBorder: 'rgba(15, 23, 42, 0.12)',
    pillShadow:
      '0 12px 32px -4px rgba(15, 23, 42, 0.10), 0 2px 8px rgba(15, 23, 42, 0.04)',
    textColorUpcoming: '#64748B',
    textColorPast: '#0F172A',
    textColorActive: '#2563EB',
    activeTextGlow: 'none',
  },
  roadmap: {
    activeSegmentBg: '#2563EB',
    inactiveSegmentBg: 'rgba(15, 23, 42, 0.12)',
  },
  sceneTransition: {
    accentEdgeColor: '#2563EB',
    wipeFillColor: '#F8F9FA',
  },
};

export const DARK_TECH_THEME: VideoTheme = {
  id: 'dark-tech',
  name: 'Dark Tech Blueprint',
  canvas: {
    bg: '#090A10',
    gridPattern:
      'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.08) 1.5px, transparent 0)',
    ambientGlowPrimary: 'rgba(249, 115, 22, 0.12)',
    ambientGlowSecondary: 'rgba(56, 189, 248, 0.10)',
  },
  cards: {
    bg: 'rgba(15, 18, 28, 0.88)',
    border: 'rgba(255, 255, 255, 0.16)',
    shadow:
      '0 24px 48px -12px rgba(0, 0, 0, 0.7), 0 0 32px rgba(249, 115, 22, 0.15)',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
    badgeText: '#FB923C',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#94A3B8',
    muted: '#64748B',
    accentBlue: '#38BDF8',
    accentOrange: '#FB923C',
    accentGreen: '#34D399',
    accentRed: '#F87171',
  },
  subtitles: {
    pillBg: 'rgba(15, 18, 28, 0.88)',
    pillBorder: 'rgba(255, 255, 255, 0.16)',
    pillShadow:
      '0 12px 32px -4px rgba(0, 0, 0, 0.6), 0 0 20px rgba(249, 115, 22, 0.15)',
    textColorUpcoming: '#94A3B8',
    textColorPast: '#FFFFFF',
    textColorActive: '#FB923C',
    activeTextGlow: 'none',
  },
  roadmap: {
    activeSegmentBg: 'linear-gradient(90deg, #F97316 0%, #38BDF8 100%)',
    inactiveSegmentBg: 'rgba(255, 255, 255, 0.15)',
  },
  sceneTransition: {
    accentEdgeColor: '#F97316',
    wipeFillColor: '#090A10',
  },
};

export const WARM_PAPER_THEME: VideoTheme = {
  id: 'warm-paper',
  name: 'Warm Cream Paper & Flatlay',
  canvas: {
    bg: '#FAF9F6',
    gridPattern:
      'radial-gradient(circle at 1px 1px, rgba(30, 41, 59, 0.12) 1.5px, transparent 0)',
    ambientGlowPrimary: 'rgba(245, 158, 11, 0.08)',
    ambientGlowSecondary: 'rgba(37, 99, 235, 0.06)',
  },
  cards: {
    bg: '#FFFFFF',
    border: 'rgba(30, 41, 59, 0.10)',
    shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
    badgeBg: '#FEF3C7',
    badgeText: '#B45309',
  },
  text: {
    primary: '#1E293B',
    secondary: '#475569',
    muted: '#94A3B8',
    accentBlue: '#2563EB',
    accentOrange: '#D97706',
    accentGreen: '#059669',
    accentRed: '#DC2626',
  },
  subtitles: {
    pillBg: '#FFFFFF',
    pillBorder: 'rgba(30, 41, 59, 0.12)',
    pillShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.10)',
    textColorUpcoming: '#64748B',
    textColorPast: '#1E293B',
    textColorActive: '#2563EB',
    activeTextGlow: 'none',
  },
  roadmap: {
    activeSegmentBg: '#2563EB',
    inactiveSegmentBg: 'rgba(30, 41, 59, 0.12)',
  },
  sceneTransition: {
    accentEdgeColor: '#FACC15',
    wipeFillColor: '#2563EB',
  },
};

export const THEMES: Record<string, VideoTheme> = {
  cleanLight: CLEAN_LIGHT_THEME,
  darkTech: DARK_TECH_THEME,
  warmPaper: WARM_PAPER_THEME,
};
