# Bengali Typography and Layout Specification

This document defines the typography and layout rules for Bengali video production.

---

## 1. Font Configuration

The application bundles local TrueType font files in `public/fonts/`.

| Font Family | Weights | Files | Script / Purpose |
| :--- | :--- | :--- | :--- |
| **Hind Siliguri** | 400, 500, 600, 700, 800 | `HindSiliguri-*.ttf` | Primary Bengali UI, Headers, Captions |
| **Noto Sans Bengali** | 400, 700, 800 | `NotoSansBengali-*.ttf` | Bengali Fallback, Complex Conjuncts |
| **Space Grotesk** | 400, 500, 600, 700 | `SpaceGrotesk.ttf` | Latin Headers, Numbers, Tool Titles |
| **JetBrains Mono** | 400, 500, 700 | `JetBrainsMono.ttf` | Code, URLs, Token Counters |

### Font Stack

Use the standard Bengali font stack in CSS and React:

```css
font-family: 'Hind Siliguri', 'Noto Sans Bengali', NotoSansBengali, sans-serif;
```

In TypeScript, import:

```typescript
import { BENGALI_FONT_STACK, SPACE_GROTESK, JETBRAINS_MONO } from '../fonts';
```

---

## 2. Text Shaping and Diacritic Rules

Bengali uses complex vowel signs (matras), conjuncts (যুক্তাক্ষর), and marks (reph র্, hasant ্).
Follow these rules to prevent broken glyphs and clipping:

1. **Letter Spacing**:
   - Always set `letter-spacing: normal !important`.
   - Never use tracking or non-zero letter spacing on Bengali text.
   - Non-zero letter spacing breaks conjuncts into detached letters.

2. **Line Height**:
   - Use `line-height: 1.35` to `1.40`.
   - Never set line height below `1.30`.
   - Low line height clips top reph (র্) and bottom vowel signs (ু, ূ, ৃ).

3. **Vertical Padding**:
   - Give text containers at least `8px` to `14px` top and bottom padding.
   - Do not use `overflow: hidden` on tight inline boxes.

4. **Font Features**:
   - Enable `font-feature-settings: "kern" 1, "liga" 1;`.
   - Enable `text-rendering: optimizeLegibility;`.

---

## 3. Safe Zones and Layout Boundaries

The video canvas is 9:16 vertical format (`1080 x 1920`).

| Stage | Y Range | Dimensions | Safe Margins |
| :--- | :--- | :--- | :--- |
| **Top Caption Region** | `y = 100` to `y = 260` | Width: `940px`, Height: `160px` | Left: `32px`, Right: `32px` |
| **Buffer Zone** | `y = 260` to `y = 320` | Height: `60px` | Clear space between caption and action |
| **Action Stage** | `y = 320` to `y = 1700` | Width: `896px`, Height: `1380px` | Left: `64px`, Right: `120px` |
| **Bottom UI Safe Zone** | `y = 1700` to `y = 1920` | Height: `220px` | Clear space for social media UI overlays |

---

## 4. Typography Presets

### Preset 1: Main Header

Use this preset for scene titles, question openers, and section changes.

- **Font**: `Hind Siliguri`, `Noto Sans Bengali`
- **Weight**: `700` (Bold)
- **Size**: `64px` to `76px` (Standard: `68px`)
- **Line Height**: `1.35`
- **Color Options**:
  - **Clean White Glow**: Color `#FFFFFF`, text shadow `0 0 20px rgba(255,255,255,0.45), 0 0 40px rgba(56,189,248,0.30)`.
  - **High-Contrast Gradient**: `linear-gradient(135deg, #FFFFFF 0%, #38BDF8 60%, #818CF8 100%)`.
- **CSS Class**: `.bengali-header-glow` or `.bengali-header-gradient`
- **React Component**: `<MainHeader variant="glow">...</MainHeader>`

### Preset 2: Tool Name Badge

Use this preset for software tool names, model versions, and website addresses.

- **Container**: Rounded pill (`borderRadius: 9999px`)
- **Background**: `rgba(30, 41, 59, 0.85)` with `backdrop-filter: blur(12px)`
- **Border**: `1.5px solid rgba(56, 189, 248, 0.35)`
- **Shadow**: `0 10px 28px -4px rgba(0, 0, 0, 0.50)`
- **Padding**: `12px 28px`
- **Tool Name**: `Space Grotesk`, `32px`, weight `700`, color `#F8FAFC`
- **URL / Tag**: `JetBrains Mono`, `20px`, weight `500`, color `#94A3B8`
- **CSS Class**: `.tool-badge-pill`
- **React Component**: `<ToolNameBadge name="OpenAI" url="openai.com" />`

### Preset 3: Feature Highlight Bullet / Tag

Use this preset for comparison metrics, token statistics, and bullet callouts.

- **Container**: Card with rounded corners (`borderRadius: 20px`)
- **Background**: `rgba(23, 35, 55, 0.85)` with `backdrop-filter: blur(10px)`
- **Border**: `1px solid rgba(255, 255, 255, 0.10)`
- **Accent Border**: `6px solid` on the left border:
  - Blue (`#38BDF8`): Standard info
  - Green (`#10B981`): Cost savings / token efficiency
  - Amber (`#F59E0B`): Important notice
  - Red (`#EF4444`): High cost / warning
- **Text**: `Hind Siliguri`, `34px`, weight `600`, line height `1.35`
- **Metric Value**: `JetBrains Mono`, `40px`, weight `800`
- **CSS Class**: `.feature-tag-bullet`
- **React Component**: `<FeatureHighlight label="বাংলা টোকেন" value="4x" variant="amber" />`

### Preset 4: Timed Top Captions

Use this preset for top captions in the safe zone (`y = 100` to `y = 260`).

- **Container**: Width up to `940px`, centered horizontally
- **Background**: `rgba(11, 15, 23, 0.90)` with `backdrop-filter: blur(12px)`
- **Border**: `1px solid rgba(56, 189, 248, 0.28)`
- **Radius**: `22px`
- **Padding**: `12px 28px`
- **Font**: `Hind Siliguri`, `40px`, weight `700`, line height `1.38`
- **Color States**:
  - **Active Spoken Word**: `#38BDF8` with cyan text glow (`0 0 14px rgba(56, 189, 248, 0.5)`)
  - **Completed Words**: `#F8FAFC` (pure high-contrast light slate)
  - **Upcoming Words**: `#94A3B8` (muted slate)
- **CSS Class**: `.top-caption-pill`
- **React Component**: `<TimedCaptions cues={...} mode="phrase" accent="#38BDF8" />`

---

## 5. Mobile Readability and Contrast Standards

1. **Background Contrast**:
   - Canvas background is `#0B0F17`.
   - Text color `#FFFFFF` or `#F8FAFC` yields a contrast ratio above `14:1`.
   - Cyan accent `#38BDF8` yields a contrast ratio above `8:1`.
   - This exceeds WCAG AAA requirements for mobile legibility.

2. **Mobile Scaling**:
   - Minimum font size on canvas is `20px` for URLs and tags.
   - Main body text and labels stay at or above `32px`.
   - Headers stay at `64px` to `76px`.
   - This guarantees readability on small mobile screens.
