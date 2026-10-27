import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {TimedCaptions} from '../shared/TimedCaptions';
import {TimelineAudio} from '../shared/TimelineAudio';
import {VIDEO_LAYOUT} from '../shared/SceneStage';
import type {CompiledTimeline} from '../shared/video-timeline';
import timelineData from '../../work/current/timeline.compiled.json';
import {
  Scene01BanquetRiddle,
  Scene02OsDeadlockReveal,
  Scene03TopologySetup,
  Scene04TwoSticksConstraint,
  Scene05SimultaneousPickup,
  Scene06DeadlockClimax,
  Scene07Starvation,
  Scene08ConcurrencyControl,
  Scene09SemaphoreCta,
} from './scenes';

const timeline = timelineData as unknown as CompiledTimeline;

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill className="bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans select-none">
      {/* Background clean minimal atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 30%, #FFFFFF 0%, #F8FAFC 60%, #F1F5F9 100%)',
        }}
      />

      {/* Shot Sequences with SceneStage inside each scene */}
      <Sequence from={0} durationInFrames={210} name="shot-01">
        <Scene01BanquetRiddle startFrame={0} endFrame={210} events={timeline.events} />
      </Sequence>

      <Sequence from={210} durationInFrames={174} name="shot-02">
        <Scene02OsDeadlockReveal startFrame={210} endFrame={384} events={timeline.events} />
      </Sequence>

      <Sequence from={384} durationInFrames={366} name="shot-03">
        <Scene03TopologySetup startFrame={384} endFrame={750} events={timeline.events} />
      </Sequence>

      <Sequence from={750} durationInFrames={185} name="shot-04">
        <Scene04TwoSticksConstraint startFrame={750} endFrame={935} events={timeline.events} />
      </Sequence>

      <Sequence from={935} durationInFrames={240} name="shot-05">
        <Scene05SimultaneousPickup startFrame={935} endFrame={1175} events={timeline.events} />
      </Sequence>

      <Sequence from={1175} durationInFrames={345} name="shot-06">
        <Scene06DeadlockClimax startFrame={1175} endFrame={1520} events={timeline.events} />
      </Sequence>

      <Sequence from={1520} durationInFrames={375} name="shot-07">
        <Scene07Starvation startFrame={1520} endFrame={1895} events={timeline.events} />
      </Sequence>

      <Sequence from={1895} durationInFrames={330} name="shot-08">
        <Scene08ConcurrencyControl startFrame={1895} endFrame={2225} events={timeline.events} />
      </Sequence>

      <Sequence from={2225} durationInFrames={210} name="shot-09">
        <Scene09SemaphoreCta startFrame={2225} endFrame={2435} events={timeline.events} />
      </Sequence>

      {/* Top Captions - High Contrast Glassmorphic Container with Bengali font */}
      <TimedCaptions
        cues={timeline.captions}
        layout={VIDEO_LAYOUT}
        accent="#38BDF8"
        mode={timeline.captionMode}
        highlightTerms={[
          'দার্শনিক',
          'ডেডলক',
          'Deadlock',
          'Starvation',
          'Concurrency Control',
          'Semaphore',
          'কাঠি',
          'P1',
          'P2',
          'P3',
          'P4',
          'P5',
          'Part 2',
        ]}
      />

      {/* Master Audio Track */}
      <TimelineAudio
        timeline={timeline}
        voice="current/os_audio.mp3"
        soundEffects={true}
        voiceVolume={1.2}
      />
    </AbsoluteFill>
  );
};
