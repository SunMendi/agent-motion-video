import React from 'react';
import {spring, useCurrentFrame, useVideoConfig, Img, staticFile} from 'remotion';
import {SceneStage} from '../../shared/SceneStage';
import {SceneProps, getEvent} from './scene-utils';
import {eventProgress} from '../../shared/video-timeline';

export const Scene09SemaphoreCta: React.FC<SceneProps> = ({startFrame, events}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const absFrame = startFrame + frame;

  const evSem = getEvent(events, 'ev-09-sem');
  const evCta = getEvent(events, 'ev-09-cta');

  const pSem = eventProgress(evSem, absFrame);
  const pCta = eventProgress(evCta, absFrame);

  const semSpring = spring({
    frame: Math.max(0, absFrame - evSem.startFrame),
    fps,
    config: {damping: 12, stiffness: 120},
  });

  const ctaSpring = spring({
    frame: Math.max(0, absFrame - evCta.startFrame),
    fps,
    config: {damping: 10, stiffness: 140},
  });

  return (
    <SceneStage>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Solution Reveal Card */}
        <div
          className="relative flex flex-col items-center text-center px-10 py-10 rounded-3xl border-2 mb-10"
          style={{
            width: 720,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderColor: '#059669',
            boxShadow: '0 20px 50px rgba(5, 150, 105, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05)',
            transform: `scale(${semSpring})`,
            opacity: pSem,
          }}
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-black tracking-widest uppercase mb-6">
            THE ALGORITHMIC SOLUTION
          </div>

          {/* Semaphore Shield */}
          <div className="w-36 h-36 mb-6">
            <Img src={staticFile('current/semaphore-system.svg')} className="w-full h-full" />
          </div>

          <h1 className="text-5xl font-black text-slate-900 tracking-wider mb-2">
            SEMAPHORE
          </h1>
          <h2 className="text-3xl font-extrabold text-emerald-700 mb-4">
            সেমাফোর (পরের পর্বে)
          </h2>

          <div className="flex items-center gap-4 text-sm font-mono text-emerald-800 bg-emerald-50 px-6 py-2.5 rounded-xl border border-emerald-200">
            <span>wait(S)</span>
            <span>•</span>
            <span>Critical Section</span>
            <span>•</span>
            <span>signal(S)</span>
          </div>
        </div>

        {/* High-Converting Call to Action Card */}
        {pCta > 0.05 && (
          <div
            className="flex flex-col items-center px-8 py-6 rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-slate-950 shadow-2xl border-2 border-amber-300"
            style={{
              width: 680,
              transform: `scale(${ctaSpring})`,
              opacity: pCta,
            }}
          >
            <div className="flex items-center gap-4 mb-2">
              <span className="text-4xl animate-bounce">💬</span>
              <span className="text-3xl font-black text-slate-950 tracking-wider">
                কমেন্টে লিখুন: "Part 2"
              </span>
            </div>
            <p className="text-slate-900 font-extrabold text-lg">
              পরের পর্বে Semaphore দিয়ে সমাধান দেখতে চান?
            </p>
          </div>
        )}
      </div>
    </SceneStage>
  );
};