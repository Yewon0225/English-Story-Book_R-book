import React, { useState, useMemo } from 'react';
import { StoryQuestion, QuestionChoice } from '../data/storyData';
import { soundEffects, speechService } from '../utils/audioService';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertCircle, HelpCircle, Volume2, ArrowRight } from 'lucide-react';

interface QuestionModalProps {
  pageNumber: number;
  question: StoryQuestion;
  onAnswerCorrect: () => void;
  onNextPage: () => void;
  isLastPage: boolean;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  pageNumber,
  question,
  onAnswerCorrect,
  onNextPage,
  isLastPage,
}) => {
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hasAttempted, setHasAttempted] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Randomize answer choices order each time
  const randomizedOptions = useMemo(() => {
    const arr = [...question.options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [question]);

  const handleSelectChoice = (choice: QuestionChoice, index: number) => {
    setSelectedChoiceIndex(index);
    setHasAttempted(true);

    if (choice.isCorrect) {
      setStatus('correct');
      soundEffects.correct();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#f59e0b', '#ec4899', '#38bdf8'],
        });
      } catch {}
      onAnswerCorrect();
    } else {
      setStatus('incorrect');
      soundEffects.nudge();
      setShowHint(true);
    }
  };

  const handleReadQuestion = () => {
    soundEffects.click();
    setIsPlayingAudio(true);
    const textToSpeak = question.blankPrefix
      ? `${question.questionText}. ${question.blankPrefix} blank ${question.blankSuffix || ''}`
      : question.questionText;

    speechService.speakText({
      text: textToSpeak,
      speed: 0.85,
      pitch: 1.05,
      onEnd: () => {
        setIsPlayingAudio(false);
      },
    });
  };

  return (
    <div className="relative w-full flex flex-col justify-between p-4 sm:p-5 bg-white rounded-3xl shadow-lg border-2 border-emerald-300 min-h-[420px] select-none transition-all">
      {/* Quiz Header */}
      <div>
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-100">
          <span className="text-xs font-bold tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-fairytale">
            Page {pageNumber} Quiz
          </span>
        </div>

        {/* Prominent 'Listen to Question' Button */}
        <div className="w-full flex justify-center my-2">
          <button
            onClick={handleReadQuestion}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm shadow-sm transition-all cursor-pointer font-fairytale ${
              isPlayingAudio
                ? 'bg-amber-500 text-white ring-2 ring-amber-300 animate-pulse'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-200 active:scale-95'
            }`}
            title="Listen to question spoken aloud"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>{isPlayingAudio ? 'Listening...' : '🔊 Listen to Question'}</span>
          </button>
        </div>

        {/* Question Text */}
        <div className="my-2 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-fairytale leading-snug">
            {question.questionText}
          </h2>

          {/* Sentence Blank Display for Fill-in-the-Blank */}
          {question.blankPrefix && (
            <div className="mt-2.5 inline-flex flex-wrap items-center justify-center gap-1.5 text-base sm:text-lg font-semibold text-amber-950 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200 shadow-inner">
              <span>{question.blankPrefix}</span>
              <span
                className={`min-w-20 px-3 py-0.5 text-center rounded-lg border-2 transition-all font-bold ${
                  status === 'correct'
                    ? 'bg-emerald-200 text-emerald-900 border-emerald-500 scale-105'
                    : status === 'incorrect'
                    ? 'bg-rose-100 text-rose-800 border-rose-400'
                    : 'bg-white text-slate-400 border-dashed border-amber-400'
                }`}
              >
                {selectedChoiceIndex !== null
                  ? randomizedOptions[selectedChoiceIndex].text
                  : '_______'}
              </span>
              <span>{question.blankSuffix}</span>
            </div>
          )}
        </div>
      </div>

      {/* Answer Choices arranged with Random Order */}
      <div className="my-3">
        <div
          className={`grid gap-3 ${
            randomizedOptions.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
          }`}
        >
          {randomizedOptions.map((option, idx) => {
            const isSelected = selectedChoiceIndex === idx;
            const isCorrectOption = option.isCorrect;

            let cardStyle =
              'bg-slate-50 hover:bg-emerald-50/70 border-slate-200 hover:border-emerald-300 text-slate-800 shadow-xs hover:shadow-md';

            if (isSelected) {
              if (status === 'correct') {
                cardStyle =
                  'bg-emerald-100 border-emerald-500 text-emerald-950 shadow-md ring-2 ring-emerald-400 scale-[1.02]';
              } else if (status === 'incorrect') {
                cardStyle =
                  'bg-rose-100 border-rose-400 text-rose-950 shadow-md ring-2 ring-rose-300';
              }
            } else if (status === 'incorrect' && isCorrectOption) {
              // Highlight the correct answer gently after an incorrect attempt
              cardStyle =
                'bg-emerald-50 border-emerald-400 text-emerald-900 ring-1 ring-emerald-300';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectChoice(option, idx)}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer active:scale-95 ${cardStyle}`}
              >
                {option.icon && (
                  <span className="text-3xl sm:text-4xl mb-1.5 drop-shadow-xs transition-transform hover:scale-110">
                    {option.icon}
                  </span>
                )}
                <span className="text-sm sm:text-base font-bold text-center leading-tight">
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Banner and Next Button */}
      <div className="mt-2 space-y-2.5">
        {status === 'correct' && (
          <div className="flex items-center justify-center gap-2 py-2 px-3 bg-emerald-100 text-emerald-900 rounded-xl border border-emerald-300 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold font-fairytale">Nice! 🎉 You got it right!</span>
          </div>
        )}

        {status === 'incorrect' && showHint && (
          <div className="flex items-start gap-2 py-2 px-3 bg-amber-50 text-amber-900 rounded-xl border border-amber-300">
            <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs font-medium text-left">
              <span className="font-bold">Hint: </span>
              {question.hint}
            </div>
          </div>
        )}

        {/* Action Button: Visible after learner has selected an option */}
        {hasAttempted && (
          <button
            onClick={() => {
              soundEffects.pageTurn();
              onNextPage();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-2xl shadow-md transition-all cursor-pointer font-fairytale text-base"
          >
            <span>{isLastPage ? 'See Story Result! 🌟' : 'Next Story Page ▶'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
