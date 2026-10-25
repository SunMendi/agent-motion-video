import React from 'react';
import { Audio, staticFile, useCurrentFrame, Sequence } from 'remotion';
import { SCENES } from '../../data/scenesData';

import duckingEnvelopeData from '../../data/duckingEnvelope.json';

interface AudioMixerProps {
  totalDurationFrames: number;
}

export const AudioMixer: React.FC<AudioMixerProps> = () => {
  const frame = useCurrentFrame();

  // True Speech-Aware Ducking Envelope:
  // Derived from exact vocal RMS energy analysis of public/audio/rust.wav.
  // Ducks to ~0.038 during speech, recovers to ~0.10 during natural vocal pauses.
  const bgmVolume = (duckingEnvelopeData as number[])[frame] ?? 0.045;

  return (
    <>
      {/* 1. Master Voiceover Track (0 dB reference) */}
      <Audio
        src={staticFile('audio/rust.wav')}
        volume={1.0}
      />

      {/* 2. Full 123.2s Lo-Fi Ambient Music Bed */}
      <Audio
        src={staticFile('audio/rust.music.wav')}
        volume={bgmVolume}
      />

      {/* 3. Timed Sound Effects (Clicks, Whooshes, Pops, Impacts) */}
      {SCENES.map((scene) => {
        if (!scene.sound_cues || scene.sound_cues.length === 0) return null;

        return scene.sound_cues.map((cue, idx) => {
          const cueFrame = scene.start_frame + cue.frame;
          const sfxFile = `audio/rust-${cue.type}.wav`;

          return (
            <Sequence
              key={`sfx-${scene.scene_id}-${idx}`}
              from={cueFrame}
              durationInFrames={15}
              name={`sfx-${cue.type}-${scene.scene_number}`}
            >
              <Audio
                src={staticFile(sfxFile)}
                volume={cue.volume ?? 0.25}
              />
            </Sequence>
          );
        });
      })}
    </>
  );
};
