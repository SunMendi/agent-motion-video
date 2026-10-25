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

export const SceneNotebook: React.FC<SceneProps> = ({
  title = 'Gemini Notebook',
  subtitle = 'PDF Summaries & Conversational Podcasts',
}) => {
  const frame = useCurrentFrame();

  const enter = easeOutCubic(progress(frame, 0, 20));
  const cardProgress = easeOutCubic(progress(frame, 10, 25));
  const podcastProgress = easeOutCubic(progress(frame, 50, 25));
  const summaryProgress = easeOutCubic(progress(frame, 80, 25));

  // Waveform animation
  const w1 = Math.abs(Math.sin(frame * 0.2)) * 32 + 10;
  const w2 = Math.abs(Math.sin(frame * 0.2 + 1.2)) * 40 + 12;
  const w3 = Math.abs(Math.sin(frame * 0.2 + 2.4)) * 36 + 10;
  const w4 = Math.abs(Math.sin(frame * 0.2 + 3.6)) * 44 + 14;
  const w5 = Math.abs(Math.sin(frame * 0.2 + 4.8)) * 30 + 8;

  return (
    <svg
      viewBox="0 0 896 1380"
      width={896}
      height={1380}
      role="img"
      aria-label="Scene Notebook - Document to Podcast Showcase"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="nbGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
          <stop offset="100%" stopColor={THEME.bg} stopOpacity="0" />
        </radialGradient>
        <clipPath id="nbRealImageClip">
          <rect x={72} y={358} width={752} height={400} rx={16} />
        </clipPath>
      </defs>

      <circle cx={448} cy={480} r={440} fill="url(#nbGlow)" />

      {/* Top Tool Badge */}
      <SvgToolBadge
        number="TOOL 04 / 05"
        category="NOTEBOOKLM & AUDIO"
        accent="#38BDF8"
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
          fill="#38BDF8"
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
          stroke="#38BDF8"
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
          🔒 https://notebook.google.com
        </SvgText>

        {/* Embedded Real Screenshot */}
        <g clipPath="url(#nbRealImageClip)">
          <image
            href={staticFile('current/tools/notebook.png')}
            x={72}
            y={358}
            width={752}
            height={400}
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      </g>

      {/* Conversational Podcast Audio Overview Feature */}
      <g opacity={podcastProgress}>
        <SvgPanel
          x={68}
          y={800}
          width={760}
          height={240}
          fill={THEME.panelAlt}
          stroke={THEME.border}
          radius={20}
        />

        {/* Host Avatar 1 */}
        <g transform="translate(110, 840)">
          <circle cx={40} cy={40} r={34} fill="#1E293B" stroke="#38BDF8" strokeWidth={2} />
          <SvgText x={40} y={48} size={28} weight={800} fill="#38BDF8" anchor="middle" fontFamily={THEME.fontLatin}>
            AI 1
          </SvgText>
        </g>

        {/* Dynamic Waveform Bars in Center */}
        <g transform="translate(230, 875)">
          <line x1={0} y1={-w1} x2={0} y2={w1} stroke="#38BDF8" strokeWidth={6} strokeLinecap="round" />
          <line x1={30} y1={-w2} x2={30} y2={w2} stroke="#38BDF8" strokeWidth={6} strokeLinecap="round" />
          <line x1={60} y1={-w3} x2={60} y2={w3} stroke="#38BDF8" strokeWidth={6} strokeLinecap="round" />
          <line x1={90} y1={-w4} x2={90} y2={w4} stroke="#38BDF8" strokeWidth={6} strokeLinecap="round" />
          <line x1={120} y1={-w5} x2={120} y2={w5} stroke="#38BDF8" strokeWidth={6} strokeLinecap="round" />
          <line x1={150} y1={-w3} x2={150} y2={w3} stroke="#38BDF8" strokeWidth={6} strokeLinecap="round" />
          <line x1={180} y1={-w2} x2={180} y2={w2} stroke="#38BDF8" strokeWidth={6} strokeLinecap="round" />
          <line x1={210} y1={-w4} x2={210} y2={w4} stroke="#38BDF8" strokeWidth={6} strokeLinecap="round" />
          <line x1={240} y1={-w1} x2={240} y2={w1} stroke="#38BDF8" strokeWidth={6} strokeLinecap="round" />
        </g>

        {/* Host Avatar 2 */}
        <g transform="translate(686, 840)">
          <circle cx={40} cy={40} r={34} fill="#1E293B" stroke="#10B981" strokeWidth={2} />
          <SvgText x={40} y={48} size={28} weight={800} fill="#10B981" anchor="middle" fontFamily={THEME.fontLatin}>
            AI 2
          </SvgText>
        </g>

        <SvgText
          x={448}
          y={985}
          size={24}
          weight={700}
          fill={THEME.textPrimary}
          anchor="middle"
          fontFamily={THEME.fontBengali}
        >
          🎙️ অডিও ওভারভিউ: দুই হোস্টের পডকাস্ট আলোচনা
        </SvgText>
      </g>

      {/* Feature Takeaway Callout */}
      <g
        opacity={summaryProgress}
        transform={`translate(0, ${Math.round((1 - summaryProgress) * 20)})`}
      >
        <SvgPanel
          x={68}
          y={1070}
          width={760}
          height={120}
          fill="rgba(56, 189, 248, 0.12)"
          stroke="#38BDF8"
          strokeWidth={2}
          radius={24}
        />
        <circle cx={120} cy={1130} r={28} fill="#38BDF8" />
        <SvgText x={120} y={1140} size={30} weight={900} fill={THEME.bg} anchor="middle" fontFamily={THEME.fontLatin}>
          📄
        </SvgText>

        <SvgText
          x={168}
          y={1120}
          size={28}
          weight={800}
          fill="#38BDF8"
          fontFamily={THEME.fontBengali}
        >
          ৮০ পৃষ্ঠার PDF এখন ২০ মিনিটের পডকাস্ট
        </SvgText>
        <SvgText
          x={168}
          y={1160}
          size={22}
          weight={600}
          fill={THEME.textSecondary}
          fontFamily={THEME.fontBengali}
        >
          পড়ার সময় না থাকলে শুনে শুনেই পুরোটা শিখে ফেলুন
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
          stroke="#38BDF8"
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
          📚 পড়াশোনা ও গবেষণার জন্য সেরা ফ্রি সঙ্গী
        </SvgText>
      </g>
    </svg>
  );
};
