import { describe, expect, it } from 'vitest';
import {
  ambientFloat,
  badgePop,
  calculateSpringPhysics,
  cameraPan,
  interpolateBezier,
  parallaxTilt,
  smoothBezier,
  SPRING_SNAPPY_CONFIG,
  SPRING_SNAPPY_METRICS,
  SPRING_SMOOTH_CONFIG,
  SPRING_SMOOTH_METRICS,
  springSnappy,
  springSmooth,
  verticalCardEntrance,
} from '../src/shared/motion';
import * as VideoMotionCurves from '../src/video/motion-curves';

describe('Video Motion Curves Re-export', () => {
  it('re-exports all motion helpers from src/video/motion-curves.ts', () => {
    expect(VideoMotionCurves.springSmooth).toBe(springSmooth);
    expect(VideoMotionCurves.springSnappy).toBe(springSnappy);
    expect(VideoMotionCurves.parallaxTilt).toBe(parallaxTilt);
    expect(VideoMotionCurves.smoothBezier).toBe(smoothBezier);
    expect(VideoMotionCurves.verticalCardEntrance).toBe(verticalCardEntrance);
    expect(VideoMotionCurves.badgePop).toBe(badgePop);
    expect(VideoMotionCurves.ambientFloat).toBe(ambientFloat);
  });
});

describe('Spring Mathematical Physics', () => {
  it('calculates accurate physics for springSmooth (card entrances)', () => {
    const metrics = calculateSpringPhysics(SPRING_SMOOTH_CONFIG, 30);

    expect(metrics.mass).toBe(0.8);
    expect(metrics.damping).toBe(15);
    expect(metrics.stiffness).toBe(110);
    expect(metrics.behavior).toBe('underdamped');

    // Damping ratio should be ~0.80 (subtle overshoot, no wild oscillation)
    expect(metrics.dampingRatio).toBeGreaterThan(0.78);
    expect(metrics.dampingRatio).toBeLessThan(0.82);

    // Peak overshoot should be between 1.5% and 3.0%
    expect(metrics.peakOvershootPercent).toBeGreaterThan(1.5);
    expect(metrics.peakOvershootPercent).toBeLessThan(3.0);

    // Settling time at 30 fps should be ~12-15 frames
    expect(metrics.settlingFramesAt30Fps).toBeGreaterThanOrEqual(12);
    expect(metrics.settlingFramesAt30Fps).toBeLessThanOrEqual(16);
  });

  it('calculates accurate physics for springSnappy (fast UI & badge pops)', () => {
    const metrics = calculateSpringPhysics(SPRING_SNAPPY_CONFIG, 30);

    expect(metrics.mass).toBe(0.5);
    expect(metrics.damping).toBe(12);
    expect(metrics.stiffness).toBe(180);
    expect(metrics.behavior).toBe('underdamped');

    // Damping ratio should be ~0.63 (lively, energetic pop)
    expect(metrics.dampingRatio).toBeGreaterThan(0.60);
    expect(metrics.dampingRatio).toBeLessThan(0.66);

    // Peak overshoot should be between 7.0% and 10.0%
    expect(metrics.peakOvershootPercent).toBeGreaterThan(7.0);
    expect(metrics.peakOvershootPercent).toBeLessThan(10.0);

    // Settling time at 30 fps should be ~10-12 frames
    expect(metrics.settlingFramesAt30Fps).toBeGreaterThanOrEqual(9);
    expect(metrics.settlingFramesAt30Fps).toBeLessThanOrEqual(13);
  });

  it('verifies exported pre-calculated metrics match calculation', () => {
    expect(SPRING_SMOOTH_METRICS.dampingRatio).toBeCloseTo(0.7995, 3);
    expect(SPRING_SNAPPY_METRICS.dampingRatio).toBeCloseTo(0.6324, 3);
  });
});

describe('Spring Execution Helpers', () => {
  it('springSmooth animates from 0 to 1 with subtle overshoot', () => {
    // Before start
    expect(springSmooth(0, 30, { delay: 5 })).toBe(0);

    // Mid flight
    const midVal = springSmooth(10, 30, { delay: 0 });
    expect(midVal).toBeGreaterThan(0.7);

    // Check overshoot around frame 8-12
    let maxVal = 0;
    for (let f = 0; f <= 30; f++) {
      const val = springSmooth(f, 30);
      if (val > maxVal) maxVal = val;
    }
    // Max value should exhibit subtle overshoot (> 1.00 and < 1.04)
    expect(maxVal).toBeGreaterThan(1.0);
    expect(maxVal).toBeLessThan(1.04);

    // Settled value at frame 30 should be 1.0 (within 0.001)
    const settledVal = springSmooth(30, 30);
    expect(settledVal).toBeCloseTo(1.0, 3);
  });

  it('springSnappy animates with rapid rise and distinct pop overshoot', () => {
    // Before start
    expect(springSnappy(0, 30, { delay: 5 })).toBe(0);

    // Check peak overshoot
    let maxVal = 0;
    let peakFrame = 0;
    for (let f = 0; f <= 30; f++) {
      const val = springSnappy(f, 30);
      if (val > maxVal) {
        maxVal = val;
        peakFrame = f;
      }
    }

    // Peak should occur early (around 5-8 frames) with 6-10% overshoot
    expect(peakFrame).toBeGreaterThanOrEqual(4);
    expect(peakFrame).toBeLessThanOrEqual(9);
    expect(maxVal).toBeGreaterThan(1.05);
    expect(maxVal).toBeLessThan(1.11);

    // Settles rapidly by frame 20
    const settledVal = springSnappy(25, 30);
    expect(settledVal).toBeCloseTo(1.0, 3);
  });
});

