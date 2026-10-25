import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {ensureFonts, HIND_SILIGURI} from '../fonts';
import {SceneStage} from '../shared/SceneStage';
import {TimedCaptions} from '../shared/TimedCaptions';
import {TimelineAudio} from '../shared/TimelineAudio';
import {type CompiledTimeline} from '../shared/video-timeline';
import timelineJson from '../../work/current/timeline.compiled.json';
import {VisualScene} from './VisualScenes';

const timeline = timelineJson as unknown as CompiledTimeline & {shots: Array<{id: string; start_frame: number; end_frame: number}>};

export const MainVideo: React.FC = () => {
  ensureFonts();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0B0F17',
        fontFamily: HIND_SILIGURI,
      }}
      className="text-slate-100 flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.08) 0%, transparent 80%), linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 48px 48px, 48px 48px',
        }}
      />

      {/* Synchronized Timeline Audio (Voice, Ducked Music Bed, Event SFX) */}
      <TimelineAudio
        timeline={timeline}
        voice="public/current/freeaai.wav"
        music="public/audio/music-bed.mp3"
        soundEffects={true}
      />

      {/* Top Karaoke Captions */}
      <TimedCaptions
        cues={timeline.captions}
        mode="phrase"
        accent="#38BDF8"
        highlightTerms={['টুল', 'Napkin', 'Gamma', 'Perplexity', 'NotebookLM', 'Adobe', 'Podcast', 'এআই', 'ফ্রি', 'ভিজুয়াল', 'প্রেজেন্টেশন', 'নোটবুক', 'পিডিএফ']}
      />

      {/* Timed Shots */}
      {timeline.shots.map((shot, index) => {
        const shotEvents = timeline.events.filter(
          (e) => e.startFrame >= shot.start_frame && e.startFrame < shot.end_frame,
        );
        return (
          <Sequence
            key={shot.id}
            from={shot.start_frame}
            durationInFrames={shot.end_frame - shot.start_frame}
          >
            <SceneStage>
              <VisualScene index={index} start={shot.start_frame} duration={shot.end_frame-shot.start_frame} events={shotEvents} />
            </SceneStage>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
