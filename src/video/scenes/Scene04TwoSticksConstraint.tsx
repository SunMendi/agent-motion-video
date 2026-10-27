import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneStage} from '../../shared/SceneStage';
import {SceneProps, getEvent} from './scene-utils';
import {eventProgress} from '../../shared/video-timeline';

export const Scene04TwoSticksConstraint: React.FC<SceneProps> = ({startFrame, events}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const absFrame = startFrame + frame;

  const evTwo = getEvent(events, 'ev-04-two');
  const evHands = getEvent(events, 'ev-04-hands');
  const evFail = getEvent(events, 'ev-04-fail');

  const pTwo = eventProgress(evTwo, absFrame);
  const pHands = eventProgress(evHands, absFrame);
  const pFail = eventProgress(evFail, absFrame);

  const cardSpring = spring({frame: Math.max(0, absFrame - evTwo.startFrame), fps, config: {damping: 14, stiffness: 120}});
  const failSpring = spring({frame: Math.max(0, absFrame - evFail.startFrame), fps, config: {damping: 10, stiffness: 160}});

  return (
    <SceneStage>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Hero Card for P1 Invariant */}
        <div
          className="relative flex flex-col items-center px-10 py-10 rounded-3xl border-2"
          style={{
            width: 740,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderColor: '#0284C7',
            boxShadow: '0 20px 50px rgba(2, 132, 199, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05)',
            transform: `scale(${cardSpring})`,
            opacity: pTwo,
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-sky-50 border border-sky-300 text-sky-700 text-xs font-black tracking-widest uppercase mb-6">
            CRITICAL INVARIANT
          </div>

          <h2 className="text-4xl font-black text-slate-900 mb-2">
            খেতে হলে লাগবে ২টি কাঠি!
          </h2>
          <p className="text-slate-500 text-lg font-medium mb-8">
            Must acquire BOTH Left and Right Chopsticks
          </p>

          {/* Philosopher Avatar with Two Hands */}
          <div className="relative w-96 h-64 flex items-center justify-center mb-8">
            {/* Center Bowl */}
            <div className="w-24 h-24 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center shadow-md z-10">
              <span className="text-4xl">🍜</span>
            </div>

            {/* Left Hand Slot */}
            <div
              className="absolute left-6 flex flex-col items-center justify-center p-3 rounded-2xl border-2"
              style={{
                width: 130,
                height: 160,
                backgroundColor: pHands > 0.5 ? 'rgba(2, 132, 199, 0.08)' : 'rgba(241, 245, 249, 0.8)',
                borderColor: pHands > 0.5 ? '#0284C7' : '#CBD5E1',
              }}
            >
              <div className="w-3 h-24 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500 shadow-sm mb-2" />
              <span className="text-xs font-bold text-sky-700 uppercase">বামহাত</span>
              <span className="text-[10px] text-slate-500 font-semibold">Left Hand</span>
            </div>

            {/* Right Hand Slot */}
            <div
              className="absolute right-6 flex flex-col items-center justify-center p-3 rounded-2xl border-2"
              style={{
                width: 130,
                height: 160,
                backgroundColor: pHands > 0.5 ? 'rgba(2, 132, 199, 0.08)' : 'rgba(241, 245, 249, 0.8)',
                borderColor: pHands > 0.5 ? '#0284C7' : '#CBD5E1',
              }}
            >
              <div className="w-3 h-24 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500 shadow-sm mb-2" />
              <span className="text-xs font-bold text-sky-700 uppercase">ডানহাত</span>
              <span className="text-[10px] text-slate-500 font-semibold">Right Hand</span>
            </div>
          </div>

          {/* Failure Alert on 1 Stick */}
          {pFail > 0.05 && (
            <div
              className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-red-50 border border-red-300 shadow-lg"
              style={{
                transform: `scale(${failSpring})`,
                opacity: pFail,
              }}
            >
              <span className="text-3xl">❌</span>
              <div className="flex flex-col text-left">
                <span className="text-red-700 font-black text-xl">
                  ১টি কাঠি দিয়ে খাওয়া অসম্ভব!
                </span>
                <span className="text-slate-600 text-sm font-medium">
                  Holding 1 Stick = Stalled / Cannot Progress
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </SceneStage>
  );
};