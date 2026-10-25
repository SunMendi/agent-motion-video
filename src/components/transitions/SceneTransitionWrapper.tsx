import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from 'remotion';
import { VideoTheme } from '../../themes/videoTheme';

interface SceneTransitionWrapperProps {
  children: React.ReactNode;
  durationInFrames: number;
  rawDurationInFrames: number;
  isFirstScene?: boolean;
  isLastScene?: boolean;
  overlapFrames?: number;
  theme?: VideoTheme;
}

/**
 * Imperceptible Seamless Scene Transition Wrapper
 * Completely eliminates colored wipes, curtains, and screen collapses.
 * Delivers a constant-power optical cross-dissolve so the user cannot
 * differentiate that a cut occurred between scenes.
 */
export const SceneTransitionWrapper: React.FC<SceneTransitionWrapperProps> = ({
  children,
  durationInFrames,
  rawDurationInFrames,
  isFirstScene = false,
  isLastScene = false,
  overlapFrames = 6,
}) => {
  const frame = useCurrentFrame();

  // 1. Entrance: smooth continuous dissolve
  let enterOpacity = 1;
  if (!isFirstScene && frame < overlapFrames) {
    enterOpacity = interpolate(frame, [0, overlapFrames], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 1, 0.5, 1),
    });
  } else if (isFirstScene && frame < 5) {
    enterOpacity = interpolate(frame, [0, 5], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  // 2. Exit: smooth continuous dissolve into next scene
  let exitOpacity = 1;
  if (!isLastScene && frame >= rawDurationInFrames) {
    const exitProgress = frame - rawDurationInFrames;
    exitOpacity = interpolate(exitProgress, [0, overlapFrames], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.5, 0, 0.75, 0),
    });
  } else if (isLastScene) {
    const exitStart = Math.max(0, durationInFrames - 8);
    if (frame >= exitStart) {
      exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }
  }

  const opacity = enterOpacity * exitOpacity;

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: 'transparent',
      }}
      className="w-full h-full flex items-center justify-center overflow-hidden"
    >
      {children}
    </AbsoluteFill>
  );
};
