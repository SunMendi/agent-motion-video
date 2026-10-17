import React from 'react';
import {Composition} from 'remotion';
import {Ad} from './Ad';
import {entries} from './briefs';
import {FPS, sizes, type SizeKey} from './brand';
import {durationFrames} from './timing';

export const RemotionRoot: React.FC = () => (
  <>
    {entries.map(({brief, timing}) =>
      (Object.keys(sizes) as SizeKey[]).map((key) => {
        const {width, height} = sizes[key];
        return (
          <Composition
            key={`${brief.name}-${key}`}
            id={`${brief.name}-${key}`}
            component={Ad}
            durationInFrames={durationFrames(timing, FPS)}
            fps={FPS}
            width={width}
            height={height}
            defaultProps={{brief, timing, width, height}}
          />
        );
      }),
    )}
  </>
);
