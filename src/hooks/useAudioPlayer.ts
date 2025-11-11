/**
 * Audio Player Hook
 * Manages audio playback state using react-native-track-player
 */

import { useState, useEffect, useCallback } from 'react';
import TrackPlayer, { State, Event } from 'react-native-track-player';
import {
  playVerse,
  pausePlayback,
  resumePlayback,
  stopPlayback,
  getPlaybackState,
  isPlaying as checkIsPlaying,
  getCurrentPosition,
  getDuration,
} from '../service/trackPlayerService';

export interface PlaybackState {
  isPlaying: boolean;
  isLoading: boolean;
  currentPosition: number;
  duration: number;
  error: string | null;
}

export const useAudioPlayer = () => {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    isLoading: false,
    currentPosition: 0,
    duration: 0,
    error: null,
  });

  // Update playback state
  const updateState = useCallback(async () => {
    try {
      const state = await getPlaybackState();
      const playing = await checkIsPlaying();
      const position = await getCurrentPosition();
      const duration = await getDuration();

      setPlaybackState(prev => ({
        ...prev,
        isPlaying: playing,
        isLoading: state === State.Loading || state === State.Buffering,
        currentPosition: position,
        duration: duration,
      }));
    } catch (error: any) {
      setPlaybackState(prev => ({
        ...prev,
        error: error.message || 'Failed to update playback state',
      }));
    }
  }, []);

  // Play a verse
  const play = useCallback(
    async (surah: number, ayah: number, reciterId: string, backendReciterId?: number, fallbackUrl?: string) => {
      try {
        setPlaybackState(prev => ({
          ...prev,
          isLoading: true,
          error: null,
        }));

        await playVerse(surah, ayah, reciterId, backendReciterId, fallbackUrl);
        
        // Quick state update (reduced delay)
        await new Promise(resolve => setTimeout(resolve, 100));
        await updateState();
      } catch (error: any) {
        setPlaybackState(prev => ({
          ...prev,
          isLoading: false,
          isPlaying: false,
          error: error.message || 'Failed to play audio',
        }));
        throw error;
      }
    },
    [updateState],
  );

  // Pause playback
  const pause = useCallback(async () => {
    try {
      await pausePlayback();
      await updateState();
    } catch (error: any) {
      setPlaybackState(prev => ({
        ...prev,
        error: error.message || 'Failed to pause playback',
      }));
    }
  }, [updateState]);

  // Resume playback
  const resume = useCallback(async () => {
    try {
      await resumePlayback();
      await updateState();
    } catch (error: any) {
      setPlaybackState(prev => ({
        ...prev,
        error: error.message || 'Failed to resume playback',
      }));
    }
  }, [updateState]);

  // Stop playback
  const stop = useCallback(async () => {
    try {
      await stopPlayback();
      setPlaybackState({
        isPlaying: false,
        isLoading: false,
        currentPosition: 0,
        duration: 0,
        error: null,
      });
    } catch (error: any) {
      setPlaybackState(prev => ({
        ...prev,
        error: error.message || 'Failed to stop playback',
      }));
    }
  }, []);

  // Toggle play/pause
  const togglePlayPause = useCallback(
    async (surah: number, ayah: number, reciterId: string, backendReciterId?: number) => {
      if (playbackState.isPlaying) {
        await pause();
      } else {
        await play(surah, ayah, reciterId, backendReciterId);
      }
    },
    [playbackState.isPlaying, play, pause],
  );

  // Set up event listeners
  useEffect(() => {
    const subscription = TrackPlayer.addEventListener(
      Event.PlaybackState,
      updateState,
    );
    const progressSubscription = TrackPlayer.addEventListener(
      Event.PlaybackProgressUpdated,
      updateState,
    );
    const playbackEndSubscription = TrackPlayer.addEventListener(
      Event.PlaybackQueueEnded,
      () => {
        setPlaybackState(prev => ({
          ...prev,
          isPlaying: false,
          isLoading: false,
        }));
      },
    );

    // Initial state update
    updateState();

    // Update position periodically only when playing (optimized)
    // Use events for most updates, interval as fallback
    let intervalId: NodeJS.Timeout | null = null;
    const startInterval = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        updateState();
      }, 2000); // Reduced frequency from 1000ms to 2000ms since events handle most updates
    };

    // Start interval - it will be cleaned up when component unmounts
    startInterval();

    return () => {
      subscription.remove();
      progressSubscription.remove();
      playbackEndSubscription.remove();
      if (intervalId) clearInterval(intervalId);
    };
  }, [updateState]);

  return {
    playbackState,
    play,
    pause,
    resume,
    stop,
    togglePlayPause,
    updateState,
  };
};

