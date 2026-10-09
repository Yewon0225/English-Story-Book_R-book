import React, { useState, useEffect, useMemo, useRef } from 'react';
import { StoryPage, VOCAB_DICTIONARY } from '../data/storyData';
import { StoryIllustration } from './StoryIllustration';
import { QuestionModal } from './QuestionModal';
import {
  soundEffects,
  storyAudioPlayer,
  PlayerState,
  speechService,
} from '../utils/audioService';
import {
  Home,
  Volume2,
  ArrowRight,
  ArrowLeft,
  Lock,
  X,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';

interface ReadModeViewProps {
  pages: StoryPage[];
  onFinishStory: (score: number) => void;
  onGoHome: () => void;
}

interface ActiveVocabInfo {
  word: string;
  korean: string;
  emoji: string;
  phonetic: string;
  partOfSpeech?: string;
}

interface TokenWord {
  raw: string;
  cleanKey: string;
  isVocab: boolean;
  globalIndex: number;
}

interface ProcessedLine {
  id: string;
  tokens: TokenWord[];
}

export const ReadModeView: React.FC<ReadModeViewProps> = ({
  pages,
  onFinishStory,
  onGoHome,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isSlowSpeed, setIsSlowSpeed] = useState<boolean>(false);
  const [hasPlayedAudioOnPage, setHasPlayedAudioOnPage] = useState<boolean>(false);
  const [showQuestion, setShowQuestion] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [activeVocab, setActiveVocab] = useState<ActiveVocabInfo | null>(null);

  // Synchronized player state
  const [playerState, setPlayerState] = useState<PlayerState>(storyAudioPlayer.state);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const currentPage = pages[currentPageIndex];
  const isLastPage = currentPageIndex === pages.length - 1;

  // Process lines into tokens matching timedWords indices
  const processedLines = useMemo(() => {
    let globalCounter = 0;
    const linesList: ProcessedLine[] = [];

    currentPage.lines.forEach((line) => {
      const splitWords = line.text.split(/\s+/).filter(Boolean);
      const tokens: TokenWord[] = splitWords.map((word) => {
        const clean = word.toLowerCase().replace(/[^a-z]/g, '');
        const isVocab =
          Boolean(VOCAB_DICTIONARY[clean]) ||
          line.underlinedWords.some((u) => u.toLowerCase() === clean);

        const tokenObj: TokenWord = {
          raw: word,
          cleanKey: clean,
          isVocab,
          globalIndex: globalCounter++,
        };
        return tokenObj;
      });

      linesList.push({
        id: line.id,
        tokens,
      });
    });

    return linesList;
  }, [currentPage]);

  // Load page audio & subscribe to real-time player updates
  useEffect(() => {
    storyAudioPlayer.load({
      audioUrl: currentPage.audioUrl || `/audio/page${currentPage.pageNumber}.mp3`,
      timedWords: currentPage.timedWords,
      duration: currentPage.duration,
      onEnded: () => {
        setHasPlayedAudioOnPage(true);
      },
    });

    storyAudioPlayer.setPlaybackRate(isSlowSpeed ? 0.7 : 1.0);

    // Auto-play page audio smoothly
    storyAudioPlayer.play().catch(() => {});

    const unsubscribe = storyAudioPlayer.subscribe((state) => {
      setPlayerState({ ...state });
    });

    return () => {
      storyAudioPlayer.stop();
      unsubscribe();
    };
  }, [currentPageIndex]);

  // Reset state on page change
  const handlePageChange = (newIndex: number) => {
    storyAudioPlayer.stop();
    setHasPlayedAudioOnPage(false);
    setShowQuestion(false);
    setActiveVocab(null);
    setCurrentPageIndex(newIndex);
  };

  const handleTogglePlay = () => {
    soundEffects.click();
    if (playerState.isPlaying) {
      storyAudioPlayer.pause();
    } else if (playerState.isPaused) {
      storyAudioPlayer.resume();
    } else {
      storyAudioPlayer.play();
    }
  };

  const handleToggleSpeed = () => {
    soundEffects.click();
    const nextSlow = !isSlowSpeed;
    setIsSlowSpeed(nextSlow);
    storyAudioPlayer.setPlaybackRate(nextSlow ? 0.7 : 1.0);
  };

  const handleReplay = () => {
    soundEffects.click();
    setHasPlayedAudioOnPage(false);
    storyAudioPlayer.seek(0);
    storyAudioPlayer.play();
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSeconds = ratio * (playerState.duration || 5.0);
    if (targetSeconds < (playerState.duration || 5.0) - 0.5) {
      setHasPlayedAudioOnPage(false);
    }
    soundEffects.click();
    storyAudioPlayer.seek(targetSeconds);
  };

  const handlePreviousPage = () => {
    soundEffects.pageTurn();
    if (currentPageIndex > 0) {
      handlePageChange(currentPageIndex - 1);
    } else {
      onGoHome();
    }
  };

  const isNextActive = hasPlayedAudioOnPage && !playerState.isPlaying;

  const handleNextClick = () => {
    if (!isNextActive) return;
    soundEffects.pageTurn();
    storyAudioPlayer.stop();
    setShowQuestion(true);
  };

  const handleNextPageFromQuiz = () => {
    if (isLastPage) {
      onFinishStory(correctAnswersCount);
    } else {
      handlePageChange(currentPageIndex + 1);
    }
  };

  const handleWordClick = (token: TokenWord) => {
    const vocabData = VOCAB_DICTIONARY[token.cleanKey];
    if (vocabData) {
      soundEffects.click();
      setActiveVocab({
        word: token.cleanKey,
        korean: vocabData.korean,
        emoji: vocabData.emoji,
        phonetic: vocabData.phonetic,
        partOfSpeech: vocabData.partOfSpeech,
      });

      speechService.speakText({
        text: token.cleanKey,
        speed: 0.85,
      });
    } else {
      // Seek to this word in audio track if timed
      const timed = currentPage.timedWords[token.globalIndex];
      if (timed) {
        soundEffects.click();
        storyAudioPlayer.seek(timed.start);
        if (!playerState.isPlaying) {
          storyAudioPlayer.play();
        }
      }
    }
  };

  const formatSeconds = (sec: number) => {
    const s = Math.floor(sec || 0);
    const m = Math.floor(s / 60);
    const remain = s % 60;
    return `${m}:${remain < 10 ? '0' : ''}${remain}`;
  };

  const progressPercentage = playerState.duration > 0
    ? Math.min(100, Math.max(0, (playerState.currentTime / playerState.duration) * 100))
    : 0;

  return (
    <div className="flex flex-col h-full w-full max-w-lg mx-auto p-2 sm:p-3.5 select-none overflow-hidden">
      {/* Top Header Bar (shrink-0) */}
      <div className="shrink-0 flex items-center justify-between py-0.5 mb-1">
        <button
          onClick={() => {
            soundEffects.click();
            storyAudioPlayer.stop();
            onGoHome();
          }}
          className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100/90 hover:bg-amber-200 px-3 py-1.5 rounded-full border border-amber-300 transition-colors cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        {/* Page Counter: Page X/10 */}
        <div className="flex items-center gap-2">
          <div className="text-sm font-extrabold text-emerald-900 bg-emerald-100/90 px-3.5 py-1 rounded-full border border-emerald-300 font-fairytale">
            Page {currentPage.pageNumber}/10
          </div>
        </div>

        {/* Story Progress Dots */}
        <div className="flex items-center gap-1">
          {pages.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === currentPageIndex
                  ? 'w-4 bg-emerald-600'
                  : i < currentPageIndex
                  ? 'bg-emerald-400'
                  : 'bg-emerald-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content: Illustration & Story Text OR Question Modal */}
      {showQuestion ? (
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <QuestionModal
            pageNumber={currentPage.pageNumber}
            question={currentPage.question}
            onAnswerCorrect={() => setCorrectAnswersCount((c) => c + 1)}
            onNextPage={handleNextPageFromQuiz}
            isLastPage={isLastPage}
          />
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          {/* Middle Scrollable Section: Illustration + Story Text + Progress */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-2 pr-0.5">
            {/* Top Half: 3D Story Illustration Canvas */}
            <div className="w-full h-32 xs:h-36 sm:h-48 md:h-52 shrink-0 p-1 sm:p-1.5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#fffef8] via-[#fef8e8] to-[#fbedd2] border-2 border-[#edd8b0] shadow-sm relative group overflow-hidden flex items-center justify-center">
            <div className="absolute top-1 left-2.5 text-[#d4af37]/50 text-xs select-none pointer-events-none">✦</div>
            <div className="absolute top-1 right-2.5 text-[#d4af37]/50 text-xs select-none pointer-events-none">✦</div>

            <StoryIllustration
              pageNumber={currentPage.pageNumber}
              isAudioPlaying={playerState.isPlaying}
            />
          </div>

          {/* Bottom Half: Story Text on Warm Parchment Card */}
          <div className="w-full bg-gradient-to-b from-[#ffffff] via-[#fffdf9] to-[#fefaf2] p-4 sm:p-5 rounded-3xl shadow-[0_8px_22px_-4px_rgba(180,120,40,0.11),0_2px_6px_rgba(0,0,0,0.03)] border-2 border-[#ecd9b5]/90 my-0.5 relative transition-all">
            <div className="space-y-3 sm:space-y-3.5">
              {processedLines.map((line) => (
                <p
                  key={line.id}
                  className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed sm:leading-loose font-fairytale"
                >
                  {line.tokens.map((token) => {
                    const isHighlighted = playerState.activeWordIndex === token.globalIndex;

                    return (
                      <span
                        key={token.globalIndex}
                        onClick={() => handleWordClick(token)}
                        className={`inline-block mr-1.5 transition-all duration-100 rounded-lg px-1.5 py-0.5 cursor-pointer ${
                          isHighlighted
                            ? 'bg-amber-300 text-amber-950 font-black scale-105 shadow-sm ring-2 ring-amber-400'
                            : token.isVocab
                            ? 'text-[#6B3A19] font-black underline decoration-amber-600 decoration-2 underline-offset-4 hover:bg-amber-100/90 active:scale-95'
                            : 'text-slate-800 font-semibold hover:bg-amber-50/80 active:scale-95'
                        }`}
                        title={token.isVocab ? 'Click to see meaning' : 'Click to hear word'}
                      >
                        {token.raw}
                      </span>
                    );
                  })}
                </p>
              ))}
            </div>

            {/* Clicked Vocabulary Meaning Card */}
            {activeVocab && (
              <div className="absolute inset-x-3 bottom-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-3 shadow-lg z-20 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-200/80 flex items-center justify-center text-2xl shadow-inner">
                      {activeVocab.emoji}
                    </div>
                    <div className="text-left">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-amber-950 font-fairytale">
                          {activeVocab.word}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {activeVocab.phonetic}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-amber-900 bg-white/90 px-2 py-0.5 rounded-md border border-amber-200">
                          {activeVocab.korean}
                        </span>
                        {activeVocab.partOfSpeech && (
                          <span className="text-[10px] text-amber-700 font-medium">
                            {activeVocab.partOfSpeech}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        soundEffects.click();
                        speechService.speakText({
                          text: activeVocab.word,
                          speed: 0.85,
                        });
                      }}
                      className="p-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                      title="Pronounce again"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveVocab(null)}
                      className="p-1.5 bg-slate-200/80 hover:bg-slate-300 text-slate-700 rounded-xl transition-colors cursor-pointer"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Audio Progress / Scrub Bar */}
          <div className="w-full px-1">
            <div
              ref={progressBarRef}
              onClick={handleProgressBarClick}
              className="relative h-2 w-full bg-amber-100 rounded-full cursor-pointer overflow-hidden border border-amber-200 hover:h-2.5 transition-all group"
              title="Click to seek"
            >
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full transition-all duration-75"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-900/70 mt-1 px-1 font-mono">
              <span>{formatSeconds(playerState.currentTime)}</span>
              {playerState.isPlaying && (
                <span className="text-[10px] text-rose-500 animate-pulse font-sans font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Playing
                </span>
              )}
              <span>{formatSeconds(playerState.duration)}</span>
            </div>
          </div>

          </div>

          {/* Bottom Controls Bar: Pinned, sticky, fully visible on mobile & tablet (shrink-0) */}
          <div className="shrink-0 w-full pt-2 pb-1 sm:pb-2 border-t border-amber-200/70 bg-[#fffdf7] z-20">
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              {/* 1. Previous Button */}
              <button
                onClick={handlePreviousPage}
                className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm font-fairytale transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 whitespace-nowrap ${
                  currentPageIndex > 0
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{currentPageIndex > 0 ? 'Prev' : 'Home'}</span>
              </button>

              {/* 2. Center Audio Controls: 🍎 Read / Pause + 🐢 Slow Toggle */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={handleTogglePlay}
                  className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer font-fairytale shrink-0 whitespace-nowrap ${
                    playerState.isPlaying
                      ? 'bg-amber-500 hover:bg-amber-600 text-white ring-2 ring-amber-300'
                      : playerState.isPaused
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-300'
                      : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white'
                  }`}
                >
                  {playerState.isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>Pause</span>
                    </>
                  ) : playerState.isPaused ? (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm sm:text-base">🍎</span>
                      <span>Read to me</span>
                    </>
                  )}
                </button>

                {/* Replay button if paused or finished */}
                {(playerState.isPaused || (!playerState.isPlaying && playerState.currentTime > 0)) && (
                  <button
                    onClick={handleReplay}
                    className="p-2 sm:p-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl sm:rounded-2xl border border-amber-300 transition-colors active:scale-95 cursor-pointer shrink-0"
                    title="Replay from start"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}

                {/* 🐢 Slow Toggle */}
                <button
                  onClick={handleToggleSpeed}
                  className={`flex items-center gap-1 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm border transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    isSlowSpeed
                      ? 'bg-amber-100 text-amber-900 border-amber-400 ring-2 ring-amber-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>🐢</span>
                  <span className="font-fairytale">{isSlowSpeed ? 'Slow' : 'Normal'}</span>
                </button>
              </div>

              {/* 3. Next Button */}
              <button
                disabled={!isNextActive}
                onClick={handleNextClick}
                className={`flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm font-fairytale transition-all duration-200 shrink-0 whitespace-nowrap ${
                  isNextActive
                    ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white ring-2 ring-emerald-300 shadow-md cursor-pointer'
                    : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none'
                }`}
                title={!hasPlayedAudioOnPage ? 'Listen to the audio first' : playerState.isPlaying ? 'Audio is currently playing' : 'Next'}
              >
                {!isNextActive && <Lock className="w-3.5 h-3.5 text-slate-400 mr-0.5" />}
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
