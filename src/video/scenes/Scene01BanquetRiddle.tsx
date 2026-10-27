import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile} from 'remotion';
import {SceneStage} from '../../shared/SceneStage';
import {SceneProps, getEvent, PHILOSOPHERS} from './scene-utils';
import {eventProgress} from '../../shared/video-timeline';

export const Scene01BanquetRiddle: React.FC<SceneProps> = ({startFrame, events}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const absFrame = startFrame + frame;

  const evEnter = getEvent(events, 'ev-01-enter');
  const evFood = getEvent(events, 'ev-01-food');
  const evPuzzle = getEvent(events, 'ev-01-puzzle');

  const pEnter = eventProgress(evEnter, absFrame);
  const pFood = eventProgress(evFood, absFrame);
  const pPuzzle = eventProgress(evPuzzle, absFrame);

  const tableScale = spring({frame: Math.max(0, absFrame - evEnter.startFrame), fps, config: {damping: 14, stiffness: 100}});
  const puzzleScale = spring({frame: Math.max(0, absFrame - evPuzzle.startFrame), fps, config: {damping: 12, stiffness: 140}});

  const radius = 280;
  const cx = 480;
  const cy = 690;

  return (
    <SceneStage>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Ambient background glow */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 700,
            height: 700,
            left: cx - 350,
            top: cy - 350,
            background: 'radial-gradient(circle, rgba(2, 132, 199, 0.08) 0%, rgba(241, 245, 249, 0) 70%)',
            opacity: pEnter,
          }}
        />

        {/* Central Dining Table */}
        <div
          className="absolute"
          style={{
            width: 580,
            height: 580,
            left: cx - 290,
            top: cy - 290,
            transform: `scale(${tableScale})`,
          }}
        >
          <Img src={staticFile('current/table-setup.svg')} className="w-full h-full" />
        </div>

        {/* Five Philosophers seated around table */}
        {PHILOSOPHERS.map((phil, i) => {
          const rad = (phil.angle * Math.PI) / 180;
          const nodeX = cx + Math.cos(rad) * radius;
          const nodeY = cy + Math.sin(rad) * radius;

          // Staggered node entrance
          const nodeProgress = spring({
            frame: Math.max(0, absFrame - evEnter.startFrame - i * 4),
            fps,
            config: {damping: 13, stiffness: 120},
          });

          // Food bowl position (slightly closer to table center)
          const bowlX = cx + Math.cos(rad) * (radius - 95);
          const bowlY = cy + Math.sin(rad) * (radius - 95);

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
                  transform: `scale(${nodeProgress})`,
                  opacity: nodeProgress,
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
                <span className="mt-1 text-xs font-bold tracking-wider text-slate-700 uppercase bg-white/95 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-sm">
                  {phil.name}
                </span>
              </div>

              {/* Steaming Food Plate */}
              <div
                className="absolute flex flex-col items-center justify-center pointer-events-none"
                style={{
                  left: bowlX - 35,
                  top: bowlY - 35,
                  width: 70,
                  height: 70,
                  opacity: pFood,
                  transform: `scale(${interpolate(pFood, [0, 1], [0.4, 1])})`,
                }}
              >
                {/* Ramen Bowl Graphic */}
                <div className="w-14 h-14 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center shadow-md">
                  <span className="text-2xl">🍜</span>
                </div>
                {/* Rising Steam Wisp */}
                <div
                  className="absolute -top-4 w-6 h-6 opacity-75"
                  style={{
                    transform: `translateY(${-((frame * 2 + i * 15) % 30)}px)`,
                    opacity: interpolate(((frame * 2 + i * 15) % 30), [0, 15, 30], [0, 0.8, 0]),
                  }}
                >
                  <svg viewBox="0 0 20 20" className="w-full h-full text-amber-500 fill-current">
                    <path d="M10 2 C12 5, 8 8, 10 11 C12 14, 8 17, 10 20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* Central Riddle / Question Callout */}
        {pPuzzle > 0.05 && (
          <div
            className="absolute z-20 flex flex-col items-center justify-center px-8 py-5 rounded-3xl border-2"
            style={{
              left: cx - 200,
              top: cy - 70,
              width: 400,
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              borderColor: '#F59E0B',
              boxShadow: '0 12px 40px rgba(245, 158, 11, 0.25), 0 4px 12px rgba(0, 0, 0, 0.05)',
              transform: `scale(${puzzleScale})`,
              opacity: pPuzzle,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-pulse">❓</span>
              <div className="flex flex-col items-center">
                <span className="text-amber-600 font-extrabold text-2xl tracking-wide">
                  কেউ খেতে পারছেন না!
                </span>
                <span className="text-slate-600 text-base font-semibold">
                  Why can nobody eat?
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Context Banner */}
        <div className="absolute bottom-12 w-full flex justify-center px-8">
          <div className="bg-white/95 border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-lg">
            <span className="w-3 h-3 rounded-full bg-sky-500 animate-ping" />
            <span className="text-slate-800 text-lg font-bold">
              The Dining Philosophers Problem
            </span>
          </div>
        </div>
      </div>
    </SceneStage>
  );
};