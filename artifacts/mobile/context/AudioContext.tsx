/**
 * AudioContext — Quran audio playback engine
 *
 * Supports two audio modes:
 *  - 'arabic'      → plays the reciter's Arabic recitation (everyayah.com/data/{folder})
 *  - 'translation' → plays a translation voice (Urdu / English) from the same CDN
 *
 * Race-condition fixes (see comments):
 *  - currentQariRef, audioModeRef, translationVoiceRef — always current, no stale closures
 *  - onPlaybackStatusUpdate has [] deps — reads only refs, never state
 *  - playRef lets onPlaybackStatusUpdate call play() without circular useCallback deps
 */

import React, {
  createContext, useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { QARIS, Qari, DEFAULT_QARI, getAudioUrl } from '@/constants/qaris';
import {
  TRANSLATION_VOICES, TranslationVoice, translationAudioUrl,
} from '@/constants/translationVoices';

type AudioMode = 'arabic' | 'translation';

interface AudioContextType {
  // State
  isPlaying:        boolean;
  isLoading:        boolean;
  currentSurah:     number;
  currentAyah:      number;
  currentQari:      Qari;
  totalAyahs:       number;
  position:         number;
  duration:         number;
  // Mode & translation
  audioMode:        AudioMode;
  translationVoice: TranslationVoice | null;
  // Lists
  qaris:            Qari[];
  translationVoices: TranslationVoice[];
  // Actions
  play:        (surah: number, ayah: number, total: number) => Promise<void>;
  pause:       () => Promise<void>;
  resume:      () => Promise<void>;
  stop:        () => Promise<void>;
  playNext:    () => Promise<void>;
  playPrev:    () => Promise<void>;
  seek:        (millis: number) => Promise<void>;
  setQari:     (qari: Qari) => void;
  setAudioMode:(mode: AudioMode) => void;
  setTranslationVoice: (voice: TranslationVoice) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null);

  // ── Mutable refs — always current, no stale closure lag ─────────────────
  const currentQariRef        = useRef<Qari>(DEFAULT_QARI);
  const currentSurahRef       = useRef(1);
  const currentAyahRef        = useRef(1);
  const totalAyahsRef         = useRef(7);
  const audioModeRef          = useRef<AudioMode>('arabic');
  const translationVoiceRef   = useRef<TranslationVoice | null>(null);
  const playRef               = useRef<((s: number, a: number, t: number) => Promise<void>) | null>(null);

  // ── React state — drives UI ──────────────────────────────────────────────
  const [isPlaying,        setIsPlaying]        = useState(false);
  const [isLoading,        setIsLoading]        = useState(false);
  const [currentSurah,     setCurrentSurah]     = useState(1);
  const [currentAyah,      setCurrentAyah]      = useState(1);
  const [totalAyahs,       setTotalAyahs]       = useState(7);
  const [currentQari,      setCurrentQari]      = useState<Qari>(DEFAULT_QARI);
  const [position,         setPosition]         = useState(0);
  const [duration,         setDuration]         = useState(0);
  const [audioMode,        setAudioModeState]   = useState<AudioMode>('arabic');
  const [translationVoice, setTranslationVoiceState] = useState<TranslationVoice | null>(null);

  // ── Audio session ────────────────────────────────────────────────────────
  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground:    true,
      playsInSilentModeIOS:       true,
      shouldDuckAndroid:          true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});
    return () => { soundRef.current?.unloadAsync().catch(() => {}); };
  }, []);

  const unloadCurrent = async () => {
    if (soundRef.current) {
      try { await soundRef.current.stopAsync(); await soundRef.current.unloadAsync(); } catch {}
      soundRef.current = null;
    }
  };

  // ── Playback callback — zero deps, uses refs only ───────────────────────
  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    setIsPlaying(status.isPlaying);
    setPosition(status.positionMillis);
    setDuration(status.durationMillis ?? 0);
    if (status.didJustFinish) {
      const next = currentAyahRef.current + 1;
      if (next <= totalAyahsRef.current) {
        currentAyahRef.current = next;
        setCurrentAyah(next);
        playRef.current?.(currentSurahRef.current, next, totalAyahsRef.current);
      } else {
        setIsPlaying(false);
      }
    }
  }, []);

  // ── play() — reads refs so qari/mode changes are always instant ──────────
  const play = useCallback(async (surah: number, ayah: number, total: number) => {
    setIsLoading(true);
    setCurrentSurah(surah);   currentSurahRef.current = surah;
    setCurrentAyah(ayah);     currentAyahRef.current  = ayah;
    setTotalAyahs(total);     totalAyahsRef.current   = total;
    try {
      await unloadCurrent();
      // Choose URL based on current mode
      let url: string;
      if (audioModeRef.current === 'translation' && translationVoiceRef.current) {
        url = translationAudioUrl(translationVoiceRef.current, surah, ayah);
      } else {
        url = getAudioUrl(currentQariRef.current.folder, surah, ayah);
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true },
        onPlaybackStatusUpdate,
      );
      soundRef.current = sound;
      setIsPlaying(true);
    } catch (e) {
      console.warn('Audio play error:', e);
    } finally {
      setIsLoading(false);
    }
  }, [onPlaybackStatusUpdate]);

  useEffect(() => { playRef.current = play; }, [play]);

  const pause  = async () => { try { await soundRef.current?.pauseAsync(); } catch {} setIsPlaying(false); };
  const resume = async () => { try { await soundRef.current?.playAsync();  } catch {} setIsPlaying(true);  };
  const stop   = async () => { await unloadCurrent(); setIsPlaying(false); setPosition(0); };

  const playNext = async () => {
    if (currentAyahRef.current < totalAyahsRef.current)
      await play(currentSurahRef.current, currentAyahRef.current + 1, totalAyahsRef.current);
  };
  const playPrev = async () => {
    if (currentAyahRef.current > 1)
      await play(currentSurahRef.current, currentAyahRef.current - 1, totalAyahsRef.current);
  };
  const seek = async (millis: number) => {
    try { await soundRef.current?.setPositionAsync(millis); } catch {}
  };

  const setQari = useCallback((qari: Qari) => {
    currentQariRef.current = qari;
    setCurrentQari(qari);
  }, []);

  const setAudioMode = useCallback((mode: AudioMode) => {
    audioModeRef.current = mode;
    setAudioModeState(mode);
  }, []);

  const setTranslationVoice = useCallback((voice: TranslationVoice) => {
    translationVoiceRef.current = voice;
    setTranslationVoiceState(voice);
    // Auto-switch to translation mode when a voice is selected
    audioModeRef.current = 'translation';
    setAudioModeState('translation');
  }, []);

  return (
    <AudioContext.Provider value={{
      isPlaying, isLoading, currentSurah, currentAyah, currentQari, totalAyahs,
      position, duration, audioMode, translationVoice,
      qaris: QARIS, translationVoices: TRANSLATION_VOICES,
      play, pause, resume, stop, playNext, playPrev, seek,
      setQari, setAudioMode, setTranslationVoice,
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
