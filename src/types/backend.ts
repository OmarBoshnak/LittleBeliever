/**
 * Backend API Response Types
 * Matches the FastAPI backend response models
 */

export interface AnalysisResponse {
  ok: boolean;
  wer: number; // Word Error Rate (0-1)
  cer: number; // Character Error Rate (0-1)
  transcript: string; // ASR transcription
  summary: string; // Child-friendly feedback
  rule_hints: Array<{
    word: string;
    hint: string;
    type?: string;
    position?: number;
  }>;
  alignment_hints: Array<{
    type: 'substitution' | 'omission' | 'insertion';
    position: number;
    ref: string;
    hyp: string;
    hint: string;
  }>;
  tajweed_analysis: {
    rules: Array<{
      rule_name: string;
      description: string;
      examples: string[];
    }>;
    difficulty_level: string;
    estimated_duration: number;
  };
  score: number; // 0-100
  needs_repeat: boolean;
}

export interface RecitationURLResponse {
  ok: boolean;
  url: string;
  reciter_name: string;
  surah: number;
  ayah: number;
}

export interface TajweedGuideResponse {
  ok: boolean;
  text: string;
  rules: Array<{
    rule_name: string;
    description: string;
    examples: string[];
  }>;
  difficulty_level: string;
  estimated_duration: number;
}

export interface ValidationResponse {
  ok: boolean;
  valid: boolean;
  message?: string;
  max_ayah?: number;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  service: string;
  version: string;
  timestamp: string;
  checks: {
    whisper?: {
      status: string;
      model?: string;
      device?: string;
      error?: string;
    };
    gemini?: {
      status: string;
      model?: string;
      note?: string;
    };
    cache?: {
      status: string;
      items?: number;
      max_size?: number;
      ttl?: number;
    };
    rate_limiter?: {
      status: string;
      general_limit?: string;
      analyze_limit?: string;
    };
  };
}

export interface BackendError {
  ok: false;
  error: string;
  detail?: string;
  timestamp?: string;
}

