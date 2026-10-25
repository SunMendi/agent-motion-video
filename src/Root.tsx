import React from 'react';
import { Composition, AbsoluteFill } from 'remotion';
import { Ad } from './Ad';
import { entries } from './briefs';
import { FPS, sizes, type SizeKey } from './brand';
import { durationFrames } from './timing';
import { ensureFonts, HIND_SILIGURI } from './fonts';
import { SceneStage } from './shared/SceneStage';
import { MainVideo } from './video/MainVideo';
import project from './video/project.json';
import {
  SceneIntro,
  SceneNapkin,
  SceneGamma,
  ScenePerplexity,
  SceneNotebook,
  SceneAdobePodcast,
  SceneOutro,
  type SceneProps,
} from './video/scenes';
import { RustReelsVideo } from './RustReelsVideo';

const ScenePreview: React.FC<{
  Component: React.ComponentType<SceneProps>;
  duration: number;
}> = ({ Component, duration }) => {
  ensureFonts();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0B0F17',
        fontFamily: HIND_SILIGURI,
      }}
      className="text-slate-100 flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.08) 0%, transparent 80%), linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 48px 48px, 48px 48px',
        }}
      />
      <SceneStage>
        <Component duration={duration} />
      </SceneStage>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <>
    {/* Current Primary 9:16 Vertical Video (1080x1920 @ 30 fps) */}
    <Composition
      id="current-video"
      component={MainVideo}
      durationInFrames={project.durationInFrames || 2549}
      fps={30}
      width={1080}
      height={1920}
    />

    {/* Individual Modular Scene Previews for 9:16 Vertical */}
    <Composition
      id="scene-01-intro"
      component={() => <ScenePreview Component={SceneIntro} duration={180} />}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="scene-02-napkin"
      component={() => <ScenePreview Component={SceneNapkin} duration={180} />}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="scene-03-gamma"
      component={() => <ScenePreview Component={SceneGamma} duration={180} />}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="scene-04-perplexity"
      component={() => <ScenePreview Component={ScenePerplexity} duration={180} />}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="scene-05-notebook"
      component={() => <ScenePreview Component={SceneNotebook} duration={180} />}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="scene-06-adobe-podcast"
      component={() => <ScenePreview Component={SceneAdobePodcast} duration={180} />}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="scene-07-outro"
      component={() => <ScenePreview Component={SceneOutro} duration={180} />}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1920}
    />

    {/* Legacy Video Compositions */}
    <Composition
      id="rust-reels"
      component={RustReelsVideo}
      durationInFrames={3696}
      fps={30}
      width={1080}
      height={1920}
    />
    {entries.map(({ brief, timing }) =>
      (Object.keys(sizes) as SizeKey[]).map((key) => {
        const { width, height } = sizes[key];
        return (
          <Composition
            key={`${brief.name}-${key}`}
            id={`${brief.name}-${key}`}
            component={Ad}
            durationInFrames={durationFrames(timing, FPS)}
            fps={FPS}
            width={width}
            height={height}
            defaultProps={{ brief, timing, width, height }}
          />
        );
      }),
    )}
  </>
);
