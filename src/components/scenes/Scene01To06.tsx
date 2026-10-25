import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Scene } from '../../types/scene';
import { snappyCardSpring, slideInSpring } from '../../animation/physics';
import { XAiLogo, GitHubLogo, CopilotLogo, HuggingFaceLogo, PythonLogo, RustLogo } from '../assets/BrandLogos';

// Scene 01: xAI Infrastructure
export const Scene01: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity, translateY } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{
          transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
          opacity,
        }}
        className="w-[880px] bg-white rounded-[40px] p-12 border border-slate-200/80 shadow-xl flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Category Pill */}
        <div className="flex items-center space-x-2 bg-blue-50 px-5 py-2 rounded-full border border-blue-200 mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <span className="font-sans text-sm font-bold text-blue-800 tracking-wider uppercase">
            AI INFRASTRUCTURE // xAI
          </span>
        </div>

        {/* Brand Logo */}
        <div className="my-4 filter drop-shadow-md">
          <XAiLogo size={100} />
        </div>

        {/* Large Bangla Headline */}
        <h1 className="font-bengali text-6xl font-bold text-slate-900 mt-6 leading-tight">
          ইলন মাস্কের <span className="text-blue-600">xAI Grok</span>
        </h1>

        {/* Minimal Sub-tag */}
        <div className="mt-8 flex items-center space-x-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-200">
          <span className="font-sans text-base font-semibold text-slate-700">Grok AI Backend Architecture</span>
        </div>
      </div>
    </div>
  );
};

// Scene 02: GitHub, Copilot, Hugging Face
export const Scene02: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c1 = slideInSpring(frame, fps, 0, 20);
  const c2 = slideInSpring(frame, fps, 6, 20);
  const c3 = slideInSpring(frame, fps, 12, 20);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div className="w-[880px] flex flex-col items-center space-y-6">
        <span className="font-sans text-sm font-bold text-blue-700 bg-blue-50 px-5 py-2 rounded-full border border-blue-200 uppercase tracking-wider">
          Top AI Industry Giants
        </span>

        {/* Card 1: GitHub */}
        <div
          style={{ transform: `scale(${c1.scale}) translateY(${c1.y}px)`, opacity: c1.opacity }}
          className="w-full bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-md flex items-center justify-between"
        >
          <div className="flex items-center space-x-5">
            <GitHubLogo size={56} />
            <div className="text-left">
              <h2 className="font-sans text-3xl font-extrabold text-slate-900">GitHub</h2>
              <p className="font-bengali text-lg text-slate-500 font-medium">বিশ্বের সর্ববৃহৎ ডেভেলপার প্ল্যাটফর্ম</p>
            </div>
          </div>
          <span className="bg-slate-100 text-slate-800 font-sans font-bold text-xs px-3 py-1.5 rounded-full">
            MIGRATING
          </span>
        </div>

        {/* Card 2: GitHub Copilot */}
        <div
          style={{ transform: `scale(${c2.scale}) translateY(${c2.y}px)`, opacity: c2.opacity }}
          className="w-full bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-md flex items-center justify-between"
        >
          <div className="flex items-center space-x-5">
            <CopilotLogo size={56} />
            <div className="text-left">
              <h2 className="font-sans text-3xl font-extrabold text-slate-900">GitHub Copilot</h2>
              <p className="font-bengali text-lg text-slate-500 font-medium">কোডিং অ্যাসিস্ট্যান্ট ইঞ্জিন</p>
            </div>
          </div>
          <span className="bg-blue-100 text-blue-800 font-sans font-bold text-xs px-3 py-1.5 rounded-full">
            AI CODE CORE
          </span>
        </div>

        {/* Card 3: Hugging Face */}
        <div
          style={{ transform: `scale(${c3.scale}) translateY(${c3.y}px)`, opacity: c3.opacity }}
          className="w-full bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-md flex items-center justify-between"
        >
          <div className="flex items-center space-x-5">
            <HuggingFaceLogo size={56} />
            <div className="text-left">
              <h2 className="font-sans text-3xl font-extrabold text-slate-900">Hugging Face</h2>
              <p className="font-bengali text-lg text-slate-500 font-medium">ওপেন-সোর্স এআই মডেল হাব</p>
            </div>
          </div>
          <span className="bg-amber-100 text-amber-800 font-sans font-bold text-xs px-3 py-1.5 rounded-full">
            TOKENIZERS IN RUST
          </span>
        </div>
      </div>
    </div>
  );
};

