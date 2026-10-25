declare module 'fontkit' {
  export interface GlyphPosition {
    xAdvance: number;
  }
  export interface GlyphRun {
    positions: GlyphPosition[];
    advanceWidth: number;
  }
  export interface Font {
    unitsPerEm: number;
    layout(text: string): GlyphRun;
  }
  const fontkit: {openSync(path: string): Font};
  export default fontkit;
}

declare module 'ffprobe-static' {
  const path: string;
  export default path;
}
