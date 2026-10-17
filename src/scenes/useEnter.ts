import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/** Enter with a spring, fade out in the last six frames of the scene. */
export const useEnter = (durationInFrames: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 14, stiffness: 120}});
  const leave = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(enter, leave);
  const rise = interpolate(enter, [0, 1], [24, 0]);
  return {
    frame,
    fps,
    enter,
    leave,
    opacity,
    rise,
    style: {opacity, transform: `translateY(${rise}px)`},
  } as const;
};
