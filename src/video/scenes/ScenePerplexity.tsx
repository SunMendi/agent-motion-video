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

export const ScenePerplexity: React.FC<SceneProps> = ({
  title = 'Perplexity AI',
  subtitle = 'Search Engine with Verified Source Citations',
}) => {
  const frame = useCurrentFrame();

  const enter = easeOutCubic(progress(frame, 0, 20));
  const cardProgress = easeOutCubic(progress(frame, 10, 25));
  const sourceProgress = easeOutCubic(progress(frame, 45, 25));
  const trustProgress = easeOutCubic(progress(frame, 75, 25));

  return (
    <svg
      viewBox="0 0 896 1380"
      width={896}
      height={1380}
      role="img"
      aria-label="Scene Perplexity - Verified Search Showcase"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="perpGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.25" />
          <stop offset="100%" stopColor={THEME.bg} stopOpacity="0" />
        </radialGradient>
        <clipPath id="perpRealImageClip">
          <rect x={72} y={358} width={752} height={400} rx={16} />
        </clipPath>
      </defs>

      <circle cx={448} cy={480} r={440} fill="url(#perpGlow)" />

      {/* Top Tool Badge */}
      <SvgToolBadge
        number="TOOL 03 / 05"
        category="VERIFIED AI SEARCH"
        accent="#2DD4BF"
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
          fill="#2DD4BF"
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
          stroke="#2DD4BF"
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
          🔒 https://www.perplexity.ai
        </SvgText>

        {/* Embedded Real Screenshot */}
        <g clipPath="url(#perpRealImageClip)">
          <image
            href={staticFile('current/tools/perplexity.png')}
            x={72}
            y={358}
            width={752}
            height={400}
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      </g>

      {/* Verified Sources Showcase */}
      <g opacity={sourceProgress}>
        <SvgPanel
          x={68}
          y={800}
          width={760}
          height={240}
          fill={THEME.panelAlt}
          stroke={THEME.border}
          radius={20}
        />

        <SvgText
          x={110}
          y={845}
          size={24}
          weight={800}
          fill="#2DD4BF"
          fontFamily={THEME.fontBengali}
        >
          ক্লিকযোগ্য নির্ভরযোগ্য সোর্স লিংক:
        </SvgText>

        {/* Source Badges */}
        <g transform="translate(110, 875)">
          <rect x={0} y={0} width={180} height={56} rx={14} fill={THEME.panelLight} stroke="#2DD4BF" strokeWidth={2} />
          <SvgText x={90} y={36} size={20} weight={700} fill={THEME.textPrimary} anchor="middle" fontFamily={THEME.fontLatin}>
            [1] arXiv.org ↗
          </SvgText>
        </g>

        <g transform="translate(310, 875)">
          <rect x={0} y={0} width={180} height={56} rx={14} fill={THEME.panelLight} stroke="#2DD4BF" strokeWidth={2} />
          <SvgText x={90} y={36} size={20} weight={700} fill={THEME.textPrimary} anchor="middle" fontFamily={THEME.fontLatin}>
            [2] github.com ↗
          </SvgText>
        </g>

        <g transform="translate(510, 875)">
          <rect x={0} y={0} width={200} height={56} rx={14} fill={THEME.panelLight} stroke="#2DD4BF" strokeWidth={2} />
          <SvgText x={100} y={36} size={20} weight={700} fill={THEME.textPrimary} anchor="middle" fontFamily={THEME.fontLatin}>
            [3] nature.com ↗
          </SvgText>
        </g>

        <SvgText
          x={448}
          y={990}
          size={22}
          weight={600}
          fill={THEME.textSecondary}
          anchor="middle"
          fontFamily={THEME.fontBengali}
        >
          AI বানিয়ে বানিয়ে উত্তর দেয় না, সরাসরি সোর্স দেখে মিলিয়ে নেওয়া যায়
        </SvgText>
      </g>

      {/* Trust Callout */}
      <g
        opacity={trustProgress}
        transform={`translate(0, ${Math.round((1 - trustProgress) * 20)})`}
      >
        <SvgPanel
          x={68}
          y={1070}
          width={760}
          height={120}
          fill="rgba(45, 212, 191, 0.12)"
          stroke="#2DD4BF"
          strokeWidth={2}
          radius={24}
        />
        <circle cx={120} cy={1130} r={28} fill="#2DD4BF" />
        <SvgText x={120} y={1140} size={30} weight={900} fill={THEME.bg} anchor="middle" fontFamily={THEME.fontLatin}>
          ✓
        </SvgText>

        <SvgText
          x={168}
          y={1120}
          size={28}
          weight={800}
          fill="#2DD4BF"
          fontFamily={THEME.fontBengali}
        >
          রিসার্চের জন্য ১০০% ভরসাযোগ্য
        </SvgText>
        <SvgText
          x={168}
          y={1160}
          size={22}
          weight={600}
          fill={THEME.textSecondary}
          fontFamily={THEME.fontBengali}
        >
          প্রতিটি তথ্যের পেছনে রয়েছে আসল ওয়েবসাইটের রেফারেন্স
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
          stroke="#2DD4BF"
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
          🔍 গুগল সার্চের চেয়ে ১০ গুণ দ্রুত নির্ভুল রিসার্চ
        </SvgText>
      </g>
    </svg>
  );
};
