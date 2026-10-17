import React from 'react';
import type {SceneType} from '../model';
import {Hook} from './Hook';
import {Problem} from './Problem';
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

export const SceneRouter: React.FC<SceneProps & {type: SceneType}> = ({type, ...rest}) => {
  const Scene: SceneComponent = MAP[type] ?? Problem;
  return <Scene {...rest} />;
};
