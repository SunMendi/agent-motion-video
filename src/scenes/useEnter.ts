import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/** Enter with a spring, then leave with a fast rise and shrink. */
export const useEnter = (durationInFrames: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 16, stiffness: 190}});
  const leave = interpolate(frame, [durationInFrames - 5, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(1, enter * 1.4) * (1 - leave);
  const rise = interpolate(enter, [0, 1], [34, 0]) - leave * 26;
  const scale = interpolate(enter, [0, 1], [0.94, 1]) * (1 - leave * 0.05);
  return {
    frame,
    fps,
    enter,
    leave,
    opacity,
    rise,
    style: {
      opacity,
      transform: `translateY(${rise}px) scale(${scale})`,
      transformOrigin: 'center center',
    },
  } as const;
};

/** A pop-in spring that starts `delay` frames into the scene. */
export const popStyle = (
  frame: number,
  fps: number,
  delay = 0,
  from = 0.82,
): {opacity: number; transform: string} => {
  const s = spring({frame: frame - delay, fps, config: {damping: 15, stiffness: 230}});
  return {
    opacity: Math.min(1, s * 1.6),
    transform: `scale(${interpolate(s, [0, 1], [from, 1])})`,
  };
};

/** Linear wipe helper, clamped to the scene. */
export const wipe = (frame: number, from: number, to: number): number =>
  interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
