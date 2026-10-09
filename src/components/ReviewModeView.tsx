import React, { useState } from 'react';
import { VOCABULARY_LIST, VocabItem } from '../data/storyData';
import { soundEffects, speechService } from '../utils/audioService';
import { WordGame } from './review/WordGame';
import {
  Volume2,
  BookOpen,
  Gamepad2,
} from 'lucide-react';

interface ReviewModeViewProps {
  onClose: () => void;
}

type ReviewTab = 'list' | 'game';

export const ReviewModeView: React.FC<ReviewModeViewProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<ReviewTab>('list');
  const [activeWordId, setActiveWordId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'noun' | 'verb' | 'adjective'>('all');

  const handlePronounce = (vocab: VocabItem) => {
    soundEffects.click();
    setActiveWordId(vocab.id);
    speechService.speakText({
      text: vocab.word,
      speed: 0.85,
      pitch: 1.05,
      onEnd: () => {
        setActiveWordId(null);
      },
    });
  };

  const handlePronounceSentence = (vocab: VocabItem) => {
    soundEffects.click();
    setActiveWordId(vocab.id);
    speechService.speakText({
      text: vocab.sentence,
      speed: 0.9,
      pitch: 1.05,
      onEnd: () => {
        setActiveWordId(null);
      },
    });
  };

  const filteredVocab = VOCABULARY_LIST.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <div className="flex flex-col h-full w-full max-w-lg mx-auto p-3 sm:p-4 select-none">
      {/* Top Header: Title & Close Button */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            📝
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-amber-950 font-fairytale leading-tight">
              Vocabulary Review
            </h1>
          </div>
        </div>

        {/* ❌ Close Button: Return to cover screen */}
        <button
          onClick={() => {
            soundEffects.click();
            speechService.stop();
            onClose();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-full font-bold text-xs sm:text-sm border border-rose-300 transition-colors cursor-pointer active:scale-95 shadow-xs"
          title="Return to Home"
        >
          <span>❌</span>
          <span className="font-fairytale">Close</span>
        </button>
      </div>

      {/* 2 Tabs: Word List / Word Game */}
      <div className="flex items-center justify-between gap-1 p-1 bg-amber-100/90 rounded-2xl border border-amber-200 mb-2">
        <button
          onClick={() => {
            soundEffects.click();
            speechService.stop();
            setActiveTab('list');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer font-fairytale ${
            activeTab === 'list'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Word List</span>
        </button>

        <button
          onClick={() => {
            soundEffects.click();
            speechService.stop();
            setActiveTab('game');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer font-fairytale ${
            activeTab === 'game'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Word Game</span>
        </button>
      </div>

      {/* TAB 1: WORD LIST */}
      {activeTab === 'list' && (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Category Filter Pills (Functional Buttons) */}
          <div className="flex items-center justify-between gap-1.5 py-1 mb-2 overflow-x-auto">
            <div className="flex items-center gap-1.5">
              {(
                [
                  { key: 'all', label: 'All (14)' },
                  { key: 'noun', label: 'Nouns' },
                  { key: 'verb', label: 'Verbs' },
                  { key: 'adjective', label: 'Adjectives' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    soundEffects.click();
                    setSelectedCategory(tab.key);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === tab.key
                      ? 'bg-amber-600 text-white shadow-xs font-fairytale'
                      : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Listen All Helper */}
            <button
              onClick={() => {
                soundEffects.click();
                const allWords = filteredVocab.map((v) => v.word).join(', ');
                speechService.speakText({
                  text: allWords,
                  speed: 0.8,
                });
              }}
              className="text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-xl border border-emerald-300 transition-colors cursor-pointer shrink-0 font-fairytale"
            >
              🔊 Play List
            </button>
          </div>

          {/* Word List Scroll View */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1 max-h-[calc(100vh-230px)]">
            {filteredVocab.map((vocab) => {
              const isPlayingThis = activeWordId === vocab.id;

              return (
                <div
                  key={vocab.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all duration-200 bg-white hover:bg-amber-50/50 shadow-xs hover:shadow-md ${
                    isPlayingThis
                      ? 'border-amber-400 ring-2 ring-amber-200 bg-amber-50/80 scale-[1.01]'
                      : 'border-amber-100/90'
                  }`}
                >
                  {/* Left: 🔊 Pronunciation Button */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handlePronounce(vocab)}
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg shadow-sm transition-all cursor-pointer active:scale-95 shrink-0 ${
                        isPlayingThis
                          ? 'bg-amber-500 text-white animate-pulse ring-2 ring-amber-300'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                      }`}
                      title="Listen to native pronunciation"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>

                    {/* Center: English Word + Phonetic + Korean Meaning */}
                    <div className="text-left">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg sm:text-xl font-extrabold text-slate-900 font-fairytale">
                          {vocab.word}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {vocab.phonetic}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-lg border border-amber-200/60">
                          {vocab.korean}
                        </span>
                      </div>

                      {/* Example Sentence preview */}
                      <button
                        onClick={() => handlePronounceSentence(vocab)}
                        className="text-[11px] text-slate-500 hover:text-emerald-700 italic mt-1 text-left line-clamp-1 cursor-pointer"
                        title="Tap to hear full sentence"
                      >
                        &ldquo;{vocab.sentence}&rdquo;
                      </button>
                    </div>
                  </div>

                  {/* Right: Picture Emoji */}
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-inner shrink-0 ml-2">
                    <span className="text-2xl sm:text-3xl drop-shadow-xs transition-transform hover:scale-125">
                      {vocab.emoji}
                    </span>
                    <span className="text-[9px] font-semibold text-amber-800/80 uppercase">
                      {vocab.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: WORD GAME */}
      {activeTab === 'game' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <WordGame vocabList={VOCABULARY_LIST} />
        </div>
      )}
    </div>
  );
};
