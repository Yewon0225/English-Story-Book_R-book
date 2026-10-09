import React, { useState, useEffect, useRef } from 'react';
import { StoryPage, CharacterId, CHARACTERS } from '../data/storyData';
import { StoryIllustration } from './StoryIllustration';
import { soundEffects, speechService } from '../utils/audioService';
import {
  Home,
  ArrowRight,
  ArrowLeft,
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RolePlayModeViewProps {
  pages: StoryPage[];
  initialCharacter?: CharacterId;
  onFinishRolePlay: () => void;
  onGoHome: () => void;
}

// Convert AudioBuffer PCM samples to standard 16-bit WAV Blob
// 100% supported by all mobile/tablet browsers (iOS Safari, Android Chrome, Desktop)
function bufferToWavBlob(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const outBuffer = new DataView(new ArrayBuffer(length));
  const channels: Float32Array[] = [];
  const sampleRate = buffer.sampleRate;
  let offset = 0;
  let pos = 0;

  function setUint16(data: number) {
    outBuffer.setUint16(pos, data, true);
    pos += 2;
  }
  function setUint32(data: number) {
    outBuffer.setUint32(pos, data, true);
    pos += 4;
  }

  // RIFF header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(sampleRate);
  setUint32(sampleRate * 2 * numOfChan); // byte rate
  setUint16(numOfChan * 2); // block align
  setUint16(16); // 16-bit
  setUint32(0x61746164); // "data" chunk
  setUint32(length - pos - 4); // chunk length

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (offset < buffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      outBuffer.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([outBuffer], { type: 'audio/wav' });
}

// Safely probe for supported mimeType across mobile and desktop
function getSupportedMimeType(): string | undefined {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return undefined;
  }
  if (typeof MediaRecorder.isTypeSupported !== 'function') {
    return undefined;
  }

  // Prefer formats compatible with the current environment:
  // - iOS Safari natively supports audio/mp4 and audio/aac
  // - Chrome/Firefox/Android natively support audio/webm;codecs=opus and audio/webm
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ];

  for (const t of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    } catch {}
  }
  return undefined;
}

