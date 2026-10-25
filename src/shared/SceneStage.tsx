import React from 'react';
import {AbsoluteFill} from 'remotion';
import defaults from './video-layout.json';

export type VideoLayout = typeof defaults;
export const VIDEO_LAYOUT: VideoLayout = defaults;

/** Mount inside each Sequence so its absolute wrapper cannot defeat scene centering. */
export const SceneStage: React.FC<{
  children: React.ReactNode;
  layout?: VideoLayout;
}> = ({children, layout = VIDEO_LAYOUT}) => (
  <AbsoluteFill
    data-video-stage="action"
    style={{
      top: layout.action.top,
      bottom: layout.height - layout.action.bottom,
      left: layout.action.left,
      right: layout.action.right,
      width: 'auto',
      height: 'auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {children}
  </AbsoluteFill>
);

export const CaptionRegion: React.FC<{
  children: React.ReactNode;
  layout?: VideoLayout;
}> = ({children, layout = VIDEO_LAYOUT}) => (
  <div
    data-video-stage="captions"
    style={{
      position: 'absolute',
      top: layout.caption.top,
      left: layout.caption.left,
      right: layout.caption.right,
      height: layout.caption.height,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      pointerEvents: 'none',
      zIndex: 50,
      fontFamily: layout.typography.captionFamily,
      fontSize: layout.typography.captionSize,
      fontWeight: layout.typography.captionWeight,
    }}
  >
    {children}
  </div>
);
