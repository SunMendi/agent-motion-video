import React from 'react';

interface TelemetryGaugeProps {
  value: number; // 0 to 100
  label: string;
  unit?: string;
  color?: string;
  size?: number;
}

export const TelemetryGauge: React.FC<TelemetryGaugeProps> = ({
  value,
  label,
  unit = '%',
  color = '#F97316',
  size = 180,
}) => {
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference * 0.75; // 270 deg arc

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        style={{ transform: 'rotate(135deg)', position: 'absolute' }}
      >
        {/* Background Arc */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="10"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeLinecap="round"
        />

        {/* Progress Arc */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${color})`,
          }}
        />
      </svg>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: '#FFFFFF',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
          }}
        >
          {Math.round(value)}
          <span style={{ fontSize: 16, color: color, marginLeft: 2 }}>{unit}</span>
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#94A3B8',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginTop: 2,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};
