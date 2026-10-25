import type { VideoLayout } from '../../shared/SceneStage';
import type { VisualEvent } from '../../shared/video-timeline';

/** Standard props accepted by every modular vertical scene component. */
export interface SceneProps {
  /** Scene or shot index in sequence */
  index?: number;
  /** Start frame in absolute timeline */
  start?: number;
  /** Total duration in frames for this scene */
  duration: number;
  /** Visual events scoped to this scene */
  events?: VisualEvent[];
  /** Video layout configuration specifying action stage and safe margins */
  layout?: VideoLayout;
  /** Optional custom title override */
  title?: string;
  /** Optional custom subtitle or tagline */
  subtitle?: string;
  /** Optional theme color override */
  accentColor?: string;
}

/** Metadata for each featured AI tool */
export interface ToolMetadata {
  id: string;
  number: string;
  name: string;
  tagline: string;
  category: string;
  website: string;
  accent: string;
}
