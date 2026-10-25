import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Scene } from '../../types/scene';
import { snappyCardSpring } from '../../animation/physics';
import { RustLogo } from '../assets/BrandLogos';

// Scene 15: Rust Enters as the Hero
export const Scene15: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = snappyCardSpring(frame, fps, 0);

  const ringScale = interpolate(frame, [0, 20], [0.8, 1.4], { extrapolateRight: 'clamp' });
  const ringOpacity = interpolate(frame, [0, 10, 20], [0, 0.4, 0], { extrapolateRight: 'clamp' });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `scale(${scale})`, opacity }}
        className="w-[880px] bg-white rounded-[40px] p-12 border-2 border-orange-200 shadow-xl flex flex-col items-center text-center relative overflow-hidden"
      >
        <span className="bg-orange-50 text-orange-800 font-sans text-sm font-bold px-6 py-2 rounded-full border border-orange-200 uppercase tracking-wider mb-6">
          The Solution
        </span>

        {/* Hero Rust Logo with Shockwave Ring */}
        <div className="relative w-36 h-36 flex items-center justify-center my-4">
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 9999,
              border: '4px solid #EA580C',
              transform: `scale(${ringScale})`,
              opacity: ringOpacity,
            }}
          />
          <RustLogo size={120} color="#EA580C" />
        </div>

        <h1 className="font-bengali text-6xl font-extrabold text-slate-900 mt-6 leading-tight">
          আর ঠিক এই জায়গাতেই <br />
          হিরো হিসেবে এন্ট্রি নিয়েছে <span className="text-orange-600">Rust</span>
        </h1>

        <div className="mt-8 bg-orange-50 px-8 py-3 rounded-2xl border border-orange-200">
          <span className="font-sans font-bold text-orange-900 text-lg">
            ⚡ C-Level Speed + Complete Memory Safety
          </span>
        </div>
      </div>
    </div>
  );
};

// Scene 16: Compiler Catches Errors Before Running
export const Scene16: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `scale(${scale})`, opacity }}
        className="w-[880px] bg-white rounded-[40px] p-10 border border-slate-200/90 shadow-xl flex flex-col items-center text-center relative"
      >
        <span className="bg-orange-50 text-orange-800 font-sans text-sm font-bold px-5 py-2 rounded-full border border-orange-200 uppercase tracking-wider mb-6">
          Borrow Checker // Compile Time
        </span>

        <h1 className="font-bengali text-5xl font-extrabold text-slate-900 leading-tight">
          রান হওয়ার আগেই কম্পাইলার <br />
          <span className="text-orange-600">সব ভুল ধরে ফেলে</span>
        </h1>

        {/* Minimal Rust Compiler Inspection Box */}
        <div className="w-full bg-slate-900 rounded-2xl p-6 text-left my-6 shadow-inner font-mono-code">
          <div className="flex items-center space-x-2 mb-3 border-b border-slate-800 pb-2">
            <span className="text-xs text-orange-400 font-bold">rustc // borrow-checker</span>
          </div>
          <p className="text-slate-300 text-base">
            <span className="text-rose-400 font-bold">error[E0382]:</span> borrow of moved value
          </p>
          <div className="mt-3 bg-slate-800 p-3 rounded-lg border-l-4 border-orange-500">
            <p className="text-xs text-slate-300">
              --&gt; src/main.rs:12:5 <br />
              Caught at compile time: Zero memory leaks allowed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Scene 17: Zero Bugs in Runtime
export const Scene17: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `scale(${scale})`, opacity }}
        className="w-[880px] bg-white rounded-[40px] p-12 border-2 border-emerald-200 shadow-xl flex flex-col items-center text-center relative"
      >
        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <span className="text-5xl">🛡️</span>
        </div>

        <h1 className="font-bengali text-6xl font-extrabold text-slate-900 leading-tight">
          মানে বাগ নিয়ে <br />
          <span className="text-emerald-600">কোড রানই হবে না</span>
        </h1>

        <div className="mt-8 flex items-center space-x-3 bg-emerald-50 px-8 py-4 rounded-2xl border border-emerald-200">
          <span className="font-sans font-extrabold text-emerald-800 text-xl">
            100% Memory Safety in Production
          </span>
        </div>
      </div>
    </div>
  );
};
