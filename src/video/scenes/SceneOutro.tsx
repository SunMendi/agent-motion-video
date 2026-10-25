import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from './types';
import {
  THEME,
  SvgPanel,
  SvgText,
  easeOutCubic,
  progress,
} from './scene-utils';

export const SceneOutro: React.FC<SceneProps> = ({
  title = '৫টি টুলের ফ্রি লিংক পেতে চান?',
  subtitle = 'নিচে কমেন্টে এখনই লিখুন "tools"',
}) => {
  const frame = useCurrentFrame();

  const enter = easeOutCubic(progress(frame, 0, 20));
  const commentBoxProgress = easeOutCubic(progress(frame, 12, 25));
  const typeProgress = progress(frame, 25, 45); // Typing animation "tools"
  const dmSentProgress = easeOutCubic(progress(frame, 50, 25));
  const ctaProgress = easeOutCubic(progress(frame, 65, 30));
  const pulse = Math.abs(Math.sin(frame * 0.15));

  // Simulated typing of "tools"
  const fullText = 'tools';
  const charCount = Math.min(fullText.length, Math.floor(typeProgress * (fullText.length + 1)));
  const displayedText = fullText.slice(0, charCount);
  const showCursor = Math.floor(frame / 10) % 2 === 0;

  return (
    <svg
      viewBox="0 0 896 1380"
      width={896}
      height={1380}
      role="img"
      aria-label="Scene Outro - Comment Tools For Direct Links"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="outroGlow" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor={THEME.blue} stopOpacity="0.25" />
          <stop offset="100%" stopColor={THEME.bg} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dmGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      <circle cx={448} cy={460} r={480} fill="url(#outroGlow)" />

      {/* Top Header Badge */}
      <g opacity={enter} transform={`translate(0, ${Math.round((1 - enter) * -20)})`}>
        <rect
          x={198}
          y={60}
          width={500}
          height={60}
          rx={30}
          fill={THEME.panelAlt}
          stroke={THEME.blue}
          strokeWidth={3}
        />
        <circle cx={235} cy={90} r={10} fill={THEME.green} />
        <SvgText
          x={460}
          y={98}
          size={22}
          weight={800}
          fill={THEME.blue}
          anchor="middle"
          fontFamily={THEME.fontLatin}
          letterSpacing={2}
        >
          ⚡ INSTANT INBOX DELIVERY
        </SvgText>
      </g>

      {/* Main Title */}
      <g opacity={enter} transform={`translate(0, ${Math.round((1 - enter) * 20)})`}>
        <SvgText
          x={448}
          y={185}
          size={46}
          weight={800}
          fill={THEME.textPrimary}
          anchor="middle"
          fontFamily={THEME.fontBengali}
        >
          {title}
        </SvgText>
        <SvgText
          x={448}
          y={245}
          size={32}
          weight={800}
          fill={THEME.amber}
          anchor="middle"
          fontFamily={THEME.fontBengali}
        >
          {subtitle}
        </SvgText>
      </g>

      {/* Center Stage: Interactive Animated Comment Box */}
      <g
        opacity={commentBoxProgress}
        transform={`translate(0, ${Math.round((1 - commentBoxProgress) * 35)})`}
      >
        <SvgPanel
          x={68}
          y={310}
          width={760}
          height={480}
          fill="url(#dmGrad)"
          stroke={THEME.blue}
          strokeWidth={3}
          radius={28}
        />

        {/* Panel Header */}
        <rect x={68} y={310} width={760} height={70} rx={28} fill={THEME.panelAlt} />
        <circle cx={110} cy={345} r={8} fill={THEME.red} />
        <circle cx={135} cy={345} r={8} fill={THEME.amber} />
        <circle cx={160} cy={345} r={8} fill={THEME.green} />

        <SvgText
          x={448}
          y={352}
          size={20}
          weight={800}
          fill={THEME.textSecondary}
          anchor="middle"
          fontFamily={THEME.fontLatin}
          letterSpacing={2}
        >
          AUTOMATED DIRECT MESSAGE BOT
        </SvgText>

        {/* Simulated Comment Input Field */}
        <g transform="translate(108, 415)">
          <rect
            x={0}
            y={0}
            width={680}
            height={90}
            rx={20}
            fill="#090D14"
            stroke={THEME.borderActive}
            strokeWidth={2}
          />
          {/* User Avatar Circle */}
          <circle cx={45} cy={45} r={24} fill={THEME.purple} />
          <SvgText
            x={45}
            y={53}
            size={22}
            weight={800}
            fill="#FFFFFF"
            anchor="middle"
            fontFamily={THEME.fontLatin}
          >
            YOU
          </SvgText>

          {/* Typed text */}
          <SvgText
            x={95}
            y={54}
            size={32}
            weight={800}
            fill={THEME.cyan}
            fontFamily={THEME.fontLatin}
          >
            {displayedText}
            {showCursor ? '|' : ''}
          </SvgText>

          {/* Send Button */}
          <rect
            x={545}
            y={15}
            width={120}
            height={60}
            rx={16}
            fill={THEME.blue}
          />
          <path
            d="M580 45 L625 35 L605 55 Z"
            fill="#FFFFFF"
          />
          <SvgText
            x={620}
            y={52}
            size={20}
            weight={800}
            fill="#FFFFFF"
            anchor="middle"
            fontFamily={THEME.fontLatin}
          >
            SEND
          </SvgText>
        </g>

        {/* Instant Automated DM Reply Card */}
        <g
          opacity={dmSentProgress}
          transform={`translate(108, ${530 + Math.round((1 - dmSentProgress) * 20)})`}
        >
          <rect
            x={0}
            y={0}
            width={680}
            height={220}
            rx={20}
            fill="rgba(16, 185, 129, 0.12)"
            stroke={THEME.green}
            strokeWidth={3}
          />

          {/* Success Check Badge */}
          <circle cx={55} cy={50} r={22} fill={THEME.green} />
          <path
            d="M45 50 L52 57 L65 44"
            stroke="#0B0F17"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          <SvgText
            x={95}
            y={56}
            size={26}
            weight={800}
            fill={THEME.green}
            fontFamily={THEME.fontLatin}
            letterSpacing={1}
          >
            DIRECT MESSAGE SENT • ইনবক্স চেক করুন!
          </SvgText>

          <SvgText
            x={95}
            y={105}
            size={28}
            weight={700}
            fill={THEME.textPrimary}
            fontFamily={THEME.fontBengali}
          >
            ৫টি এআই টুলের অফিশিয়াল লিংক ইনবক্সে পাঠানো হয়েছে
          </SvgText>

          <SvgText
            x={95}
            y={150}
            size={22}
            weight={600}
            fill={THEME.textSecondary}
            fontFamily={THEME.fontBengali}
          >
            এক ক্লিকেই সব টুল ফ্রিতে ব্যবহার শুরু করতে পারবেন
          </SvgText>

          {/* Glowing pulse indicator */}
          <rect
            x={30}
            y={185}
            width={620}
            height={8}
            rx={4}
            fill={THEME.green}
            opacity={0.4 + pulse * 0.4}
          />
        </g>
      </g>

      {/* High-Conversion CTA Container: Save & Follow */}
      <g
        opacity={ctaProgress}
        transform={`translate(0, ${Math.round((1 - ctaProgress) * 30)})`}
      >
        <SvgPanel
          x={68}
          y={825}
          width={760}
          height={420}
          fill={THEME.panelAlt}
          stroke={THEME.blue}
          strokeWidth={4}
          radius={28}
        />

        {/* Save Reminder Box with Pulse */}
        <g transform="translate(108, 865)">
          <rect
            x={0}
            y={0}
            width={680}
            height={100}
            rx={20}
            fill={THEME.blue}
            opacity={0.15 + pulse * 0.1}
          />
          <rect
            x={0}
            y={0}
            width={680}
            height={100}
            rx={20}
            fill="none"
            stroke={THEME.blue}
            strokeWidth={3}
          />
          {/* Bookmark Icon */}
          <path
            d="M50 30 V75 L70 60 L90 75 V30 Z"
            fill={THEME.blue}
          />
          <SvgText
            x={115}
            y={62}
            size={32}
            weight={800}
            fill={THEME.textPrimary}
            fontFamily={THEME.fontBengali}
          >
            ভিডিওটি এখনই সেভ করে রাখুন!
          </SvgText>
        </g>

        {/* Follow & Share Prompts */}
        <g transform="translate(108, 1000)">
          <SvgText
            x={340}
            y={35}
            size={30}
            weight={800}
            fill={THEME.textPrimary}
            anchor="middle"
            fontFamily={THEME.fontBengali}
          >
            🔔 এমন দরকারি এআই টুলস পেতে এখনই ফলো করুন
          </SvgText>

          {/* Social Handle Tag */}
          <rect x={140} y={75} width={400} height={68} rx={34} fill={THEME.panelLight} stroke={THEME.border} />
          <circle cx={185} cy={109} r={14} fill={THEME.green} />
          <SvgText
            x={365}
            y={118}
            size={26}
            weight={800}
            fill={THEME.textPrimary}
            anchor="middle"
            fontFamily={THEME.fontLatin}
            letterSpacing={1}
          >
            @AI.INSIDER.PRO
          </SvgText>
        </g>

        {/* Bottom Share Suggestion */}
        <SvgText
          x={448}
          y={1205}
          size={24}
          weight={700}
          fill={THEME.amber}
          anchor="middle"
          fontFamily={THEME.fontBengali}
        >
          বন্ধুদের মেনশন করুন যেন তারাও ফ্রিতে শিখতে পারে
        </SvgText>
      </g>

      {/* Bottom Safe Zone Indicator */}
      <SvgText
        x={448}
        y={1295}
        size={20}
        weight={600}
        fill={THEME.textMuted}
        anchor="middle"
        fontFamily={THEME.fontBengali}
      >
        লাইক ও শেয়ার করে টাইমলাইনে রেখে দিন
      </SvgText>
    </svg>
  );
};
