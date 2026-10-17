import React from 'react';
import type {SceneLayout, SceneType} from '../model';
import {Hook} from './Hook';
import {Problem} from './Problem';
import {LongRead} from './LongRead';
import {Trending} from './Trending';
import {Feature} from './Feature';
import {Question} from './Question';
import {Stat} from './Stat';
import {PromiseScene} from './Promise';
import {Cta} from './Cta';
import type {SceneComponent, SceneProps, SceneTypeMap} from './types';

const MAP: SceneTypeMap = {
  hook: Hook,
  problem: Problem,
  feature: Feature,
  question: Question,
  stat: Stat,
  promise: PromiseScene,
  cta: Cta,
};

const LAYOUTS: Partial<Record<SceneLayout, SceneComponent>> = {
  longread: LongRead,
  trending: Trending,
};

export const SceneRouter: React.FC<SceneProps & {type: SceneType; layout?: SceneLayout}> = ({
  type,
  layout,
  ...rest
}) => {
  const Scene: SceneComponent = (layout ? LAYOUTS[layout] : undefined) ?? MAP[type] ?? Problem;
  return <Scene {...rest} />;
};
