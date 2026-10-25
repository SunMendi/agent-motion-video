export interface WordTiming {
  w: string;
  s: number; // seconds
  e: number; // seconds
}

export interface SoundCue {
  type: 'click' | 'whoosh' | 'pop' | 'impact';
  frame: number; // relative to scene start
  volume?: number;
}

export interface AnimationEvent {
  frame: number;
  name: string;
}

export interface Scene {
  scene_number: number;
  scene_id: string;
  time_range: string;
  start_time_sec: number;
  end_time_sec: number;
  duration_sec: number;
  start_frame: number;
  end_frame: number;
  duration_frames: number;
  voiceover_line: string;
  words?: WordTiming[];
  headline_bn?: string;
  category_label?: string;
  sound_cues?: SoundCue[];
  animation_events?: AnimationEvent[];
  visual_concept?: string;
  visual_method?: 'Pure Code' | 'Vector SVG';
  badge?: string;
}

export interface ProjectMetadata {
  title: string;
  audio_source: string;
  language: string;
  aspect_ratio: string;
  resolution: {
    width: number;
    height: number;
  };
  fps: number;
  total_duration_seconds: number;
  total_duration_frames: number;
  total_duration_formatted: string;
  total_scenes: number;
}
