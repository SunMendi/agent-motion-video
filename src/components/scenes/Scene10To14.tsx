import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Scene } from '../../types/scene';
import { snappyCardSpring, slideInSpring } from '../../animation/physics';
import { CarDiagram } from '../assets/CarDiagram';
import { CppLogo, MicrosoftLogo, GoogleLogo } from '../assets/BrandLogos';

// Scene 10: Python does not do the heavy lifting
export const Scene10: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity, translateY } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`, opacity }}
        className="w-[920px] flex flex-col items-center text-center space-y-6"
      >
        <span className="bg-blue-50 text-blue-800 font-sans text-sm font-bold px-6 py-2 rounded-full border border-blue-200 uppercase tracking-wider">
          Orchestration Layer
        </span>

        <h1 className="font-bengali text-5xl font-bold text-slate-900 leading-tight">
          Python শুধু <span className="text-blue-600">নির্দেশ পাঠায়</span>
        </h1>

        <CarDiagram mode="flow" />
      </div>
    </div>
  );
};

// Scene 11: Sends work to C++ and GPU
export const Scene11: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `scale(${scale})`, opacity }}
        className="w-[920px] flex flex-col items-center text-center space-y-6"
      >
        <span className="bg-sky-50 text-sky-800 font-sans text-sm font-bold px-6 py-2 rounded-full border border-sky-200 uppercase tracking-wider">
          Compute Execution
        </span>

        <h1 className="font-bengali text-5xl font-bold text-slate-900 leading-tight">
          আসল লোড নেয় <span className="text-sky-600">C++ ইঞ্জিন ও GPU</span>
        </h1>

        <CarDiagram mode="flow" />
      </div>
    </div>
  );
};

// Scene 12: The Big Problem - Memory Safety
export const Scene12: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `scale(${scale})`, opacity }}
        className="w-[880px] bg-white rounded-[40px] p-12 border-2 border-rose-200 shadow-xl flex flex-col items-center text-center relative overflow-hidden"
      >
        <span className="bg-rose-50 text-rose-700 font-sans text-sm font-bold px-5 py-2 rounded-full border border-rose-200 uppercase tracking-wider mb-6">
          The Achilles Heel // C & C++
        </span>

        <div className="my-2">
          <CppLogo size={80} color="#DC2626" />
        </div>

        <h1 className="font-bengali text-5xl font-extrabold text-slate-900 mt-4 leading-tight">
          C++ এর সবচেয়ে বড় সমস্যা হলো <br />
          <span className="text-rose-600">মেমোরি সেফটি (Memory Safety)</span>
        </h1>

        <p className="font-bengali text-2xl text-slate-600 font-medium mt-4">
          ম্যানুয়াল মেমোরি ম্যানেজমেন্টের কারণে সামান্য ভুলেই বড় বিপর্যয় ঘটে
        </p>
      </div>
    </div>
  );
};

// Scene 13: Crashes & Security Bugs
export const Scene13: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c1 = slideInSpring(frame, fps, 0, 18);
  const c2 = slideInSpring(frame, fps, 6, 18);
  const c3 = slideInSpring(frame, fps, 12, 18);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div className="w-[880px] flex flex-col items-center space-y-5 text-center">
        <span className="bg-rose-50 text-rose-700 font-sans text-sm font-bold px-5 py-2 rounded-full border border-rose-200 uppercase tracking-wider mb-2">
          Critical Failures in Production
        </span>

        <h1 className="font-bengali text-5xl font-extrabold text-slate-900 leading-tight">
          সামান্য ভুলের কারণে <span className="text-rose-600">ক্র্যাশ ও বাগ</span> তৈরি হয়
        </h1>

        {/* 3 Failure Cards */}
        <div
          style={{ transform: `scale(${c1.scale}) translateY(${c1.y}px)`, opacity: c1.opacity }}
          className="w-full bg-white rounded-2xl p-5 border border-rose-200 shadow-md flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <span className="text-2xl">💥</span>
            <div className="text-left">
              <span className="font-mono-code font-bold text-lg text-slate-900">Segmentation Fault</span>
              <p className="font-bengali text-sm text-slate-500">অনাকাঙ্ক্ষিত মেমোরি এক্সেসে পুরো সার্ভার ক্র্যাশ</p>
            </div>
          </div>
          <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Crash</span>
        </div>

        <div
          style={{ transform: `scale(${c2.scale}) translateY(${c2.y}px)`, opacity: c2.opacity }}
          className="w-full bg-white rounded-2xl p-5 border border-rose-200 shadow-md flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <span className="text-2xl">🔓</span>
            <div className="text-left">
              <span className="font-mono-code font-bold text-lg text-slate-900">Buffer Overflow</span>
              <p className="font-bengali text-sm text-slate-500">সিকিউরিটি বাইপাস ও ডেটা ব্রিচের সুযোগ</p>
            </div>
          </div>
          <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Exploit</span>
        </div>

        <div
          style={{ transform: `scale(${c3.scale}) translateY(${c3.y}px)`, opacity: c3.opacity }}
          className="w-full bg-white rounded-2xl p-5 border border-rose-200 shadow-md flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <span className="text-2xl">⚠️</span>
            <div className="text-left">
              <span className="font-mono-code font-bold text-lg text-slate-900">Use-After-Free</span>
              <p className="font-bengali text-sm text-slate-500">মেমোরি করাপশন এবং অনির্দিষ্ট আচরণ</p>
            </div>
          </div>
          <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Bug</span>
        </div>
      </div>
    </div>
  );
};

// Scene 14: Microsoft and Google 70% Proof
export const Scene14: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = snappyCardSpring(frame, fps, 0);

  // Animated bar fill 0% -> 70%
  const percent = Math.min(
    70,
    Math.round(interpolate(frame, [10, 45], [0, 70], { extrapolateRight: 'clamp' }))
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `scale(${scale})`, opacity }}
        className="w-[880px] bg-white rounded-[40px] p-12 border border-slate-200/90 shadow-xl flex flex-col items-center text-center relative"
      >
        <span className="bg-slate-100 text-slate-700 font-sans text-sm font-bold px-5 py-2 rounded-full border border-slate-200 uppercase tracking-wider mb-6">
          Primary Source Research
        </span>

        {/* Logos */}
        <div className="flex items-center space-x-8 mb-6">
          <MicrosoftLogo size={52} />
          <span className="text-2xl font-bold text-slate-300">&</span>
          <GoogleLogo size={52} />
        </div>

        <h1 className="font-bengali text-5xl font-extrabold text-slate-900 leading-tight">
          যার প্রমাণ মাইক্রোসফট ও গুগল নিজেই পেয়েছে
        </h1>

        {/* Stat Bar */}
        <div className="w-full bg-slate-50 p-8 rounded-3xl border border-slate-200 mt-8">
          <div className="flex justify-between items-end mb-3">
            <span className="font-sans font-bold text-slate-600 text-lg">Memory Safety Vulnerabilities</span>
            <span className="font-sans font-black text-rose-600 text-5xl">{percent}%</span>
          </div>
          <div className="w-full h-6 bg-slate-200 rounded-full overflow-hidden">
            <div
              style={{ width: `${percent}%` }}
              className="h-full bg-rose-600 rounded-full"
            />
          </div>
          <p className="font-bengali text-slate-500 text-base font-semibold mt-3 text-left">
            মাইক্রোসফট ও ক্রোমিয়ামের মতে প্রায় ৭০% নিরাপত্তা ত্রুটির মূল কারণ C/C++ মেমোরি বাগ।
          </p>
        </div>
      </div>
    </div>
  );
};
