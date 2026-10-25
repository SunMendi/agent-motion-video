import React from 'react';
import { staticFile, useCurrentFrame } from 'remotion';
import type { SceneProps } from './types';
import {
  THEME,
  SvgPanel,
  SvgText,
  SvgToolBadge,
  easeOutCubic,
  progress,
} from './scene-utils';

export const SceneAdobePodcast: React.FC<SceneProps> = ({
  title = 'Adobe Podcast',
  subtitle = 'Studio Sound with 1-Click Enhanced Speech',
}) => {
  const frame = useCurrentFrame();

  const enter = easeOutCubic(progress(frame, 0, 20));
  const cardProgress = easeOutCubic(progress(frame, 10, 25));
  const toggleProgress = easeOutCubic(progress(frame, 45, 25));
  const waveProgress = easeOutCubic(progress(frame, 70, 25));

  // Noisy vs clean wave amplitudes
  const noisyAmps = [18, 42, 28, 55, 36, 60, 24, 48, 30, 52];
  const cleanAmps = [12, 32, 20, 44, 26, 46, 18, 38, 22, 40];

  return (
    <svg
      viewBox="0 0 896 1380"
      width={896}
      height={1380}
      role="img"
      aria-label="Scene Adobe Podcast - Audio Enhancement Showcase"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="adobeGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
          <stop offset="100%" stopColor={THEME.bg} stopOpacity="0" />
        </radialGradient>
        <clipPath id="adobeRealImageClip">
          <rect x={72} y={358} width={752} height={400} rx={16} />
        </clipPath>
      </defs>

      <circle cx={448} cy={480} r={440} fill="url(#adobeGlow)" />

      {/* Top Tool Badge */}
      <SvgToolBadge
        number="TOOL 05 / 05"
        category="VOICE ENHANCEMENT"
        accent="#10B981"
        opacity={enter}
      />

      {/* Tool Brand Header */}
      <g opacity={enter} transform={`translate(0, ${Math.round((1 - enter) * 20)})`}>
        <SvgText
          x={448}
          y={205}
          size={58}
          weight={800}
          fill={THEME.textPrimary}
          anchor="middle"
          fontFamily={THEME.fontLatin}
        >
          {title}
        </SvgText>
        <SvgText
          x={448}
          y={255}
          size={28}
          weight={600}
          fill="#10B981"
          anchor="middle"
          fontFamily={THEME.fontBengali}
        >
          {subtitle}
        </SvgText>
      </g>

      {/* Real Product UI Mockup Card */}
      <g
        opacity={cardProgress}
        transform={`translate(0, ${Math.round((1 - cardProgress) * 25)})`}
      >
        <SvgPanel
          x={68}
          y={310}
          width={760}
          height={460}
          fill={THEME.panel}
          stroke="#10B981"
          strokeWidth={3}
          radius={24}
        />
        {/* Browser Top Bar */}
        <rect x={68} y={310} width={760} height={48} rx={24} fill={THEME.panelAlt} />
        <circle cx={102} cy={334} r={6} fill={THEME.red} />
        <circle cx={124} cy={334} r={6} fill={THEME.amber} />
        <circle cx={146} cy={334} r={6} fill={THEME.green} />

        {/* URL Pill */}
        <rect x={220} y={320} width={456} height={28} rx={14} fill={THEME.bg} opacity={0.6} />
        <SvgText
          x={448}
          y={340}
          size={18}
          weight={600}
          fill={THEME.textMuted}
          anchor="middle"
          fontFamily={THEME.fontLatin}
        >
          🔒 https://podcast.adobe.com
        </SvgText>

        {/* Embedded Real Screenshot */}
        <g clipPath="url(#adobeRealImageClip)">
          <image
            href={staticFile('current/tools/adobe_podcast.png')}
            x={72}
            y={358}
            width={752}
            height={400}
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      </g>

      {/* Before / After Waveform Comparison */}
      <g opacity={waveProgress}>
        <SvgPanel
          x={68}
          y={800}
          width={760}
          height={240}
          fill={THEME.panelAlt}
          stroke={THEME.border}
          radius={20}
        />

        {/* Before: Noisy Wave */}
        <g transform="translate(100, 860)">
          <SvgText x={0} y={-10} size={18} weight={700} fill={THEME.red} fontFamily={THEME.fontLatin}>
            BEFORE: ROOM NOISE + FAN
          </SvgText>
          {noisyAmps.map((h, i) => (
            <line
              key={i}
              x1={i * 28 + 14}
              y1={25 - h / 2}
              x2={i * 28 + 14}
              y2={25 + h / 2}
              stroke={THEME.red}
              strokeWidth={5}
              strokeLinecap="round"
              opacity={0.8}
            />
          ))}
        </g>

        {/* Center Arrow / Switch */}
        <g opacity={toggleProgress} transform="translate(418, 860)">
          <circle cx={30} cy={25} r={22} fill="#10B981" />
          <SvgText x={30} y={32} size={22} weight={800} fill={THEME.bg} anchor="middle" fontFamily={THEME.fontLatin}>
            →
          </SvgText>
        </g>

        {/* After: Studio Clean Wave */}
        <g transform="translate(500, 860)">
          <SvgText x={0} y={-10} size={18} weight={700} fill="#10B981" fontFamily={THEME.fontLatin}>
            AFTER: ENHANCED STUDIO
          </SvgText>
          {cleanAmps.map((h, i) => (
            <line
              key={i}
              x1={i * 28 + 14}
              y1={25 - h / 2}
              x2={i * 28 + 14}
              y2={25 + h / 2}
              stroke="#10B981"
              strokeWidth={5}
              strokeLinecap="round"
            />
          ))}
        </g>

        <SvgText
          x={448}
          y={990}
          size={24}
          weight={700}
          fill={THEME.textPrimary}
          anchor="middle"
          fontFamily={THEME.fontBengali}
        >
          ফ্যানের বিকট আওয়াজ ও রুমের ইকো নিমেষেই গায়েব
        </SvgText>
      </g>

      {/* Feature Takeaway Callout */}
      <g
        opacity={toggleProgress}
        transform={`translate(0, ${Math.round((1 - toggleProgress) * 20)})`}
      >
        <SvgPanel
          x={68}
          y={1070}
          width={760}
          height={120}
          fill="rgba(16, 185, 129, 0.12)"
          stroke="#10B981"
          strokeWidth={2}
          radius={24}
        />
        <circle cx={120} cy={1130} r={28} fill="#10B981" />
        <SvgText x={120} y={1140} size={30} weight={900} fill={THEME.bg} anchor="middle" fontFamily={THEME.fontLatin}>
          🎙️
        </SvgText>

        <SvgText
          x={168}
          y={1120}
          size={28}
          weight={800}
          fill="#10B981"
          fontFamily={THEME.fontBengali}
        >
          দামি মাইক্রোফোনের আর প্রয়োজন নেই
        </SvgText>
        <SvgText
          x={168}
          y={1160}
          size={22}
          weight={600}
          fill={THEME.textSecondary}
          fontFamily={THEME.fontBengali}
        >
          ফোনের সাধারণ রেকর্ডার দিয়েও পাবেন পডকাস্ট কোয়ালিটি
        </SvgText>
      </g>

      {/* Bottom Summary Pill */}
      <g opacity={cardProgress}>
        <SvgPanel
          x={118}
          y={1225}
          width={660}
          height={68}
          fill={THEME.panelAlt}
          stroke="#10B981"
          radius={34}
        />
        <SvgText
          x={448}
          y={1268}
          size={24}
          weight={700}
          fill={THEME.textPrimary}
          anchor="middle"
          fontFamily={THEME.fontBengali}
        >
          ✨ শুধু ফাইল আপলোড করুন, বাকি কাজ AI করবে
        </SvgText>
      </g>
    </svg>
  );
};