describe('Cubic-Bezier Easing', () => {
  it('interpolates smoothly with cameraPan curve', () => {
    const start = interpolateBezier(0, [0, 60], [0, 100], {
      easing: smoothBezier.cameraPan,
    });
    const mid = interpolateBezier(30, [0, 60], [0, 100], {
      easing: smoothBezier.cameraPan,
    });
    const end = interpolateBezier(60, [0, 60], [0, 100], {
      easing: smoothBezier.cameraPan,
    });

    expect(start).toBe(0);
    expect(mid).toBeGreaterThan(40);
    expect(mid).toBeLessThan(60);
    expect(end).toBe(100);
  });

  it('clamps extrapolation beyond input bounds', () => {
    const beyondRight = interpolateBezier(90, [0, 60], [0, 100]);
    expect(beyondRight).toBe(100);

    const beyondLeft = interpolateBezier(-20, [0, 60], [0, 100]);
    expect(beyondLeft).toBe(0);
  });
});

describe('3D Parallax Tilt', () => {
  it('computes 3D perspective and pitch rotation on progress input', () => {
    const tiltStart = parallaxTilt({ progress: 0, maxTiltX: 8, perspective: 1000 });
    expect(tiltStart.perspective).toBe(1000);
    expect(tiltStart.rotateX).toBe(8);
    expect(tiltStart.transform).toContain('perspective(1000px)');
    expect(tiltStart.transform).toContain('rotateX(8deg)');

    const tiltEnd = parallaxTilt({ progress: 1, maxTiltX: 8 });
    expect(tiltEnd.rotateX).toBe(0);
    expect(tiltEnd.rotateY).toBe(0);
  });

  it('computes spatial 3D rotation based on normalized coordinates', () => {
    const tilt = parallaxTilt({
      normalizedX: 0.5,
      normalizedY: -0.5,
      maxTiltX: 6,
      maxTiltY: 6,
    });

    // Positive normalizedY tilts down, so -(-0.5) * 6 = 3
    expect(tilt.rotateX).toBe(3);
    // Positive normalizedX tilts right: 0.5 * 6 = 3
    expect(tilt.rotateY).toBe(3);
  });
});

describe('Vertical 9:16 Card Motion Helpers', () => {
  it('generates high-end vertical card entrance', () => {
    const entrance = verticalCardEntrance(15, 30, {
      delay: 0,
      travelDistanceY: 50,
      initialScale: 0.92,
    });

    expect(entrance.progress).toBeGreaterThan(0.9);
    expect(entrance.opacity).toBe(1);
    expect(entrance.translateY).toBeLessThan(5);
    expect(entrance.scale).toBeGreaterThan(0.99);
    expect(entrance.transform).toContain('perspective(1000px)');
    expect(entrance.transform).toContain('translate3d');
    expect(entrance.style.transformStyle).toBe('preserve-3d');
  });

  it('generates snappy badge pop for counters and pills', () => {
    const pop = badgePop(8, 30, {
      delay: 0,
      initialScale: 0.5,
      travelDistanceY: 15,
    });

    expect(pop.opacity).toBe(1);
    // Scale should have popped with snappy overshoot (> 1.0)
    expect(pop.scale).toBeGreaterThan(1.0);
    expect(pop.translateY).toBeLessThan(3);
    expect(pop.transform).toContain('scale(');
  });

  it('generates ambient float wave to prevent static holds', () => {
    const float1 = ambientFloat(0, { amplitudeY: 6, periodFrames: 60 });
    const float2 = ambientFloat(15, { amplitudeY: 6, periodFrames: 60 });
    const float3 = ambientFloat(30, { amplitudeY: 6, periodFrames: 60 });

    expect(float1.offsetY).toBe(0);
    expect(float2.offsetY).toBeCloseTo(6, 1); // Peak at quarter cycle
    expect(float3.offsetY).toBeCloseTo(0, 1); // Half cycle returns to 0
    expect(float2.transform).toContain('translate3d');
  });

  it('generates camera pan with smooth bezier interpolation', () => {
    const pan = cameraPan(30, 60, {
      fromScale: 1.0,
      toScale: 1.05,
      fromY: 0,
      toY: -20,
    });

    expect(pan.scale).toBeGreaterThan(1.01);
    expect(pan.scale).toBeLessThan(1.04);
    expect(pan.y).toBeLessThan(-5);
    expect(pan.transform).toContain('translate3d');
    expect(pan.transform).toContain('scale');
  });
});
