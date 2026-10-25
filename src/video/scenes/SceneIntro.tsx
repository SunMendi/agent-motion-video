import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from './types';
import {
  THEME,
  SvgPanel,
  SvgText,
  easeOutCubic,
  progress,
  lerp,
} from './scene-utils';

export const SceneIntro: React.FC<SceneProps> = ({
  duration = 180,
  title = '5 SECRET FREE AI TOOLS',
  subtitle = 'কেউ এই টুলগুলো শেয়ার করতে চায় না!',
}) => {
  const frame = useCurrentFrame();

  // Entrance animations
  const introProgress = easeOutCubic(progress(frame, 0, 24));
  const numberProgress = easeOutCubic(progress(frame, 10, 28));
  const titleProgress = easeOutCubic(progress(frame, 20, 25));
  const gridProgress = easeOutCubic(progress(frame, 32, 35));
  const scanProgress = progress(frame, 45, duration - 50);

  // Mystery Superpowers Teaser (Keeps audience hooked - DOES NOT reveal tool names)
  const capabilities = [
    { num: '01', tag: '🔒 TOOL 01', feat: 'টেক্সট থেকে সরাসরি ডায়াগ্রাম ও ইনফোগ্রাফিক', en: 'Text to Infographics', color: THEME.blue },
    { num: '02', tag: '🔒 TOOL 02', feat: 'এক ক্লিকে সম্পূর্ণ প্রেজেন্টেশন ও স্লাইড ডেক', en: '1-Click Slide Decks', color: THEME.purple },
    { num: '03', tag: '🔒 TOOL 03', feat: 'সরাসরি সোর্স সহ নিখুঁত এআই রিসার্চ ও সার্চ', en: 'Verified Real-time Search', color: THEME.cyan },
    { num: '04', tag: '🔒 TOOL 04', feat: 'বড় পিডিএফ ও ডক্স থেকে ফুল অডিও পডকাস্ট', en: 'PDF to Audio Podcast', color: THEME.amber },
    { num: '05', tag: '🔥 TOOL 05', feat: 'মোবাইলের সাধারণ ভয়েস স্টুডিও সাউন্ডে রূপান্তর', en: 'Studio Audio Cleanup', color: THEME.green },
  ];

  return (
    <svg
      viewBox="0 0 896 1380"
      width={896}
      height={1380}
      role="img"
      aria-label="Scene Intro - 5 Secret Free AI Tools Teaser"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="introGlow" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor={THEME.blue} stopOpacity="0.25" />
          <stop offset="100%" stopColor={THEME.bg} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="scanBeam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={THEME.blue} stopOpacity="0" />
          <stop offset="50%" stopColor={THEME.blue} stopOpacity="0.35" />
          <stop offset="100%" stopColor={THEME.blue} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background radial glow */}
      <circle cx={448} cy={420} r={420} fill="url(#introGlow)" />

      {/* Top Hook Pill */}
      <g opacity={introProgress} transform={`translate(0, ${Math.round((1 - introProgress) * -30)})`}>
        <rect
          x={188}
          y={60}
          width={520}
          height={64}
          rx={32}
          fill={THEME.panelAlt}
          stroke={THEME.borderActive}
          strokeWidth={3}
        />
        <circle cx={225} cy={92} r={10} fill={THEME.red} />
        <SvgText
          x={460}
          y={102}
          size={24}
          weight={800}
          fill={THEME.textPrimary}
          anchor="middle"
          fontFamily={THEME.fontLatin}
          letterSpacing={2}
        >
          ⚡ SECRET FREE AI ARSENAL
        </SvgText>
      </g>

      {/* Big Hero Number Emblem */}
      <g
        opacity={numberProgress}
        transform={`translate(0, ${Math.round((1 - numberProgress) * 40)})`}
      >
        <circle
          cx={448}
          cy={270}
          r={95}
          fill={THEME.panel}
          stroke={THEME.blue}
          strokeWidth={6}
        />
        <circle
          cx={448}
          cy={270}
          r={112}
          fill="none"
          stroke={THEME.blue}
          strokeWidth={2}
          strokeDasharray="16 12"
          opacity={0.6}
        />
        <SvgText
          x={448}
          y={315}
          size={110}
          weight={800}
          fill={THEME.blue}
          anchor="middle"
          fontFamily={THEME.fontLatin}
        >
          05
        </SvgText>
      </g>

      {/* Main Headline */}
      <g
        opacity={titleProgress}
        transform={`translate(0, ${Math.round((1 - titleProgress) * 30)})`}
      >
        <SvgText
          x={448}
          y={445}
          size={52}
          weight={800}
          fill={THEME.textPrimary}
          anchor="middle"
          fontFamily={THEME.fontLatin}
          letterSpacing={-1}
        >
          {title}
        </SvgText>
        <SvgText
          x={448}
          y={505}
          size={32}
          weight={700}
          fill={THEME.amber}
          anchor="middle"
          fontFamily={THEME.fontBengali}
        >
          {subtitle}
        </SvgText>
      </g>

      {/* 5 Mystery Capabilities Bento Grid (No Tool Names Shown) */}
      <g opacity={gridProgress}>
        {capabilities.map((cap, i) => {
          const itemProgress = easeOutCubic(progress(frame, 32 + i * 8, 20));
          const yPos = 560 + i * 115;
          const isHighlight = i === 4;

          return (
            <g
              key={cap.num}
              opacity={itemProgress}
              transform={`translate(0, ${Math.round((1 - itemProgress) * 35)})`}
            >
              <SvgPanel
                x={68}
                y={yPos}
                width={760}
                height={96}
                fill={isHighlight ? THEME.panelAlt : THEME.panel}
                stroke={cap.color}
                strokeWidth={isHighlight ? 3 : 2}
                radius={20}
              />
              {/* Mystery tag badge */}
              <rect
                x={90}
                y={yPos + 20}
                width={145}
                height={56}
                rx={14}
                fill={isHighlight ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.15)'}
                stroke={cap.color}
                strokeWidth={2}
              />
              <SvgText
                x={162}
                y={yPos + 56}
                size={22}
                weight={800}
                fill={cap.color}
                anchor="middle"
                fontFamily={THEME.fontLatin}
              >
                {cap.tag}
              </SvgText>

              {/* Capability Description */}
              <SvgText
                x={255}
                y={yPos + 58}
                size={26}
                weight={700}
                fill={THEME.textPrimary}
                fontFamily={THEME.fontBengali}
              >
                {cap.feat}
              </SvgText>
            </g>
          );
        })}
      </g>

      {/* Dynamic Scan Line Effect */}
      {scanProgress > 0 && scanProgress < 1 && (
        <rect
          x={68}
          y={lerp(560, 1120, scanProgress)}
          width={760}
          height={28}
          fill="url(#scanBeam)"
          opacity={0.8}
        />
      )}

      {/* Bottom Retention Hook: Wait for #5! */}
      <g opacity={gridProgress}>
        <SvgPanel
          x={108}
          y={1175}
          width={680}
          height={76}
          fill={THEME.panelAlt}
          stroke={THEME.green}
          strokeWidth={3}
          radius={38}
        />
        <circle cx={155} cy={1213} r={16} fill={THEME.green} />
        <path
          d="M148 1213 L153 1218 L162 1208"
          stroke="#0B0F17"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <SvgText
          x={435}
          y={1222}
          size={26}
          weight={800}
          fill={THEME.green}
          anchor="middle"
          fontFamily={THEME.fontBengali}
        >
          🔥 ৫ নম্বর টুলের জাদু ভিডিওর শেষে নিজেই শুনুন!
        </SvgText>

        <SvgText
          x={448}
          y={1295}
          size={22}
          weight={600}
          fill={THEME.textMuted}
          anchor="middle"
          fontFamily={THEME.fontBengali}
        >
          ১০০% ফ্রি টুলস • কোনো ক্রেডিট কার্ড লাগবে না
        </SvgText>
      </g>
    </svg>
  );
};
