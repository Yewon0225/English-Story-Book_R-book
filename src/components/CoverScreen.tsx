import React from 'react';
import { StoryIllustration } from './StoryIllustration';
import { soundEffects } from '../utils/audioService';

interface CoverScreenProps {
  onSelectMode: (mode: 'read' | 'roleplay' | 'review') => void;
  onPreviewSound?: () => void;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-md mx-auto p-3 sm:p-4 text-center select-none overflow-y-auto">
      {/* Main Title */}
      <div className="shrink-0 my-0.5 sm:my-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-fairytale tracking-tight drop-shadow-xs">
          The Big Red Apple
        </h1>
      </div>

      {/* Cover 3D Illustration Frame */}
      <div className="w-full my-1 sm:my-1.5 relative group shrink-0">
        <div className="relative bg-white p-1.5 sm:p-2 rounded-2xl shadow-md border-2 border-amber-200">
          <StoryIllustration pageNumber={0} className="h-44 sm:h-52 md:h-56 min-h-[170px]" />
        </div>
      </div>

      {/* Characters Meet Preview */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 my-1 text-[11px] sm:text-xs font-bold text-slate-700 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200 shadow-xs shrink-0">
        <span>🐷 Pinky</span>
        <span className="text-amber-300">·</span>
        <span>🐰 Toto</span>
        <span className="text-amber-300">·</span>
        <span>🐻 Buddy</span>
      </div>

      {/* 3 Core Learning Mode Buttons */}
      <div className="w-full flex flex-col gap-2 sm:gap-2.5 my-1 shrink-0">
        {/* Read Mode Button */}
        <button
          onClick={() => {
            soundEffects.click();
            onSelectMode('read');
          }}
          className="w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.98] text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-b-4 border-emerald-700"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl sm:text-2xl shadow-inner shrink-0">
              📖
            </div>
            <div className="text-base sm:text-lg font-bold font-fairytale tracking-wide text-left">
              Read Mode
            </div>
          </div>
          <span className="text-xs font-bold bg-white text-emerald-800 px-2.5 py-1 rounded-full shadow-xs shrink-0">
            Start ▶
          </span>
        </button>

        {/* Role-Play Mode Button */}
        <button
          onClick={() => {
            soundEffects.click();
            onSelectMode('roleplay');
          }}
          className="w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 active:scale-[0.98] text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-b-4 border-rose-700"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl sm:text-2xl shadow-inner shrink-0">
              🎭
            </div>
            <div className="text-base sm:text-lg font-bold font-fairytale tracking-wide text-left">
              Role-Play Mode
            </div>
          </div>
          <span className="text-xs font-bold bg-white text-pink-800 px-2.5 py-1 rounded-full shadow-xs shrink-0">
            Play ▶
          </span>
        </button>

        {/* Review Mode Button */}
        <button
          onClick={() => {
            soundEffects.click();
            onSelectMode('review');
          }}
          className="w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-b-4 border-amber-700"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl sm:text-2xl shadow-inner shrink-0">
              📝
            </div>
            <div className="text-base sm:text-lg font-bold font-fairytale tracking-wide text-left">
              Review Mode
            </div>
          </div>
          <span className="text-xs font-bold bg-white text-amber-900 px-2.5 py-1 rounded-full shadow-xs shrink-0">
            Review ▶
          </span>
        </button>
      </div>
    </div>
  );
};
