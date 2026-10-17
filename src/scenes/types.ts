import type React from 'react';
import type {SceneCopy, SceneType} from '../model';

export type SceneProps = {
  copy: SceneCopy;
  durationInFrames: number;
  width: number;
  height: number;
};

export type SceneComponent = React.FC<SceneProps>;

export type SceneTypeMap = Record<SceneType, SceneComponent>;
