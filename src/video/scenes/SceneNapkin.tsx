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

export const SceneNapkin: React.FC<SceneProps> = ({
  title = 'Napkin AI',
  subtitle = 'Text to Visual Diagrams in 3 Seconds',
}) => {
  const frame = useCurrentFrame();

  const enter = easeOutCubic(progress(frame, 0, 20));
  const cardProgress = easeOutCubic(progress(frame, 12, 22));
  const sparkProgress = easeOutCubic(progress(frame, 45, 20));
  const diagramProgress = easeOutCubic(progress(frame, 65, 25));
  const node1 = easeOutCubic(progress(frame, 75, 18));
  const node2 = easeOutCubic(progress(frame, 95, 18));
  const node3 = easeOutCubic(progress(frame, 115, 18));

  return (
    <svg
      viewBox="0 0 896 1380"
      width={896}
      height={1380}
      role="img"
      aria-label="Scene Napkin - Text to Diagram Showcase"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="napkinGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor={THEME.blue} stopOpacity="0.25" />
          <stop offset="100%" stopColor={THEME.bg} stopOpacity="0" />
        </radialGradient>
        <clipPath id="napkinRealImageClip">
          <rect x={72} y={358} width={752} height={354} rx={16} />
        </clipPath>
      </defs>

      <circle cx={448} cy={480} r={440} fill="url(#napkinGlow)" />

      {/* Top Tool Badge */}
      <SvgToolBadge
        number="TOOL 01 / 05"
        category="TEXT TO DIAGRAM"
        accent={THEME.blue}
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
          fill={THEME.blue}
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
          height={410}
          fill={THEME.panel}
          stroke={THEME.blue}
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
          🔒 https://www.napkin.ai
        </SvgText>

        {/* Embedded Real Screenshot */}
        <g clipPath="url(#napkinRealImageClip)">
          <image
            href={staticFile('current/tools/napkin.png')}
            x={72}
            y={358}
            width={752}
            height={354}
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      </g>

      {/* Center Transform Magic Pill & Arrow */}
      <g
        opacity={sparkProgress}
        transform={`translate(0, ${Math.round((1 - sparkProgress) * 20)})`}
      >
        <line
          x1={448}
          y1={720}
          x2={448}
          y2={800}
          stroke={THEME.blue}
          strokeWidth={4}
          strokeDasharray="8 6"
        />
        <rect
          x={318}
          y={735}
          width={260}
          height={54}
          rx={27}
          fill={THEME.blue}
        />
        <SvgText
          x={448}
          y={770}
          size={22}
          weight={800}
          fill={THEME.bg}
          anchor="middle"
          fontFamily={THEME.fontLatin}
          letterSpacing={1}
        >
          ⚡ 1-CLICK DIAGRAM
        </SvgText>
      </g>

      {/* Step 2: Generated Diagram Visual */}
      <g opacity={diagramProgress}>
        <SvgPanel
          x={68}
          y={805}
          width={760}
          height={380}
          fill={THEME.panel}
          stroke={THEME.border}
          radius={24}
        />

        {/* Node 1 */}
        <g opacity={node1} transform={`translate(${Math.round((1 - node1) * -20)}, 0)`}>
          <rect x={108} y={845} width={180} height={110} rx={18} fill={THEME.panelAlt} stroke={THEME.blue} strokeWidth={2} />
          <SvgText x={198} y={895} size={28} weight={800} fill={THEME.blue} anchor="middle" fontFamily={THEME.fontLatin}>
            INPUT
          </SvgText>
          <SvgText x={198} y={930} size={20} weight={600} fill={THEME.textSecondary} anchor="middle">
            র প্রম্পট
          </SvgText>
        </g>

        {/* Connector Arrow 1 */}
        <line x1={288} y1={900} x2={358} y2={900} stroke={THEME.blue} strokeWidth={4} strokeDasharray="6 4" opacity={node1} />

        {/* Node 2 (Center Core) */}
        <g opacity={node2} transform={`scale(${node2})`} style={{ transformOrigin: '448px 900px' }}>
          <circle cx={448} cy={900} r={70} fill={THEME.panelAlt} stroke={THEME.amber} strokeWidth={3} />
          <SvgText x={448} y={895} size={28} weight={800} fill={THEME.amber} anchor="middle" fontFamily={THEME.fontLatin}>
            NAPKIN
          </SvgText>
          <SvgText x={448} y={930} size={20} weight={700} fill={THEME.textPrimary} anchor="middle">
            AI ইঞ্জিন
          </SvgText>
        </g>

        {/* Connector Arrow 2 */}
        <line x1={518} y1={900} x2={608} y2={900} stroke={THEME.green} strokeWidth={4} strokeDasharray="6 4" opacity={node2} />

        {/* Node 3 (Output Vector) */}
        <g opacity={node3} transform={`translate(${Math.round((1 - node3) * 20)}, 0)`}>
          <rect x={608} y={845} width={180} height={110} rx={18} fill={THEME.panelAlt} stroke={THEME.green} strokeWidth={2} />
          <SvgText x={698} y={895} size={28} weight={800} fill={THEME.green} anchor="middle" fontFamily={THEME.fontLatin}>
            VECTOR
          </SvgText>
          <SvgText x={698} y={930} size={20} weight={600} fill={THEME.textSecondary} anchor="middle">
            ডায়াগ্রাম
          </SvgText>
        </g>

        {/* Export Badges */}
        <g opacity={node3}>
          <rect x={268} y={1015} width={100} height={40} rx={12} fill={THEME.panelLight} stroke={THEME.border} />
          <SvgText x={318} y={1042} size={18} weight={800} fill={THEME.textPrimary} anchor="middle" fontFamily={THEME.fontLatin}>
            SVG
          </SvgText>

          <rect x={398} y={1015} width={100} height={40} rx={12} fill={THEME.panelLight} stroke={THEME.border} />
          <SvgText x={448} y={1042} size={18} weight={800} fill={THEME.textPrimary} anchor="middle" fontFamily={THEME.fontLatin}>
            PNG
          </SvgText>

          <rect x={528} y={1015} width={100} height={40} rx={12} fill={THEME.panelLight} stroke={THEME.border} />
          <SvgText x={578} y={1042} size={18} weight={800} fill={THEME.textPrimary} anchor="middle" fontFamily={THEME.fontLatin}>
            PDF
          </SvgText>
        </g>

        {/* Feature highlight */}
        <SvgText
          x={448}
          y={1135}
          size={24}
          weight={700}
          fill={THEME.blue}
          anchor="middle"
          fontFamily={THEME.fontBengali}
        >
          ✓ পুরো ব্যাপারটা এক ছবিতে
        </SvgText>
      </g>

      {/* Bottom Summary Pill */}
      <g opacity={diagramProgress}>
        <SvgPanel
          x={118}
          y={1225}
          width={660}
          height={68}
          fill={THEME.panelAlt}
          stroke={THEME.blue}
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
          💡 কোনো ডিজাইন স্কিল ছাড়াই তৈরি করুন নিখুঁত ডায়াগ্রাম
        </SvgText>
      </g>
    </svg>
  );
};
