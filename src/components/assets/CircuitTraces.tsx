import React from 'react';
import { interpolate } from 'remotion';

interface CircuitTracesProps {
  frame: number;
  width?: number;
  height?: number;
  color?: string;
}

export const CircuitTraces: React.FC<CircuitTracesProps> = ({
  frame,
  width = 900,
  height = 320,
  color = '#F97316',
}) => {
  // Compute pulse position looping every 45 frames (1.5s @ 30fps)
  const pulsePhase = (frame % 45) / 45;
  const pulseOffset = interpolate(pulsePhase, [0, 1], [0, 600]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: 'visible', position: 'absolute', inset: 0 }}
    >
      <defs>
        <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
          <stop offset="60%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor="#EA580C" stopOpacity="1" />
        </linearGradient>

        <radialGradient id="pulseGlow">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Static Bus Paths */}
      <path
        d="M 112 0 C 112 120 450 120 450 160"
        fill="none"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="3"
        strokeDasharray="6 6"
      />
      <path
        d="M 337 0 C 337 100 450 110 450 160"
        fill="none"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="3"
        strokeDasharray="6 6"
      />
      <path
        d="M 562 0 C 562 100 450 110 450 160"
        fill="none"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="3"
        strokeDasharray="6 6"
      />
      <path
        d="M 787 0 C 787 120 450 120 450 160"
        fill="none"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="3"
        strokeDasharray="6 6"
      />

      {/* Active Glowing Flow Paths */}
      <path
        d="M 112 0 C 112 120 450 120 450 160"
        fill="none"
        stroke="url(#circuitGrad)"
        strokeWidth="4"
        strokeDasharray="40 160"
        strokeDashoffset={-pulseOffset}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      <path
        d="M 337 0 C 337 100 450 110 450 160"
        fill="none"
        stroke="url(#circuitGrad)"
        strokeWidth="4"
        strokeDasharray="40 160"
        strokeDashoffset={-pulseOffset * 0.9}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      <path
        d="M 562 0 C 562 100 450 110 450 160"
        fill="none"
        stroke="url(#circuitGrad)"
        strokeWidth="4"
        strokeDasharray="40 160"
        strokeDashoffset={-pulseOffset * 0.9}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      <path
        d="M 787 0 C 787 120 450 120 450 160"
        fill="none"
        stroke="url(#circuitGrad)"
        strokeWidth="4"
        strokeDasharray="40 160"
        strokeDashoffset={-pulseOffset}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  );
};
