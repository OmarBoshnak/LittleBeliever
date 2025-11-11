/**
 * Audio Recording Hook
 * Handles audio recording for Quran recitation analysis using react-native-nitro-sound
 */

import { useEffect, useRef, useState } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import type { AudioSet, RecordBackType } from 'react-native-nitro-sound';
import {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  OutputFormatAndroidType,
  useSoundRecorderWithStates,
} from 'react-native-nitro-sound';

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  currentPosition: number;
  currentDuration: number;
  recordSecs: number;
  recordTime: string;
}

export const useAudioRecorder = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    currentPosition: 0,
    currentDuration: 0,
    recordSecs: 0,
    recordTime: '00:00:00',
  });

  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const isPausedRef = useRef(false);

  // Configure audio settings
  const audioSet: AudioSet = {
    // Android settings
    AudioSourceAndroid: AudioSourceAndroidType.MIC,
    OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
    AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
    // iOS settings
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
    AVFormatIDKeyIOS: 'aac',
    AVNumberOfChannelsKeyIOS: 2,
    // Common settings
    AudioQuality: 'high',
    AudioChannels: 2,
    AudioSamplingRate: 44100,
  };

  // Use nitro-sound recorder with states
  const recorder = useSoundRecorderWithStates({
    subscriptionDuration: 1, // Update every second
    autoDispose: false, // We'll manage disposal manually
    onRecord: (e: RecordBackType & { ended?: boolean }) => {
      const recordSecs = e.recordSecs || Math.floor(e.currentPosition / 1000);
      const minutes = Math.floor(recordSecs / 60);
      const seconds = recordSecs % 60;
      const hours = Math.floor(minutes / 60);
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      setRecordingState(prev => ({
        ...prev,
        isRecording: e.isRecording ?? prev.isRecording,
        currentPosition: e.currentPosition,
        recordSecs,
        recordTime: timeString,
        isPaused: isPausedRef.current,
      }));

      if (e.ended) {
        setRecordingState(prev => ({
          ...prev,
          isRecording: false,
          isPaused: false,
        }));
      }
    },
  });

  // Ensure recorder is initialized and sound instance is created
  useEffect(() => {
    if (recorder) {
      // Access sound property to trigger initialization via ensureSoundActivation
      try {
        const sound = recorder.sound;
        console.log('[Recorder] Recorder initialized successfully', {
          hasSound: !!sound,
          hasStartRecorder: typeof recorder.startRecorder === 'function',
          hasStopRecorder: typeof recorder.stopRecorder === 'function',
        });
      } catch (error) {
        console.error('[Recorder] Failed to initialize sound instance:', error);
      }
    } else {
      console.warn('[Recorder] Recorder not properly initialized');
    }
  }, [recorder]);

  // Request microphone permission
  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);

        if (
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          setHasPermission(true);
          return true;
        } else {
          Alert.alert(
            'Permission Denied',
            'Microphone permission is required to record your recitation.',
          );
          setHasPermission(false);
          return false;
        }
      } catch (err) {
        console.warn('Permission request error:', err);
        setHasPermission(false);
        return false;
      }
    } else {
      // iOS - permissions are requested automatically on first use
      setHasPermission(true);
      return true;
    }
  };

  // Start recording
  const startRecording = async (): Promise<string | null> => {
    try {
      // Check if recorder is available
      if (!recorder) {
        console.error('[Recorder] Recorder instance not available');
        Alert.alert(
          'Recording Error',
          'Recorder not initialized. Please restart the app completely. If the problem persists, ensure react-native-nitro-sound is properly installed and rebuild the app.',
        );
        return null;
      }

      // Verify recorder has required methods
      if (typeof recorder.startRecorder !== 'function') {
        console.error('[Recorder] startRecorder method not available on recorder');
        Alert.alert(
          'Recording Error',
          'Recorder methods not available. The native module may not be properly linked. Please rebuild the app.',
        );
        return null;
      }

      // Request permission if not already granted
      if (hasPermission === false) {
        const granted = await requestPermission();
        if (!granted) {
          return null;
        }
      }

      console.log('[Recorder] Starting recording...', { 
        recorder: !!recorder, 
        startRecorder: typeof recorder.startRecorder === 'function',
        hasAudioSet: !!audioSet,
        hasPermission: hasPermission !== false,
      });
      
      // Start recording - methods are directly on recorder object
      // The recorder.startRecorder internally calls ensureSoundActivation
      // Pass undefined for path (auto-generate), audioSet for config, and false for not to override
      const uri = await recorder.startRecorder(undefined, audioSet, false);
      
      console.log('[Recorder] Recording started, URI:', uri);
      
      setAudioPath(uri);
      isPausedRef.current = false;
      setRecordingState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        recordSecs: 0,
        recordTime: '00:00:00',
      }));

      return uri;
    } catch (error: any) {
      console.error('[Recorder] Start recording error:', error);
      const errorMessage = error.message || 'Failed to start recording. Please try again.';
      
      // Provide more helpful error message
      if (errorMessage.includes('No recorder instance') || errorMessage.includes('recorder instance')) {
        Alert.alert(
          'Recording Error',
          'Recorder not initialized. Please restart the app or check if react-native-nitro-sound is properly installed.',
        );
      } else {
        Alert.alert('Recording Error', errorMessage);
      }
      return null;
    }
  };

  // Stop recording
  const stopRecording = async (): Promise<string | null> => {
    try {
      if (!recorder) {
        console.error('[Recorder] Recorder instance not available');
        Alert.alert('Recording Error', 'Recorder not available. Recording may have been lost.');
        return null;
      }

      if (typeof recorder.stopRecorder !== 'function') {
        console.error('[Recorder] stopRecorder method not available');
        Alert.alert('Recording Error', 'Cannot stop recording. Recorder methods not available.');
        return null;
      }

      console.log('[Recorder] Stopping recording...');
      const result = await recorder.stopRecorder();
      console.log('[Recorder] Recording stopped, result:', result);
      
      isPausedRef.current = false;
      setRecordingState(prev => ({
        ...prev,
        isRecording: false,
        isPaused: false,
      }));

      return result;
    } catch (error: any) {
      console.error('[Recorder] Stop recording error:', error);
      Alert.alert('Recording Error', error.message || 'Failed to stop recording.');
      return null;
    }
  };

  // Pause recording
  const pauseRecording = async () => {
    try {
      if (!recorder) {
        console.error('[Recorder] Recorder instance not available');
        return;
      }
      await recorder.pauseRecorder();
      isPausedRef.current = true;
      setRecordingState(prev => ({
        ...prev,
        isPaused: true,
      }));
    } catch (error: any) {
      console.error('[Recorder] Pause recording error:', error);
    }
  };

  // Resume recording
  const resumeRecording = async () => {
    try {
      if (!recorder) {
        console.error('[Recorder] Recorder instance not available');
        return;
      }
      await recorder.resumeRecorder();
      isPausedRef.current = false;
      setRecordingState(prev => ({
        ...prev,
        isPaused: false,
      }));
    } catch (error: any) {
      console.error('[Recorder] Resume recording error:', error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingState.isRecording && recorder) {
        recorder.stopRecorder().catch(console.error);
      }
      try {
        if (recorder?.dispose) {
          recorder.dispose();
        }
      } catch (error) {
        console.error('[Recorder] Dispose error:', error);
      }
    };
  }, [recorder, recordingState.isRecording]);

  return {
    recordingState,
    audioPath,
    hasPermission,
    requestPermission,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  };
};
