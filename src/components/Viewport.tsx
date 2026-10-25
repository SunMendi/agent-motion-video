import React, { useState, useEffect, useRef } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { RustReelsVideo } from '../RustReelsVideo';
import { CLEAN_LIGHT_THEME } from '../themes/videoTheme';

interface ViewportProps {
  playerRef: React.RefObject<PlayerRef | null>;
  subtitlesEnabled?: boolean;
}

export const Viewport: React.FC<ViewportProps> = ({ playerRef, subtitlesEnabled = true }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState<number>(0.4);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const parentH = containerRef.current.clientHeight || window.innerHeight * 0.75;
        const parentW = containerRef.current.clientWidth || window.innerWidth * 0.9;
        const scaleH = (parentH - 40) / 1920;
        const scaleW = (parentW - 40) / 1080;
        setScale(Math.max(0.2, Math.min(scaleH, scaleW, 0.65)));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
    >
      {/* 1080x1920 Phone Canvas Container */}
      <div
        style={{
          width: 1080,
          height: 1920,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flexShrink: 0,
          borderRadius: 48,
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.25), 0 0 0 12px #0F172A',
        }}
        className="relative bg-[#F8F9FA] flex items-center justify-center"
      >
        <Player
          ref={playerRef}
          component={RustReelsVideo}
          durationInFrames={3696}
          compositionWidth={1080}
          compositionHeight={1920}
          fps={30}
          inputProps={{
            theme: CLEAN_LIGHT_THEME,
            showSubtitles: subtitlesEnabled,
          }}
          controls={false}
          loop
          autoPlay={false}
          style={{
            width: 1080,
            height: 1920,
          }}
        />
      </div>
    </div>
  );
};
