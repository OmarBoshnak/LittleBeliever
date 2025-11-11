/**
 * Backend API Service
 * Handles all communication with the FastAPI backend
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG } from '../config/api';
import type {
  AnalysisResponse,
  RecitationURLResponse,
  TajweedGuideResponse,
  ValidationResponse,
  HealthCheckResponse,
} from '../types/backend';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_CONFIG.API_KEY,
  },
});

/**
 * Analyze Quran recitation
 * Sends audio file and expected Arabic text to backend for analysis
 */
export const analyzeRecitation = async (
  audioUri: string,
  expectedArabic: string,
): Promise<AnalysisResponse> => {
  try {
    // Determine file type from URI
    let fileType = 'audio/m4a';
    let fileName = 'recitation.m4a';
    
    // Check URI extension to determine file type
    if (audioUri.includes('.m4a') || audioUri.includes('.mp4')) {
      fileType = 'audio/m4a';
      fileName = 'recitation.m4a';
    } else if (audioUri.includes('.wav')) {
      fileType = 'audio/wav';
      fileName = 'recitation.wav';
    } else if (audioUri.includes('.mp3')) {
      fileType = 'audio/mp3';
      fileName = 'recitation.mp3';
    } else if (audioUri.includes('.aac')) {
      fileType = 'audio/aac';
      fileName = 'recitation.aac';
    }

    // Create FormData for multipart/form-data
    // React Native FormData format
    const formData = new FormData();
    
    // Normalize audio URI for React Native
    const normalizedUri = audioUri.startsWith('file://') 
      ? audioUri 
      : audioUri.startsWith('/') 
        ? `file://${audioUri}`
        : `file:///${audioUri}`;

    // Log for debugging
    console.log('[BackendAPI] Uploading audio:', {
      originalUri: audioUri.substring(0, 50) + '...',
      normalizedUri: normalizedUri.substring(0, 50) + '...',
      fileType,
      fileName,
      expectedArabic: expectedArabic.substring(0, 30) + '...',
    });

    // Add audio file - React Native format
    formData.append('audio', {
      uri: normalizedUri,
      type: fileType,
      name: fileName,
    } as any);

    // Add expected Arabic text
    formData.append('expected_arabic', expectedArabic);

    // Create a new axios instance without default Content-Type header
    // React Native will set it automatically with boundary for FormData
    const uploadClient = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
    });

    // Remove Content-Type header - React Native will set it automatically with boundary
    const response = await uploadClient.post<AnalysisResponse>(
      '/analyze',
      formData,
      {
        headers: {
          'X-API-Key': API_CONFIG.API_KEY,
          // Don't set Content-Type - let axios/React Native set it with boundary
        },
      },
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string; error?: string }>;
    const errorMessage = 
      axiosError.response?.data?.detail ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      'Failed to analyze recitation';
    
    // Log detailed error for debugging
    console.error('[BackendAPI] Analysis error:', {
      message: errorMessage,
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      audioUri: audioUri.substring(0, 50) + '...',
    });
    
    throw new Error(errorMessage);
  }
};

/**
 * Get recitation audio URL for a specific surah and ayah
 */
export const getRecitationURL = async (
  surah: number,
  ayah: number,
  reciterId: number = 7,
): Promise<RecitationURLResponse> => {
  try {
    const response = await apiClient.get<RecitationURLResponse>('/recitation', {
      params: {
        surah,
        ayah,
        reciter_id: reciterId,
      },
      headers: {
        'X-API-Key': API_CONFIG.API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string; error?: string }>;
    throw new Error(
      axiosError.response?.data?.detail ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Failed to get recitation URL',
    );
  }
};

/**
 * Get Tajweed guide for Arabic text
 */
export const getTajweedGuide = async (
  arabicText: string,
): Promise<TajweedGuideResponse> => {
  try {
    const formData = new FormData();
    formData.append('arabic_text', arabicText);

    const response = await apiClient.post<TajweedGuideResponse>(
      '/tajweed-guide',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-API-Key': API_CONFIG.API_KEY,
        },
      },
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string; error?: string }>;
    throw new Error(
      axiosError.response?.data?.detail ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Failed to get Tajweed guide',
    );
  }
};

/**
 * Validate surah and ayah numbers
 */
export const validateAyah = async (
  surah: number,
  ayah: number,
): Promise<ValidationResponse> => {
  try {
    const response = await apiClient.post<ValidationResponse>(
      '/validate-ayah',
      {
        surah,
        ayah,
      },
      {
        headers: {
          'X-API-Key': API_CONFIG.API_KEY,
        },
      },
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string; error?: string }>;
    throw new Error(
      axiosError.response?.data?.detail ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Failed to validate ayah',
    );
  }
};

/**
 * Health check endpoint
 */
export const healthCheck = async (): Promise<HealthCheckResponse> => {
  try {
    const response = await apiClient.get<HealthCheckResponse>('/health');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(
      axiosError.message || 'Backend health check failed',
    );
  }
};

/**
 * Test backend connection
 */
export const testBackendConnection = async (): Promise<boolean> => {
  try {
    const health = await healthCheck();
    const isConnected = health.status === 'healthy' || health.status === 'degraded';
    
    // Log backend status for debugging
    if (isConnected) {
      console.log('[BackendAPI] Backend connected:', {
        status: health.status,
        service: health.service,
        version: health.version,
        gemini: health.checks?.gemini?.status || 'not configured',
        whisper: health.checks?.whisper?.status || 'not configured',
      });
    } else {
      console.warn('[BackendAPI] Backend unhealthy:', health);
    }
    
    return isConnected;
  } catch (error) {
    console.error('[BackendAPI] Backend connection test failed:', error);
    return false;
  }
};

/**
 * Get backend status with detailed information
 */
export const getBackendStatus = async (): Promise<{
  connected: boolean;
  geminiEnabled: boolean;
  whisperEnabled: boolean;
  message: string;
}> => {
  try {
    const health = await healthCheck();
    const connected = health.status === 'healthy' || health.status === 'degraded';
    const geminiEnabled = health.checks?.gemini?.status === 'configured';
    const whisperEnabled = health.checks?.whisper?.status === 'ok';
    
    let message = 'Backend is ';
    if (health.status === 'healthy') {
      message += 'healthy and ready';
    } else if (health.status === 'degraded') {
      message += 'degraded but functional';
    } else {
      message += 'unhealthy';
    }
    
    if (geminiEnabled) {
      message += ' (Gemini AI enabled)';
    } else {
      message += ' (Using fallback feedback)';
    }
    
    return {
      connected,
      geminiEnabled,
      whisperEnabled,
      message,
    };
  } catch (error) {
    return {
      connected: false,
      geminiEnabled: false,
      whisperEnabled: false,
      message: 'Cannot connect to backend. Please check if the server is running.',
    };
  }
};

