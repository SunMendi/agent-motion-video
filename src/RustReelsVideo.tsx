import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { SCENES } from './data/scenesData';
import { SceneRenderer } from './components/scenes/SceneRenderer';
import { SceneTransitionWrapper } from './components/transitions/SceneTransitionWrapper';
import { TopKaraokeSubtitle } from './components/subtitles/TopKaraokeSubtitle';
import { TopChapterRoadmap } from './components/navigation/TopChapterRoadmap';
import { AudioMixer } from './components/audio/AudioMixer';
import { CLEAN_LIGHT_THEME, VideoTheme } from './themes/videoTheme';
import { HIND_SILIGURI, ensureFonts } from './fonts';
import './compiled.css';
import './index.css';

const TOTAL_FRAMES = 3696; // 123.2s @ 30fps

export interface RustReelsVideoProps {
  theme?: VideoTheme;
  showSubtitles?: boolean;
}

export const RustReelsVideo: React.FC<RustReelsVideoProps> = ({
  theme = CLEAN_LIGHT_THEME,
  showSubtitles = true,
}) => {
  // Ensure all local fonts are fully loaded before rendering frames
  ensureFonts();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.canvas.bg,
        fontFamily: HIND_SILIGURI,
      }}
      className="text-slate-900 flex flex-col justify-center items-center overflow-hidden"
    >
      {/* 1080x1920 Viewport Canvas */}
      <div
        style={{
          width: 1080,
          height: 1920,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundImage: theme.canvas.gridPattern,
          backgroundSize: '36px 36px',
        }}
      >
        {/* Ambient Corner Lighting Glows (pure GPU radial falloff, zero CPU blur) */}
        <div
          style={{
            background: `radial-gradient(circle, ${theme.canvas.ambientGlowPrimary} 0%, rgba(234, 88, 12, 0.04) 45%, transparent 70%)`,
            position: 'absolute',
            top: -150,
            right: -150,
            width: 750,
            height: 750,
            borderRadius: 9999,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            background: `radial-gradient(circle, ${theme.canvas.ambientGlowSecondary} 0%, rgba(37, 99, 235, 0.04) 45%, transparent 70%)`,
            position: 'absolute',
            bottom: -200,
            left: -200,
            width: 850,
            height: 850,
            borderRadius: 9999,
            pointerEvents: 'none',
          }}
        />

        {/* 1. Top Chapter Roadmap (Derived from exact narrative boundaries) */}
        <TopChapterRoadmap
          totalDurationFrames={TOTAL_FRAMES}
          theme={theme}
        />

        {/* 2. Hero Visual Stage (Continuous coverage with seamless transitions) */}
        {SCENES.map((scene, idx) => {
          const isFirstScene = idx === 0;
          const isLastScene = idx === SCENES.length - 1;
          const nextScene = SCENES[idx + 1];

          // Continuous visual coverage: holds until the next scene begins
          const visualStartFrame = isFirstScene ? 0 : scene.start_frame;
          const nextStartFrame = isLastScene ? TOTAL_FRAMES : nextScene.start_frame;
          const rawDurationInFrames = nextStartFrame - visualStartFrame;

          // Seamless transition overlap (6 frames = 0.20s continuous optical dissolve)
          const overlapFrames = 6;
          const totalSequenceDuration = isLastScene
            ? rawDurationInFrames
            : rawDurationInFrames + overlapFrames;

          return (
            <Sequence
              key={scene.scene_id}
              from={visualStartFrame}
              durationInFrames={totalSequenceDuration}
              name={`scene-${scene.scene_number}`}
            >
              <SceneTransitionWrapper
                durationInFrames={totalSequenceDuration}
                rawDurationInFrames={rawDurationInFrames}
                isFirstScene={isFirstScene}
                isLastScene={isLastScene}
                overlapFrames={overlapFrames}
                theme={theme}
              >
                <div
                  style={{
                    width: 1080,
                    height: 1920,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 160,
                    paddingBottom: 280,
                    boxSizing: 'border-box',
                  }}
                >
                  <SceneRenderer scene={scene} />
                </div>
              </SceneTransitionWrapper>
            </Sequence>
          );
        })}

        {/* 3. Captions Track (Docked cleanly at bottom safe zone with exact word timing) */}
        {showSubtitles &&
          SCENES.map((scene, idx) => {
            const isLastScene = idx === SCENES.length - 1;
            const nextScene = SCENES[idx + 1];
            const nextStartFrame = isLastScene ? TOTAL_FRAMES : nextScene.start_frame;
            const subDuration = nextStartFrame - scene.start_frame;

            return (
              <Sequence
                key={`sub-${scene.scene_id}`}
                from={scene.start_frame}
                durationInFrames={subDuration}
                name={`sub-${scene.scene_number}`}
              >
                <TopKaraokeSubtitle
                  scene={scene}
                  theme={theme}
                  position="bottom"
                />
              </Sequence>
            );
          })}
      </div>

      {/* 4. Multi-Track Broadcast Audio Engine (Voiceover + Ducked Bed + Timed SFX) */}
      <AudioMixer totalDurationFrames={TOTAL_FRAMES} />
    </AbsoluteFill>
  );
};
