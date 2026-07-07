import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Platform } from 'react-native';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSurah, setCurrentSurah] = useState(1);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [totalAyahs, setTotalAyahs] = useState(7);
  const [currentQari, setCurrentQari] = useState<Qari>(DEFAULT_QARI);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setupAudio();
    return () => { soundRef.current?.unloadAsync(); };
  }, []);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch {}
  };

  const unloadCurrent = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch {}
      soundRef.current = null;
    }
  };

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    setIsPlaying(status.isPlaying);
    setPosition(status.positionMillis);
    setDuration(status.durationMillis ?? 0);

    if (status.didJustFinish) {
      // Auto-advance to next ayah
      setCurrentAyah(prev => {
        const next = prev + 1;
        if (next <= totalAyahs) {
          play(currentSurah, next, totalAyahs);
          return next;
        }
        setIsPlaying(false);
        return prev;
      });
    }
  }, [currentSurah, totalAyahs]);

  const play = useCallback(async (surah: number, ayah: number, total: number) => {
    setIsLoading(true);
    setCurrentSurah(surah);
    setCurrentAyah(ayah);
    setTotalAyahs(total);
    try {
      await unloadCurrent();
      const url = getAudioUrl(currentQari.folder, surah, ayah);
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
  }, [currentQari, onPlaybackStatusUpdate]);

  const pause = async () => {
    try { await soundRef.current?.pauseAsync(); } catch {}
    setIsPlaying(false);
  };

  const resume = async () => {
    try { await soundRef.current?.playAsync(); } catch {}
    setIsPlaying(true);
  };

  const stop = async () => {
    await unloadCurrent();
    setIsPlaying(false);
    setPosition(0);
  };

  const playNext = async () => {
    if (currentAyah < totalAyahs) {
      await play(currentSurah, currentAyah + 1, totalAyahs);
    }
  };

  const playPrev = async () => {
    if (currentAyah > 1) {
      await play(currentSurah, currentAyah - 1, totalAyahs);
    }
  };

  const seek = async (millis: number) => {
    try { await soundRef.current?.setPositionAsync(millis); } catch {}
  };

  const setQari = (qari: Qari) => setCurrentQari(qari);

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
