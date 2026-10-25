import type React from 'react';
import { Easing, interpolate, spring, type SpringConfig } from 'remotion';

/**
 * ============================================================================
 * Mathematical Physics & Motion Curves for Remotion
 * ============================================================================
 *
 * Harmonic Oscillator Physics:
 *   m * d²x/dt² + c * dx/dt + k * x = 0
 *
 * Parameters:
 *   m = mass
 *   c = damping
 *   k = stiffness
 *
 * Key Equations:
 *   - Undamped natural frequency:  ω₀ = √(k / m)
 *   - Critical damping coefficient: cc = 2 * √(m * k)
 *   - Damping ratio:               ζ  = c / (2 * √(m * k))
 *   - Damped angular frequency:    ωd = ω₀ * √(1 - ζ²)   (for underdamped ζ < 1)
 *   - Peak overshoot ratio:        Mp = exp(-π * ζ / √(1 - ζ²))
 *   - Approximate 1% settling time: ts ≈ 4 / (ζ * ω₀)
 */

export interface SpringPhysicsMetrics {
  mass: number;
  damping: number;
  stiffness: number;
  fps: number;
  naturalFrequency: number; // ω₀ (rad/s)
  dampingRatio: number; // ζ
  dampedFrequency: number; // ωd (rad/s)
  peakOvershootPercent: number; // % overshoot above 1.0
  settlingFrames: number; // frames to settle at configured fps
  settlingFramesAt30Fps: number; // frames to settle to equilibrium
  settlingFramesAt60Fps: number;
  behavior: 'underdamped' | 'critically_damped' | 'overdamped';
}

/**
 * Calculate physical properties for a spring configuration.
 */
export const calculateSpringPhysics = (
  config: SpringConfig,
  fps = 30,
): SpringPhysicsMetrics => {
  const { mass, damping, stiffness } = config;
  const naturalFrequency = Math.sqrt(stiffness / mass);
  const criticalDamping = 2 * Math.sqrt(mass * stiffness);
  const dampingRatio = damping / criticalDamping;

  let dampedFrequency = 0;
  let peakOvershootPercent = 0;

  if (dampingRatio < 1) {
    dampedFrequency = naturalFrequency * Math.sqrt(1 - dampingRatio * dampingRatio);
    peakOvershootPercent =
      Math.exp((-Math.PI * dampingRatio) / Math.sqrt(1 - dampingRatio * dampingRatio)) *
      100;
  }

  // Settling time approximation for ~1% error band: ts ≈ 4 / (ζ * ω₀)
  const settlingSeconds =
    dampingRatio > 0 ? 4 / (Math.max(dampingRatio, 0.1) * naturalFrequency) : 1;
  const settlingFrames = Math.ceil(settlingSeconds * fps);
  const settlingFramesAt30Fps = Math.ceil(settlingSeconds * 30);
  const settlingFramesAt60Fps = Math.ceil(settlingSeconds * 60);

  const behavior: 'underdamped' | 'critically_damped' | 'overdamped' =
    dampingRatio < 0.98
      ? 'underdamped'
      : dampingRatio > 1.02
        ? 'overdamped'
        : 'critically_damped';

  return {
    mass,
    damping,
    stiffness,
    fps,
    naturalFrequency,
    dampingRatio,
    dampedFrequency,
    peakOvershootPercent,
    settlingFrames,
    settlingFramesAt30Fps,
    settlingFramesAt60Fps,
    behavior,
  };
};

/**
 * ----------------------------------------------------------------------------
 * 1. Preset Spring Configurations
 * ----------------------------------------------------------------------------
 */

/**
 * `springSmooth` Config
 * Designed for card entrances in 9:16 vertical layouts.
 * Damping: 15 (range: 14-16), Mass: 0.8, Stiffness: 110 (range: 100-120).
 * Physics: ζ ≈ 0.80, Peak overshoot ≈ 2.0% - 2.5%, Settling time ≈ 13 frames @ 30fps.
 * Delivers an organic, cinematic settle without jarring wobble.
 */
