import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerRef } from '@remotion/player';
import { Viewport } from './components/Viewport';
import { Controls } from './components/Controls';
import { SCENES, PROJECT_METADATA } from './data/scenesData';
import { Download, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSec, setCurrentSec] = useState<number>(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state with Remotion Player frame events
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onFrameUpdate = (e: { detail: { frame: number } }) => {
      const frame = e.detail.frame;
      const sec = frame / 30;
      setCurrentSec(sec);

      const sceneIdx = SCENES.findIndex(
        (s) => frame >= s.start_frame && frame < s.end_frame
      );
      if (sceneIdx !== -1 && sceneIdx !== activeSceneIndex) {
        setActiveSceneIndex(sceneIdx);
      }
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    player.addEventListener('frameupdate', onFrameUpdate);
    player.addEventListener('play', onPlay);
    player.addEventListener('pause', onPause);

    return () => {
      player.removeEventListener('frameupdate', onFrameUpdate);
      player.removeEventListener('play', onPlay);
      player.removeEventListener('pause', onPause);
    };
  }, [activeSceneIndex]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    if (player.isPlaying()) {
      player.pause();
    } else {
      player.play();
    }
  }, []);

  // Seek handler
  const handleSeek = useCallback((time: number) => {
    const player = playerRef.current;
    if (!player) return;

    const targetFrame = Math.round(time * 30);
    player.seekTo(targetFrame);
    setCurrentSec(time);

    const idx = SCENES.findIndex(
      (s) => targetFrame >= s.start_frame && targetFrame < s.end_frame
    );
    if (idx !== -1) {
      setActiveSceneIndex(idx);
    }
  }, []);

  // Select scene
  const handleSelectScene = useCallback((index: number) => {
    const player = playerRef.current;
    if (!player || !SCENES[index]) return;

    const targetFrame = SCENES[index].start_frame;
    player.seekTo(targetFrame);
    setActiveSceneIndex(index);
    setCurrentSec(SCENES[index].start_time_sec);
  }, []);

  // Mute toggle
  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    if (isMuted) {
      player.unmute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  }, [isMuted]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn('Exit fullscreen failed:', err);
      });
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (activeSceneIndex < SCENES.length - 1) {
          handleSelectScene(activeSceneIndex + 1);
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (activeSceneIndex > 0) {
          handleSelectScene(activeSceneIndex - 1);
        }
      } else if (e.code === 'KeyM') {
        toggleMute();
      } else if (e.code === 'KeyS') {
        setSubtitlesEnabled((prev) => !prev);
      } else if (e.code === 'KeyF') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, handleSelectScene, toggleMute, toggleFullscreen, activeSceneIndex]);

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen bg-[#F1F5F9] text-slate-900 flex flex-col justify-between items-center p-4 select-none overflow-hidden"
    >
      {/* Outer Studio Top Bar */}
      <header className="w-full max-w-5xl flex justify-between items-center py-2.5 px-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm z-20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-wide truncate">
              {PROJECT_METADATA.title}
            </h1>
            <div className="flex items-center gap-2 text-[11px] font-mono-code text-slate-500">
              <span>VOICE: bn-BD</span>
              <span>•</span>
              <span className="text-blue-600 font-bold">30 FPS // 1080×1920 (9:16)</span>
            </div>
          </div>
        </div>

        {/* Actions & Keyboard shortcut tips */}
        <div className="flex items-center space-x-3">
          <a
            href="/rust-reels-9x16-v2.mp4"
            download="rust-reels-9x16-v2.mp4"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono-code text-xs font-bold shadow-md shadow-blue-500/20"
            title="Download Updated Reels Video (1080x1920 MP4)"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD V2 MP4</span>
          </a>

          <div className="hidden md:flex items-center space-x-2 text-xs font-mono-code text-slate-400">
            <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">
              [Space] Play
            </span>
            <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">
              [← / →] Switch Scenes
            </span>
          </div>
        </div>
      </header>

      {/* Centered Remotion Player Viewport */}
      <main className="flex-1 w-full flex justify-center items-center py-2 relative overflow-hidden">
        <Viewport
          playerRef={playerRef}
          subtitlesEnabled={subtitlesEnabled}
        />
      </main>

      {/* Docked Control Deck */}
      <footer className="w-full flex justify-center z-20">
        <Controls
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          currentSec={currentSec}
          totalSec={PROJECT_METADATA.total_duration_seconds}
          onSeek={handleSeek}
          activeSceneIndex={activeSceneIndex}
          scenes={SCENES}
          onSelectScene={handleSelectScene}
          subtitlesEnabled={subtitlesEnabled}
          onToggleSubtitles={() => setSubtitlesEnabled((prev) => !prev)}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onToggleFullscreen={toggleFullscreen}
        />
      </footer>
    </div>
  );
};
