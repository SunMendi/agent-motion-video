import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile} from 'remotion';
import {SceneStage} from '../../shared/SceneStage';
import {SceneProps, getEvent, PHILOSOPHERS} from './scene-utils';
import {eventProgress} from '../../shared/video-timeline';

export const Scene03TopologySetup: React.FC<SceneProps> = ({startFrame, events}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const absFrame = startFrame + frame;

  const evNodes = getEvent(events, 'ev-03-pnodes');
  const evCircle = getEvent(events, 'ev-03-circle');
  const evPlates = getEvent(events, 'ev-03-plates');
  const evSticks = getEvent(events, 'ev-03-sticks');
  const evCount = getEvent(events, 'ev-03-count');

  const pNodes = eventProgress(evNodes, absFrame);
  const pCircle = eventProgress(evCircle, absFrame);
  const pPlates = eventProgress(evPlates, absFrame);
  const pSticks = eventProgress(evSticks, absFrame);
  const pCount = eventProgress(evCount, absFrame);

  const radius = 290;
  const stickRadius = 200; // Chopsticks rest between nodes on table surface
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

        {/* Circular connecting bus line with continuous active motion */}
        <svg
          className="absolute pointer-events-none"
          style={{
            left: cx - radius,
            top: cy - radius,
            width: radius * 2,
            height: radius * 2,
            opacity: pCircle,
          }}
        >
          <circle
            cx={radius}
            cy={radius}
            r={radius - 10}
            fill="none"
            stroke="#0284C7"
            strokeWidth="3"
            strokeDasharray="16 10"
            strokeDashoffset={-frame * 3}
            strokeOpacity="0.7"
          />
          {/* Active sweeping scan radar beam */}
          <line
            x1={radius}
            y1={radius}
            x2={radius + (radius - 20) * Math.cos((frame * 3 * Math.PI) / 180)}
            y2={radius + (radius - 20) * Math.sin((frame * 3 * Math.PI) / 180)}
            stroke="#0284C7"
            strokeWidth="2"
            strokeOpacity="0.4"
          />
        </svg>

        {/* 5 Philosophers & 5 Plates */}
        {PHILOSOPHERS.map((phil, i) => {
          const rad = (phil.angle * Math.PI) / 180;
          const nodeX = cx + Math.cos(rad) * radius;
          const nodeY = cy + Math.sin(rad) * radius;

          const nSpring = spring({
            frame: Math.max(0, absFrame - evNodes.startFrame - i * 5),
            fps,
            config: {damping: 14, stiffness: 120},
          });

          // Plate location
          const bowlX = cx + Math.cos(rad) * (radius - 90);
          const bowlY = cy + Math.sin(rad) * (radius - 90);

          return (
            <React.Fragment key={phil.id}>
              {/* Philosopher Node */}
              <div
                className="absolute flex flex-col items-center justify-center"
                style={{
                  left: nodeX - 55,
                  top: nodeY - 55,
                  width: 110,
                  height: 110,
                  transform: `scale(${nSpring})`,
                  opacity: pNodes,
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

              {/* Food Plate */}
              <div
                className="absolute flex items-center justify-center pointer-events-none"
                style={{
                  left: bowlX - 30,
                  top: bowlY - 30,
                  width: 60,
                  height: 60,
                  opacity: pPlates,
                  transform: `scale(${interpolate(pPlates, [0, 1], [0.3, 1])})`,
                }}
              >
                <div className="w-12 h-12 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center shadow-sm">
                  <span className="text-xl">🍜</span>
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* 5 Chopsticks positioned BETWEEN adjacent philosophers */}
        {PHILOSOPHERS.map((phil, i) => {
          // Angle midway between phil[i] and phil[(i+1)%5]
          const nextPhil = PHILOSOPHERS[(i + 1) % 5];
          let midAngle = (phil.angle + nextPhil.angle) / 2;
          if (nextPhil.angle < phil.angle) {
            midAngle = (phil.angle + nextPhil.angle + 360) / 2;
          }

          const midRad = (midAngle * Math.PI) / 180;
          const stickX = cx + Math.cos(midRad) * stickRadius;
          const stickY = cy + Math.sin(midRad) * stickRadius;

          const sSpring = spring({
            frame: Math.max(0, absFrame - evSticks.startFrame - i * 4),
            fps,
            config: {damping: 12, stiffness: 140},
          });

          return (
            <div
              key={`chopstick-${i}`}
              className="absolute flex flex-col items-center justify-center"
              style={{
                left: stickX - 25,
                top: stickY - 45,
                width: 50,
                height: 90,
                opacity: pSticks,
                transform: `scale(${sSpring}) rotate(${midAngle + 90}deg)`,
              }}
            >
              {/* Glowing Chopstick SVG */}
              <div className="w-4 h-20 rounded-full bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-600 shadow-md border border-yellow-200" />
              <div
                className="mt-1 px-1.5 py-0.5 rounded text-[10px] font-black text-amber-950 bg-amber-200 shadow-sm border border-amber-300"
                style={{transform: `rotate(-${midAngle + 90}deg)`}}
              >
                C{i + 1}
              </div>
            </div>
          );
        })}

        {/* Resource Counter HUD pill */}
        {pCount > 0.05 && (
          <div
            className="absolute bottom-14 px-8 py-4 rounded-3xl bg-white/95 border-2 border-amber-400 shadow-xl flex items-center gap-6"
            style={{
              opacity: pCount,
              transform: `scale(${spring({frame: Math.max(0, absFrame - evCount.startFrame), fps, config: {damping: 12, stiffness: 120}})})`,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-3xl">🥢</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Shared Resources</span>
                <span className="text-slate-900 font-black text-2xl">মোট কাঠি: ৫টি</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-slate-600 text-sm font-semibold">
              ১টি করে কাঠি দুজনের মাঝখানে
            </div>
          </div>
        )}
      </div>
    </SceneStage>
  );
};