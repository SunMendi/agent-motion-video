import {continueRender, delayRender, staticFile} from 'remotion';

export const FONT_FAMILY = 'NotoSansBengali';

const FACES: Array<{file: string; weight: '400' | '700'}> = [
  {file: 'fonts/NotoSansBengali-Regular.ttf', weight: '400'},
  {file: 'fonts/NotoSansBengali-Bold.ttf', weight: '700'},
];

const started = new Set<string>();

/** Load the Bangla font before the first frame is drawn. */
export const ensureFonts = (): void => {
  if (typeof document === 'undefined') return;
  for (const face of FACES) {
    if (started.has(face.file)) continue;
    started.add(face.file);
    const handle = delayRender(`load ${face.file}`);
    const fontFace = new FontFace(FONT_FAMILY, `url(${staticFile(face.file)})`, {weight: face.weight});
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
