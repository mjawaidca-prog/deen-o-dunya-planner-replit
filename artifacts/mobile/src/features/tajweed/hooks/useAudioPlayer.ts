import { useState, useCallback, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { AudioState } from '../types/tajweed.types';

export const useAudioPlayer = () => {
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    currentItemId: null,
    isLoading: false,
    error: null,
  });

  // Stop speech when the screen unmounts
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const playAudio = useCallback(async (itemId: string, arabicText: string) => {
    // Stop anything already speaking
    await Speech.stop();

    setState({ isPlaying: false, currentItemId: itemId, isLoading: true, error: null });

    try {
      await Speech.speak(arabicText, {
        language: 'ar',
        rate: 0.75,
        pitch: 1.0,
        onStart: () => {
          setState({ isPlaying: true, currentItemId: itemId, isLoading: false, error: null });
        },
        onDone: () => {
          setState({ isPlaying: false, currentItemId: null, isLoading: false, error: null });
        },
        onStopped: () => {
          setState({ isPlaying: false, currentItemId: null, isLoading: false, error: null });
        },
        onError: () => {
          setState({
            isPlaying: false,
            currentItemId: null,
            isLoading: false,
            error: 'Could not play audio',
          });
        },
      });
    } catch {
      setState({
        isPlaying: false,
        currentItemId: null,
        isLoading: false,
        error: 'Could not play audio',
      });
    }
  }, []);

  const stopAudio = useCallback(async () => {
    await Speech.stop();
    setState({ isPlaying: false, currentItemId: null, isLoading: false, error: null });
  }, []);

  return { ...state, playAudio, stopAudio };
};
