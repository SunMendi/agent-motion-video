import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PythonLogo, CppLogo, RustLogo } from './BrandLogos';

interface CarDiagramProps {
  mode: 'full' | 'steering' | 'engine' | 'flow' | 'swap';
}

export const CarDiagram: React.FC<CarDiagramProps> = ({ mode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { mass: 0.6, damping: 14, stiffness: 240 },
  });
  const entranceScale = interpolate(entrance, [0, 1], [0.92, 1]);
  const entranceOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });

  // Camera coordinates based on mode
  let targetZoom = 1.0;
  let targetPanX = 0;
  let targetPanY = 0;

  if (mode === 'full') {
    targetZoom = 1.0;
    targetPanX = 0;
    targetPanY = 0;
  } else if (mode === 'steering') {
    targetZoom = 1.8;
    targetPanX = -30;
    targetPanY = 45;
  } else if (mode === 'engine') {
    targetZoom = 1.8;
    targetPanX = -180;
    targetPanY = -10;
  } else if (mode === 'flow') {
    targetZoom = 1.25;
    targetPanX = -40;
    targetPanY = 0;
  } else if (mode === 'swap') {
    targetZoom = 1.75;
    targetPanX = -170;
    targetPanY = -10;
  }

  // Smooth camera zoom and pan interpolation
  const camZoom = interpolate(entrance, [0, 1], [1.0, targetZoom]);
  const camPanX = interpolate(entrance, [0, 1], [0, targetPanX]);
  const camPanY = interpolate(entrance, [0, 1], [0, targetPanY]);

  // Steering wheel oscillation
  const steerAngle = interpolate(
    Math.sin((frame / 14) * Math.PI),
    [-1, 1],
    [-14, 14]
  );

  // Engine micro vibration
  const engineVibe = mode === 'engine' ? Math.sin((frame * 2.5) * Math.PI) * 2 : 0;

  // Signal flow packet position (mode === 'flow')
  const flowProgress = (frame % 24) / 24;
  const packetX = interpolate(flowProgress, [0, 1], [455, 590]);
  const packetY = interpolate(flowProgress, [0, 1], [140, 190]);

  // Swap animations (mode === 'swap')
  const cppSlide = interpolate(frame, [15, 35], [0, -420], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cppOpacity = interpolate(frame, [15, 30], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rustSlide = interpolate(frame, [25, 45], [420, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rustOpacity = interpolate(frame, [25, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        transform: `scale(${entranceScale})`,
        opacity: entranceOpacity,
      }}
      className="w-full flex flex-col items-center justify-center relative mt-2"
    >
      {/* 880x420 Master Supercar Stage Card */}
      <div className="relative w-[880px] h-[420px] bg-white rounded-[36px] border border-slate-200/90 shadow-xl flex items-center justify-center p-6 overflow-hidden">
        {/* Subtle blueprint grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.05) 1px, transparent 0)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
          }}
        />

        {/* Cinematic Camera Wrapper */}
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${camZoom}) translate(${camPanX}px, ${camPanY}px)`,
            transformOrigin: 'center center',
          }}
          className="relative flex items-center justify-center"
        >
          <svg viewBox="0 0 800 320" className="w-full h-full" fill="none">
            {/* Ground shadow */}
            <ellipse cx="400" cy="275" rx="340" ry="18" fill="rgba(15, 23, 42, 0.08)" />

            {/* Aerodynamic Supercar Body */}
            <path
              d="M120 230 C 130 190, 170 170, 240 160 L 330 110 C 370 90, 470 90, 530 120 L 640 160 C 690 170, 720 190, 730 230 C 720 240, 700 245, 660 245 C 650 215, 620 195, 580 195 C 540 195, 510 215, 500 245 L 280 245 C 270 215, 240 195, 200 195 C 160 195, 130 215, 120 245 Z"
              fill="#2563EB"
              stroke="#1D4ED8"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Front hood highlight line */}
            <path
              d="M620 165 L 710 215 L 660 220"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Cabin / Windshield & Windows */}
            <path
              d="M 335 118 L 435 105 L 525 125 L 505 160 L 315 160 Z"
              fill="#0F172A"
              stroke="#38BDF8"
              strokeWidth="3"
            />

            {/* Wheels */}
            {/* Front Wheel */}
            <g transform="translate(580, 245)">
              <circle r="44" fill="#0F172A" stroke="#334155" strokeWidth="4" />
              <circle r="28" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
              <circle r="14" fill="#E2E8F0" />
            </g>

            {/* Rear Wheel */}
            <g transform="translate(200, 245)">
              <circle r="44" fill="#0F172A" stroke="#334155" strokeWidth="4" />
              <circle r="28" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
              <circle r="14" fill="#E2E8F0" />
            </g>

            {/* Headlights */}
            <polygon points="720,205 735,215 725,225" fill="#FEF08A" />

            {/* STEERING WHEEL ASSEMBLY at (455, 138) */}
            <g
              transform={`translate(455, 138) rotate(${steerAngle})`}
              style={{ transformOrigin: 'center' }}
            >
              <circle r="22" stroke="#FACC15" strokeWidth="5" fill="#0F172A" />
              <circle r="22" stroke="#38BDF8" strokeWidth="5" strokeDasharray="35 35" fill="none" />
              <line x1="0" y1="-22" x2="0" y2="22" stroke="#FACC15" strokeWidth="4" />
              <line x1="-22" y1="0" x2="22" y2="0" stroke="#FACC15" strokeWidth="4" />
              <circle r="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            </g>

            {/* ENGINE BAY ASSEMBLY at (600, 190) */}
            {mode !== 'swap' && (
              <g transform={`translate(600, 190) translate(0, ${engineVibe})`}>
                <rect
                  x="-45"
                  y="-28"
                  width="90"
                  height="56"
                  rx="10"
                  fill="#0369A1"
                  stroke="#38BDF8"
                  strokeWidth="3"
                />
                <line x1="-35" y1="-14" x2="35" y2="-14" stroke="#7DD3FC" strokeWidth="3" strokeLinecap="round" />
                <line x1="-35" y1="0" x2="35" y2="0" stroke="#7DD3FC" strokeWidth="3" strokeLinecap="round" />
                <line x1="-35" y1="14" x2="35" y2="14" stroke="#7DD3FC" strokeWidth="3" strokeLinecap="round" />
                <text x="0" y="5" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="Space Grotesk">
                  C / C++
                </text>
              </g>
            )}

            {/* HOT-SWAP ENGINE BAY (mode === 'swap') */}
            {mode === 'swap' && (
              <g transform="translate(600, 190)">
                {/* Legacy C++ Engine Sliding Out */}
                <g
                  transform={`translate(${cppSlide}, 0)`}
                  opacity={cppOpacity}
                >
                  <rect
                    x="-45"
                    y="-28"
                    width="90"
                    height="56"
                    rx="10"
                    fill="#64748B"
                    stroke="#94A3B8"
                    strokeWidth="3"
                  />
                  <text x="0" y="5" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="Space Grotesk">
                    C / C++
                  </text>
                </g>

                {/* New Rust Core Engine Sliding In and Locking */}
                <g
                  transform={`translate(${rustSlide}, 0)`}
                  opacity={rustOpacity}
                >
                  <rect
                    x="-45"
                    y="-28"
                    width="90"
                    height="56"
                    rx="10"
                    fill="#EA580C"
                    stroke="#FB923C"
                    strokeWidth="3.5"
                  />
                  <line x1="-35" y1="-14" x2="35" y2="-14" stroke="#FFEDD5" strokeWidth="3" strokeLinecap="round" />
                  <line x1="-35" y1="0" x2="35" y2="0" stroke="#FFEDD5" strokeWidth="3" strokeLinecap="round" />
                  <line x1="-35" y1="14" x2="35" y2="14" stroke="#FFEDD5" strokeWidth="3" strokeLinecap="round" />
                  <text x="0" y="5" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="Space Grotesk">
                    RUST
                  </text>
                </g>
              </g>
            )}

            {/* FLOW WIRING HARNESS & INSTRUCTION PACKET (mode === 'flow') */}
            {mode === 'flow' && (
              <>
                <path
                  d="M 455 140 Q 520 130, 590 190"
                  stroke="#38BDF8"
                  strokeWidth="4"
                  strokeDasharray="6 4"
                  fill="none"
                />
                <circle cx={packetX} cy={packetY} r="8" fill="#FACC15" stroke="#FFFFFF" strokeWidth="2.5" />
              </>
            )}
          </svg>
        </div>

        {/* Dynamic Contextual Callout Overlay */}
        {mode === 'full' && (
          <>
            <div className="absolute top-6 left-12 flex items-center space-x-2 bg-white/95 px-4 py-2 rounded-full border border-blue-200 shadow-sm">
              <PythonLogo size={24} />
              <span className="text-xs font-bold text-blue-900 font-sans">কন্ট্রোল: Python স্টিয়ারিং</span>
            </div>
            <div className="absolute top-6 right-12 flex items-center space-x-2 bg-white/95 px-4 py-2 rounded-full border border-sky-200 shadow-sm">
              <CppLogo size={24} />
              <span className="text-xs font-bold text-sky-900 font-sans">কম্পিউট: C/C++ ইঞ্জিন</span>
            </div>
          </>
        )}

        {mode === 'steering' && (
          <div className="absolute top-6 left-6 flex items-center space-x-2.5 bg-blue-50/95 px-5 py-2 rounded-full border-2 border-blue-400 shadow-md">
            <PythonLogo size={24} />
            <span className="text-sm font-bold text-blue-900 font-sans">
              Python // স্টিয়ারিং হুইল (সহজ ইউজার ইন্টারফেস)
            </span>
          </div>
        )}

        {mode === 'engine' && (
          <div className="absolute top-6 right-6 flex items-center space-x-2.5 bg-sky-50/95 px-5 py-2 rounded-full border-2 border-sky-400 shadow-md">
            <CppLogo size={24} />
            <span className="text-sm font-bold text-sky-900 font-sans">
              C/C++ // আসল ইঞ্জিন (ভারি কম্পিউটেশন ও গতি)
            </span>
          </div>
        )}

        {mode === 'flow' && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-slate-900/90 text-white px-6 py-2 rounded-full shadow-md font-sans text-sm font-bold">
            <span className="text-amber-400">⚡ নির্দেশ প্রবাহ:</span>
            <span>Python (কন্ট্রোল) ➔ C++ / GPU (কম্পিউট)</span>
          </div>
        )}

        {mode === 'swap' && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center space-x-3 bg-orange-50/95 px-6 py-2.5 rounded-full border-2 border-orange-500 shadow-md">
            <RustLogo size={28} color="#EA580C" />
            <span className="text-base font-bold text-orange-950 font-sans">
              ইঞ্জিন আপগ্রেড: Legacy C++ ➔ 100% সেফ Rust কোর
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
