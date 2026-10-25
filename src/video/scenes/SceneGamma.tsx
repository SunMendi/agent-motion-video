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

export const SceneGamma: React.FC<SceneProps> = ({
  title = 'Gamma AI',
  subtitle = 'Full Presentations in 1 Click',
}) => {
  const frame = useCurrentFrame();

  const enter = easeOutCubic(progress(frame, 0, 20));
  const cardProgress = easeOutCubic(progress(frame, 10, 25));
  const creditProgress = easeOutCubic(progress(frame, 55, 25));
  const featureProgress = easeOutCubic(progress(frame, 85, 25));

  return (
    <svg
      viewBox="0 0 896 1380"
      width={896}
      height={1380}
      role="img"
      aria-label="Scene Gamma - AI Presentation Showcase"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="gammaGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.25" />
          <stop offset="100%" stopColor={THEME.bg} stopOpacity="0" />
        </radialGradient>
        <clipPath id="gammaRealImageClip">
          <rect x={72} y={358} width={752} height={400} rx={16} />
        </clipPath>
      </defs>

      <circle cx={448} cy={480} r={440} fill="url(#gammaGlow)" />

      {/* Top Tool Badge */}
      <SvgToolBadge
        number="TOOL 02 / 05"
        category="AI PRESENTATIONS"
        accent="#A855F7"
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
          fill="#C084FC"
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
          stroke="#A855F7"
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
          🔒 https://gamma.app
        </SvgText>

        {/* Embedded Real Screenshot */}
        <g clipPath="url(#gammaRealImageClip)">
          <image
            href={staticFile('current/tools/gamma.png')}
            x={72}
            y={358}
            width={752}
            height={400}
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      </g>

      {/* Generated Presentation Capabilities */}
      <g opacity={featureProgress}>
        <SvgPanel
          x={68}
          y={800}
          width={760}
          height={240}
          fill={THEME.panelAlt}
          stroke={THEME.border}
          radius={20}
        />
        
        {/* 3 Capabilities Pills */}
        <g transform="translate(100, 835)">
          <rect x={0} y={0} width={200} height={70} rx={16} fill={THEME.panelLight} stroke="#A855F7" strokeWidth={2} />
          <SvgText x={100} y={42} size={22} weight={800} fill={THEME.textPrimary} anchor="middle">
            প্রেজেন্টেশন
          </SvgText>
        </g>

        <g transform="translate(325, 835)">
          <rect x={0} y={0} width={200} height={70} rx={16} fill={THEME.panelLight} stroke="#A855F7" strokeWidth={2} />
          <SvgText x={100} y={42} size={22} weight={800} fill={THEME.textPrimary} anchor="middle">
            ডকুমেন্টস
          </SvgText>
        </g>

        <g transform="translate(550, 835)">
          <rect x={0} y={0} width={200} height={70} rx={16} fill={THEME.panelLight} stroke="#A855F7" strokeWidth={2} />
          <SvgText x={100} y={42} size={22} weight={800} fill={THEME.textPrimary} anchor="middle">
            ওয়েবপেজ
          </SvgText>
        </g>

        <SvgText
          x={448}
          y={970}
          size={24}
          weight={700}
          fill={THEME.textSecondary}
          anchor="middle"
          fontFamily={THEME.fontBengali}
        >
          টপিক লিখে দিলেই প্রফেশনাল ড্রাফট তৈরি
        </SvgText>
      </g>

      {/* Crucial Tip: 400 Free Credits Alert Pill */}
      <g
        opacity={creditProgress}
        transform={`translate(0, ${Math.round((1 - creditProgress) * 20)})`}
      >
        <SvgPanel
          x={68}
          y={1070}
          width={760}
          height={120}
          fill="rgba(245, 158, 11, 0.12)"
          stroke={THEME.amber}
          strokeWidth={2}
          radius={24}
        />
        <circle cx={120} cy={1130} r={28} fill={THEME.amber} />
        <SvgText x={120} y={1140} size={30} weight={900} fill={THEME.bg} anchor="middle" fontFamily={THEME.fontLatin}>
          !
        </SvgText>

        <SvgText
          x={168}
          y={1120}
          size={28}
          weight={800}
          fill={THEME.amber}
          fontFamily={THEME.fontBengali}
        >
          গুরুত্বপূর্ণ তথ্য: ৪০০ ফ্রি ক্রেডিট
        </SvgText>
        <SvgText
          x={168}
          y={1160}
          size={22}
          weight={600}
          fill={THEME.textSecondary}
          fontFamily={THEME.fontBengali}
        >
          ক্রেডিট শেষ হলে কিন্তু অটোমেটিক রিফিল হয় না
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
          stroke="#A855F7"
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
          ⚡ কালকের প্রেজেন্টেশন আজ রাতেই রেডি
        </SvgText>
      </g>
    </svg>
  );
};
