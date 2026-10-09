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
    <main className="min-h-screen w-full bg-[#fcf8ed] flex flex-col items-center justify-center p-2 sm:p-4 text-slate-800">
      {/* Mobile/Tablet Picture-Book App Shell */}
      <div className="w-full max-w-md sm:max-w-lg min-h-[92vh] sm:min-h-[780px] sm:max-h-[880px] bg-[#fffdf7] rounded-3xl shadow-xl border-4 border-amber-200/80 flex flex-col relative overflow-hidden">
        {/* Top App Header with 'R-book' Logo */}
        <header className="w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white shadow-sm z-10 select-none">
          <div
            onClick={handleGoHome}
            className="flex items-center gap-2 cursor-pointer hover:opacity-95 transition-opacity"
            title="R-Book: Home"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-lg shadow-inner">
              📖
            </div>
            <span className="text-xl font-black tracking-tight font-fairytale drop-shadow-xs">
              R-Book
            </span>
          </div>
        </header>

        {/* Dynamic Mode Screens */}
        <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
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
