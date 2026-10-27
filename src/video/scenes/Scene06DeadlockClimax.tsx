import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile} from 'remotion';
import {SceneStage} from '../../shared/SceneStage';
import {SceneProps, getEvent, PHILOSOPHERS} from './scene-utils';
import {eventProgress} from '../../shared/video-timeline';

export const Scene06DeadlockClimax: React.FC<SceneProps> = ({startFrame, events}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const absFrame = startFrame + frame;

  const evHeld = getEvent(events, 'ev-06-held');
  const evRefuse = getEvent(events, 'ev-06-refuse');
  const evFreeze = getEvent(events, 'ev-06-freeze');
  const evDeadlock = getEvent(events, 'ev-06-deadlock');
  const evStall = getEvent(events, 'ev-06-stall');

  const pHeld = eventProgress(evHeld, absFrame);
  const pRefuse = eventProgress(evRefuse, absFrame);
  const pFreeze = eventProgress(evFreeze, absFrame);
  const pDeadlock = eventProgress(evDeadlock, absFrame);
  const pStall = eventProgress(evStall, absFrame);

  const deadlockSpring = spring({
    frame: Math.max(0, absFrame - evDeadlock.startFrame),
    fps,
    config: {damping: 10, stiffness: 140},
  });

  const radius = 290;
  const cx = 480;
  const cy = 690;

  return (
    <SceneStage>
      <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
        {/* Red Alarm Strobe Filter */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: pFreeze > 0.1 ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
            boxShadow: pFreeze > 0.1 ? 'inset 0 0 100px rgba(239, 68, 68, 0.15)' : undefined,
          }}
        />

        {/* Central Circular Table */}
        <div
          className="absolute"
          style={{
            width: 580,
            height: 580,
            left: cx - 290,
            top: cy - 290,
            filter: pFreeze > 0.2 ? 'grayscale(0.3) brightness(0.95)' : undefined,
          }}
        >
          <Img src={staticFile('current/table-setup.svg')} className="w-full h-full" />
        </div>

        {/* Fiery Red Circular Wait Loop */}
        <svg
          className="absolute pointer-events-none"
          style={{
            left: cx - radius - 50,
            top: cy - radius - 50,
            width: (radius + 50) * 2,
            height: (radius + 50) * 2,
            opacity: pHeld,
          }}
        >
          <circle
            cx={radius + 50}
            cy={radius + 50}
            r={radius + 20}
            fill="none"
            stroke="#DC2626"
            strokeWidth="8"
            strokeDasharray="60 30"
            strokeDashoffset={-frame * 2}
            style={{
              filter: 'drop-shadow(0 0 12px rgba(220, 38, 38, 0.4))',
            }}
          />
        </svg>

        {/* 5 Philosophers with Locked Badges */}
        {PHILOSOPHERS.map((phil) => {
          const rad = (phil.angle * Math.PI) / 180;
          const nodeX = cx + Math.cos(rad) * radius;
          const nodeY = cy + Math.sin(rad) * radius;

          return (
            <div
              key={phil.id}
              className="absolute flex flex-col items-center justify-center"
              style={{
                left: nodeX - 55,
                top: nodeY - 55,
                width: 110,
                height: 110,
              }}
            >
              {/* Philosopher Node */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl shadow-md border-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: pFreeze > 0.2 ? '#DC2626' : phil.color,
                  color: pFreeze > 0.2 ? '#DC2626' : phil.color,
                  boxShadow: pFreeze > 0.2 ? '0 4px 20px rgba(220, 38, 38, 0.25)' : `0 4px 16px ${phil.glow}`,
                }}
              >
                {phil.id}
              </div>

              {/* Locked Chopstick Indicator */}
              {pRefuse > 0.1 && (
                <div
                  className="absolute -top-3 -right-2 bg-red-600 text-white rounded-full p-1.5 shadow-lg border border-white"
                  style={{
                    transform: `scale(${interpolate(pRefuse, [0, 1], [0, 1])})`,
                  }}
                >
                  <span className="text-sm">🔒</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Hero DEADLOCK Climax Banner */}
        {pDeadlock > 0.05 && (
          <div
            className="absolute z-30 flex flex-col items-center text-center px-10 py-10 rounded-3xl border-4"
            style={{
              width: 700,
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              borderColor: '#DC2626',
              boxShadow: '0 20px 60px rgba(220, 38, 38, 0.2), 0 4px 12px rgba(0, 0, 0, 0.05)',
              transform: `scale(${deadlockSpring})`,
              opacity: pDeadlock,
            }}
          >
            {/* Alert Tag */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-300 text-red-600 text-xs font-black tracking-widest uppercase mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              SYSTEM CRITICAL STATE
            </div>

            <h1 className="text-6xl font-black text-slate-900 tracking-widest mb-1">
              DEADLOCK
            </h1>
            <h2 className="text-4xl font-black text-red-600 mb-4">
              পুরো সিস্টেম আটকে গেলো!
            </h2>

            <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-700">Circular Wait Condition</span>
                <span className="text-red-600 font-mono">0% PROGRESS</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                <div className="w-0 h-full bg-red-600" />
              </div>
              <p className="text-slate-600 text-xs font-semibold mt-1">
                কেউ কাঠি ছাড়বেন না, কেউ খেতে পারবেন না!
              </p>
            </div>
          </div>
        )}

        {/* Bottom Ticker */}
        {pStall > 0.1 && (
          <div className="absolute bottom-10 w-full flex justify-center px-8">
            <div className="bg-red-50 border border-red-300 px-8 py-3 rounded-2xl flex items-center gap-4 shadow-lg">
              <span className="text-2xl">⛔</span>
              <span className="text-red-800 font-extrabold text-lg">
                সবাই অপেক্ষা করছে, কাজ এগোচ্ছে না!
              </span>
            </div>
          </div>
        )}
      </div>
    </SceneStage>
  );
};