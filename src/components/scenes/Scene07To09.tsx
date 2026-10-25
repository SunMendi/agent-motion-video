import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Scene } from '../../types/scene';
import { snappyCardSpring } from '../../animation/physics';
import { CarDiagram } from '../assets/CarDiagram';

// Scene 07: Compare AI to a Car (Full Car Introduction)
export const Scene07: React.FC<{ scene: Scene }> = () => {
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
          The Mental Model // Car Analogy
        </span>

        <h1 className="font-bengali text-5xl font-bold text-slate-900 leading-tight">
          এআই যেন <span className="text-blue-600">একটি সুপারকার</span>
        </h1>

        {/* Full Vector Car Diagram */}
        <CarDiagram mode="full" />
      </div>
    </div>
  );
};

// Scene 08: Python is the Steering Wheel
export const Scene08: React.FC<{ scene: Scene }> = () => {
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
          Part 01 // The Interface
        </span>

        <h1 className="font-bengali text-5xl font-bold text-slate-900 leading-tight">
          Python: <span className="text-blue-600">কন্ট্রোল ও স্টিয়ারিং</span>
        </h1>

        {/* Steering Wheel Close-up */}
        <CarDiagram mode="steering" />
      </div>
    </div>
  );
};

// Scene 09: C / C++ is the Engine
export const Scene09: React.FC<{ scene: Scene }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity, translateY } = snappyCardSpring(frame, fps, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div
        style={{ transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`, opacity }}
        className="w-[920px] flex flex-col items-center text-center space-y-6"
      >
        <span className="bg-sky-50 text-sky-800 font-sans text-sm font-bold px-6 py-2 rounded-full border border-sky-200 uppercase tracking-wider">
          Part 02 // The Raw Engine
        </span>

        <h1 className="font-bengali text-5xl font-bold text-slate-900 leading-tight">
          C / C++: <span className="text-sky-600">আসল কম্পিউট ইঞ্জিন</span>
        </h1>

        {/* Engine Block Close-up */}
        <CarDiagram mode="engine" />
      </div>
    </div>
  );
};
