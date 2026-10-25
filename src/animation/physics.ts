import { spring, interpolate, Easing } from 'remotion';

/**
 * Calibrated Remotion spring physics configurations
 * for broadcast-grade vertical motion design.
 */

/**
 * Snappy UI Card Entrance
 * Settles completely within 12-14 frames with controlled overshoot.
 * Works consistently for delayFrames = 0 and delayFrames > 0.
 */
export const snappyCardSpring = (
  frame: number,
  fps = 30,
  delayFrames = 0,
): { scale: number; opacity: number; translateY: number } => {
  if (frame < delayFrames) {
    return { scale: 0.95, opacity: 0, translateY: 16 };
  }

  const adjustedFrame = frame - delayFrames;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: {
      mass: 0.5,
      damping: 14,
      stiffness: 280,
    },
  });

  const scale = interpolate(progress, [0, 1], [0.95, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(progress, [0, 1], [18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(adjustedFrame, [0, 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return { scale, opacity, translateY };
};

/**
 * Directional Slide & Spring Entrance
 */
export const slideInSpring = (
  frame: number,
  fps = 30,
  delayFrames = 0,
  fromY = 24,
  fromX = 0,
): { scale: number; opacity: number; x: number; y: number } => {
  if (frame < delayFrames) {
    return { scale: 0.96, opacity: 0, x: fromX, y: fromY };
  }

  const adjustedFrame = frame - delayFrames;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: {
      mass: 0.6,
      damping: 15,
      stiffness: 260,
    },
  });

  const scale = interpolate(progress, [0, 1], [0.96, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const x = interpolate(progress, [0, 1], [fromX, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const y = interpolate(progress, [0, 1], [fromY, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(adjustedFrame, [0, 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return { scale, opacity, x, y };
};

/**
 * Micro-State Callout Pulse
 * Pops an element (1.0 -> 1.08 -> 1.0) over 14 frames on callout trigger.
 */
export const microCalloutPulse = (
  frame: number,
  triggerFrame: number,
): number => {
  if (frame < triggerFrame) return 1.0;
  const elapsed = frame - triggerFrame;
  if (elapsed > 14) return 1.0;

  return interpolate(elapsed, [0, 5, 14], [1.0, 1.08, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
};

/**
 * Ambient Camera Drift
 * Continuous smooth scale from 1.000 to 1.025 across scene duration.
 */
export const cameraDriftScale = (
  frame: number,
  durationInFrames: number,
): number => {
  return interpolate(frame, [0, durationInFrames], [1.0, 1.025], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
  });
};

/**
 * Normalized Linear Progress
 */
export const linearProgress = (
  frame: number,
  startFrame: number,
  durationFrames: number,
): number => {
  return interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};
