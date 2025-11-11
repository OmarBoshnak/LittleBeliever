/**
 * Track Player Service
 * Handles audio playback using react-native-track-player
 */

import TrackPlayer, {
  Capability,
  State,
  Event,
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';
import { getRecitationURL } from '../api/backendApi';

// Map reciter string IDs to backend numeric IDs
const RECITER_ID_MAP: Record<string, number> = {
  'ar.abdurrahmaansudais': 2,
  'ar.alafasy': 2,
  'ar.husary': 3,
  'ar.minshawi': 4,
  'ar.mahermuaiqly': 2,
  'ar.shaatree': 7, // Default
  'ar.abdulbasitmurattal': 1,
};

/**
 * Initialize Track Player
 * Call this once when the app starts
 */
export const setupTrackPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer({
      autoHandleInterruptions: true,
      autoUpdateMetadata: true,
    });

    // Configure capabilities
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
        Capability.SeekTo,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
      progressUpdateEventInterval: 1,
    });

    console.log('✓ Track Player initialized');
  } catch (error) {
    console.error('✗ Track Player setup failed:', error);
    throw error;
  }
};

/**
 * Get recitation URL from backend and add to track player
 */
export const loadRecitationTrack = async (
  surah: number,
  ayah: number,
  reciterId: string,
  backendReciterId?: number,
  fallbackUrl?: string,
): Promise<string> => {
  try {
    let audioUrl: string;
    let reciterName: string = 'Unknown Reciter';

    // Try to get URL from backend first
    try {
      // Use provided backend ID or map string reciter ID to numeric ID
      const numericReciterId = backendReciterId || RECITER_ID_MAP[reciterId] || 7;
      console.log(`[TrackPlayer] Fetching URL for Surah ${surah}, Ayah ${ayah}, Reciter ID ${numericReciterId}`);

      // Get URL from backend
      const response = await getRecitationURL(surah, ayah, numericReciterId);
      console.log(`[TrackPlayer] Backend response:`, response);

      if (response.ok && response.url) {
        audioUrl = response.url;
        reciterName = response.reciter_name || reciterName;
        console.log(`[TrackPlayer] Using backend URL: ${audioUrl}`);
      } else {
        throw new Error('Backend response not OK or missing URL');
      }
    } catch (backendError) {
      console.warn('[TrackPlayer] Backend fetch failed, trying fallback:', backendError);
      
      // Use fallback URL if provided
      if (fallbackUrl) {
        audioUrl = fallbackUrl;
        console.log(`[TrackPlayer] Using fallback URL: ${audioUrl}`);
      } else {
        throw new Error(
          `Failed to get audio URL: ${backendError instanceof Error ? backendError.message : 'Unknown error'}. ` +
          `Please ensure your backend is running and accessible.`
        );
      }
    }

    // Add track to player
    const track = {
      id: `surah-${surah}-ayah-${ayah}-reciter-${reciterId}`,
      url: audioUrl,
      title: `Surah ${surah}, Ayah ${ayah}`,
      artist: reciterName,
      artwork: undefined,
    };

    console.log(`[TrackPlayer] Adding track:`, track);

    // Remove existing tracks and add new one
    await TrackPlayer.reset();
    await TrackPlayer.add(track);
    
    console.log(`[TrackPlayer] Track added successfully`);

    return audioUrl;
  } catch (error) {
    console.error('[TrackPlayer] Load recitation track error:', error);
    throw error;
  }
};

/**
 * Play a specific verse
 */
