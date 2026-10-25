import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Scene } from '../../types/scene';
import { snappyCardSpring, slideInSpring } from '../../animation/physics';
import { CarDiagram } from '../assets/CarDiagram';
import { PythonLogo, RustLogo } from '../assets/BrandLogos';

// Scene 28: Tiktoken, Pydantic, Polars
export const Scene28: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c1 = slideInSpring(frame, fps, 0, 18);
  const c2 = slideInSpring(frame, fps, 6, 18);
  const c3 = slideInSpring(frame, fps, 12, 18);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div className="w-[880px] flex flex-col items-center space-y-5 text-center">
        <span className="bg-orange-50 text-orange-800 font-sans text-sm font-bold px-6 py-2 rounded-full border border-orange-200 uppercase tracking-wider mb-2">
          Real-World AI Ecosystem
        </span>

        <h1 className="font-bengali text-5xl font-extrabold text-slate-900 leading-tight">
          টিকটকেন, পাইড্যান্টিক কিংবা পলার্স
        </h1>

        {/* 3 Real-World Rust Cards */}
        <div
          style={{ transform: `scale(${c1.scale}) translateY(${c1.y}px)`, opacity: c1.opacity }}
          className="w-full bg-white rounded-2xl p-5 border border-slate-200 shadow-md flex items-center justify-between"
        >
          <div className="text-left">
            <span className="font-sans font-extrabold text-xl text-slate-900">OpenAI Tiktoken</span>
            <p className="font-bengali text-sm text-slate-500 font-medium">অ্যালগরিদম সম্পূর্ণ রাস্টে লিখিত দ্রুত টোকেনাইজার</p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full font-sans uppercase">
            Rust Core
          </span>
        </div>

        <div
          style={{ transform: `scale(${c2.scale}) translateY(${c2.y}px)`, opacity: c2.opacity }}
          className="w-full bg-white rounded-2xl p-5 border border-slate-200 shadow-md flex items-center justify-between"
        >
          <div className="text-left">
            <span className="font-sans font-extrabold text-xl text-slate-900">Pydantic v2</span>
            <p className="font-bengali text-sm text-slate-500 font-medium">পাইথনের ভ্যালিডেশন ইঞ্জিন এখন রাস্টে ১৭ গুণ ফাস্ট</p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full font-sans uppercase">
            17x Faster
          </span>
        </div>

        <div
          style={{ transform: `scale(${c3.scale}) translateY(${c3.y}px)`, opacity: c3.opacity }}
          className="w-full bg-white rounded-2xl p-5 border border-slate-200 shadow-md flex items-center justify-between"
        >
          <div className="text-left">
            <span className="font-sans font-extrabold text-xl text-slate-900">Polars DataFrames</span>
            <p className="font-bengali text-sm text-slate-500 font-medium">প্যান্ডাসের আধুনিক বিকল্প, সম্পূর্ণ রাস্ট ইঞ্জিনে তৈরি</p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full font-sans uppercase">
            Multi-Threaded
          </span>
        </div>
      </div>
    </div>
  );
};

// Scene 29: Rust is already inside everyday tools
export const Scene29: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `scale(${scale})`, opacity }}
        className="w-[880px] bg-white rounded-[40px] p-12 border border-slate-200/90 shadow-xl flex flex-col items-center text-center relative"
      >
        <span className="bg-orange-50 text-orange-800 font-sans text-sm font-bold px-6 py-2 rounded-full border border-orange-200 uppercase tracking-wider mb-6">
          Under The Hood Everywhere
        </span>

        <h1 className="font-bengali text-5xl font-extrabold text-slate-900 leading-tight">
          প্রতিদিন যেসব টুল ব্যবহার করি, <br />
          তার ভেতরে <span className="text-orange-600">অলরেডি রাস্ট কাজ করছে</span>
        </h1>

        <div className="mt-8 flex items-center space-x-3 bg-orange-50 px-8 py-4 rounded-2xl border border-orange-200">
          <RustLogo size={36} color="#EA580C" />
          <span className="font-sans font-extrabold text-orange-950 text-xl">
            100% Rust Engine Powering Everyday AI
          </span>
        </div>
      </div>
    </div>
  );
};

