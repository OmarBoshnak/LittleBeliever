/**
 * @format
 */

import 'react-native-gesture-handler'; // MUST BE FIRST!
import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import { name as appName } from './app.json';
import playbackService from './src/service/playbackService';

AppRegistry.registerComponent(appName, () => App);

// Register Track Player service for background playback
TrackPlayer.registerPlaybackService(() => playbackService);