// Scene 03: Shift to Rust
export const Scene03: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = snappyCardSpring(frame, fps, 0);

  // Animated gear rotation
  const gearRotation = interpolate(frame, [0, 120], [0, 360]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `scale(${scale})`, opacity }}
        className="w-[880px] bg-white rounded-[40px] p-12 border border-slate-200/80 shadow-xl flex flex-col items-center text-center relative"
      >
        <span className="bg-orange-50 text-orange-700 font-sans text-sm font-bold px-5 py-2 rounded-full border border-orange-200 uppercase tracking-wider mb-8">
          The Great Tech Shift
        </span>

        {/* Central Spinning Rust Core */}
        <div className="relative w-36 h-36 flex items-center justify-center my-4">
          <div style={{ transform: `rotate(${gearRotation}deg)` }}>
            <RustLogo size={120} color="#EA580C" />
          </div>
        </div>

        {/* Large Bangla Headline */}
        <h1 className="font-bengali text-5xl font-extrabold text-slate-900 mt-6 leading-tight">
          সবাই এখন দ্রুত <span className="text-orange-600">Rust</span> ল্যাঙ্গুয়েজে শিফট করছে
        </h1>

        <div className="mt-8 flex items-center space-x-2 bg-orange-50 px-6 py-3 rounded-2xl border border-orange-200 text-orange-900 font-sans font-bold text-base">
          <span>⚡ High-Performance AI Backend Engine</span>
        </div>
      </div>
    </div>
  );
};

// Scene 04: AI Boss is Python?
export const Scene04: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity, translateY } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`, opacity }}
        className="w-[880px] bg-white rounded-[40px] p-12 border border-slate-200/80 shadow-xl flex flex-col items-center text-center relative"
      >
        <div className="flex items-center space-x-2 bg-blue-50 px-5 py-2 rounded-full border border-blue-200 mb-8">
          <span className="font-sans text-sm font-bold text-blue-800 uppercase tracking-wider">
            👑 The Undisputed King of AI
          </span>
        </div>

        <div className="my-4 filter drop-shadow-md">
          <PythonLogo size={110} />
        </div>

        <h1 className="font-bengali text-6xl font-extrabold text-slate-900 mt-6 leading-tight">
          কিন্তু প্রশ্ন হলো, এআই-এর বস তো <span className="text-blue-600">Python?</span>
        </h1>

        <p className="font-bengali text-2xl text-slate-600 font-medium mt-4">
          সব লাইব্রেরি, মডেল এবং রিসার্চ তো পাইথনেই তৈরি!
        </p>
      </div>
    </div>
  );
};

// Scene 05: Why is everyone shifting to Rust?
export const Scene05: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = snappyCardSpring(frame, fps, 0);

  // Subtle magnetic pull
  const pullProgress = interpolate(Math.sin((frame / 15) * Math.PI), [-1, 1], [-6, 6]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `scale(${scale})`, opacity }}
        className="w-[880px] bg-white rounded-[40px] p-12 border border-slate-200/80 shadow-xl flex flex-col items-center text-center relative"
      >
        <div className="flex items-center space-x-12 my-6">
          <div style={{ transform: `translateX(${-pullProgress}px)` }}>
            <PythonLogo size={90} />
          </div>
          <span className="font-sans text-4xl font-extrabold text-slate-300">➔</span>
          <div style={{ transform: `translateX(${pullProgress}px)` }}>
            <RustLogo size={90} color="#EA580C" />
          </div>
        </div>

        <h1 className="font-bengali text-5xl font-extrabold text-slate-900 mt-6 leading-tight">
          তাহলে হঠাৎ সবাই <span className="text-orange-600">রাস্টের</span> দিকে ঝুঁকছে কেন?
        </h1>

        <div className="mt-8 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-200">
          <span className="font-bengali text-xl font-bold text-slate-700">
            কী এমন কারণ যা সবাইকে বাধ্য করছে?
          </span>
        </div>
      </div>
    </div>
  );
};

// Scene 06: Is Python Dead?
export const Scene06: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity, translateY } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`, opacity }}
        className="w-[880px] bg-white rounded-[40px] p-12 border-2 border-red-200 shadow-xl flex flex-col items-center text-center relative overflow-hidden"
      >
        <div className="bg-red-50 text-red-700 font-sans text-sm font-bold px-5 py-2 rounded-full border border-red-200 uppercase tracking-wider mb-8">
          ⚠️ Industry Myth
        </div>

        <h1 className="font-bengali text-6xl font-extrabold text-slate-900 mt-4 leading-tight">
          পাইথনের দিন কি তবে শেষ?
        </h1>

        <div className="mt-8 flex items-center space-x-4">
          <span className="bg-red-100 text-red-800 text-lg font-sans font-bold px-6 py-2.5 rounded-full">
            Myth: Python is Dying ❌
          </span>
        </div>
      </div>
    </div>
  );
};
