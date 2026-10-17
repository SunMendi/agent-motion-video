import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

type Spot = {x: number; y: number; size?: number; phase?: number};

/** Twinkling four-point sparkles drawn as SVG paths. */
export const Sparkles: React.FC<{spots: Spot[]; color?: string}> = ({
  spots,
  color = '#1668E3',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible'}}>
      {spots.map((s, i) => {
        const size = s.size ?? 26;
        const p = (frame / fps) * 2.2 + (s.phase ?? i * 1.3);
        const k = (Math.sin(p * Math.PI) + 1) / 2; // 0..1 twinkle
        const scale = 0.5 + k * 0.7;
        const rot = k * 45;
        const r = size / 2;
        const path = `M0,${-r} Q ${r * 0.18},${-r * 0.18} ${r},0 Q ${r * 0.18},${r * 0.18} 0,${r} Q ${-r * 0.18},${r * 0.18} ${-r},0 Q ${-r * 0.18},${-r * 0.18} 0,${-r} Z`;
        return (
          <g
            key={i}
            transform={`translate(${s.x} ${s.y}) rotate(${rot}) scale(${scale})`}
            opacity={0.25 + k * 0.75}
          >
            <path d={path} fill={color} />
          </g>
        );
      })}
    </svg>
  );
};
