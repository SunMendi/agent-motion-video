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
  const phrase = first.text.split(/(\s+)/u);
  let highlighted = false;
  return (
    <CaptionRegion layout={layout}>
      <div
        style={{
          maxWidth: 930,
          padding: '12px 28px',
          borderRadius: 22,
          backgroundColor: 'rgba(11, 15, 23, 0.88)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(56, 189, 248, 0.28)',
          boxShadow: '0 10px 32px rgba(0, 0, 0, 0.45)',
          color: '#F8FAFC',
          fontSize: 40,
          lineHeight: 1.38,
          letterSpacing: 'normal',
          textRendering: 'optimizeLegibility',
          textAlign: 'center',
          opacity: fade,
          fontFamily: captionFamily,
          fontWeight: 700,
        }}
      >
        {mode === 'phrase' ? phrase.map((part, index) => {
          if (/^\s+$/u.test(part)) return <React.Fragment key={`${first.id}-${index}`}>{part}</React.Fragment>;
          const highlight = !highlighted && emphasized(part);
          if (highlight) highlighted = true;
          return (
            <span
              key={`${first.id}-${index}`}
              style={{
                color: highlight ? accent : '#F8FAFC',
                textShadow: highlight ? `0 0 14px ${accent}80` : undefined,
                fontWeight: 700,
              }}
            >
              {part}
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