export const SPRING_SMOOTH_CONFIG: SpringConfig = {
  damping: 15,
  mass: 0.8,
  stiffness: 110,
  overshootClamping: false,
};

/**
 * `springSnappy` Config
 * Designed for quick UI elements, badge pops, icons, and counters.
 * Damping: 12, Mass: 0.5, Stiffness: 180.
 * Physics: ζ ≈ 0.63, Peak overshoot ≈ 8.0% - 9.0%, Settling time ≈ 10 frames @ 30fps.
 * Delivers immediate tactile feedback with crisp bounce.
 */
export const SPRING_SNAPPY_CONFIG: SpringConfig = {
  damping: 12,
  mass: 0.5,
  stiffness: 180,
  overshootClamping: false,
};

/**
 * Pre-calculated physics profiles for verification and inspection.
 */
export const SPRING_SMOOTH_METRICS = calculateSpringPhysics(SPRING_SMOOTH_CONFIG, 30);
export const SPRING_SNAPPY_METRICS = calculateSpringPhysics(SPRING_SNAPPY_CONFIG, 30);

/**
 * ----------------------------------------------------------------------------
 * 2. Spring Execution Helpers
 * ----------------------------------------------------------------------------
 */

export interface SpringOptions {
  delay?: number;
  from?: number;
  to?: number;
  durationInFrames?: number;
  reverse?: boolean;
  config?: Partial<SpringConfig>;
}

/**
 * Calculate smooth spring progress (default 0 -> 1).
 */
export const springSmooth = (
  frame: number,
  fps = 30,
  options: SpringOptions = {},
): number => {
  const { delay = 0, from = 0, to = 1, durationInFrames, reverse, config } = options;
  const mergedConfig: SpringConfig = {
    ...SPRING_SMOOTH_CONFIG,
    ...config,
  };

  return spring({
    frame: frame - delay,
    fps,
    config: mergedConfig,
    from,
    to,
    durationInFrames,
    reverse,
  });
};

/**
 * Calculate snappy spring progress (default 0 -> 1).
 */
export const springSnappy = (
  frame: number,
  fps = 30,
  options: SpringOptions = {},
): number => {
  const { delay = 0, from = 0, to = 1, durationInFrames, reverse, config } = options;
  const mergedConfig: SpringConfig = {
    ...SPRING_SNAPPY_CONFIG,
    ...config,
  };

  return spring({
    frame: frame - delay,
    fps,
    config: mergedConfig,
    from,
    to,
    durationInFrames,
    reverse,
  });
};

/**
 * ----------------------------------------------------------------------------
 * 3. Cubic-Bezier Curves & Smooth Interpolation
 * ----------------------------------------------------------------------------
 */

export const smoothBezier = {
  /**
   * Camera Pan curve: cinematic ease-in-out with gentle acceleration and smooth deceleration.
   * Symmetric S-curve ensuring natural midpoint velocity.
   */
  cameraPan: Easing.bezier(0.42, 0.0, 0.58, 1.0),

  /**
   * Continuous Scale & Drift curve: fast initial expansion that tapers smoothly.
   */
  continuousScale: Easing.bezier(0.16, 1.0, 0.3, 1.0),

  /**
   * Ambient Drift curve: symmetrical sinusoidal curve for idle breathing.
   */
  ambientDrift: Easing.bezier(0.37, 0.0, 0.63, 1.0),

  /**
   * Cinematic Out: strong deceleration curve for incoming overlays.
   */
  cinematicOut: Easing.bezier(0.22, 1.0, 0.36, 1.0),

  /**
   * Cinematic In-Out: heavy dramatic S-curve for punchy camera transitions.
   */
  cinematicInOut: Easing.bezier(0.65, 0.0, 0.35, 1.0),
};

