# Motion Curves and Easing Guide for 9:16 Vertical Video

This guide describes the mathematical physics and easing presets for Remotion.
Use these curves for top-tier vertical motion design in 1080x1920 canvas.

## 1. Mathematical Physics of Remotion Springs

Remotion calculates springs with an unforced damped harmonic oscillator:

```text
m * (d²x/dt²) + c * (dx/dt) + k * x = 0
```

The parameters mean:
- `m`: Mass of the layer.
- `c`: Damping coefficient.
- `k`: Spring stiffness constant.

### Key Equations

1. **Natural Angular Frequency**:
   ```text
   ω₀ = √(k / m)
   ```
2. **Critical Damping**:
   ```text
   cc = 2 * √(m * k)
   ```
3. **Damping Ratio**:
   ```text
   ζ = c / (2 * √(m * k))
   ```
4. **Behavior by Damping Ratio**:
   - `ζ < 1`: Underdamped. The spring overshoots and settles.
   - `ζ = 1`: Critically damped. The spring returns fastest with zero overshoot.
   - `ζ > 1`: Overdamped. The movement is sluggish without overshoot.
5. **Peak Overshoot**:
   ```text
   Mp = exp(-π * ζ / √(1 - ζ²))
   ```
6. **Settling Time (1% Band)**:
   ```text
   ts ≈ 4 / (ζ * ω₀)
   ```

---

## 2. Calibrated Presets

| Preset | Damping (`c`) | Mass (`m`) | Stiffness (`k`) | Ratio (`ζ`) | Overshoot | Settling (30fps) | Target Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `springSmooth` | 15 | 0.8 | 110 | ≈ 0.80 | ≈ 2.0% - 2.5% | 13 frames | Large vertical cards, layout transitions |
| `springSnappy` | 12 | 0.5 | 180 | ≈ 0.63 | ≈ 8.0% - 9.0% | 10 frames | Badges, tags, checkmarks, icon pops |

### `springSmooth` (Card Entrances)
- Use this preset for large containers and UI cards.
- It delivers a subtle overshoot of ~2%.
- It settles in 13 frames at 30 fps (0.43 seconds).
- It prevents visual wobble while feeling organic.

### `springSnappy` (UI Elements & Badges)
- Use this preset for pills, status badges, and icons.
- It delivers a sharp, tactile overshoot of ~8%.
- It settles in 10 frames at 30 fps (0.33 seconds).
- It gives instant feedback to the viewer.

---

## 3. Cubic-Bezier Curves (`smoothBezier`)

Use cubic-bezier curves when constant velocity or continuous motion is needed.

- **`cameraPan`**: `Easing.bezier(0.42, 0.0, 0.58, 1.0)`
  - Symmetrical ease-in-out.
  - Good for horizontal pans and camera shifts.
- **`continuousScale`**: `Easing.bezier(0.16, 1.0, 0.3, 1.0)`
  - Fast expansion that decelerates smoothly.
  - Good for zoom reveals.
- **`ambientDrift`**: `Easing.bezier(0.37, 0.0, 0.63, 1.0)`
  - Continuous sinusoidal wave.
  - Good for idle card floating.
- **`cinematicOut`**: `Easing.bezier(0.22, 1.0, 0.36, 1.0)`
  - Clean deceleration for incoming overlays.
- **`cinematicInOut`**: `Easing.bezier(0.65, 0.0, 0.35, 1.0)`
  - Heavy S-curve for dramatic transitions.

---

## 4. 3D Parallax Tilt (`parallaxTilt`)

Vertical 9:16 videos look flat without depth.
The `parallaxTilt` function adds 3D perspective to elements:

```text
transform: perspective(1000px) rotateX(...) rotateY(...)
```

### Optical Rules for 1080x1920:
- Use `perspective(1000px)` to simulate an 85mm portrait lens.
- Rotate pitch (`rotateX`) between `+6°` and `0°` during upward entrance.
- Keep yaw (`rotateY`) within `±4°` for off-center cards.
- Keep roll (`rotateZ`) near `0°` to avoid viewer disorientation.

---

## 5. How to Apply to 9:16 Vertical Cards and UI Frames

The video canvas is 1080x1920 pixels.
Layout constraints:
- Captions safe zone: Top `y: 100` to `260`.
- Action stage: Top `y: 320` to `1700`. Width: 896px (`left: 64`, `right: 120`).

### Example 1: Full Card Entrance with 3D Tilt

```tsx
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { verticalCardEntrance } from '../shared/motion';

export const StoryCard: React.FC = () => {
  const frame = useCurrentFrame();

  const motion = verticalCardEntrance(frame, 30, {
    delay: 5,
    travelDistanceY: 52,
    initialScale: 0.93,
    initialTiltX: 6,
  });

  return (
    <div
      style={{
        ...motion.style,
        width: 820,
        height: 600,
        borderRadius: 36,
        backgroundColor: '#172337',
        border: '3px solid #38BDF8',
      }}
    >
      <h2>Card Content</h2>
    </div>
  );
};
```

### Example 2: Snappy Badge Pop

```tsx
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { badgePop } from '../shared/motion';

export const TokenBadge: React.FC<{ label: string; delay?: number }> = ({ label, delay = 0 }) => {
  const frame = useCurrentFrame();
  const pop = badgePop(frame, 30, { delay, initialScale: 0.3 });

  return (
    <div
      style={{
        ...pop.style,
        padding: '10px 24px',
        borderRadius: 999,
        backgroundColor: '#F59E0B',
        color: '#0B0F17',
        fontWeight: 800,
      }}
    >
      {label}
    </div>
  );
};
```

### Example 3: Idle Floating (Prevent Static Holds)

The test `npm run video:check-motion` flags static holds longer than 3 seconds.
Use `ambientFloat` to keep the body stage moving:

```tsx
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ambientFloat } from '../shared/motion';

export const FloatingStage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const float = ambientFloat(frame, { amplitudeY: 5, periodFrames: 90 });

  return (
    <div style={{ transform: float.transform }}>
      {children}
    </div>
  );
};
```