export const playVerse = async (
  surah: number,
  ayah: number,
  reciterId: string,
  backendReciterId?: number,
  fallbackUrl?: string,
): Promise<void> => {
  try {
    console.log(`[TrackPlayer] Loading track: Surah ${surah}, Ayah ${ayah}, Reciter ${reciterId}`);
    
    // If we have a fallback URL, use it immediately for faster playback
    // Then try to get backend URL in background
    let audioUrl = fallbackUrl;
    
    if (fallbackUrl) {
      console.log(`[TrackPlayer] Using fallback URL immediately: ${fallbackUrl}`);
      // Load fallback URL immediately
      const track = {
        id: `surah-${surah}-ayah-${ayah}-reciter-${reciterId}`,
        url: fallbackUrl,
        title: `Surah ${surah}, Ayah ${ayah}`,
        artist: 'Reciter',
        artwork: undefined,
      };
      
      await TrackPlayer.reset();
      await TrackPlayer.add(track);
      
      // Start playing immediately
      await TrackPlayer.play();
      console.log(`[TrackPlayer] Started playing with fallback URL`);
      
      // Try to get backend URL in background (optional upgrade)
      loadRecitationTrack(surah, ayah, reciterId, backendReciterId, fallbackUrl)
        .then(backendUrl => {
          if (backendUrl && backendUrl !== fallbackUrl) {
            console.log(`[TrackPlayer] Backend URL loaded, can switch if needed: ${backendUrl}`);
            // Optionally switch to backend URL if different
          }
        })
        .catch(err => {
          console.warn(`[TrackPlayer] Backend URL fetch failed (using fallback):`, err);
        });
      
      return;
    }
    
    // No fallback, load from backend
    const url = await loadRecitationTrack(surah, ayah, reciterId, backendReciterId, fallbackUrl);
    console.log(`[TrackPlayer] Track loaded: ${url}`);

    // Minimal wait for track to be ready
    await new Promise(resolve => setTimeout(resolve, 50));

    // Check if track is ready
    const state = await TrackPlayer.getState();
    console.log(`[TrackPlayer] State before play: ${state}`);

    // If already playing, stop first
    if (state === State.Playing) {
      await TrackPlayer.stop();
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Play the track
    await TrackPlayer.play();
    
    // Quick verification
    await new Promise(resolve => setTimeout(resolve, 100));
    const newState = await TrackPlayer.getState();
    console.log(`[TrackPlayer] State after play: ${newState}`);
    
    if (newState !== State.Playing && newState !== State.Buffering) {
      const errorMsg = `Expected Playing/Buffering state but got: ${newState}. URL: ${url}`;
      console.warn(`[TrackPlayer] ${errorMsg}`);
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('[TrackPlayer] Play verse error:', error);
    throw error;
  }
};

/**
 * Pause playback
 */
export const pausePlayback = async (): Promise<void> => {
  try {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
    }
  } catch (error) {
    console.error('Pause playback error:', error);
    throw error;
  }
};

/**
 * Resume playback
 */
export const resumePlayback = async (): Promise<void> => {
  try {
    const state = await TrackPlayer.getState();
    if (state === State.Paused || state === State.Ready) {
      await TrackPlayer.play();
    }
  } catch (error) {
    console.error('Resume playback error:', error);
    throw error;
  }
};

/**
 * Stop playback
 */
export const stopPlayback = async (): Promise<void> => {
  try {
    await TrackPlayer.stop();
    await TrackPlayer.reset();
  } catch (error) {
    console.error('Stop playback error:', error);
    throw error;
  }
};

/**
 * Get current playback state
 */
export const getPlaybackState = async (): Promise<State> => {
  try {
    return await TrackPlayer.getState();
  } catch (error) {
    console.error('Get playback state error:', error);
    return State.None;
  }
};

/**
 * Check if currently playing
 */
export const isPlaying = async (): Promise<boolean> => {
  const state = await getPlaybackState();
  return state === State.Playing;
};

/**
 * Get current position
 */
export const getCurrentPosition = async (): Promise<number> => {
  try {
    return await TrackPlayer.getPosition();
  } catch (error) {
    console.error('Get current position error:', error);
    return 0;
  }
};

/**
 * Get track duration
 */
export const getDuration = async (): Promise<number> => {
  try {
    return await TrackPlayer.getDuration();
  } catch (error) {
    console.error('Get duration error:', error);
    return 0;
  }
};

/**
 * Seek to position
 */
export const seekTo = async (position: number): Promise<void> => {
  try {
    await TrackPlayer.seekTo(position);
  } catch (error) {
    console.error('Seek error:', error);
    throw error;
  }
};

