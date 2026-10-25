import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Scene } from '../../types/scene';
import { snappyCardSpring } from '../../animation/physics';

// Scene 18: 4 Pillars Overview
export const Scene18: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `scale(${scale})`, opacity }}
        className="w-[880px] bg-white rounded-[40px] p-10 border border-slate-200/90 shadow-xl flex flex-col items-center text-center relative"
      >
        <span className="bg-orange-50 text-orange-800 font-sans text-sm font-bold px-6 py-2 rounded-full border border-orange-200 uppercase tracking-wider mb-6">
          The 4 Key Pillars
        </span>

        <h1 className="font-bengali text-5xl font-extrabold text-slate-900 leading-tight">
          মূলত <span className="text-orange-600">চারটি কারণে</span> <br />
          রাস্ট এখন এআই-এর সেরা ইঞ্জিন
        </h1>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-2 gap-4 w-full mt-8">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left">
            <span className="font-sans font-black text-orange-600 text-xl">01</span>
            <p className="font-bengali font-bold text-slate-800 text-lg mt-1">প্রেডিক্টেবল স্পিড</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left">
            <span className="font-sans font-black text-orange-600 text-xl">02</span>
            <p className="font-bengali font-bold text-slate-800 text-lg mt-1">ট্রু প্যারালালিজম</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left">
            <span className="font-sans font-black text-orange-600 text-xl">03</span>
            <p className="font-bengali font-bold text-slate-800 text-lg mt-1">নিখুঁত মেমোরি কন্ট্রোল</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left">
            <span className="font-sans font-black text-orange-600 text-xl">04</span>
            <p className="font-bengali font-bold text-slate-800 text-lg mt-1">পাইথনের সাথে মিল</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Scene 19: Pillar 1 - Predictable Speed
export const Scene19: React.FC<{ scene: Scene }> = () => {
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
          Pillar 01
        </span>

        <span className="text-6xl font-black text-orange-600 font-sans">01</span>

        <h1 className="font-bengali text-6xl font-extrabold text-slate-900 mt-4 leading-tight">
          প্রেডিক্টেবল স্পিড
        </h1>

        <p className="font-sans text-2xl font-bold text-slate-500 mt-4">
          Ultra-Consistent Low Latency
        </p>
      </div>
    </div>
  );
};

// Scene 20: No Garbage Collector
export const Scene20: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `scale(${scale})`, opacity }}
        className="w-[880px] bg-white rounded-[40px] p-10 border border-slate-200/90 shadow-xl flex flex-col items-center text-center relative"
      >
        <span className="bg-emerald-50 text-emerald-800 font-sans text-sm font-bold px-6 py-2 rounded-full border border-emerald-200 uppercase tracking-wider mb-6">
          Zero GC Overhead
        </span>

        <h1 className="font-bengali text-5xl font-extrabold text-slate-900 leading-tight">
          এতে কোনো <span className="text-orange-600">Garbage Collector</span> নেই
        </h1>

        <div className="w-full bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-left">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bengali font-bold text-slate-800 text-lg">রিয়েল-টাইম এআই সার্ভার ল্যাটেন্সি:</span>
            <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full uppercase">Smooth</span>
          </div>
          <div className="w-full h-12 bg-white rounded-xl border border-slate-200 flex items-center px-4 relative overflow-hidden">
            <div className="w-full h-1 bg-emerald-500 rounded-full" />
            <span className="absolute right-4 text-xs font-bold text-emerald-700">Zero GC Stutter</span>
          </div>
        </div>

        <p className="font-bengali text-2xl text-slate-600 font-medium">
          সার্ভারে কোনো ল্যাগ বা অপ্রত্যাশিত ফ্রিজ হয় না
        </p>
      </div>
    </div>
  );
};

// Scene 21: Pillar 2 - True Parallelism
export const Scene21: React.FC<{ scene: Scene }> = () => {
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
          Pillar 02
        </span>

        <span className="text-6xl font-black text-orange-600 font-sans">02</span>

        <h1 className="font-bengali text-6xl font-extrabold text-slate-900 mt-4 leading-tight">
          ট্রু প্যারালালিজম
        </h1>

        <p className="font-sans text-2xl font-bold text-slate-500 mt-4">
          Fearless Multithreading Across All CPU Cores
        </p>
      </div>
    </div>
  );
};

// Scene 22: Python GIL bottleneck
export const Scene22: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `scale(${scale})`, opacity }}
        className="w-[880px] bg-white rounded-[40px] p-10 border border-slate-200/90 shadow-xl flex flex-col items-center text-center relative"
      >
        <span className="bg-amber-50 text-amber-800 font-sans text-sm font-bold px-6 py-2 rounded-full border border-amber-200 uppercase tracking-wider mb-6">
          Python GIL Bottleneck
        </span>

        <h1 className="font-bengali text-5xl font-extrabold text-slate-900 leading-tight">
          পাইথনে একসাথে মাল্টিপল থ্রেডে <br />
          কাজ করা বেশ কঠিন
        </h1>

        <div className="w-full bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6">
          <span className="font-mono-code font-bold text-rose-600 text-lg">
            Global Interpreter Lock (GIL)
          </span>
          <p className="font-bengali text-slate-600 text-lg font-medium mt-2">
            একবারে শুধুমাত্র একটি থ্রেড এক্সিকিউট হতে পারে
          </p>
        </div>
      </div>
    </div>
  );
};

