import React, {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {CaptionRegion, VIDEO_LAYOUT, type VideoLayout} from './SceneStage';
import {captionPageAtFrame, type CaptionCue} from './video-timeline';

/** Mount once at composition level; cue frames are absolute. No CSS animation timing. */
export const TimedCaptions: React.FC<{
  cues: CaptionCue[];
  layout?: VideoLayout;
  accent?: string;
  mode?: 'word' | 'phrase';
  highlightTerms?: string[];
}> = ({cues, layout = VIDEO_LAYOUT, accent = '#38BDF8', mode = 'word', highlightTerms = []}) => {
  const [fontHandle] = useState(() => delayRender('Load shared caption font'));
  const {captionFamily, captionFile, captionWeight} = layout.typography;
  useEffect(() => {
    const family = captionFamily.split(',')[0].trim().replace(/['"]/g, '');
    const face = new FontFace(family, `url(${staticFile(captionFile)})`, {weight: String(captionWeight)});
    face.load().then((loaded) => {
      const fontSet = document.fonts as typeof document.fonts & {add(face: FontFace): unknown};
      fontSet.add(loaded);
      continueRender(fontHandle);
    }).catch((error: unknown) => cancelRender(error));
  }, [captionFamily, captionFile, captionWeight, fontHandle]);
  const frame = useCurrentFrame();
  const page = captionPageAtFrame(cues, frame, mode === 'phrase' ? 1 : 5);
  if (!page.cues.length) return null;
  const first = page.cues[0];
  const fade = Math.max(0, Math.min(1, (frame - first.startFrame) / 5));
  const emphasized = (word: string) => highlightTerms.some((term) =>
    word.normalize('NFC').replace(/[^\p{L}\p{M}\p{N}]/gu, '').includes(term.normalize('NFC')),
  );
  const words = first.text.trim().split(/\s+/u);
  let highlighted = false;
  return (
    <CaptionRegion layout={layout}>
      <div
        style={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          columnGap: '16px',
          rowGap: '6px',
          maxWidth: 980,
          padding: '10px 28px',
          borderRadius: 20,
          backgroundColor: 'rgba(5, 7, 12, 0.72)',
          backdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)',
          color: '#FFFFFF',
          fontSize: 50,
          lineHeight: 1.3,
          textAlign: 'center',
          opacity: fade,
          fontFamily: captionFamily,
          fontWeight: 800,
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.95), 0 0 20px rgba(0, 0, 0, 0.9)',
        }}
      >
        {mode === 'phrase' ? words.map((word, index) => {
          const highlight = !highlighted && emphasized(word);
          if (highlight) highlighted = true;
          return (
            <span
              key={`${first.id}-${index}`}
              style={{
                color: highlight ? '#FACC15' : '#FFFFFF',
                textShadow: highlight
                  ? '0 0 24px rgba(250, 204, 21, 0.9), 0 2px 8px #000'
                  : '0 2px 10px rgba(0, 0, 0, 0.95)',
                fontWeight: 900,
                display: 'inline-block',
                transform: highlight ? 'scale(1.06)' : undefined,
              }}
            >
              {word}
            </span>
          );
        }) : page.cues.map((cue, index) => {
          const isActive = cue.id === page.activeId;
          const isSpoken = cue.endFrame <= frame;
          return (
            <React.Fragment key={cue.id}>
              {index ? ' ' : null}
              <span
                style={{
                  color: isActive ? accent : isSpoken ? '#F8FAFC' : '#94A3B8',
                  textShadow: isActive ? `0 0 14px ${accent}80` : undefined,
                  fontWeight: isActive ? 700 : isSpoken ? 700 : 600,
                }}
              >
                {cue.text}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </CaptionRegion>
  );
};
