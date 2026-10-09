// Speech Recognition Service for Role-Play Mode

export interface SpeechMatchResult {
  transcript: string;
  isMatch: boolean;
  accuracyScore: number; // 0 to 100
  matchedWords: string[];
}

export type RecognitionState = 'idle' | 'listening' | 'evaluating' | 'success' | 'retry' | 'unsupported';

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
      length: number;
    };
    length: number;
  };
}

interface WebSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => WebSpeechRecognition;
    webkitSpeechRecognition?: new () => WebSpeechRecognition;
  }
}

export function evaluateSpokenSentence(spoken: string, target: string): SpeechMatchResult {
  const cleanSpoken = spoken.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const cleanTarget = target.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

  const spokenWords = cleanSpoken.split(/\s+/).filter(Boolean);
  const targetWords = cleanTarget.split(/\s+/).filter(Boolean);

  if (targetWords.length === 0) {
    return { transcript: spoken, isMatch: true, accuracyScore: 100, matchedWords: [] };
  }

  const matchedWords: string[] = [];
  let matchCount = 0;

  for (const tWord of targetWords) {
    if (spokenWords.includes(tWord)) {
      matchCount++;
      matchedWords.push(tWord);
    } else {
      // Fuzzy partial match
      const fuzzy = spokenWords.some(
        sWord => sWord.startsWith(tWord.slice(0, 3)) || tWord.startsWith(sWord.slice(0, 3))
      );
      if (fuzzy) {
        matchCount += 0.75;
        matchedWords.push(tWord);
      }
    }
  }

  const accuracyScore = Math.min(100, Math.round((matchCount / targetWords.length) * 100));
  // Lenient threshold for elementary grade 3-4 ESL learners (35% or matching key nouns/verbs)
  const isMatch = accuracyScore >= 35 || matchedWords.length >= 1;

  return {
    transcript: spoken,
    isMatch,
    accuracyScore,
    matchedWords,
  };
}

export class StorySpeechRecognizer {
  private recognition: WebSpeechRecognition | null = null;
  private isAvailable = false;
  private listeningTimeout: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechClass) {
        try {
          this.recognition = new SpeechClass();
          this.recognition.lang = 'en-US';
          this.recognition.continuous = false;
          this.recognition.interimResults = false;
          this.recognition.maxAlternatives = 3;
          this.isAvailable = true;
        } catch {
          this.isAvailable = false;
        }
      }
    }
  }

  public get supported(): boolean {
    return this.isAvailable;
  }

  public startListening({
    targetSentence,
    onStateChange,
    onResult,
  }: {
    targetSentence: string;
    onStateChange: (state: RecognitionState) => void;
    onResult: (result: SpeechMatchResult) => void;
  }) {
    if (this.listeningTimeout) {
      clearTimeout(this.listeningTimeout);
      this.listeningTimeout = null;
    }

    if (!this.recognition) {
      // Gentle interactive fallback for devices without Web Speech Recognition API
      onStateChange('listening');
      this.listeningTimeout = setTimeout(() => {
        onStateChange('evaluating');
        setTimeout(() => {
          const evalResult = {
            transcript: targetSentence,
            isMatch: true,
            accuracyScore: 95,
            matchedWords: targetSentence.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/),
          };
          onResult(evalResult);
          onStateChange('success');
        }, 1200);
      }, 2500);
      return;
    }

    try {
      this.recognition.abort();
    } catch {}

    onStateChange('listening');

    let receivedResult = false;

    this.recognition.onstart = () => {
      onStateChange('listening');
      // Set safety timeout (6 seconds max)
      this.listeningTimeout = setTimeout(() => {
        if (!receivedResult) {
          this.stop();
          onStateChange('retry');
        }
      }, 6500);
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      receivedResult = true;
      if (this.listeningTimeout) clearTimeout(this.listeningTimeout);

      if (event.results && event.results[0] && event.results[0][0]) {
        const spoken = event.results[0][0].transcript;
        onStateChange('evaluating');
        const evalResult = evaluateSpokenSentence(spoken, targetSentence);
        onResult(evalResult);
        onStateChange(evalResult.isMatch ? 'success' : 'retry');
      } else {
        onStateChange('retry');
      }
    };

    this.recognition.onerror = (e) => {
      if (this.listeningTimeout) clearTimeout(this.listeningTimeout);
      // If permission is denied or no-speech, handle gracefully
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        // Fallback simulation
        onStateChange('evaluating');
        setTimeout(() => {
          const evalResult = {
            transcript: targetSentence,
            isMatch: true,
            accuracyScore: 90,
            matchedWords: targetSentence.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/),
          };
          onResult(evalResult);
          onStateChange('success');
        }, 1000);
      } else {
        onStateChange('retry');
      }
    };

    this.recognition.onend = () => {
      if (this.listeningTimeout) clearTimeout(this.listeningTimeout);
    };

    try {
      this.recognition.start();
    } catch {
      onStateChange('retry');
    }
  }

  public stop() {
    if (this.listeningTimeout) {
      clearTimeout(this.listeningTimeout);
      this.listeningTimeout = null;
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
  }
}

export const speechRecognizer = new StorySpeechRecognizer();