export const RolePlayModeView: React.FC<RolePlayModeViewProps> = ({
  pages,
  initialCharacter = 'pinky',
  onFinishRolePlay,
  onGoHome,
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>(initialCharacter);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [peekBlur, setPeekBlur] = useState<boolean>(false);

  // Recording & Playback State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isPlayingMyVoice, setIsPlayingMyVoice] = useState<boolean>(false);
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);

  // References for Media Management
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const voicePlayerRef = useRef<HTMLAudioElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const pcmChunksRef = useRef<Float32Array[]>([]);
  const speechRecognizerRef = useRef<any>(null);

  const currentPage = pages[currentPageIndex];
  const isLastPage = currentPageIndex === pages.length - 1;

  // Is chosen character speaking on this page?
  const isMyTurn = currentPage.rolePlaySpeakers.includes(selectedCharacter);

  const myCharacterLines = currentPage.lines.filter(
    (line) =>
      line.speaker === selectedCharacter ||
      line.speakerName?.toLowerCase().includes(selectedCharacter)
  );

  const targetLineToSpeak =
    myCharacterLines.length > 0
      ? myCharacterLines.map((l) => l.text).join(' ')
      : currentPage.lines[currentPage.lines.length - 1].text;

  // Cleanup all media when unmounting or changing page
  useEffect(() => {
    return () => {
      stopAllMedia();
    };
  }, [currentPageIndex]);

  const stopAllMedia = () => {
    speechService.stop();

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    // Stop speech recognition
    if (speechRecognizerRef.current) {
      try {
        speechRecognizerRef.current.stop();
      } catch {}
      speechRecognizerRef.current = null;
    }

    // Stop MediaRecorder cleanly
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
      mediaRecorderRef.current = null;
    }

    // Release all hardware microphone tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      mediaStreamRef.current = null;
    }

    // Close AudioContext fallback if active
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }

    // Stop recorded voice playback
    if (voicePlayerRef.current) {
      voicePlayerRef.current.pause();
      voicePlayerRef.current = null;
    }

    setIsRecording(false);
    setIsPlayingMyVoice(false);
  };

  const handlePageChange = (newIndex: number) => {
    stopAllMedia();
    if (recordedAudioUrl && recordedAudioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(recordedAudioUrl);
    }
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
    setPeekBlur(false);
    setMicErrorMessage(null);
    setRecognizedText(null);
    setCurrentPageIndex(newIndex);
  };

  // 1. Request microphone permission gracefully and start recording
  const handleStartRecording = async () => {
    soundEffects.click();
    stopAllMedia();
    setMicErrorMessage(null);
    setRecognizedText(null);

    // Check mediaDevices support
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== 'function'
    ) {
      setMicErrorMessage(
        'Microphone is not supported on this browser. You can still practice speaking aloud!'
      );
      return;
    }

    let stream: MediaStream;
    try {
      // Request microphone stream gracefully with audio processing
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;
    } catch (err: any) {
      console.warn('Microphone permission/access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicErrorMessage(
          'Microphone permission was denied. Please allow microphone access in your browser address bar/settings to record.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setMicErrorMessage(
          'No microphone was detected on this device. Please connect a microphone or headset.'
        );
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setMicErrorMessage(
          'Microphone is currently busy in another app or tab. Please close other audio apps and try again.'
        );
      } else {
        setMicErrorMessage(
          'Could not access microphone. Please check your browser audio permissions.'
        );
      }
      return;
    }

    // Optional Web Speech API recognition for live transcript feedback
    try {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        const recognizer = new SpeechRecognitionClass();
        recognizer.continuous = true;
        recognizer.interimResults = true;
        recognizer.lang = 'en-US';
        recognizer.onresult = (event: any) => {
          let text = '';
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript + ' ';
          }
          if (text.trim()) {
            setRecognizedText(text.trim());
          }
        };
        recognizer.onerror = () => {};
        recognizer.start();
        speechRecognizerRef.current = recognizer;
      }
    } catch {}

    // Initialize MediaRecorder
    try {
      const mimeType = getSupportedMimeType();
      audioChunksRef.current = [];

      let recorder: MediaRecorder;
      if (mimeType) {
        recorder = new MediaRecorder(stream, { mimeType });
      } else {
        recorder = new MediaRecorder(stream);
      }
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const finalMime = recorder.mimeType || mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: finalMime });

        if (blob.size > 0) {
          const url = URL.createObjectURL(blob);
          setRecordedAudioUrl(url);
          soundEffects.correct();
          try {
            confetti({
              particleCount: 45,
              spread: 55,
              origin: { y: 0.65 },
            });
          } catch {}
        }

        // Release hardware audio tracks immediately
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
      };

      // Start recording without timeslice (prevents corrupt MP4 containers in iOS Safari)
      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch (recorderError) {
      console.warn('MediaRecorder error, falling back to Web Audio PCM:', recorderError);
      // Fallback: Web Audio API ScriptProcessor to 16-bit WAV Blob
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const scriptNode = ctx.createScriptProcessor(4096, 1, 1);

        pcmChunksRef.current = [];
        scriptNode.onaudioprocess = (e) => {
          const input = e.inputBuffer.getChannelData(0);
          pcmChunksRef.current.push(new Float32Array(input));
        };

        source.connect(scriptNode);
        scriptNode.connect(ctx.destination);

        setIsRecording(true);
        setRecordingSeconds(0);

        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds((s) => s + 1);
        }, 1000);
      } catch (fallbackError) {
        console.error('All recording strategies failed:', fallbackError);
        setMicErrorMessage('Audio recording is not supported in this browser environment.');
      }
    }
  };

  // 2. Stop recording cleanly without breaking audio streams
  const handleStopRecording = () => {
    soundEffects.click();

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    // Stop speech recognition
    if (speechRecognizerRef.current) {
      try {
        speechRecognizerRef.current.stop();
      } catch {}
      speechRecognizerRef.current = null;
    }

    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        // Request final buffered data before stop
        if (typeof mediaRecorderRef.current.requestData === 'function') {
          mediaRecorderRef.current.requestData();
        }
        mediaRecorderRef.current.stop();
      } catch {}
      setIsRecording(false);
    } else if (audioContextRef.current && pcmChunksRef.current.length > 0) {
      // Process Web Audio fallback PCM buffer to WAV
      try {
        const ctx = audioContextRef.current;
        const chunks = pcmChunksRef.current;
        const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
        const audioBuffer = ctx.createBuffer(1, totalLen, ctx.sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        let offset = 0;
        for (const chunk of chunks) {
          channelData.set(chunk, offset);
          offset += chunk.length;
        }

        const wavBlob = bufferToWavBlob(audioBuffer);
        const url = URL.createObjectURL(wavBlob);
        setRecordedAudioUrl(url);
        soundEffects.correct();
        try {
          confetti({ particleCount: 45, spread: 55, origin: { y: 0.65 } });
        } catch {}
      } catch (wavErr) {
        console.warn('WAV conversion error:', wavErr);
      } finally {
        setIsRecording(false);
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
          mediaStreamRef.current = null;
        }
      }
    } else {
      setIsRecording(false);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    }
  };

  // 3. Play back user's recorded voice
  const handlePlayMyVoice = () => {
    soundEffects.click();
    if (!recordedAudioUrl) return;

    if (isPlayingMyVoice) {
      if (voicePlayerRef.current) {
        voicePlayerRef.current.pause();
      }
      setIsPlayingMyVoice(false);
      return;
    }

    const audio = new Audio(recordedAudioUrl);
    voicePlayerRef.current = audio;

    audio.onplay = () => setIsPlayingMyVoice(true);
    audio.onended = () => setIsPlayingMyVoice(false);
    audio.onpause = () => setIsPlayingMyVoice(false);
    audio.onerror = (e) => {
      console.warn('Recorded audio playback error:', e);
      setIsPlayingMyVoice(false);
    };

    audio.play().catch((err) => {
      console.warn('Audio playback was prevented:', err);
      setIsPlayingMyVoice(false);
    });
  };

  // Listen to character example voice
  const handleListenExample = () => {
    soundEffects.click();
    stopAllMedia();
    setIsAudioPlaying(true);

    speechService.speakText({
      text: targetLineToSpeak,
      speed: 0.85,
      pitch: selectedCharacter === 'pinky' ? 1.2 : selectedCharacter === 'toto' ? 1.15 : 0.85,
      onEnd: () => {
        setIsAudioPlaying(false);
      },
    });
  };

  return (
    <div className="flex flex-col justify-between min-h-full w-full max-w-lg mx-auto p-3 sm:p-4 select-none">
      {/* Top Bar: Home, Character Tabs & Page Counter */}
      <div>
        <div className="flex items-center justify-between py-1 mb-2">
          <button
            onClick={() => {
              soundEffects.click();
              stopAllMedia();
              onGoHome();
            }}
            className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100/90 hover:bg-amber-200 px-3 py-1.5 rounded-full border border-amber-300 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <div className="text-sm font-extrabold text-purple-900 bg-purple-100/90 px-3.5 py-1 rounded-full border border-purple-300 font-fairytale">
            Page {currentPage.pageNumber}/10
          </div>
        </div>

        {/* Character Selection Tabs */}
        <div className="w-full flex items-center justify-center gap-2 p-1 bg-amber-100/80 rounded-2xl border border-amber-200 mb-2">
          {(Object.keys(CHARACTERS) as CharacterId[]).map((charKey) => {
            const char = CHARACTERS[charKey];
            const isSelected = selectedCharacter === charKey;
            return (
              <button
                key={charKey}
                onClick={() => {
                  soundEffects.click();
                  stopAllMedia();
                  setSelectedCharacter(charKey);
                  setRecordedAudioUrl(null);
                  setRecognizedText(null);
                }}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? `${char.badgeColor} shadow-sm scale-102 ring-2 ring-white font-fairytale`
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span className="text-base">{char.emoji}</span>
                <span>{char.displayName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Stage: 3D Illustration Canvas */}
      <div className="w-full min-h-[200px] max-h-[280px] my-1 p-1.5 sm:p-2 rounded-3xl bg-gradient-to-b from-[#fffef8] via-[#fef8e8] to-[#fbedd2] border-2 border-[#edd8b0] shadow-[0_12px_28px_-6px_rgba(180,120,40,0.16),0_4px_10px_rgba(0,0,0,0.04)]">
        <StoryIllustration
          pageNumber={currentPage.pageNumber}
          isAudioPlaying={isAudioPlaying || isPlayingMyVoice}
        />
      </div>

      {/* Story Text Box */}
      <div className="w-full bg-white p-4 rounded-3xl shadow-sm border-2 border-amber-200/90 my-2">
        {/* Peek Button (if blurred) */}
        {isMyTurn && (
          <div className="flex justify-end mb-1">
            <button
              onClick={() => {
                soundEffects.click();
                setPeekBlur((prev) => !prev);
              }}
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer"
            >
              {peekBlur ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{peekBlur ? 'Hide' : 'Peek'}</span>
            </button>
          </div>
        )}

        {/* Text Lines */}
        <div className="space-y-2.5">
          {currentPage.lines.map((line) => {
            const isCharacterLine =
              line.speaker === selectedCharacter ||
              line.speakerName?.toLowerCase().includes(selectedCharacter);

            const shouldBlur = isCharacterLine && !peekBlur;

            return (
              <div key={line.id} className="relative">
                <p
                  className={`text-xl sm:text-2xl font-bold leading-relaxed sm:leading-loose font-fairytale transition-all duration-300 ${
                    shouldBlur
                      ? 'filter blur-sm select-none text-pink-600 bg-pink-50/40 p-1.5 rounded-xl border border-dashed border-pink-300'
                      : isCharacterLine
                      ? 'text-pink-700 bg-pink-50/50 p-1.5 rounded-xl font-bold'
                      : 'text-slate-900'
                  }`}
                >
                  {line.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Microphone Error Alert Banner */}
        {micErrorMessage && (
          <div className="mt-3 p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{micErrorMessage}</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={handleStartRecording}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setMicErrorMessage(null)}
                  className="px-2 py-1 text-slate-500 hover:text-slate-800 text-[11px] cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Recording In-Progress Indicator */}
        {isRecording && (
          <div className="mt-3 p-3 bg-rose-50 border-2 border-rose-300 rounded-2xl animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                <span className="text-xs font-bold text-rose-800 font-fairytale">
                  Recording... {recordingSeconds}s 🎙️
                </span>
              </div>
              <button
                onClick={handleStopRecording}
                className="flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                <Square className="w-3 h-3 fill-white" />
                <span>Done</span>
              </button>
            </div>
            {recognizedText && (
              <p className="mt-2 text-xs text-rose-900 italic font-medium bg-white/70 p-1.5 rounded-lg border border-rose-200">
                &ldquo;{recognizedText}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* Listen to My Voice Player */}
        {recordedAudioUrl && !isRecording && (
          <div className="mt-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 font-fairytale">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Voice Recorded!</span>
              </div>
              <button
                onClick={handleStartRecording}
                className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Re-record</span>
              </button>
            </div>

            <button
              onClick={handlePlayMyVoice}
              className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer font-fairytale ${
                isPlayingMyVoice
                  ? 'bg-amber-500 text-white ring-2 ring-amber-300 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white'
              }`}
            >
              {isPlayingMyVoice ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Playing Your Voice... 🎧</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>▶️ Listen to My Voice</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar: [Prev] [Speak / Stop] [Example] [Next] */}
      <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2 pt-2 pb-1">
        {/* Previous Page */}
        <button
          onClick={() => {
            soundEffects.pageTurn();
            if (currentPageIndex > 0) {
              handlePageChange(currentPageIndex - 1);
            } else {
              onGoHome();
            }
          }}
          className="flex items-center gap-1 px-3 py-2.5 rounded-2xl font-bold text-xs sm:text-sm font-fairytale bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{currentPageIndex > 0 ? 'Prev' : 'Home'}</span>
        </button>

        {/* Center: Speak & Example */}
        <div className="flex items-center gap-2">
          {/* Speak / Stop Button */}
          {isRecording ? (
            <button
              onClick={handleStopRecording}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md bg-rose-600 hover:bg-rose-700 text-white animate-pulse active:scale-95 cursor-pointer font-fairytale"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Stop ({recordingSeconds}s)</span>
            </button>
          ) : (
            <button
              onClick={handleStartRecording}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer font-fairytale bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white"
            >
              <Mic className="w-4 h-4" />
              <span>Speak</span>
            </button>
          )}

          {/* Example Audio Button */}
          <button
            onClick={handleListenExample}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-2.5 bg-white hover:bg-amber-50 text-amber-900 rounded-2xl font-semibold text-xs sm:text-sm border border-amber-300 shadow-xs transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-fairytale">Example</span>
          </button>
        </div>

        {/* Next Button */}
        <div>
          <button
            onClick={() => {
              soundEffects.pageTurn();
              if (isLastPage) {
                onFinishRolePlay();
              } else {
                handlePageChange(currentPageIndex + 1);
              }
            }}
            className="flex items-center gap-1 px-3 sm:px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm font-fairytale transition-all duration-200 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white shadow-md cursor-pointer ring-2 ring-purple-300"
          >
            <span>{isLastPage ? 'Finish' : 'Next'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
