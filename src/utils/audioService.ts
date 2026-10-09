// Web Speech API and Web Audio Sound Effects service

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const soundEffects = {
  click: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  },

  pageTurn: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  },

  correct: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const startTime = ctx.currentTime + i * 0.08;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch {}
  },

  nudge: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [392.0, 329.63]; // G4, E4
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const startTime = ctx.currentTime + i * 0.12;
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.18);
      });
    } catch {}
  },

  fanfare: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const melody = [
        { f: 523.25, t: 0.0, d: 0.12 },
        { f: 659.25, t: 0.12, d: 0.12 },
        { f: 783.99, t: 0.24, d: 0.15 },
        { f: 1046.5, t: 0.4, d: 0.45 },
      ];
      melody.forEach(item => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = item.f;
        const startTime = ctx.currentTime + item.t;
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + item.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + item.d);
      });
    } catch {}
  },
};

export interface WordSpan {
  index: number;
  start: number;
  end: number;
  word: string;
}

export function parseTextWordSpans(text: string): WordSpan[] {
  const spans: WordSpan[] = [];
  const regex = /\S+/g;
  let match: RegExpExecArray | null;
  let idx = 0;
  while ((match = regex.exec(text)) !== null) {
    spans.push({
      index: idx++,
      start: match.index,
      end: match.index + match[0].length,
      word: match[0],
    });
  }
  return spans;
}

export interface TimedWordItem {
  word: string;
  start: number;
  end: number;
}

export interface PlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  activeWordIndex: number | null;
  playbackRate: number;
}

export type PlayerListener = (state: PlayerState) => void;

