import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SceneStage} from '../../src/shared/SceneStage';

/** Replace this empty composition after the user approves the current storyboard. */
export const MainVideo: React.FC = () => (
  <AbsoluteFill className="bg-slate-50 text-center text-slate-900">
    {/* Keep SceneStage INSIDE each Sequence when adding timed shots. */}
    <SceneStage>
    <div>
      <h1 className="text-6xl font-bold">Current video is empty</h1>
      <p className="mt-8 text-3xl">Complete brief.json. Then follow start.md.</p>
    </div>
    </SceneStage>
  </AbsoluteFill>
);
