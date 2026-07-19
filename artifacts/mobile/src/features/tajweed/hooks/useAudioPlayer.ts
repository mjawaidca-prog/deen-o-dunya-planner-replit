import { useState, useCallback, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { AudioState } from '../types/tajweed.types';

export const useAudioPlayer = () => {
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    currentItemId: null,
    isLoading: false,
    error: null,
  });

  const soundRef = useRef<Audio.Sound | null>(null);
  const retryCountRef = useRef(0);

  // Configure audio session once
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    }).catch(() => {});
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
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

  const playAudio = useCallback(async (itemId: string, audioSource: any) => {
    // Stop whatever is currently playing
    await unloadCurrent();

    setState({ isPlaying: false, currentItemId: itemId, isLoading: true, error: null });
    retryCountRef.current = 0;

    // Placeholder — no real file yet
    if (!audioSource) {
      setTimeout(() => {
        setState({ isPlaying: false, currentItemId: null, isLoading: false, error: null });
      }, 800);
      return;
    }

    const attemptPlay = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          audioSource,
          { shouldPlay: true },
          (status) => {
            if (status.isLoaded && status.didJustFinish) {
              setState(prev => ({ ...prev, isPlaying: false, currentItemId: null }));
            }
          },
        );
        soundRef.current = sound;
        setState({ isPlaying: true, currentItemId: itemId, isLoading: false, error: null });
      } catch (err) {
        if (retryCountRef.current < 1) {
          retryCountRef.current += 1;
          await attemptPlay();
        } else {
          setState({
            isPlaying: false,
            currentItemId: null,
            isLoading: false,
            error: 'Audio coming soon',
          });
        }
      }
    };

    await attemptPlay();
  }, []);

  const stopAudio = useCallback(async () => {
    await unloadCurrent();
    setState({ isPlaying: false, currentItemId: null, isLoading: false, error: null });
  }, []);

  return { ...state, playAudio, stopAudio };
};
