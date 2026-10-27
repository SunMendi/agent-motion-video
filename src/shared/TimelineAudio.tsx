import React from 'react';
import {Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {musicGainAtFrame, type CompiledTimeline} from './video-timeline';

/** Mount once at composition level; pass paths relative to public/ and respect the brief. */
export const TimelineAudio: React.FC<{
  timeline: CompiledTimeline;
  voice: string;
  music?: string;
  soundEffects?: boolean;
  voiceVolume?: number;
}> = ({timeline, voice, music, soundEffects = true, voiceVolume = 1.15}) => {
  const {fps} = useVideoConfig();
  return (
    <>
      <Audio src={staticFile(voice.replace(/^public\//, ''))} volume={voiceVolume} />
      {music ? <Audio src={staticFile(music.replace(/^public\//, ''))} loop loopVolumeCurveBehavior="extend" volume={(frame) => musicGainAtFrame(timeline.captions, frame, fps)} /> : null}
      {soundEffects ? timeline.soundCues.map((cue, index) => (
        <Sequence key={`${cue.file}-${index}`} from={cue.startFrame} durationInFrames={cue.duration_frames} layout="none">
          <Audio src={staticFile(cue.file.replace(/^public\//, ''))} volume={(frame) => {
            const fade = cue.fade_out_frames ?? 0;
            return cue.gain * (fade ? Math.max(0, Math.min(1, (cue.duration_frames - 1 - frame) / fade)) : 1);
          }} />
        </Sequence>
      )) : null}
    </>
  );
};