export class SynchronizedAudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private timedWords: TimedWordItem[] = [];
  private listeners: Set<PlayerListener> = new Set();
  private rafId: number | null = null;
  private isFallbackMode = false;
  private fallbackTimer: NodeJS.Timeout | null = null;
  private fallbackStartTime = 0;
  private fallbackPausedOffset = 0;
  private fallbackDuration = 0;
  private onEndedCallback: (() => void) | null = null;

  public state: PlayerState = {
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
    activeWordIndex: null,
    playbackRate: 1.0,
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.preload = 'auto';
      this.attachAudioEvents();
    }
  }

  private attachAudioEvents() {
    if (!this.audio) return;

    this.audio.addEventListener('timeupdate', () => {
      this.syncCurrentTime();
    });

    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio && !isNaN(this.audio.duration)) {
        this.updateState({ duration: this.audio.duration });
      }
    });

    this.audio.addEventListener('ended', () => {
      this.stopSyncLoop();
      this.updateState({
        isPlaying: false,
        isPaused: false,
        activeWordIndex: null,
        currentTime: this.state.duration,
      });
      this.onEndedCallback?.();
    });

    this.audio.addEventListener('error', () => {
      // Switch to precise Web Audio/Speech fallback if MP3 fails to load
      this.isFallbackMode = true;
    });
  }

  public subscribe(listener: PlayerListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private updateState(partial: Partial<PlayerState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((l) => l(this.state));
  }

  public load({
    audioUrl,
    timedWords,
    duration,
    onEnded,
  }: {
    audioUrl: string;
    timedWords: TimedWordItem[];
    duration?: number;
    onEnded?: () => void;
  }) {
    this.stop();
    this.timedWords = timedWords;
    this.onEndedCallback = onEnded || null;
    this.isFallbackMode = false;

    const estDuration =
      duration ||
      (timedWords.length > 0 ? timedWords[timedWords.length - 1].end + 0.3 : 5.0);

    this.fallbackDuration = estDuration;

    if (this.audio) {
      this.audio.src = audioUrl;
      this.audio.playbackRate = this.state.playbackRate;
      // Some browsers require preservesPitch for smooth slowing
      const anyAudio = this.audio as unknown as { preservesPitch?: boolean; mozPreservesPitch?: boolean };
      if ('preservesPitch' in anyAudio) anyAudio.preservesPitch = true;
      if ('mozPreservesPitch' in anyAudio) anyAudio.mozPreservesPitch = true;
      this.audio.load();
    }

    this.updateState({
      currentTime: 0,
      duration: estDuration,
      activeWordIndex: null,
      isPlaying: false,
      isPaused: false,
    });
  }

  public async play(): Promise<void> {
    if (this.state.isPlaying) return;

    if (!this.audio || this.isFallbackMode) {
      this.playFallback();
      return;
    }

    try {
      this.audio.playbackRate = this.state.playbackRate;
      await this.audio.play();
      this.updateState({ isPlaying: true, isPaused: false });
      this.startSyncLoop();
    } catch {
      // Autoplay or load failure -> fallback
      this.isFallbackMode = true;
      this.playFallback();
    }
  }

  public pause(): void {
    if (!this.state.isPlaying) return;

    if (this.audio && !this.isFallbackMode) {
      this.audio.pause();
    } else if (this.isFallbackMode) {
      if (this.fallbackTimer) {
        clearInterval(this.fallbackTimer);
        this.fallbackTimer = null;
      }
      this.fallbackPausedOffset = this.state.currentTime;
      speechService.stop();
    }

    this.stopSyncLoop();
    this.updateState({ isPlaying: false, isPaused: true });
  }

  public resume(): void {
    if (this.state.isPaused) {
      this.play();
    }
  }

  public seek(seconds: number): void {
    const clamped = Math.max(0, Math.min(this.state.duration, seconds));

    if (this.audio && !this.isFallbackMode) {
      this.audio.currentTime = clamped;
    } else {
      this.fallbackPausedOffset = clamped;
      this.fallbackStartTime = performance.now() - (clamped * 1000) / this.state.playbackRate;
    }

    const wordIdx = this.findWordIndexAtTime(clamped);
    this.updateState({
      currentTime: clamped,
      activeWordIndex: wordIdx,
    });
  }

  public setPlaybackRate(rate: number): void {
    const validRate = Math.max(0.5, Math.min(2.0, rate));
    this.updateState({ playbackRate: validRate });

    if (this.audio && !this.isFallbackMode) {
      this.audio.playbackRate = validRate;
    } else if (this.isFallbackMode && this.state.isPlaying) {
      this.fallbackPausedOffset = this.state.currentTime;
      this.fallbackStartTime = performance.now();
    }
  }

  public stop(): void {
    this.stopSyncLoop();

    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }

    if (this.fallbackTimer) {
      clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }

    speechService.stop();

    this.fallbackPausedOffset = 0;
    this.updateState({
      isPlaying: false,
      isPaused: false,
      currentTime: 0,
      activeWordIndex: null,
    });
  }

  private startSyncLoop() {
    this.stopSyncLoop();

    const loop = () => {
      this.syncCurrentTime();
      if (this.state.isPlaying) {
        this.rafId = requestAnimationFrame(loop);
      }
    };

    this.rafId = requestAnimationFrame(loop);
  }

  private stopSyncLoop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private syncCurrentTime() {
    if (!this.audio) return;
    const curr = this.audio.currentTime;
    const dur = this.audio.duration || this.state.duration;
    const wordIdx = this.findWordIndexAtTime(curr);

    if (
      Math.abs(curr - this.state.currentTime) > 0.015 ||
      wordIdx !== this.state.activeWordIndex ||
      (dur && dur !== this.state.duration)
    ) {
      this.updateState({
        currentTime: curr,
        duration: isNaN(dur) ? this.state.duration : dur,
        activeWordIndex: wordIdx,
      });
    }
  }

  private findWordIndexAtTime(time: number): number | null {
    if (!this.timedWords.length) return null;

    // Clear highlight before first word or after last word ends
    if (time < this.timedWords[0].start) return null;
    const last = this.timedWords[this.timedWords.length - 1];
    if (time > last.end + 0.1) return null;

    for (let i = 0; i < this.timedWords.length; i++) {
      const curr = this.timedWords[i];
      const next = this.timedWords[i + 1];

      if (time >= curr.start) {
        if (time <= curr.end) {
          return i;
        }
        // In gap between current and next word
        if (next && time < next.start) {
          // Smooth continuous speech: bridge tiny gaps (< 0.12s)
          if (next.start - curr.end < 0.12) {
            return i;
          }
          // Natural pause between sentences / phrases -> clear highlight
          return null;
        }
      }
    }

    return null;
  }

  private playFallback() {
    this.fallbackStartTime = performance.now();
    const startOffset = this.state.isPaused ? this.fallbackPausedOffset : 0;
    this.updateState({ isPlaying: true, isPaused: false });

    // Speak page words with speech service in parallel if starting from beginning
    if (startOffset === 0) {
      const allText = this.timedWords.map((t) => t.word).join(' ');
      speechService.speakText({
        text: allText,
        speed: this.state.playbackRate,
      });
    }

    const intervalMs = 25;
    this.fallbackTimer = setInterval(() => {
      const elapsed =
        ((performance.now() - this.fallbackStartTime) / 1000) * this.state.playbackRate +
        startOffset;

      if (elapsed >= this.fallbackDuration) {
        this.stop();
        this.updateState({
          isPlaying: false,
          isPaused: false,
          activeWordIndex: null,
          currentTime: this.fallbackDuration,
        });
        this.onEndedCallback?.();
        return;
      }

      const wordIdx = this.findWordIndexAtTime(elapsed);
      this.updateState({
        currentTime: elapsed,
        activeWordIndex: wordIdx,
      });
    }, intervalMs);
  }
}

