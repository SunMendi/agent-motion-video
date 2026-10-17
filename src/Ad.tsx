import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette} from './brand';
import {ensureFonts, FONT_FAMILY} from './fonts';
import type {Brief, Timing} from './model';
import {activeWordIndex, durationFrames, groupCaptions, sceneFrames, sceneSpans} from './timing';
import {Background} from './parts/Background';
import {CaptionBar} from './parts/CaptionBar';
import {ProgressBar} from './parts/ProgressBar';
import {Sweep} from './parts/Sweep';
import {SceneRouter} from './scenes/SceneRouter';

export const Ad: React.FC<{brief: Brief; timing: Timing; width: number; height: number}> = ({
  brief,
  timing,
  width,
  height,
}) => {
  ensureFonts();
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;

  const scenes = useMemo(
    () => sceneFrames(sceneSpans(timing, brief), durationInFrames ?? durationFrames(timing, fps), fps),
    [timing, brief, durationInFrames, fps],
  );
  const chunks = useMemo(() => groupCaptions(timing.words), [timing]);

  // The caption switches when its first word starts and stays up through pauses.
  let chunk = null;
  for (const c of chunks) {
    if (t >= c.start) chunk = c;
  }
  const localIndex = chunk ? activeWordIndex(chunk.words, t) : -1;
  const activeIndex = localIndex;

  return (
    <AbsoluteFill style={{fontFamily: `"${FONT_FAMILY}", sans-serif`, backgroundColor: palette.bg}}>
      <Background />
      {scenes.map((scene, i) => (
        <Sequence
          key={`s-${i}`}
          from={scene.start}
          durationInFrames={scene.end - scene.start}
          name={scene.type}
        >
          <SceneRouter
            type={scene.type}
            layout={scene.copy.layout}
            copy={{...scene.copy, cta: scene.copy.cta ?? brief.cta, contact: scene.copy.contact ?? brief.contact}}
            durationInFrames={scene.end - scene.start}
            width={width}
            height={height}
          />
        </Sequence>
      ))}
      {scenes.map((scene, i) =>
        i === 0 ? null : (
          <Sequence key={`w-${i}`} from={scene.start - 2} durationInFrames={6} name="sweep">
            <Sweep />
          </Sequence>
        ),
      )}
      <CaptionBar chunk={chunk} activeIndex={activeIndex} width={width} height={height} />
      <ProgressBar />
      <Audio src={staticFile(brief.audio)} />
    </AbsoluteFill>
  );
};
