/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { STORY_PAGES } from './data/storyData';
import { CoverScreen } from './components/CoverScreen';
import { ReadModeView } from './components/ReadModeView';
import { RolePlayModeView } from './components/RolePlayModeView';
import { ReviewModeView } from './components/ReviewModeView';
import { ResultScreen } from './components/ResultScreen';

export type AppMode = 'cover' | 'read' | 'roleplay' | 'review' | 'result';

export default function App() {
  const [mode, setMode] = useState<AppMode>('cover');
  const [lastQuizScore, setLastQuizScore] = useState<number>(10);

  const handleSelectMode = (newMode: 'read' | 'roleplay' | 'review') => {
    setMode(newMode);
  };

  const handleFinishStory = (score: number) => {
    setLastQuizScore(score);
    setMode('result');
  };

  const handleFinishRolePlay = () => {
    setMode('result');
  };

  const handleGoHome = () => {
    setMode('cover');
  };

  return (
    <main className="min-h-screen h-full w-full bg-[#fcf8ed] flex flex-col items-center justify-center p-0 sm:p-2 md:p-4 text-slate-800 overflow-y-auto sm:overflow-hidden">
      {/* Mobile/Tablet/Notebook Picture-Book App Shell */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl h-full sm:h-[860px] max-h-[100dvh] sm:max-h-[96vh] bg-[#fffdf7] rounded-none sm:rounded-3xl shadow-xl sm:border-4 border-amber-200/80 flex flex-col relative overflow-hidden">
        {/* Top App Header with 'R-book' Logo */}
        <header className="w-full shrink-0 flex items-center justify-center px-4 py-2 sm:py-2.5 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white shadow-sm z-10 select-none">
          <div
            onClick={handleGoHome}
            className="flex items-center gap-2 cursor-pointer hover:opacity-95 transition-opacity"
            title="R-Book: Home"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 flex items-center justify-center text-base sm:text-lg shadow-inner">
              📖
            </div>
            <span className="text-lg sm:text-xl font-black tracking-tight font-fairytale drop-shadow-xs">
              R-Book
            </span>
          </div>
        </header>

        {/* Dynamic Mode Screens */}
        <div className="flex-1 flex flex-col h-full w-full overflow-hidden min-h-0">
          {mode === 'cover' && (
            <CoverScreen onSelectMode={handleSelectMode} />
          )}

          {mode === 'read' && (
            <ReadModeView
              pages={STORY_PAGES}
              onFinishStory={handleFinishStory}
              onGoHome={handleGoHome}
            />
          )}

          {mode === 'roleplay' && (
            <RolePlayModeView
              pages={STORY_PAGES}
              initialCharacter="pinky"
              onFinishRolePlay={handleFinishRolePlay}
              onGoHome={handleGoHome}
            />
          )}

          {mode === 'review' && (
            <ReviewModeView onClose={handleGoHome} />
          )}

          {mode === 'result' && (
            <ResultScreen
              score={lastQuizScore}
              onReadAgain={() => setMode('read')}
              onRolePlay={() => setMode('roleplay')}
              onReview={() => setMode('review')}
              onGoHome={handleGoHome}
            />
          )}
        </div>
      </div>
    </main>
  );
}
