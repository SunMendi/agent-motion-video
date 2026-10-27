import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneStage} from '../../shared/SceneStage';
import {SceneProps, getEvent} from './scene-utils';
import {eventProgress} from '../../shared/video-timeline';

export const Scene07Starvation: React.FC<SceneProps> = ({startFrame, events}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const absFrame = startFrame + frame;

  const evIssue = getEvent(events, 'ev-07-issue');
  const evFeast = getEvent(events, 'ev-07-feast');
  const evHunger = getEvent(events, 'ev-07-hunger');
  const evBadge = getEvent(events, 'ev-07-badge');

  const pIssue = eventProgress(evIssue, absFrame);
  const pFeast = eventProgress(evFeast, absFrame);
  const pHunger = eventProgress(evHunger, absFrame);
  const pBadge = eventProgress(evBadge, absFrame);

  const badgeSpring = spring({
    frame: Math.max(0, absFrame - evBadge.startFrame),
    fps,
    config: {damping: 12, stiffness: 130},
  });

  return (
    <SceneStage>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Header Question */}
        <div
          className="absolute top-10 flex flex-col items-center"
          style={{opacity: Math.max(0.2, pIssue)}}
        >
          <div className="px-5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-black tracking-widest uppercase mb-2">
            SECONDARY SYNCHRONIZATION ISSUE
          </div>
          <h2 className="text-3xl font-black text-slate-900">
            আরেকটা সমস্যা: STARVATION
          </h2>
        </div>

        {/* Dynamic Split Comparison Area */}
        <div className="relative w-full flex flex-col items-center gap-10 mt-8">
          {/* Top Half: P2 and P3 Feasting Rapidly */}
          <div
            className="w-11/12 p-6 rounded-3xl border-2 flex flex-col items-center bg-white/95 shadow-xl"
            style={{
              borderColor: '#059669',
              boxShadow: '0 12px 40px rgba(5, 150, 105, 0.15)',
              opacity: pFeast,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-emerald-700 font-extrabold text-xl uppercase tracking-wider">
                P2 &amp; P3: বারবার খাচ্ছেন (Feasting)
              </span>
            </div>

            <div className="flex items-center justify-around w-full px-6">
              {/* P2 Node with continuous eating bounce */}
              <div
                className="flex flex-col items-center"
                style={{transform: `translateY(${Math.sin(frame * 0.3) * 6}px)`}}
              >
                <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-500 flex items-center justify-center font-black text-2xl text-emerald-700 shadow-md">
                  P2
                </div>
                <span className="text-xs text-emerald-800 mt-2 font-bold">Eating... 🍜</span>
              </div>

              {/* Resource Ping-Pong Animation with continuous rapid travel */}
              <div className="flex flex-col items-center px-4">
                <span
                  className="text-2xl"
                  style={{transform: `translateX(${Math.sin(frame * 0.25) * 24}px)`}}
                >
                  🥢 ⇄ 🥢
                </span>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mt-1">
                  Shared Stick Alternate
                </span>
              </div>

              {/* P3 Node with continuous alternating eating bounce */}
              <div
                className="flex flex-col items-center"
                style={{transform: `translateY(${-Math.sin(frame * 0.3) * 6}px)`}}
              >
                <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-500 flex items-center justify-center font-black text-2xl text-emerald-700 shadow-md">
                  P3
                </div>
                <span className="text-xs text-emerald-800 mt-2 font-bold">Eating... 🍜</span>
              </div>
            </div>
          </div>

          {/* Bottom Half: Starved P1 Left Out */}
          <div
            className="w-11/12 p-6 rounded-3xl border-2 flex flex-col items-center bg-white/95 shadow-xl relative"
            style={{
              borderColor: '#D97706',
              boxShadow: '0 12px 40px rgba(217, 119, 6, 0.15)',
              opacity: pHunger,
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⏳</span>
              <span className="text-amber-700 font-black text-xl uppercase tracking-wider">
                P1: কাঠি পাচ্ছেন না (Starved Node)
              </span>
            </div>

            <div className="flex items-center gap-8 w-full px-8">
              {/* Faded P1 Node */}
              <div className="relative flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 border-4 border-slate-300 flex items-center justify-center font-black text-2xl text-slate-400 shadow-inner">
                  P1
                </div>
                <span className="text-xs text-red-600 mt-2 font-extrabold uppercase">
                  Hungry ⚠️
                </span>
              </div>

              {/* Gauge and Status Description */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span>Resource Access:</span>
                  <span className="text-amber-700 font-mono font-bold">DENIED (0 Turns)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="w-1/12 h-full bg-amber-500" />
                </div>
                <p className="text-slate-600 text-sm font-semibold mt-1">
                  P1 শুধু ক্ষুধার্থ বসে আছেন, কোনো সুযোগই পাচ্ছেন না!
                </p>
              </div>
            </div>

            {/* Stamp Badge */}
            {pBadge > 0.05 && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-3xl"
                style={{
                  transform: `scale(${badgeSpring})`,
                  opacity: pBadge,
                }}
              >
                <div className="px-8 py-4 rounded-2xl bg-amber-500 text-white font-black text-3xl tracking-widest uppercase border-4 border-amber-600 shadow-2xl rotate-[-3deg]">
                  STARVATION (অনাহার)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SceneStage>
  );
};