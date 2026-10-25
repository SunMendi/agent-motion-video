import {continueRender, delayRender, staticFile} from 'remotion';

// Authentic Font Families loaded from local bundled files
export const HIND_SILIGURI = "'Hind Siliguri', 'Noto Sans Bengali', 'NotoSansBengali', sans-serif";
export const BENGALI_FONT_STACK = "'Hind Siliguri', 'Noto Sans Bengali', 'NotoSansBengali', sans-serif";
export const SPACE_GROTESK = "'Space Grotesk', sans-serif";
export const JETBRAINS_MONO = "'JetBrains Mono', monospace";
export const FONT_FAMILY = 'NotoSansBengali';

export interface LocalFontFace {
  family: string;
  file: string;
  weight: string;
  style?: string;
}

export const ALL_FONT_FACES: LocalFontFace[] = [
  // Legacy Bangla Font Face Names
  {family: 'NotoSansBengali', file: 'fonts/NotoSansBengali-Regular.ttf', weight: '400'},
  {family: 'NotoSansBengali', file: 'fonts/NotoSansBengali-Bold.ttf', weight: '700'},
  {family: 'NotoSansBengali', file: 'fonts/NotoSansBengali-Bold.ttf', weight: '800'},
  // Standard CSS Font Face Names (with spaces)
  {family: 'Noto Sans Bengali', file: 'fonts/NotoSansBengali-Regular.ttf', weight: '400'},
  {family: 'Noto Sans Bengali', file: 'fonts/NotoSansBengali-Bold.ttf', weight: '700'},
  {family: 'Noto Sans Bengali', file: 'fonts/NotoSansBengali-Bold.ttf', weight: '800'},
  // Hind Siliguri (Bangla)
  {family: 'Hind Siliguri', file: 'fonts/HindSiliguri-Regular.ttf', weight: '400'},
  {family: 'Hind Siliguri', file: 'fonts/HindSiliguri-Medium.ttf', weight: '500'},
  {family: 'Hind Siliguri', file: 'fonts/HindSiliguri-SemiBold.ttf', weight: '600'},
  {family: 'Hind Siliguri', file: 'fonts/HindSiliguri-Bold.ttf', weight: '700'},
  {family: 'Hind Siliguri', file: 'fonts/HindSiliguri-Bold.ttf', weight: '800'}, // Avoid synthetic bold by using authentic bold 700
  // Space Grotesk (Latin)
  {family: 'Space Grotesk', file: 'fonts/SpaceGrotesk.ttf', weight: '400'},
  {family: 'Space Grotesk', file: 'fonts/SpaceGrotesk.ttf', weight: '500'},
  {family: 'Space Grotesk', file: 'fonts/SpaceGrotesk.ttf', weight: '600'},
  {family: 'Space Grotesk', file: 'fonts/SpaceGrotesk.ttf', weight: '700'},
  // JetBrains Mono (Code)
  {family: 'JetBrains Mono', file: 'fonts/JetBrainsMono.ttf', weight: '400'},
  {family: 'JetBrains Mono', file: 'fonts/JetBrainsMono.ttf', weight: '500'},
  {family: 'JetBrains Mono', file: 'fonts/JetBrainsMono.ttf', weight: '700'},
];

const started = new Set<string>();

/** Load all locally bundled font files before rendering frames. */
export const ensureFonts = (): void => {
  if (typeof document === 'undefined') return;
  for (const face of ALL_FONT_FACES) {
    const key = `${face.family}-${face.weight}`;
    if (started.has(key)) continue;
    started.add(key);
    const handle = delayRender(`load font ${key}`);
    const fontFace = new FontFace(
      face.family,
      `url(${staticFile(face.file)})`,
      {weight: face.weight, style: face.style ?? 'normal'}
    );
    fontFace
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        continueRender(handle);
      })
      .catch((err: unknown) => {
        console.error(`font failed to load: ${face.file}`, err);
        continueRender(handle);
      });
  }
};
