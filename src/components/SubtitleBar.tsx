import React from 'react';

interface SubtitleBarProps {
  text: string;
  visible?: boolean;
}

export const SubtitleBar: React.FC<SubtitleBarProps> = ({ text, visible = true }) => {
  if (!visible || !text) return null;

  return (
    <div className="absolute bottom-[220px] left-8 right-8 z-50 pointer-events-none flex flex-col items-center justify-center">
      <div className="max-w-[940px] px-8 py-5 rounded-[32px] bg-white/95 border border-slate-200/90 shadow-xl text-center">
        <p className="font-bengali text-4xl font-extrabold text-slate-900 leading-snug">
          {text}
        </p>
      </div>
    </div>
  );
};
