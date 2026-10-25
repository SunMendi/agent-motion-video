import React from 'react';
import {AbsoluteFill, Composition, Sequence, registerRoot, useCurrentFrame} from 'remotion';
import {SceneStage} from '../../src/shared/SceneStage';
import {TimedCaptions} from '../../src/shared/TimedCaptions';

/** Synthetic geometry probe, independent of the current video's narration and approvals. */
const StageProbe: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: '#0B0F17'}}>
      <Sequence from={0} durationInFrames={60}>
        <SceneStage>
          <svg width="100%" height="100%" viewBox="0 0 896 1380">
            <rect x="2" y="2" width="892" height="1376" fill="#161F30" stroke="#38BDF8" strokeWidth="4" />
            <path d="M448 240 L448 1140" stroke="#64748B" strokeWidth="8" />
            <rect x="248" y="100" width="400" height="200" rx="20" fill="#21759B" />
            <rect x="248" y="1080" width="400" height="200" rx="20" fill="#777BB4" />
            <circle cx="448" cy={300 + Math.min(frame / 59, 1) * 780} r="45" fill="#38BDF8" />
          </svg>
        </SceneStage>
      </Sequence>
      <TimedCaptions cues={[{id: 'test', text: 'বাংলা ক্যাপশন', startFrame: 0, endFrame: 60}]} />
    </AbsoluteFill>
  );
};

registerRoot(() => <Composition id="stage-probe" component={StageProbe} width={1080} height={1920} fps={30} durationInFrames={60} />);
