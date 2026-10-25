import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Subtitles,
  Volume2,
  VolumeX,
  Maximize2,
} from 'lucide-react';
import { Scene } from '../types/scene';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentSec: number;
  totalSec: number;
  onSeek: (time: number) => void;
  activeSceneIndex: number;
  scenes: Scene[];
  onSelectScene: (index: number) => void;
  subtitlesEnabled: boolean;
  onToggleSubtitles: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onTogglePlay,
  currentSec,
  totalSec,
  onSeek,
  activeSceneIndex,
  scenes,
  onSelectScene,
  subtitlesEnabled,
  onToggleSubtitles,
  isMuted,
  onToggleMute,
  onToggleFullscreen,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePrev = () => {
    if (activeSceneIndex > 0) {
      onSelectScene(activeSceneIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeSceneIndex < scenes.length - 1) {
      onSelectScene(activeSceneIndex + 1);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-4 shadow-xl flex flex-col gap-3 text-slate-800">
      {/* Top Timeline Scrubber */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-xs font-mono-code text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-slate-900 font-bold">
              SCENE {activeSceneIndex + 1} / {scenes.length}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-blue-600 font-semibold">
              {scenes[activeSceneIndex]?.headline_bn || scenes[activeSceneIndex]?.scene_id.toUpperCase()}
            </span>
          </div>

          <div className="font-bold text-slate-700">
            {formatTime(currentSec)} / {formatTime(totalSec)}
          </div>
        </div>

        {/* Custom Scrubber Input */}
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={totalSec}
            step={0.1}
            value={currentSec}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500"
          />

          {/* Scene cut tick marks */}
          <div className="absolute inset-x-0 h-2 pointer-events-none flex">
            {scenes.map((s) => (
              <div
                key={s.scene_number}
                style={{ left: `${(s.start_time_sec / totalSec) * 100}%` }}
                className="absolute top-0 bottom-0 w-[1px] bg-slate-400/40"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Button Toolbar */}
      <div className="flex justify-between items-center">
        {/* Playback navigation buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={activeSceneIndex === 0}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
            title="Previous Scene (ArrowLeft)"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={onTogglePlay}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 shadow-md shadow-blue-500/20"
            title="Play / Pause (Space)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span className="text-xs font-mono-code font-black">PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span className="text-xs font-mono-code font-black">PLAY</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={activeSceneIndex === scenes.length - 1}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
            title="Next Scene (ArrowRight)"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Scene quick selection pills */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto max-w-md py-1">
          {scenes.map((s, idx) => (
            <button
              key={s.scene_number}
              onClick={() => onSelectScene(idx)}
              className={`px-2 py-1 rounded-md text-[10px] font-mono-code ${
                activeSceneIndex === idx
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {s.scene_number.toString().padStart(2, '0')}
            </button>
          ))}
        </div>

        {/* Utility buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSubtitles}
            className={`p-2.5 rounded-xl border ${
              subtitlesEnabled
                ? 'bg-blue-50 border-blue-200 text-blue-600 font-bold'
                : 'bg-slate-100 border-transparent text-slate-500'
            }`}
            title="Toggle Subtitles"
          >
            <Subtitles className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleMute}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
            title="Mute / Unmute Audio"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <button
            onClick={onToggleFullscreen}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
