export interface CaptionCue {
  id: string;
  text: string;
  startFrame: number;
  endFrame: number;
}

export interface VisualEvent {
  id: string;
  startFrame: number;
  endFrame: number;
}

export interface CompiledSoundCue {
  file: string;
  startFrame: number;
  duration_frames: number;
  gain: number;
  fade_out_frames?: number;
}

export interface CompiledTimeline {
  fps: number;
  durationInFrames: number;
  captionMode: 'word' | 'phrase';
  captions: CaptionCue[];
  events: VisualEvent[];
  soundCues: CompiledSoundCue[];
}

/** Returns no page during silence instead of falling back to the first spoken words. */
export const captionPageAtFrame = (cues: CaptionCue[], frame: number, pageSize = 5) => {
  const activeIndex = cues.findIndex((cue) => frame >= cue.startFrame && frame < cue.endFrame);
  if (activeIndex < 0) return {cues: [], activeId: null};
  const start = Math.floor(activeIndex / pageSize) * pageSize;
  return {cues: cues.slice(start, start + pageSize), activeId: cues[activeIndex].id};
};

/** Absolute timeline frames; scene-local callers must add their Sequence start frame. */
export const eventProgress = (event: VisualEvent, absoluteFrame: number) =>
  Math.max(0, Math.min(1, (absoluteFrame - event.startFrame) / Math.max(1, event.endFrame - event.startFrame - 1)));

/** Smoothed speech ducking, with anticipation and release rather than gap pumping. */
export const musicGainAtFrame = (cues: CaptionCue[], frame: number, fps: number, baseGain = 0.1, speechGain = 0.035) => {
  const attack = Math.max(1, Math.round(fps * 0.12));
  const release = Math.max(1, Math.round(fps * 0.3));
  let activity = 0;
  for (const cue of cues) {
    const envelope = frame < cue.startFrame
      ? 1 - (cue.startFrame - frame) / attack
      : frame < cue.endFrame ? 1 : 1 - (frame - cue.endFrame) / release;
    activity = Math.max(activity, Math.max(0, Math.min(1, envelope)));
  }
  return baseGain + (speechGain - baseGain) * activity;
};