export interface InterpolateBezierOptions {
  extrapolateLeft?: 'clamp' | 'extend' | 'identity';
  extrapolateRight?: 'clamp' | 'extend' | 'identity';
  easing?: (t: number) => number;
}

/**
 * Interpolate values using cubic-bezier easing with default clamp extrapolation.
 */
export const interpolateBezier = (
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
  options: InterpolateBezierOptions = {},
): number => {
  const {
    extrapolateLeft = 'clamp',
    extrapolateRight = 'clamp',
    easing = smoothBezier.cameraPan,
  } = options;

  return interpolate(frame, inputRange, outputRange, {
    extrapolateLeft,
    extrapolateRight,
    easing,
  });
};

/**
 * ----------------------------------------------------------------------------
 * 4. 3D Parallax Tilt Math & CSS Transform
 * ----------------------------------------------------------------------------
 */

export interface ParallaxTiltOptions {
  /**
   * Current animation progress (0 to 1), frame, or normalized coordinate.
   */
  progress?: number;
  /**
   * Horizontal relative offset (-1 to 1). Defaults to 0.
   */
  normalizedX?: number;
  /**
   * Vertical relative offset (-1 to 1). Defaults to 0.
   */
  normalizedY?: number;
  /**
   * Maximum X rotation angle in degrees (pitch). Defaults to 6.
   */
  maxTiltX?: number;
  /**
   * Maximum Y rotation angle in degrees (yaw). Defaults to 6.
   */
  maxTiltY?: number;
  /**
   * Perspective distance in pixels. Defaults to 1000px for 9:16 vertical viewports.
   */
  perspective?: number;
  /**
   * Invert tilt direction. Defaults to false.
   */
  reverse?: boolean;
}

export interface ParallaxTiltResult {
  rotateX: number;
  rotateY: number;
  perspective: number;
  transform: string;
  style: React.CSSProperties;
}

/**
 * Compute 3D perspective and rotation angles for vertical cards.
 *
 * Physics & Optics in 9:16 Canvas:
 *   - Perspective of 1000px matches an 85mm portrait lens feel on a 1080x1920 canvas.
 *   - Small pitch (rotateX) makes incoming cards feel like they tilt upward to face the lens.
 *   - Yaw (rotateY) reacts to off-center horizontal position.
 */
export const parallaxTilt = (options: ParallaxTiltOptions = {}): ParallaxTiltResult => {
  const {
    progress,
    normalizedX = 0,
    normalizedY = 0,
    maxTiltX = 6,
    maxTiltY = 6,
    perspective = 1000,
    reverse = false,
  } = options;

  let rotX = 0;
  let rotY = 0;

  if (progress !== undefined) {
    // When progress is passed (e.g. 0 -> 1 during entrance):
    // Card starts tilted backwards (+maxTiltX) and levels out to 0 at progress = 1.
    const clampedProgress = Math.max(0, Math.min(1, progress));
    rotX = (1 - clampedProgress) * maxTiltX;
    rotY = (1 - clampedProgress) * (maxTiltY * -0.5);
  } else {
    // When spatial coordinates are passed:
    // Tilts towards the viewer based on coordinates.
    rotX = -normalizedY * maxTiltX;
    rotY = normalizedX * maxTiltY;
  }

  if (reverse) {
    rotX = -rotX;
    rotY = -rotY;
  }

  // Round to 3 decimal places for clean CSS rendering
  const rX = Number(rotX.toFixed(3));
  const rY = Number(rotY.toFixed(3));

  const transform = `perspective(${perspective}px) rotateX(${rX}deg) rotateY(${rY}deg)`;

  const style: React.CSSProperties = {
    transform,
    transformStyle: 'preserve-3d',
    willChange: 'transform',
  };

  return {
    rotateX: rX,
    rotateY: rY,
    perspective,
    transform,
    style,
  };
};

/**
 * ----------------------------------------------------------------------------
 * 5. Composite Vertical Motion Functions (for 9:16 Canvas)
 * ----------------------------------------------------------------------------
 */

