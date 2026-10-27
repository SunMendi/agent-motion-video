import React from 'react';
import { Composition } from 'remotion';
import { Ad } from './Ad';
import { entries } from './briefs';
import { FPS, sizes, type SizeKey } from './brand';
import { durationFrames } from './timing';
import { MainVideo } from './video/MainVideo';
import project from './video/project.json';
import { RustReelsVideo } from './RustReelsVideo';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Current Primary 9:16 Vertical Video (1080x1920 @ 30 fps) */}
    <Composition
      id="current-video"
      component={MainVideo}
      durationInFrames={project.durationInFrames || 300}
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
