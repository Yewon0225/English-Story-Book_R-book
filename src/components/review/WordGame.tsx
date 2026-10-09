import React, { useState, useEffect, useMemo } from 'react';
import { VocabItem } from '../../data/storyData';
import { soundEffects, speechService } from '../../utils/audioService';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Trophy,
  RotateCcw,
  Sparkles,
  Gamepad2,
  Brain,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface WordGameProps {
  vocabList: VocabItem[];
}

type GameMode = 'quiz' | 'memory';

interface MemoryCard {
  id: string; // unique card id
  vocabId: string;
  type: 'word' | 'meaning';
  display: string;
  sub?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const WordGame: React.FC<WordGameProps> = ({ vocabList }) => {
  const [gameMode, setGameMode] = useState<GameMode>('quiz');

  // ==================== QUIZ MODE STATE ====================
  const [quizQuestions, setQuizQuestions] = useState<
    Array<{
      item: VocabItem;
      options: string[];
      correctAnswer: string;
    }>
  >([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizStreak, setQuizStreak] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  // ==================== MEMORY MATCH STATE ====================
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [memoryMoves, setMemoryMoves] = useState<number>(0);
  const [matchedPairsCount, setMatchedPairsCount] = useState<number>(0);
  const [isMemoryFinished, setIsMemoryFinished] = useState<boolean>(false);

  // Initialize Quiz Game
  const initQuiz = () => {
    soundEffects.click();
    const shuffled = [...vocabList].sort(() => Math.random() - 0.5);
    const questions = shuffled.slice(0, 8).map((target) => {
      // Pick 3 random distractor meanings from other vocab items
      const distractors = vocabList
        .filter((v) => v.id !== target.id)
        .map((v) => v.korean)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [target.korean, ...distractors].sort(() => Math.random() - 0.5);

      return {
        item: target,
        options,
        correctAnswer: target.korean,
      };
    });

    setQuizQuestions(questions);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizStreak(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsQuizFinished(false);
  };

  // Initialize Memory Match Game
  const initMemory = () => {
    soundEffects.click();
    const chosen = [...vocabList].sort(() => Math.random() - 0.5).slice(0, 4);
    const cards: MemoryCard[] = [];

    chosen.forEach((v) => {
      // English card
      cards.push({
        id: `${v.id}-en`,
        vocabId: v.id,
        type: 'word',
        display: v.word,
        sub: v.emoji,
        isFlipped: false,
        isMatched: false,
      });
      // Korean meaning card
      cards.push({
        id: `${v.id}-ko`,
        vocabId: v.id,
        type: 'meaning',
        display: v.korean,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle the cards
    cards.sort(() => Math.random() - 0.5);
    setMemoryCards(cards);
    setFlippedCardIds([]);
    setMemoryMoves(0);
    setMatchedPairsCount(0);
    setIsMemoryFinished(false);
  };

  // Start on mount or mode change
  useEffect(() => {
    if (gameMode === 'quiz') {
      initQuiz();
    } else {
      initMemory();
    }
  }, [gameMode]);

  // Handle Quiz Choice
  const handleSelectQuizOption = (option: string) => {
    if (isAnswered) return;
    const currentQ = quizQuestions[currentQuizIndex];
    if (!currentQ) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    if (option === currentQ.correctAnswer) {
      soundEffects.correct();
      setQuizScore((s) => s + 10);
      setQuizStreak((st) => st + 1);
      try {
        confetti({
          particleCount: 35,
          spread: 45,
          origin: { y: 0.6 },
        });
      } catch {}
    } else {
      soundEffects.nudge();
      setQuizStreak(0);
    }
  };

  const handleNextQuizQuestion = () => {
    soundEffects.click();
    if (currentQuizIndex + 1 < quizQuestions.length) {
      setCurrentQuizIndex((i) => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsQuizFinished(true);
      soundEffects.fanfare();
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.5 },
        });
      } catch {}
    }
  };

  // Handle Memory Card Click
  const handleMemoryCardClick = (card: MemoryCard) => {
    if (card.isMatched || card.isFlipped || flippedCardIds.length >= 2) return;

    soundEffects.click();
    const newFlipped = [...flippedCardIds, card.id];
    setFlippedCardIds(newFlipped);

    // Update flip state in cards array
    setMemoryCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c))
    );

    // If word card was flipped, pronounce it
    if (card.type === 'word') {
      speechService.speakText({
        text: card.display,
        speed: 0.9,
      });
    }

    if (newFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      const first = memoryCards.find((c) => c.id === newFlipped[0]);
      const second = card;

      if (first && first.vocabId === second.vocabId) {
        // Matched!
        soundEffects.correct();
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) =>
              c.vocabId === first.vocabId ? { ...c, isMatched: true, isFlipped: true } : c
            )
          );
          setFlippedCardIds([]);
          setMatchedPairsCount((p) => {
            const next = p + 1;
            if (next === 4) {
              setIsMemoryFinished(true);
              soundEffects.fanfare();
              try {
                confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
              } catch {}
            }
            return next;
          });
        }, 500);
      } else {
        // No match -> flip back after brief delay
        soundEffects.nudge();
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) =>
              newFlipped.includes(c.id) && !c.isMatched ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCardIds([]);
        }, 900);
      }
    }
  };

  const currentQ = quizQuestions[currentQuizIndex];

  return (
    <div className="flex flex-col flex-1 justify-between w-full h-full pb-1 select-none">
      {/* Game Mode Selector */}
      <div className="flex items-center justify-between gap-2 p-1 bg-amber-100/90 rounded-2xl border border-amber-200 mb-2">
        <button
          onClick={() => setGameMode('quiz')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer font-fairytale ${
            gameMode === 'quiz'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>Word Quiz</span>
        </button>

        <button
          onClick={() => setGameMode('memory')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer font-fairytale ${
            gameMode === 'memory'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Card Match</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* GAME 1: WORD QUIZ */}
      {/* ========================================================= */}
      {gameMode === 'quiz' && (
        <div className="flex flex-col flex-1 justify-between">
          {!isQuizFinished && currentQ ? (
            <>
              {/* Score & Streak Header */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1 mb-1 font-fairytale">
                <span className="bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Question {currentQuizIndex + 1} / {quizQuestions.length}
                </span>

                <div className="flex items-center gap-2">
                  {quizStreak > 1 && (
                    <span className="text-orange-600 animate-pulse">🔥 Combo x{quizStreak}!</span>
                  )}
                  <span className="text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ⭐ {quizScore} pts
                  </span>
                </div>
              </div>

              {/* Quiz Prompt Card */}
              <div className="bg-gradient-to-b from-white via-amber-50/40 to-amber-50/70 p-4 rounded-3xl border-2 border-amber-200 shadow-sm text-center my-1 relative">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-4xl">{currentQ.item.emoji}</span>
                  <button
                    onClick={() => {
                      soundEffects.click();
                      speechService.speakText({
                        text: currentQ.item.word,
                        speed: 0.85,
                      });
                    }}
                    className="p-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                    title="Hear word"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-fairytale mb-0.5">
                  {currentQ.item.word}
                </h3>
                <p className="text-xs text-slate-400 font-mono mb-1">{currentQ.item.phonetic}</p>
                <p className="text-xs font-bold text-amber-800/80 font-fairytale">
                  What does this word mean?
                </p>
              </div>

              {/* 4 Choices Grid */}
              <div className="grid grid-cols-2 gap-2 my-2">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQ.correctAnswer;

                  let style =
                    'bg-white hover:bg-amber-50 text-slate-800 border-2 border-amber-200/80 hover:border-amber-300';

                  if (isAnswered) {
                    if (isCorrect) {
                      style =
                        'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-300 scale-102';
                    } else if (isSelected) {
                      style =
                        'bg-rose-100 border-2 border-rose-400 text-rose-950 line-through opacity-80';
                    } else {
                      style = 'bg-white/60 text-slate-400 border border-slate-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuizOption(option)}
                      disabled={isAnswered}
                      className={`p-3 rounded-2xl text-center text-sm sm:text-base font-bold transition-all cursor-pointer shadow-xs active:scale-95 font-fairytale ${style}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Next Question Button */}
              <div className="pt-1">
                {isAnswered ? (
                  <button
                    onClick={handleNextQuizQuestion}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer font-fairytale"
                  >
                    <span>
                      {currentQuizIndex + 1 === quizQuestions.length ? 'See Result' : 'Next Question'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="py-2 text-center text-xs text-slate-400 font-fairytale">
                    Choose the correct Korean meaning above!
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Quiz Completed Screen */
            <div className="flex flex-col items-center justify-center flex-1 p-5 text-center bg-white rounded-3xl border-2 border-amber-300 shadow-md">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl shadow-inner mb-3">
                🏆
              </div>

              <h2 className="text-2xl font-extrabold text-amber-950 font-fairytale mb-1">
                Quiz Completed!
              </h2>

              <p className="text-sm font-semibold text-slate-600 mb-3 font-fairytale">
                You scored <span className="text-emerald-700 font-extrabold">{quizScore} pts</span>!
              </p>

              <div className="flex items-center gap-1.5 text-2xl mb-4">
                {quizScore >= 70 ? '⭐⭐⭐ Fantastic!' : quizScore >= 40 ? '⭐⭐ Great Job!' : '⭐ Good Try!'}
              </div>

              <button
                onClick={initQuiz}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer font-fairytale"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* GAME 2: MEMORY MATCH */}
      {/* ========================================================= */}
      {gameMode === 'memory' && (
        <div className="flex flex-col flex-1 justify-between">
          {!isMemoryFinished ? (
            <>
              {/* Header Stats */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1 mb-1 font-fairytale">
                <span className="bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Pairs Matched: {matchedPairsCount} / 4
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Moves: {memoryMoves}</span>
                  <button
                    onClick={initMemory}
                    className="flex items-center gap-1 text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-lg border border-amber-300 transition-colors cursor-pointer"
                    title="Restart game"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* 8 Memory Cards Grid (4x2) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 my-1">
                {memoryCards.map((card) => {
                  const showFront = card.isFlipped || card.isMatched;

                  return (
                    <div
                      key={card.id}
                      onClick={() => handleMemoryCardClick(card)}
                      className={`h-24 sm:h-28 rounded-2xl p-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 border-2 select-none active:scale-95 ${
                        card.isMatched
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-950 ring-2 ring-emerald-300 shadow-sm scale-98'
                          : showFront
                          ? 'bg-white border-amber-400 text-amber-950 shadow-md scale-102'
                          : 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-500 text-white shadow-xs hover:scale-102'
                      }`}
                    >
                      {showFront ? (
                        <>
                          {card.sub && <span className="text-xl mb-0.5">{card.sub}</span>}
                          <span
                            className={`font-bold font-fairytale ${
                              card.type === 'word'
                                ? 'text-base sm:text-lg text-amber-950'
                                : 'text-sm sm:text-base text-amber-900'
                            }`}
                          >
                            {card.display}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5 uppercase">
                            {card.type === 'word' ? 'English' : 'Korean'}
                          </span>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-2xl drop-shadow-xs">🃏</span>
                          <span className="text-[10px] font-extrabold text-amber-100 tracking-widest uppercase mt-1">
                            Flip
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="py-1 text-center text-xs text-slate-400 font-fairytale">
                Find the matching English word & Korean meaning pairs!
              </div>
            </>
          ) : (
            /* Memory Match Completed Screen */
            <div className="flex flex-col items-center justify-center flex-1 p-5 text-center bg-white rounded-3xl border-2 border-amber-300 shadow-md">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shadow-inner mb-3">
                🎉
              </div>

              <h2 className="text-2xl font-extrabold text-amber-950 font-fairytale mb-1">
                All Pairs Matched!
              </h2>

              <p className="text-sm font-semibold text-slate-600 mb-4 font-fairytale">
                You cleared the board in{' '}
                <span className="text-emerald-700 font-extrabold">{memoryMoves} moves</span>!
              </p>

              <button
                onClick={initMemory}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer font-fairytale"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
