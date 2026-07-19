import { useState, useCallback, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { AudioState } from '../types/tajweed.types';

/** Never throws — safe to call whether or not the TTS engine is ready. */
function safeStop(): void {
  try { Speech.stop(); } catch {}
}

export const useAudioPlayer = () => {
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    currentItemId: null,
    isLoading: false,
    error: null,
  });

  // Stop speech when the screen unmounts
  useEffect(() => {
    return () => { safeStop(); };
  }, []);

  const playAudio = useCallback(async (itemId: string, arabicText: string) => {
    // Stop anything already speaking — safe even if TTS isn't initialised yet
    safeStop();

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

  // Synchronous — Speech.stop() returns void; no async needed and no unhandled rejection risk.
  const stopAudio = useCallback(() => {
    safeStop();
    setState({ isPlaying: false, currentItemId: null, isLoading: false, error: null });
  }, []);

  return { ...state, playAudio, stopAudio };
};
