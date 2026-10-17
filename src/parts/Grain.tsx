import React from 'react';
import {AbsoluteFill} from 'remotion';

export const Grain: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage:
        'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.05), rgba(0,0,0,0.55) 100%)',
      pointerEvents: 'none',
    }}
  />
);
