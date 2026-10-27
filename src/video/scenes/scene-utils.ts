import {VisualEvent} from '../../shared/video-timeline';

export interface SceneProps {
  startFrame: number;
  endFrame: number;
  events: VisualEvent[];
}

export const getEvent = (events: VisualEvent[], id: string): VisualEvent => {
  const found = events.find((e) => e.id === id);
  return found ?? {id, startFrame: 0, endFrame: 1};
};

export const PHILOSOPHERS = [
  {id: 'P1', name: 'Philosopher 1', color: '#0284C7', glow: 'rgba(2, 132, 199, 0.2)', angle: -90},
  {id: 'P2', name: 'Philosopher 2', color: '#059669', glow: 'rgba(5, 150, 105, 0.2)', angle: -18},
  {id: 'P3', name: 'Philosopher 3', color: '#7C3AED', glow: 'rgba(124, 58, 237, 0.2)', angle: 54},
  {id: 'P4', name: 'Philosopher 4', color: '#D97706', glow: 'rgba(217, 119, 6, 0.2)', angle: 126},
  {id: 'P5', name: 'Philosopher 5', color: '#E11D48', glow: 'rgba(225, 29, 72, 0.2)', angle: 198},
];
