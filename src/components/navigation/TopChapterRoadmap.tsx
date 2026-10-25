import React from 'react';
import { useCurrentFrame } from 'remotion';
import { VideoTheme, CLEAN_LIGHT_THEME } from '../../themes/videoTheme';
import { SCENES } from '../../data/scenesData';

interface TopChapterRoadmapProps {
  totalDurationFrames: number;
  theme?: VideoTheme;
}

interface Chapter {
  id: string;
  name: string;
  startFrame: number;
  endFrame: number;
}

export const TopChapterRoadmap: React.FC<TopChapterRoadmapProps> = ({
  totalDurationFrames,
  theme = CLEAN_LIGHT_THEME,
}) => {
  const frame = useCurrentFrame();

  // Derive chapters directly from exact narrative boundaries:
  // Act 1: The Shift (Scenes 1 to 6)
  // Act 2: The Car Analogy & Problem (Scenes 7 to 17)
  // Act 3: 4 Core Pillars of Rust (Scenes 18 to 27)
  // Act 4: The AI Ecosystem & Future (Scenes 28 to 32)
  const chapters: Chapter[] = [
    {
      id: 'act1',
      name: '01. THE SHIFT',
      startFrame: SCENES[0].start_frame,
      endFrame: SCENES[6].start_frame,
    },
    {
      id: 'act2',
      name: '02. CAR ANALOGY',
      startFrame: SCENES[6].start_frame,
      endFrame: SCENES[17].start_frame,
    },
    {
      id: 'act3',
      name: '03. 4 PILLARS',
      startFrame: SCENES[17].start_frame,
      endFrame: SCENES[27].start_frame,
    },
    {
      id: 'act4',
      name: '04. THE VERDICT',
      startFrame: SCENES[27].start_frame,
      endFrame: totalDurationFrames,
    },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 80,
        left: 48,
        right: 48,
        zIndex: 40,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div className="w-[880px] flex items-center justify-between gap-4">
        {chapters.map((chapter) => {
          const isStarted = frame >= chapter.startFrame;
          const isCompleted = frame >= chapter.endFrame;
          const isActive = isStarted && !isCompleted;

          const chapterLength = Math.max(1, chapter.endFrame - chapter.startFrame);
          const progress = isActive
            ? Math.min(1, Math.max(0, (frame - chapter.startFrame) / chapterLength))
            : isCompleted
              ? 1
              : 0;

          return (
            <div key={chapter.id} className="flex-1 flex flex-col space-y-1.5">
              {/* Top minimal progress bar */}
              <div className="w-full h-1.5 bg-slate-200/90 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${progress * 100}%`,
                    backgroundColor: theme.roadmap.activeSegmentBg,
                  }}
                  className="h-full rounded-full"
                />
              </div>

              {/* Minimal Act Label */}
              <div className="flex justify-between items-center text-[10px] font-sans font-bold tracking-wider">
                <span
                  style={{
                    color: isActive ? theme.text.primary : theme.text.muted,
                  }}
                >
                  {chapter.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
