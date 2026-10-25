import React from 'react';
import {AbsoluteFill, Img, cancelRender, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';

let fontStarted = false;

const loadSmokeFont = () => {
  if (fontStarted || typeof document === 'undefined') return;
  fontStarted = true;
  const handle = delayRender('workspace local font test');
  const face = new FontFace('WorkspaceSmoke', `url(${staticFile('fonts/NotoSansBengali-Regular.ttf')})`);
  face.load().then((loaded) => {
    document.fonts.add(loaded);
    continueRender(handle);
  }).catch((error: unknown) => {
    // Fail the render when the required font is unavailable.
    cancelRender(error);
  });
};

export const SetupSmoke: React.FC = () => {
  loadSmokeFont();
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 29], [-120, 120], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill className="items-center justify-center gap-6 bg-slate-50 text-slate-900">
      <Img src={staticFile('workspace-smoke/check.svg')} className="h-24 w-24" style={{transform: `translateX(${x}px)`}} />
      <h1 className="text-4xl font-bold">Workspace setup test</h1>
      <p style={{fontFamily: 'WorkspaceSmoke', fontSize: 36}}>বাংলা ফন্ট পরীক্ষা</p>
      <Audio src={staticFile('workspace-smoke/tone.wav')} />
    </AbsoluteFill>
  );
};
