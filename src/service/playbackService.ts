/**
 * Track Player Playback Service
 * Required for react-native-track-player background playback
 */

import TrackPlayer, { Event } from 'react-native-track-player';

module.exports = async function () {
  // This service is required for background playback
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.stop();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    // Handle next track if needed
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    // Handle previous track if needed
  });
};

