/**
 * AudioContext — Quran audio playback engine
 *
 * Key design decisions:
 *  - currentQariRef (useRef) stays in sync with state AND is read inside play(),
 *    so changing the qari takes effect on the VERY NEXT play() call regardless of
 *    React's async state update cycle (fixes "wrong reciter plays" race condition).
 *  - currentSurahRef / currentAyahRef / totalAyahsRef are refs for the same reason:
 *    onPlaybackStatusUpdate needs them for auto-advance without creating circular deps.
 *  - playRef lets onPlaybackStatusUpdate call play() without circular useCallback deps.
 *  - onPlaybackStatusUpdate has zero state/function deps (uses only refs), so it is
 *    created once and never recreated — prevents sound objects from receiving a stale
 *    callback after a re-render.
 */

import React, {
  createContext, useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { QARIS, Qari, DEFAULT_QARI, getAudioUrl } from '@/constants/qaris';

interface AudioContextType {
  isPlaying: boolean;
  isLoading: boolean;
  currentSurah: number;
  currentAyah: number;
  currentQari: Qari;
  totalAyahs: number;
  position: number;
  duration: number;
  qaris: Qari[];
  play: (surah: number, ayah: number, total: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  playNext: () => Promise<void>;
  playPrev: () => Promise<void>;
  seek: (millis: number) => Promise<void>;
  setQari: (qari: Qari) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null);

  // ── Mutable refs — always current, zero render lag ──────────────────────────
  const currentQariRef   = useRef<Qari>(DEFAULT_QARI);
  const currentSurahRef  = useRef(1);
  const currentAyahRef   = useRef(1);
  const totalAyahsRef    = useRef(7);
  /** Ref to play() so onPlaybackStatusUpdate can call it without circular deps */
  const playRef          = useRef<((s: number, a: number, t: number) => Promise<void>) | null>(null);

  // ── React state — drives UI ─────────────────────────────────────────────────
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [currentSurah, setCurrentSurah] = useState(1);
  const [currentAyah,  setCurrentAyah]  = useState(1);
  const [totalAyahs,   setTotalAyahs]   = useState(7);
  const [currentQari,  setCurrentQari]  = useState<Qari>(DEFAULT_QARI);
  const [position,     setPosition]     = useState(0);
  const [duration,     setDuration]     = useState(0);

  // ── Audio session setup ──────────────────────────────────────────────────────
  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS:    true,
      shouldDuckAndroid:       true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});
    return () => { soundRef.current?.unloadAsync().catch(() => {}); };
  }, []);

  const unloadCurrent = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch {}
      soundRef.current = null;
    }
  };

  // ── Playback status callback — no deps, uses refs only ──────────────────────
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
  }, []); // intentionally empty — uses refs only

  // ── play() — reads currentQariRef so it NEVER plays the wrong reciter ────────
  const play = useCallback(async (surah: number, ayah: number, total: number) => {
    setIsLoading(true);
    // Update both state (for UI) and refs (for callbacks) synchronously
    setCurrentSurah(surah);   currentSurahRef.current = surah;
    setCurrentAyah(ayah);     currentAyahRef.current  = ayah;
    setTotalAyahs(total);     totalAyahsRef.current   = total;
    try {
      await unloadCurrent();
      // ← always uses the ref, not the state, so qari change is instant
      const url = getAudioUrl(currentQariRef.current.folder, surah, ayah);
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
  }, [onPlaybackStatusUpdate]); // stable — onPlaybackStatusUpdate never changes

  // Keep playRef current so auto-advance always calls the latest play
  useEffect(() => { playRef.current = play; }, [play]);

  const pause  = async () => { try { await soundRef.current?.pauseAsync();  } catch {} setIsPlaying(false); };
  const resume = async () => { try { await soundRef.current?.playAsync();   } catch {} setIsPlaying(true);  };
  const stop   = async () => { await unloadCurrent(); setIsPlaying(false); setPosition(0); };

  const playNext = async () => {
    if (currentAyahRef.current < totalAyahsRef.current)
      await play(currentSurahRef.current, currentAyahRef.current + 1, totalAyahsRef.current);
  };
  const playPrev = async () => {
    if (currentAyahRef.current > 1)
      await play(currentSurahRef.current, currentAyahRef.current - 1, totalAyahsRef.current);
  };
  const seek = async (millis: number) => { try { await soundRef.current?.setPositionAsync(millis); } catch {} };

  /** Changing the qari updates ref immediately so the NEXT play() uses the new voice */
  const setQari = useCallback((qari: Qari) => {
    currentQariRef.current = qari;  // sync — takes effect before any re-render
    setCurrentQari(qari);            // async — updates UI
  }, []);

  return (
    <AudioContext.Provider value={{
      isPlaying, isLoading, currentSurah, currentAyah, currentQari, totalAyahs,
      position, duration, qaris: QARIS,
      play, pause, resume, stop, playNext, playPrev, seek, setQari,
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
