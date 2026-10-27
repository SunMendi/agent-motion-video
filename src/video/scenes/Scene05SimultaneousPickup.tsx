import React from 'react';
import {interpolate, useCurrentFrame, Img, staticFile} from 'remotion';
import {SceneStage} from '../../shared/SceneStage';
import {SceneProps, getEvent, PHILOSOPHERS} from './scene-utils';
import {eventProgress} from '../../shared/video-timeline';

export const Scene05SimultaneousPickup: React.FC<SceneProps> = ({startFrame, events}) => {
  const frame = useCurrentFrame();
  const absFrame = startFrame + frame;

  const evLift = getEvent(events, 'ev-05-lift');
  const evWait = getEvent(events, 'ev-05-wait');

  const pLift = eventProgress(evLift, absFrame);
  const pWait = eventProgress(evWait, absFrame);

  const radius = 290;
  const stickRadiusTable = 200; // where stick rested on table
  const cx = 480;
  const cy = 690;

  return (
    <SceneStage>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Table Background */}
        <div
          className="absolute"
          style={{
            width: 580,
            height: 580,
            left: cx - 290,
            top: cy - 290,
          }}
        >
          <Img src={staticFile('current/table-setup.svg')} className="w-full h-full" />
        </div>

        {/* 5 Philosophers */}
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
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl shadow-md border-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: phil.color,
                  color: phil.color,
                  boxShadow: `0 4px 16px ${phil.glow}`,
                }}
              >
                {phil.id}
              </div>
              <span className="mt-1 text-xs font-bold text-slate-700 bg-white/95 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-sm">
                {phil.name}
              </span>
            </div>
          );
        })}

        {/* 5 Chopsticks lifting and moving into each philosopher's LEFT HAND */}
        {PHILOSOPHERS.map((phil, i) => {
          // Resting position on table
          const nextPhil = PHILOSOPHERS[(i + 1) % 5];
          let midAngle = (phil.angle + nextPhil.angle) / 2;
          if (nextPhil.angle < phil.angle) {
            midAngle = (phil.angle + nextPhil.angle + 360) / 2;
          }
          const midRad = (midAngle * Math.PI) / 180;
          const restX = cx + Math.cos(midRad) * stickRadiusTable;
          const restY = cy + Math.sin(midRad) * stickRadiusTable;

          // Target position: Phil[i]'s left hand (tangential left offset from node)
          const nodeRad = (phil.angle * Math.PI) / 180;
          const handX = cx + Math.cos(nodeRad) * (radius - 20) - Math.sin(nodeRad) * 45;
          const handY = cy + Math.sin(nodeRad) * (radius - 20) + Math.cos(nodeRad) * 45;

          const currX = interpolate(pLift, [0, 1], [restX, handX]);
          const currY = interpolate(pLift, [0, 1], [restY, handY]);
          const currAngle = interpolate(pLift, [0, 1], [midAngle + 90, phil.angle]);

          return (
            <div
              key={`chopstick-lift-${i}`}
              className="absolute flex items-center justify-center"
              style={{
                left: currX - 15,
                top: currY - 45,
                width: 30,
                height: 90,
                transform: `rotate(${currAngle}deg)`,
              }}
            >
              <div
                className="w-4 h-20 rounded-full shadow-md border"
                style={{
                  background: pLift > 0.8
                    ? 'linear-gradient(to bottom, #38BDF8, #0284C7)'
                    : 'linear-gradient(to bottom, #FDE047, #CA8A04)',
                  borderColor: pLift > 0.8 ? '#7DD3FC' : '#FEF08A',
                  boxShadow: pLift > 0.8 ? '0 0 16px rgba(2, 132, 199, 0.4)' : undefined,
                }}
              />
            </div>
          );
        })}

        {/* Circular Waiting Arrows pointing clockwise to right neighbor */}
        {pWait > 0.05 && (
          <svg
            className="absolute pointer-events-none"
            style={{
              left: cx - radius - 40,
              top: cy - radius - 40,
              width: (radius + 40) * 2,
              height: (radius + 40) * 2,
              opacity: pWait,
            }}
          >
            <circle
              cx={radius + 40}
              cy={radius + 40}
              r={radius + 20}
              fill="none"
              stroke="#D97706"
              strokeWidth="5"
              strokeDasharray="40 20"
              strokeDashoffset={-frame * 3}
            />
          </svg>
        )}

        {/* Status Callout Banner */}
        <div className="absolute bottom-12 w-full flex justify-center px-8">
          <div
            className="bg-white/95 border border-amber-400 px-8 py-4 rounded-2xl flex items-center gap-6 shadow-xl"
            style={{
              transform: `scale(${pWait > 0 ? 1 : 0.95})`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-spin">⏳</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                  Race Condition State
                </span>
                <span className="text-slate-900 font-extrabold text-xl">
                  বামহাতের কাঠি নেওয়া শেষ → ডানহাতের অপেক্ষা!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SceneStage>
  );
};