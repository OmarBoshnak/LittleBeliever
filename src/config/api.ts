/**
 * Backend API Configuration
 * Configure your FastAPI backend URL and API key here
 */

// For development, use localhost with appropriate IP
// Android emulator: http://10.0.2.2:8081
// iOS simulator: http://localhost:8081
// Physical device: Use your computer's IP address (e.g., http://192.168.1.100:8081)

const getBaseURL = (): string => {
  // You can use environment variables or hardcode for now
  // For production, replace with your actual backend URL
  if (__DEV__) {
    // Development - adjust based on your setup
    // For Android emulator:
    return 'http://10.0.2.2:8081';
    // For iOS simulator:
    // return 'http://localhost:8081';
    // For physical device, replace with your computer's IP:
    // return 'http://192.168.1.100:8081';
  }
  // Production URL
  return 'https://your-backend-domain.com';
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  API_KEY: 'dev-key-change-in-production', // Should match backend config.py API_KEY
  TIMEOUT: 60000, // 60 seconds for audio analysis
} as const;

