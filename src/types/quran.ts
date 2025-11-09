export type RevelationPlace = 'Makkah' | 'Madinah';

export interface Verse {
  arabic: string;
  transliteration?: string;
  translation?: string;
  tafsir?: string;
}

export interface SurahMeta {
  id: number;
  name: string;
  nameArabic: string;
  ayahCount: number;
  revelationPlace: RevelationPlace;
  juz: number;
}

export interface Surah extends SurahMeta {
  verses: Verse[];
}

export interface JuzMeta {
  id: number;
  nameArabic: string;
  nameEnglish: string;
  startSurah: number;
  startSurahName: string;
  startSurahNameArabic: string;
  startAyah: number;
}

export interface Reciter {
  id: number; // Changed from string to number to match backend
  name: string;
  nameArabic?: string; // Backend uses 'name_ar'
  description?: string;
  style?: string; // Added: backend has 'style' (Murattal/Mujawwad)
  baseUrl?: string; // Added: backend has 'base_url'
}

export interface BookmarkData {
  surahId: number;
  verseIndex: number;
  timestamp: number;
}

export interface ProgressData {
  [surahId: number]: {
    completedVerses: number[];
    memorizedVerses: number[];
    lastReadVerse: number;
    lastReadTime: number;
  };
}

// Analysis types matching backend response structure
export interface AnalysisMistake {
  word: string;
  hint: string; // tajweed/articulation hint
  position?: number; // Added: word position in verse
  type?: string; // Added: error type (tajweed, pronunciation, etc.)
}

export interface AnalysisFeedback {
  isCorrect: boolean;
  score?: number; // 0..100
  mistakes?: AnalysisMistake[];
  message?: string; // child-friendly summary
  transcription?: string; // Added: ASR transcription from backend
  expected_text?: string; // Added: expected Arabic text
  wer?: number; // Added: Word Error Rate from backend
  alignment?: Array<{
    ref: string;
    hyp: string;
    match: boolean;
  }>; // Added: word-level alignment
}
