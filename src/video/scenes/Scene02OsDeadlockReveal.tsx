import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneStage} from '../../shared/SceneStage';
import {SceneProps, getEvent} from './scene-utils';
import {eventProgress} from '../../shared/video-timeline';

export const Scene02OsDeadlockReveal: React.FC<SceneProps> = ({startFrame, events}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const absFrame = startFrame + frame;

  const evOs = getEvent(events, 'ev-02-os');
  const evRule = getEvent(events, 'ev-02-rule');

  const pOs = eventProgress(evOs, absFrame);
  const pRule = eventProgress(evRule, absFrame);

  const badgeSpring = spring({
    frame: Math.max(0, absFrame - evOs.startFrame),
    fps,
    config: {damping: 12, stiffness: 120},
  });

  return (
    <SceneStage>
      <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
        {/* Clean Subtle Grid Lines */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#E2E8F0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Ambient Core Glow */}
        <div
          className="absolute w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, rgba(241, 245, 249, 0) 70%)',
            transform: `scale(${interpolate(pOs, [0, 1], [0.6, 1.4])})`,
          }}
        />

        {/* Main Central Processor / HUD Card */}
        <div
          className="relative z-10 flex flex-col items-center text-center px-10 py-12 rounded-3xl border-2"
          style={{
            width: 720,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderColor: '#EF4444',
            boxShadow: '0 20px 50px rgba(239, 68, 68, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05)',
            transform: `scale(${badgeSpring})`,
            opacity: pOs,
          }}
        >
          {/* OS Header Pill */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-sm font-bold tracking-widest uppercase mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            OPERATING SYSTEMS SYNCHRONIZATION
          </div>

          {/* Icon */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg mb-6 border border-red-300">
            <span className="text-5xl">🔒</span>
          </div>

          {/* Hero Deadlock Title */}
          <h1 className="text-6xl font-black text-slate-900 tracking-wider mb-2">
            DEADLOCK
          </h1>
          <h2 className="text-4xl font-extrabold text-red-600 tracking-wide mb-6">
            ডেডলক
          </h2>

          {/* Description */}
          <div className="border-t border-slate-200 pt-6 w-full flex flex-col items-center">
            <p className="text-slate-800 text-2xl font-bold mb-2">
              কম্পিউটারের সবচেয়ে বড় সমস্যা!
            </p>
            <p className="text-slate-500 text-lg font-medium">
              Processes permanently stuck waiting on each other
            </p>
          </div>
        </div>

        {/* Story Intro Card */}
        {pRule > 0.05 && (
          <div
            className="absolute bottom-20 px-8 py-4 rounded-2xl bg-white/95 border border-sky-300 shadow-xl flex items-center gap-4"
            style={{
              opacity: pRule,
              transform: `translateY(${interpolate(pRule, [0, 1], [30, 0])}px)`,
            }}
          >
            <span className="text-2xl">📜</span>
            <span className="text-sky-800 font-bold text-xl">
              গল্পটা এরকম: ৫ জন দার্শনিক ও ৫টি কাঠি
            </span>
          </div>
        )}
      </div>
    </SceneStage>
  );
};