export interface VerticalCardEntranceOptions {
  delay?: number;
  travelDistanceY?: number; // pixels to travel upward (default: 48)
  initialScale?: number; // scale at start (default: 0.94)
  initialTiltX?: number; // initial pitch tilt (default: 7 degrees)
  perspective?: number; // 3D perspective (default: 1000)
  opacityFrames?: number; // frames to fade opacity in (default: 6)
  springConfig?: Partial<SpringConfig>;
}

export interface VerticalCardEntranceResult {
  progress: number;
  translateY: number;
  scale: number;
  opacity: number;
  rotateX: number;
  rotateY: number;
  transform: string;
  style: React.CSSProperties;
}

/**
 * High-end card entrance for 9:16 vertical cards.
 * Combines `springSmooth`, subtle Y-axis elevation, scale settling, and 3D pitch tilt.
 */
export const verticalCardEntrance = (
  frame: number,
  fps = 30,
  options: VerticalCardEntranceOptions = {},
): VerticalCardEntranceResult => {
  const {
    delay = 0,
    travelDistanceY = 48,
    initialScale = 0.94,
    initialTiltX = 7,
    perspective = 1000,
    opacityFrames = 6,
    springConfig,
  } = options;

  const adjustedFrame = frame - delay;

  if (adjustedFrame < 0) {
    return {
      progress: 0,
      translateY: travelDistanceY,
      scale: initialScale,
      opacity: 0,
      rotateX: initialTiltX,
      rotateY: 0,
      transform: `perspective(${perspective}px) translate3d(0px, ${travelDistanceY}px, 0px) scale(${initialScale}) rotateX(${initialTiltX}deg)`,
      style: {
        opacity: 0,
        transform: `perspective(${perspective}px) translate3d(0px, ${travelDistanceY}px, 0px) scale(${initialScale}) rotateX(${initialTiltX}deg)`,
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity',
      },
    };
  }

  const progress = springSmooth(frame, fps, {
    delay,
    config: springConfig,
  });

  const translateY = interpolate(progress, [0, 1], [travelDistanceY, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'extend',
  });

  const scale = interpolate(progress, [0, 1], [initialScale, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'extend',
  });

  const rotateX = interpolate(progress, [0, 1], [initialTiltX, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'extend',
  });

  const opacity = interpolate(adjustedFrame, [0, opacityFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const tY = Number(translateY.toFixed(2));
  const s = Number(scale.toFixed(4));
  const rX = Number(rotateX.toFixed(2));

  const transform = `perspective(${perspective}px) translate3d(0px, ${tY}px, 0px) scale(${s}) rotateX(${rX}deg)`;

  const style: React.CSSProperties = {
    opacity,
    transform,
    transformStyle: 'preserve-3d',
    willChange: 'transform, opacity',
  };

  return {
    progress,
    translateY: tY,
    scale: s,
    opacity,
    rotateX: rX,
    rotateY: 0,
    transform,
    style,
  };
};

export interface BadgePopOptions {
  delay?: number;
  initialScale?: number; // scale before pop (default: 0.4)
  travelDistanceY?: number; // small upward rise (default: 16)
  opacityFrames?: number; // default: 3
  springConfig?: Partial<SpringConfig>;
}

export interface BadgePopResult {
  progress: number;
  scale: number;
  opacity: number;
  translateY: number;
  transform: string;
  style: React.CSSProperties;
}

/**
 * Snappy entrance for pills, counters, checkmarks, and tags.
 * Uses `springSnappy` for an energetic pop with ~8% overshoot.
 */
export const badgePop = (
  frame: number,
  fps = 30,
  options: BadgePopOptions = {},
): BadgePopResult => {
  const {
    delay = 0,
    initialScale = 0.4,
    travelDistanceY = 16,
    opacityFrames = 3,
    springConfig,
  } = options;

  const adjustedFrame = frame - delay;

  if (adjustedFrame < 0) {
    return {
      progress: 0,
      scale: initialScale,
      opacity: 0,
      translateY: travelDistanceY,
      transform: `translate3d(0px, ${travelDistanceY}px, 0px) scale(${initialScale})`,
      style: {
        opacity: 0,
        transform: `translate3d(0px, ${travelDistanceY}px, 0px) scale(${initialScale})`,
        willChange: 'transform, opacity',
      },
    };
  }

  const progress = springSnappy(frame, fps, {
    delay,
    config: springConfig,
  });

  const scale = interpolate(progress, [0, 1], [initialScale, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'extend',
  });

  const translateY = interpolate(progress, [0, 1], [travelDistanceY, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'extend',
  });

  const opacity = interpolate(adjustedFrame, [0, opacityFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const s = Number(scale.toFixed(4));
  const tY = Number(translateY.toFixed(2));
  const transform = `translate3d(0px, ${tY}px, 0px) scale(${s})`;

  const style: React.CSSProperties = {
    opacity,
    transform,
    willChange: 'transform, opacity',
  };

  return {
    progress,
    scale: s,
    opacity,
    translateY: tY,
    transform,
    style,
  };
};

export interface AmbientFloatOptions {
  periodFrames?: number; // frames per full wave cycle (default: 90 frames = 3s @ 30fps)
  amplitudeY?: number; // vertical drift in pixels (default: 6px)
  amplitudeRotate?: number; // subtle angle in degrees (default: 0.6 deg)
  phaseOffset?: number; // radians offset
}

export interface AmbientFloatResult {
  offsetY: number;
  rotation: number;
  transform: string;
}

/**
 * Continuous subtle floating motion for vertical cards.
 * Prevents video from staying static for >3 seconds (satisfies `video:check-motion`).
 */
export const ambientFloat = (
  frame: number,
  options: AmbientFloatOptions = {},
): AmbientFloatResult => {
  const {
    periodFrames = 90,
    amplitudeY = 6,
    amplitudeRotate = 0.6,
    phaseOffset = 0,
  } = options;

  const angle = ((2 * Math.PI) / periodFrames) * frame + phaseOffset;
  const offsetY = Number((Math.sin(angle) * amplitudeY).toFixed(2));
  const rotation = Number((Math.cos(angle * 0.8) * amplitudeRotate).toFixed(3));

  const transform = `translate3d(0px, ${offsetY}px, 0px) rotate(${rotation}deg)`;

  return {
    offsetY,
    rotation,
    transform,
  };
};

export interface CameraPanOptions {
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
  fromScale?: number;
  toScale?: number;
  easing?: (t: number) => number;
}

export interface CameraPanResult {
  x: number;
  y: number;
  scale: number;
  transform: string;
  style: React.CSSProperties;
}

/**
 * Camera pan & zoom drift across a shot duration.
 * Uses `smoothBezier.cameraPan` or `smoothBezier.continuousScale`.
 */
export const cameraPan = (
  frame: number,
  durationInFrames: number,
  options: CameraPanOptions = {},
): CameraPanResult => {
  const {
    fromX = 0,
    toX = 0,
    fromY = 0,
    toY = 0,
    fromScale = 1.0,
    toScale = 1.03,
    easing = smoothBezier.cameraPan,
  } = options;

  const progress = interpolateBezier(frame, [0, durationInFrames], [0, 1], {
    easing,
  });

  const x = Number(interpolate(progress, [0, 1], [fromX, toX]).toFixed(2));
  const y = Number(interpolate(progress, [0, 1], [fromY, toY]).toFixed(2));
  const scale = Number(interpolate(progress, [0, 1], [fromScale, toScale]).toFixed(4));

  const transform = `translate3d(${x}px, ${y}px, 0px) scale(${scale})`;

  const style: React.CSSProperties = {
    transform,
    willChange: 'transform',
  };

  return {
    x,
    y,
    scale,
    transform,
    style,
  };
};