// Scene 23: Rust Parallelism & Data Loading
export const Scene23: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `scale(${scale})`, opacity }}
        className="w-[880px] bg-white rounded-[40px] p-10 border border-slate-200/90 shadow-xl flex flex-col items-center text-center relative"
      >
        <span className="bg-emerald-50 text-emerald-800 font-sans text-sm font-bold px-6 py-2 rounded-full border border-emerald-200 uppercase tracking-wider mb-6">
          Fearless Parallelism
        </span>

        <h1 className="font-bengali text-5xl font-extrabold text-slate-900 leading-tight">
          রাস্টে খুব নিরাপদে <br />
          <span className="text-emerald-600">প্যারালাল কোড</span> চালানো যায়
        </h1>

        <div className="w-full bg-orange-50 p-6 rounded-2xl border border-orange-200 my-6">
          <p className="font-bengali text-2xl font-bold text-orange-950">
            Rayon ও Multithreading ডেটা লোডিং-কে বহুগুণ ফাস্ট করে
          </p>
        </div>
      </div>
    </div>
  );
};

// Scene 24: Pillar 3 - Memory Control
export const Scene24: React.FC<{ scene: Scene }> = () => {
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
          Pillar 03
        </span>

        <span className="text-6xl font-black text-orange-600 font-sans">03</span>

        <h1 className="font-bengali text-6xl font-extrabold text-slate-900 mt-4 leading-tight">
          মেমোরি কন্ট্রোল
        </h1>

        <p className="font-sans text-2xl font-bold text-slate-500 mt-4">
          Bare-Metal Precision Without Crashing
        </p>
      </div>
    </div>
  );
};

// Scene 25: C++ Level Control Without Crashes
export const Scene25: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `scale(${scale})`, opacity }}
        className="w-[880px] bg-white rounded-[40px] p-10 border border-slate-200/90 shadow-xl flex flex-col items-center text-center relative"
      >
        <span className="bg-blue-50 text-blue-800 font-sans text-sm font-bold px-6 py-2 rounded-full border border-blue-200 uppercase tracking-wider mb-6">
          Best of Both Worlds
        </span>

        <h1 className="font-bengali text-5xl font-extrabold text-slate-900 leading-tight">
          C++ এর মতো সম্পূর্ণ কন্ট্রোল, <br />
          <span className="text-emerald-600">কোন ক্র্যাশ হওয়ার ভয় ছাড়াই</span>
        </h1>

        <div className="flex items-center space-x-6 my-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-800 text-lg">100% Hardware Access</span>
          </div>
          <span className="text-2xl text-slate-400 font-bold">+</span>
          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200">
            <span className="font-bold text-emerald-800 text-lg">0% Crash Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Scene 26: Pillar 4 - Seamless Python Synergy
export const Scene26: React.FC<{ scene: Scene }> = () => {
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
          Pillar 04
        </span>

        <span className="text-6xl font-black text-orange-600 font-sans">04</span>

        <h1 className="font-bengali text-6xl font-extrabold text-slate-900 mt-4 leading-tight">
          পাইথনের সাথে দারুণ মিল
        </h1>

        <p className="font-sans text-2xl font-bold text-slate-500 mt-4">
          Seamless Interoperability
        </p>
      </div>
    </div>
  );
};

// Scene 27: PyO3 Bridge
export const Scene27: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `scale(${scale})`, opacity }}
        className="w-[880px] bg-white rounded-[40px] p-10 border border-slate-200/90 shadow-xl flex flex-col items-center text-center relative"
      >
        <span className="bg-blue-50 text-blue-800 font-sans text-sm font-bold px-6 py-2 rounded-full border border-blue-200 uppercase tracking-wider mb-6">
          PyO3 // Rust-Python Bindings
        </span>

        <h1 className="font-bengali text-5xl font-extrabold text-slate-900 leading-tight">
          <span className="text-blue-600 font-sans">PyO3</span> দিয়ে রাস্টের কোড <br />
          সরাসরি পাইথনে ইম্পোর্ট করা যায়
        </h1>

        <div className="w-full bg-slate-900 rounded-2xl p-6 text-left my-6 font-mono-code shadow-inner">
          <p className="text-slate-400 text-sm"># inside Python script</p>
          <p className="text-white text-xl font-bold mt-1">
            <span className="text-purple-400">import</span> rust_core
          </p>
          <p className="text-emerald-400 text-base mt-2">
            result = rust_core.heavy_compute()
          </p>
        </div>
      </div>
    </div>
  );
};
