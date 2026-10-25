import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Scene } from '../../types/scene';
import { VideoTheme, CLEAN_LIGHT_THEME } from '../../themes/videoTheme';

interface TopKaraokeSubtitleProps {
  scene: Scene;
  theme?: VideoTheme;
  position?: 'bottom' | 'top';
}

export const TopKaraokeSubtitle: React.FC<TopKaraokeSubtitleProps> = ({
  scene,
  theme = CLEAN_LIGHT_THEME,
  position = 'bottom',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate exact current video time in seconds
  const currentSec = scene.start_time_sec + frame / fps;

  const words = scene.words && scene.words.length > 0
    ? scene.words
    : scene.voiceover_line.trim().split(/\s+/).map((w, i, arr) => {
        const d = scene.duration_sec / arr.length;
        return {
          w,
          s: scene.start_time_sec + i * d,
          e: scene.start_time_sec + (i + 1) * d,
        };
      });

  if (words.length === 0) return null;

  // Safe bottom placement (above TikTok/Reels UI footer, below hero stage)
  const positionStyle: React.CSSProperties =
    position === 'bottom'
      ? { bottom: 220 }
      : { top: 180 };

  return (
    <div
      style={{
        position: 'absolute',
        ...positionStyle,
        left: 48,
        right: 48,
        zIndex: 50,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: theme.subtitles.pillBg,
          borderColor: theme.subtitles.pillBorder,
          boxShadow: theme.subtitles.pillShadow,
          maxWidth: 960,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          columnGap: 18,
          rowGap: 12,
          padding: '22px 36px',
          borderRadius: 36,
          borderWidth: 1,
          borderStyle: 'solid',
        }}
      >
        {words.map((wordObj, idx) => {
          const isActive = currentSec >= wordObj.s && currentSec < wordObj.e;
          const isPast = currentSec >= wordObj.e;

          const textColor = isActive
            ? theme.subtitles.textColorActive
            : isPast
              ? theme.subtitles.textColorPast
              : theme.subtitles.textColorUpcoming;

          const scale = isActive ? 1.06 : 1.0;
          const fontWeight = isActive ? 700 : isPast ? 600 : 500;

          return (
            <span
              key={`${idx}-${wordObj.w}`}
              style={{
                color: textColor,
                transform: `scale(${scale})`,
                fontWeight,
                fontSize: 52,
                lineHeight: 1.35,
                letterSpacing: 'normal',
                display: 'inline-block',
                fontFamily: 'Hind Siliguri, sans-serif',
              }}
            >
              {wordObj.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
