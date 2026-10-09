import React from 'react';
import { StoryIllustration } from './StoryIllustration';
import { soundEffects } from '../utils/audioService';

interface CoverScreenProps {
  onSelectMode: (mode: 'read' | 'roleplay' | 'review') => void;
  onPreviewSound?: () => void;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-full w-full max-w-md mx-auto p-4 sm:p-5 text-center select-none">
      {/* Main Title */}
      <div className="my-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-950 font-fairytale tracking-tight drop-shadow-xs">
          The Big Red Apple
        </h1>
      </div>

      {/* Cover 3D Illustration Frame */}
      <div className="w-full my-2 relative group">
        <div className="relative bg-white p-2 rounded-2xl shadow-md border-2 border-amber-200">
          <StoryIllustration pageNumber={0} className="h-56 sm:h-64" />
        </div>
      </div>

      {/* Characters Meet Preview */}
      <div className="flex items-center justify-center gap-4 my-2 text-xs font-bold text-slate-700 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200 shadow-xs">
        <span>🐷 Pinky</span>
        <span className="text-amber-300">·</span>
        <span>🐰 Toto</span>
        <span className="text-amber-300">·</span>
        <span>🐻 Buddy</span>
      </div>

      {/* 3 Core Learning Mode Buttons */}
      <div className="w-full flex flex-col gap-3 my-2">
        {/* Read Mode Button */}
        <button
          onClick={() => {
            soundEffects.click();
            onSelectMode('read');
          }}
          className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.98] text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-b-4 border-emerald-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              📖
            </div>
            <div className="text-lg font-bold font-fairytale tracking-wide">
              Read Mode
            </div>
          </div>
          <span className="text-xs font-bold bg-white text-emerald-800 px-3 py-1 rounded-full shadow-xs">
            Start ▶
          </span>
        </button>

        {/* Role-Play Mode Button */}
        <button
          onClick={() => {
            soundEffects.click();
            onSelectMode('roleplay');
          }}
          className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 active:scale-[0.98] text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-b-4 border-rose-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              🎭
            </div>
            <div className="text-lg font-bold font-fairytale tracking-wide">
              Role-Play Mode
            </div>
          </div>
          <span className="text-xs font-bold bg-white text-pink-800 px-3 py-1 rounded-full shadow-xs">
            Play ▶
          </span>
        </button>

        {/* Review Mode Button */}
        <button
          onClick={() => {
            soundEffects.click();
            onSelectMode('review');
          }}
          className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-b-4 border-amber-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              📝
            </div>
            <div className="text-lg font-bold font-fairytale tracking-wide">
              Review Mode
            </div>
          </div>
          <span className="text-xs font-bold bg-white text-amber-900 px-3 py-1 rounded-full shadow-xs">
            Review ▶
          </span>
        </button>
      </div>
    </div>
  );
};
