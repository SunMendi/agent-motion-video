import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneStage} from '../../shared/SceneStage';
import {SceneProps, getEvent} from './scene-utils';
import {eventProgress} from '../../shared/video-timeline';

export const Scene08ConcurrencyControl: React.FC<SceneProps> = ({startFrame, events}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const absFrame = startFrame + frame;

  const evRule = getEvent(events, 'ev-08-rule');
  const evMutex = getEvent(events, 'ev-08-mutex');
  const evQueue = getEvent(events, 'ev-08-queue');

  const pRule = eventProgress(evRule, absFrame);
  const pMutex = eventProgress(evMutex, absFrame);
  const pQueue = eventProgress(evQueue, absFrame);

  const shieldSpring = spring({
    frame: Math.max(0, absFrame - evRule.startFrame),
    fps,
    config: {damping: 12, stiffness: 120},
  });

  return (
    <SceneStage>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Main Header Card */}
        <div
          className="flex flex-col items-center text-center px-10 py-6 rounded-3xl border-2 mb-10"
          style={{
            width: 740,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderColor: '#059669',
            boxShadow: '0 20px 50px rgba(5, 150, 105, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05)',
            transform: `scale(${shieldSpring})`,
            opacity: pRule,
          }}
        >
          <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-black tracking-widest uppercase mb-3">
            THE OS GOLDEN RULE
          </div>
          <h1 className="text-4xl font-black text-slate-900">
            CONCURRENCY CONTROL
          </h1>
          <h2 className="text-2xl font-extrabold text-emerald-700 mt-1">
            কনকারেন্সি কন্ট্রোল
          </h2>
        </div>

        {/* Mutual Exclusion Barrier Visualization */}
        <div
          className="relative w-11/12 p-8 rounded-3xl bg-white/95 border-2 border-slate-200 shadow-xl flex flex-col items-center"
          style={{
            opacity: pMutex,
          }}
        >
          <div className="text-slate-700 text-lg font-bold mb-8 text-center">
            পাশাপাশি দুজন একই কাঠি একসাথে ব্যবহার করতে পারবেন না!
          </div>

          <div className="flex items-center justify-between w-full px-8 relative">
            {/* Animated energy bus beam connecting Critical Section to Node */}
            <svg className="absolute inset-0 pointer-events-none w-full h-full">
              <line
                x1="25%"
                y1="50%"
                x2="75%"
                y2="50%"
                stroke="#059669"
                strokeWidth="2"
                strokeDasharray="8 6"
                strokeDashoffset={-frame * 3}
                strokeOpacity="0.5"
              />
            </svg>

            {/* Left Node: Eating in Critical Section */}
            <div
              className="flex flex-col items-center"
              style={{transform: `translateY(${Math.sin(frame * 0.2) * 4}px)`}}
            >
              <div className="relative w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-500 flex items-center justify-center font-black text-3xl text-emerald-700 shadow-md">
                P1
                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full p-1 text-xs">
                  ✓
                </span>
              </div>
              <span className="text-sm font-extrabold text-emerald-700 mt-3">
                Eating (খাচ্ছেন)
              </span>
              <span className="text-xs text-slate-500 font-semibold">Critical Section</span>
            </div>

            {/* Mutex Barrier with Protected Chopstick */}
            <div className="flex flex-col items-center px-6">
              <div
                className="p-4 rounded-2xl border-2 flex flex-col items-center bg-slate-50"
                style={{
                  borderColor: '#059669',
                  boxShadow: `0 4px 20px rgba(5, 150, 105, 0.2)`,
                }}
              >
                <div className="w-4 h-24 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500 shadow-sm mb-2" />
                <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">
                  MUTEX LOCK
                </span>
              </div>
              <span className="text-xs text-slate-500 mt-2 font-bold">1 Node at a Time</span>
            </div>

            {/* Right Node: Polite Waiting Queue with animated spinning indicator */}
            <div className="flex flex-col items-center">
              <div
                className="relative w-24 h-24 rounded-full border-4 flex items-center justify-center font-black text-3xl shadow-md"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: pQueue > 0.5 ? '#0284C7' : '#94A3B8',
                  color: pQueue > 0.5 ? '#0284C7' : '#64748B',
                }}
              >
                P2
                <span
                  className="absolute -top-2 -right-2 bg-sky-500 text-white rounded-full p-1 text-xs flex items-center justify-center"
                  style={{transform: `rotate(${frame * 4}deg)`}}
                >
                  ⏳
                </span>
              </div>
              <span className="text-sm font-extrabold text-sky-700 mt-3">
                Waiting (অপেক্ষা)
              </span>
              <span className="text-xs text-slate-500 font-semibold">Polite Queue</span>
            </div>
          </div>
        </div>

        {/* Bottom Takeaway */}
        <div className="absolute bottom-12 w-full flex justify-center px-8">
          <div className="bg-emerald-50 border border-emerald-300 px-8 py-3 rounded-2xl flex items-center gap-4 shadow-lg">
            <span className="text-2xl">💡</span>
            <span className="text-emerald-900 font-bold text-lg">
              একজন খেলে, আরেকজন অপেক্ষা করবে!
            </span>
          </div>
        </div>
      </div>
    </SceneStage>
  );
};