export const storyAudioPlayer = new SynchronizedAudioPlayer();

class SpeechService {
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private fallbackTimer: NodeJS.Timeout | null = null;
  private checkBoundaryTimer: NodeJS.Timeout | null = null;

  public stop() {
    if (this.fallbackTimer) {
      clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if (this.checkBoundaryTimer) {
      clearTimeout(this.checkBoundaryTimer);
      this.checkBoundaryTimer = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.activeUtterance = null;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    return window.speechSynthesis.getVoices();
  }

  public pickNaturalEnglishVoice(): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    if (!voices.length) return null;
    const enVoices = voices.filter(v => v.lang.startsWith('en'));
    const preferred = enVoices.find(v =>
      /natural|google|samantha|karen|daniel|victoria|serena|allison/i.test(v.name)
    );
    return preferred || enVoices[0] || voices[0] || null;
  }

  public speakText({
    text,
    speed = 1.0,
    pitch = 1.05,
    onWordHighlight,
    onStart,
    onEnd,
  }: {
    text: string;
    speed?: number;
    pitch?: number;
    onWordHighlight?: (wordIndex: number) => void;
    onStart?: () => void;
    onEnd?: () => void;
  }) {
    this.stop();

    const wordSpans = parseTextWordSpans(text);
    if (wordSpans.length === 0) {
      onEnd?.();
      return;
    }

    const cleanup = () => {
      if (this.fallbackTimer) {
        clearInterval(this.fallbackTimer);
        this.fallbackTimer = null;
      }
      if (this.checkBoundaryTimer) {
        clearTimeout(this.checkBoundaryTimer);
        this.checkBoundaryTimer = null;
      }
      this.activeUtterance = null;
    };

    // If browser lacks speech synthesis, step through words with fallback timer
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onStart?.();
      onWordHighlight?.(0);
      let curr = 0;
      // Normal: ~420ms per word, Slow: ~650ms per word
      const intervalMs = Math.round((420 / speed));
      this.fallbackTimer = setInterval(() => {
        curr++;
        if (curr < wordSpans.length) {
          onWordHighlight?.(curr);
        } else {
          cleanup();
          onEnd?.();
        }
      }, intervalMs);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    this.activeUtterance = utterance;
    utterance.lang = 'en-US';
    utterance.rate = Math.max(0.6, Math.min(1.8, speed));
    utterance.pitch = pitch;

    const voice = this.pickNaturalEnglishVoice();
    if (voice) {
      utterance.voice = voice;
    }

    let nativeBoundaryFired = false;

    utterance.onstart = () => {
      onStart?.();
      onWordHighlight?.(0);

      // Check if browser native onboundary fires.
      // Only launch fallback timer if 700ms pass and no boundary event occurred.
      this.checkBoundaryTimer = setTimeout(() => {
        if (!nativeBoundaryFired) {
          let currWord = 0;
          const wordIntervalMs = Math.round((440 / speed));
          this.fallbackTimer = setInterval(() => {
            currWord++;
            if (currWord < wordSpans.length) {
              onWordHighlight?.(currWord);
            }
          }, wordIntervalMs);
        }
      }, 700);
    };

    utterance.onboundary = (event) => {
      nativeBoundaryFired = true;
      if (this.fallbackTimer) {
        clearInterval(this.fallbackTimer);
        this.fallbackTimer = null;
      }
      if (this.checkBoundaryTimer) {
        clearTimeout(this.checkBoundaryTimer);
        this.checkBoundaryTimer = null;
      }

      const charIdx = event.charIndex;
      // Map charIndex to the exact word span
      let foundIdx = 0;
      for (let i = 0; i < wordSpans.length; i++) {
        const nextStart = i < wordSpans.length - 1 ? wordSpans[i + 1].start : text.length + 999;
        if (charIdx >= wordSpans[i].start && charIdx < nextStart) {
          foundIdx = i;
          break;
        }
      }
      onWordHighlight?.(foundIdx);
    };

    utterance.onend = () => {
      cleanup();
      onEnd?.();
    };

    utterance.onerror = () => {
      cleanup();
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }
}

export const speechService = new SpeechService();
