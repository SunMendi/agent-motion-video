import React from 'react';
import { BENGALI_FONT_STACK, SPACE_GROTESK, JETBRAINS_MONO } from '../fonts';

/**
 * Typography Preset 1: Main Header
 * High-impact hero title with gradient or clean white glow.
 * Guaranteed zero diacritic clipping with safe line-height and padding.
 */
export interface MainHeaderProps {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
  variant?: 'glow' | 'gradient' | 'cyan' | 'amber';
  align?: 'center' | 'left' | 'right';
  size?: number; // default: 68
  className?: string;
  style?: React.CSSProperties;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  children,
  subtitle,
  variant = 'glow',
  align = 'center',
  size = 68,
  className = '',
  style = {},
}) => {
  const getVariantStyle = (): React.CSSProperties => {
    switch (variant) {
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, #FFFFFF 0%, #38BDF8 60%, #818CF8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 4px 18px rgba(56, 189, 248, 0.35))',
        };
      case 'cyan':
        return {
          color: '#38BDF8',
          textShadow: '0 0 24px rgba(56, 189, 248, 0.6), 0 2px 8px rgba(0, 0, 0, 0.8)',
        };
      case 'amber':
        return {
          color: '#F59E0B',
          textShadow: '0 0 24px rgba(245, 158, 11, 0.5), 0 2px 8px rgba(0, 0, 0, 0.8)',
        };
      case 'glow':
      default:
        return {
          color: '#FFFFFF',
          textShadow: '0 0 20px rgba(255, 255, 255, 0.45), 0 0 40px rgba(56, 189, 248, 0.3), 0 4px 12px rgba(0, 0, 0, 0.9)',
        };
    }
  };

  return (
    <div
      className={`bengali-header-container ${className}`}
      style={{
        textAlign: align,
        paddingTop: 8,
        paddingBottom: 8,
        ...style,
      }}
    >
      <h1
        style={{
          fontFamily: BENGALI_FONT_STACK,
          fontSize: size,
          fontWeight: 700,
          lineHeight: 1.35,
          letterSpacing: 'normal',
          margin: 0,
          padding: 0,
          textRendering: 'optimizeLegibility',
          ...getVariantStyle(),
        }}
      >
        {children}
      </h1>
      {subtitle && (
        <p
          style={{
            fontFamily: BENGALI_FONT_STACK,
            fontSize: Math.round(size * 0.48),
            fontWeight: 500,
            lineHeight: 1.35,
            letterSpacing: 'normal',
            color: '#94A3B8',
            marginTop: 10,
            marginBottom: 0,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

/**
 * Typography Preset 2: Tool Name Badge
 * Sleek glass pill badge displaying product name, website URL, and optional status badge.
 */
export interface ToolNameBadgeProps {
  name: string;
  url?: string;
  icon?: React.ReactNode;
  badge?: string;
  accent?: string; // default: '#38BDF8'
  className?: string;
  style?: React.CSSProperties;
}

export const ToolNameBadge: React.FC<ToolNameBadgeProps> = ({
  name,
  url,
  icon,
  badge,
  accent = '#38BDF8',
  className = '',
  style = {},
}) => (
  <div
    className={`tool-name-badge ${className}`}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 16,
      padding: '12px 28px',
      borderRadius: 9999,
      backgroundColor: 'rgba(30, 41, 59, 0.85)',
      backdropFilter: 'blur(12px)',
      border: `1.5px solid ${accent}40`,
      boxShadow: `0 10px 28px -4px rgba(0, 0, 0, 0.5), 0 0 16px ${accent}25`,
      ...style,
    }}
  >
    {icon && (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 38,
          height: 38,
          borderRadius: '50%',
          backgroundColor: `${accent}20`,
          border: `1px solid ${accent}50`,
          color: accent,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
    )}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            fontFamily: SPACE_GROTESK,
            fontSize: 32,
            fontWeight: 700,
            color: '#F8FAFC',
            letterSpacing: -0.5,
            lineHeight: 1.2,
          }}
        >
          {name}
        </span>
        {badge && (
          <span
            style={{
              fontFamily: JETBRAINS_MONO,
              fontSize: 16,
              fontWeight: 700,
              color: accent,
              backgroundColor: `${accent}20`,
              padding: '2px 8px',
              borderRadius: 6,
              border: `1px solid ${accent}40`,
              textTransform: 'uppercase',
            }}
          >
            {badge}
          </span>
        )}
      </div>
      {url && (
        <span
          style={{
            fontFamily: JETBRAINS_MONO,
            fontSize: 20,
            fontWeight: 500,
            color: '#94A3B8',
            lineHeight: 1.2,
            marginTop: 2,
          }}
        >
          {url}
        </span>
      )}
    </div>
  </div>
);

/**
 * Typography Preset 3: Feature Highlight Bullet / Tag
 * High-contrast metric card or bullet point for cost comparison and feature tags.
 */
export interface FeatureHighlightProps {
  label: React.ReactNode;
  value?: React.ReactNode;
  description?: React.ReactNode;
  variant?: 'blue' | 'green' | 'amber' | 'red';
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  label,
  value,
  description,
  variant = 'blue',
  icon,
  className = '',
  style = {},
}) => {
  const colors = {
    blue: { border: '#38BDF8', bg: 'rgba(56, 189, 248, 0.10)', glow: 'rgba(56, 189, 248, 0.25)', text: '#38BDF8' },
    green: { border: '#10B981', bg: 'rgba(16, 185, 129, 0.10)', glow: 'rgba(16, 185, 129, 0.25)', text: '#10B981' },
    amber: { border: '#F59E0B', bg: 'rgba(245, 158, 11, 0.10)', glow: 'rgba(245, 158, 11, 0.25)', text: '#F59E0B' },
    red: { border: '#EF4444', bg: 'rgba(239, 68, 68, 0.10)', glow: 'rgba(239, 68, 68, 0.25)', text: '#EF4444' },
  }[variant];

  return (
    <div
      className={`feature-highlight-card ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        padding: '16px 26px',
        borderRadius: 20,
        backgroundColor: 'rgba(23, 35, 55, 0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        borderLeft: `6px solid ${colors.border}`,
        boxShadow: `0 8px 24px rgba(0, 0, 0, 0.4), 0 0 16px ${colors.glow}`,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {icon && <div style={{ color: colors.border, flexShrink: 0 }}>{icon}</div>}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: BENGALI_FONT_STACK,
              fontSize: 34,
              fontWeight: 600,
              lineHeight: 1.35,
              letterSpacing: 'normal',
              color: '#F8FAFC',
            }}
          >
            {label}
          </span>
          {description && (
            <span
              style={{
                fontFamily: BENGALI_FONT_STACK,
                fontSize: 24,
                fontWeight: 400,
                lineHeight: 1.35,
                letterSpacing: 'normal',
                color: '#94A3B8',
              }}
            >
              {description}
            </span>
          )}
        </div>
      </div>
      {value && (
        <span
          style={{
            fontFamily: JETBRAINS_MONO,
            fontSize: 40,
            fontWeight: 800,
            color: colors.text,
            letterSpacing: -0.5,
            padding: '4px 14px',
            borderRadius: 10,
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}40`,
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
};

/**
 * Typography Preset 4: Top Caption Safe Box (y=100-260)
 * Styled container conforming to mobile top safe zones.
 */
export interface TopCaptionBoxProps {
  children: React.ReactNode;
  accent?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const TopCaptionBox: React.FC<TopCaptionBoxProps> = ({
  children,
  accent = '#38BDF8',
  className = '',
  style = {},
}) => (
  <div
    className={`top-caption-box ${className}`}
    style={{
      maxWidth: 940,
      width: '100%',
      padding: '12px 28px',
      borderRadius: 22,
      backgroundColor: 'rgba(11, 15, 23, 0.90)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${accent}45`,
      boxShadow: '0 10px 32px rgba(0, 0, 0, 0.50), 0 0 16px rgba(56, 189, 248, 0.15)',
      fontFamily: BENGALI_FONT_STACK,
      fontSize: 40,
      fontWeight: 700,
      lineHeight: 1.38,
      letterSpacing: 'normal',
      textAlign: 'center',
      color: '#F8FAFC',
      textRendering: 'optimizeLegibility',
      ...style,
    }}
  >
    {children}
  </div>
);
