import React, { useEffect } from 'react';
import { soundEffects } from '../utils/audioService';
import confetti from 'canvas-confetti';
import { Sparkles, Star, Award, RotateCcw, Mic, BookOpen, Home } from 'lucide-react';
import { StoryIllustration } from './StoryIllustration';

interface ResultScreenProps {
  score?: number;
  onReadAgain: () => void;
  onRolePlay: () => void;
  onReview: () => void;
  onGoHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  score = 10,
  onReadAgain,
  onRolePlay,
  onReview,
  onGoHome,
}) => {
  useEffect(() => {
    soundEffects.fanfare();
    try {
      // Cheerful multi-burst confetti
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.6 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.6 },
        });
      }, 350);
    } catch {}
  }, []);

  return (
    <div className="flex flex-col items-center justify-between min-h-full w-full max-w-md mx-auto p-4 sm:p-6 text-center select-none">
      {/* Top Home Nav */}
      <div className="w-full flex justify-end">
        <button
          onClick={() => {
            soundEffects.click();
            onGoHome();
          }}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white px-2.5 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
      </div>

      {/* Main Heading with Shining Star Icon */}
      <div className="my-2 space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 shadow-md animate-bounce">
          <Star className="w-10 h-10 text-amber-500 fill-amber-400 drop-shadow-sm" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-fairytale tracking-tight">
          You finished the story!
        </h1>
        <p className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-4 py-1 rounded-full border border-emerald-200 inline-block">
          Good friends share together! 🍎
        </p>
      </div>

      {/* Happy Ending Illustration Banner */}
      <div className="w-full my-2 bg-white p-2 rounded-2xl shadow-sm border border-amber-200">
        <StoryIllustration pageNumber={10} className="h-44 sm:h-52" />
      </div>

      {/* Accomplishment Stars Badge */}
      <div className="flex items-center justify-center gap-1.5 my-2">
        {[1, 2, 3, 4, 5].map((starIdx) => (
          <Star
            key={starIdx}
            className="w-6 h-6 text-amber-400 fill-amber-400 drop-shadow-xs animate-pulse"
          />
        ))}
        <span className="ml-2 text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
          Super Reader! 🌟
        </span>
      </div>

      {/* Side-by-side action buttons: Read Again, Role-play, Review */}
      <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 my-4">
        {/* Read Again */}
        <button
          onClick={() => {
            soundEffects.click();
            onReadAgain();
          }}
          className="flex flex-col items-center justify-center p-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl shadow-md transition-all cursor-pointer border-b-4 border-emerald-800"
        >
          <RotateCcw className="w-5 h-5 mb-1" />
          <span className="text-xs sm:text-sm font-bold font-fairytale leading-tight text-center">
            Read Again
          </span>
        </button>

        {/* Role-play */}
        <button
          onClick={() => {
            soundEffects.click();
            onRolePlay();
          }}
          className="flex flex-col items-center justify-center p-3 bg-pink-600 hover:bg-pink-700 active:scale-95 text-white rounded-2xl shadow-md transition-all cursor-pointer border-b-4 border-rose-800"
        >
          <Mic className="w-5 h-5 mb-1" />
          <span className="text-xs sm:text-sm font-bold font-fairytale leading-tight text-center">
            Role-play
          </span>
        </button>

        {/* Review */}
        <button
          onClick={() => {
            soundEffects.click();
            onReview();
          }}
          className="flex flex-col items-center justify-center p-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-2xl shadow-md transition-all cursor-pointer border-b-4 border-amber-700"
        >
          <BookOpen className="w-5 h-5 mb-1" />
          <span className="text-xs sm:text-sm font-bold font-fairytale leading-tight text-center">
            Review
          </span>
        </button>
      </div>
    </div>
  );
};
