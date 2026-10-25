import React from 'react';
import type { VisualEvent } from '../shared/video-timeline';
import {
  SceneIntro,
  SceneNapkin,
  SceneGamma,
  ScenePerplexity,
  SceneNotebook,
  SceneAdobePodcast,
  SceneOutro,
} from './scenes';

export interface VisualSceneProps {
  index: number;
  start: number;
  duration: number;
  events: VisualEvent[];
}

/**
 * Modular Scene Router for 9:16 Vertical Showcase.
 * Connects timeline shots directly to isolated, modular scene components.
 */
export const VisualScene: React.FC<VisualSceneProps> = ({
  index,
  start,
  duration,
  events,
}) => {
  switch (index) {
    case 0:
      return <SceneIntro index={0} start={start} duration={duration} events={events} />;
    case 1:
      return <SceneNapkin index={1} start={start} duration={duration} events={events} />;
    case 2:
      return <SceneGamma index={2} start={start} duration={duration} events={events} />;
    case 3:
      return <ScenePerplexity index={3} start={start} duration={duration} events={events} />;
    case 4:
      return <SceneNotebook index={4} start={start} duration={duration} events={events} />;
    case 5:
      return <SceneAdobePodcast index={5} start={start} duration={duration} events={events} />;
    case 6:
    default:
      return <SceneOutro index={index} start={start} duration={duration} events={events} />;
  }
};