// Scene 30: Rust is NOT replacing Python
export const Scene30: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `scale(${scale})`, opacity }}
        className="w-[880px] bg-white rounded-[40px] p-12 border border-slate-200/90 shadow-xl flex flex-col items-center text-center relative"
      >
        <div className="flex items-center space-x-6 mb-6">
          <PythonLogo size={72} />
          <span className="text-4xl font-extrabold text-emerald-600">+</span>
          <RustLogo size={72} color="#EA580C" />
        </div>

        <h1 className="font-bengali text-6xl font-extrabold text-slate-900 leading-tight">
          তাই, রাস্ট কিন্তু <br />
          <span className="text-blue-600">পাইথনকে রিপ্লেস করছে না</span>
        </h1>

        <div className="mt-8 bg-blue-50 px-8 py-3 rounded-2xl border border-blue-200">
          <span className="font-bengali text-xl font-bold text-blue-900">
            নয় কোনো প্রতিদ্বন্দ্বিতা — বরং দুর্দান্ত পার্টনারশিপ!
          </span>
        </div>
      </div>
    </div>
  );
};

// Scene 31: Replacing C++ Engine Under The Hood
export const Scene31: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `scale(${scale})`, opacity }}
        className="w-[920px] flex flex-col items-center text-center space-y-6"
      >
        <span className="bg-orange-50 text-orange-800 font-sans text-sm font-bold px-6 py-2 rounded-full border border-orange-200 uppercase tracking-wider">
          The Engine Upgrade
        </span>

        <h1 className="font-bengali text-5xl font-bold text-slate-900 leading-tight">
          C++ এর বদলে <span className="text-orange-600">শক্তিশালী Rust ইঞ্জিন</span>
        </h1>

        <CarDiagram mode="swap" />
      </div>
    </div>
  );
};

// Scene 32: Making AI Faster and Safer (Hero Outro through 123.2s)
export const Scene32: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `scale(${scale})`, opacity }}
        className="w-[880px] bg-white rounded-[44px] p-12 border-2 border-orange-300 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
      >
        <div className="flex items-center space-x-6 mb-6">
          <PythonLogo size={80} />
          <span className="text-4xl font-extrabold text-slate-400">+</span>
          <RustLogo size={80} color="#EA580C" />
        </div>

        <h1 className="font-bengali text-6xl font-extrabold text-slate-900 leading-tight">
          এআই-কে আরো <span className="text-orange-600">ফাস্ট</span> এবং <br />
          <span className="text-emerald-600">নিরাপদ</span> করে তুলছে
        </h1>

        {/* Dual Hero Pills */}
        <div className="grid grid-cols-2 gap-4 w-full mt-8">
          <div className="bg-orange-50 p-6 rounded-3xl border border-orange-200 text-center">
            <span className="text-4xl">⚡</span>
            <p className="font-sans font-black text-2xl text-orange-900 mt-2">10x Faster</p>
            <p className="font-bengali text-sm text-orange-700 font-semibold mt-1">হাই-স্পিড ডেটা প্রসেসিং</p>
          </div>

          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-200 text-center">
            <span className="text-4xl">🛡️</span>
            <p className="font-sans font-black text-2xl text-emerald-900 mt-2">100% Safe</p>
            <p className="font-bengali text-sm text-emerald-700 font-semibold mt-1">জিরো মেমোরি ক্র্যাশ</p>
          </div>
        </div>

        <div className="mt-8 text-slate-400 font-sans text-sm font-bold uppercase tracking-widest">
          Python (Control) + Rust (Core Engine) = Future of AI
        </div>
      </div>
    </div>
  );
};
