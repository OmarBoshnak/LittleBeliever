import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKMARK_STORAGE_KEY = '@littlebeliever:quran-bookmarks';
const PROGRESS_STORAGE_KEY = '@littlebeliever:quran-progress';
const LEARNING_PROGRESS_STORAGE_KEY = '@littlebeliever:quran-learning-progress';

export interface QuranBookmark {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  surahNameArabic: string;
  createdAt: number;
}

export interface SurahProgressEntry {
  ayahNumber: number;
  updatedAt: number;
}

export type SurahProgressMap = Record<number, SurahProgressEntry>;

export interface LearningProgressEntry {
  lastAyah: number;
  completedAyahs: number[];
  updatedAt: number;
}

export type LearningProgressMap = Record<number, LearningProgressEntry>;

const parseJson = <T>(value: string | null): T | null => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn("Failed to parse Qur'an storage value", error);
    return null;
  }
};

export const useQuranBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<QuranBookmark[]>([]);
  const [progress, setProgress] = useState<SurahProgressMap>({});
  const [learningProgress, setLearningProgress] = useState<LearningProgressMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [bookmarkValue, progressValue, learningProgressValue] = await Promise.all([
          AsyncStorage.getItem(BOOKMARK_STORAGE_KEY),
          AsyncStorage.getItem(PROGRESS_STORAGE_KEY),
          AsyncStorage.getItem(LEARNING_PROGRESS_STORAGE_KEY),
        ]);
        const bookmarkList = parseJson<QuranBookmark[]>(bookmarkValue) ?? [];
        const progressMap = parseJson<SurahProgressMap>(progressValue) ?? {};
        const learningProgressMap = parseJson<LearningProgressMap>(learningProgressValue) ?? {};
        setBookmarks(bookmarkList);
        setProgress(progressMap);
        setLearningProgress(learningProgressMap);
      } catch (error) {
        console.warn("Failed to load Qur'an bookmarks", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const persistBookmarks = useCallback(async (next: QuranBookmark[]) => {
    // Don't update state here - state should be updated optimistically before calling this
    try {
      await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn("Failed to persist Qur'an bookmarks", error);
      throw error; // Re-throw to allow rollback
    }
  }, []);

  const persistProgress = useCallback(async (next: SurahProgressMap) => {
    // Update state immediately (optimistic update)
    setProgress(next);
    try {
      await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn("Failed to persist Qur'an progress", error);
      // Progress updates are less critical, so we don't rollback
    }
  }, []);

  const toggleBookmark = useCallback(
    (bookmark: Omit<QuranBookmark, 'createdAt'>) => {
      // Optimistic update - update UI immediately
      const exists = bookmarks.some(
        item =>
          item.surahNumber === bookmark.surahNumber &&
          item.ayahNumber === bookmark.ayahNumber,
      );

      if (exists) {
        const filtered = bookmarks.filter(
          item =>
            !(
              item.surahNumber === bookmark.surahNumber &&
              item.ayahNumber === bookmark.ayahNumber
            ),
        );
        // Update state immediately
        setBookmarks(filtered);
        // Persist in background (non-blocking)
        persistBookmarks(filtered).catch(err => {
          console.warn('Failed to persist bookmark removal:', err);
          // Rollback on error
          setBookmarks(bookmarks);
        });
        return;
      }

      const next = [
        {
          ...bookmark,
          createdAt: Date.now(),
        },
        ...bookmarks,
      ];
      // Update state immediately
      setBookmarks(next);
      // Persist in background (non-blocking)
      persistBookmarks(next).catch(err => {
        console.warn('Failed to persist bookmark:', err);
        // Rollback on error
        setBookmarks(bookmarks);
      });
    },
    [bookmarks, persistBookmarks],
  );

  const removeBookmark = useCallback(
    (surahNumber: number, ayahNumber: number) => {
      const filtered = bookmarks.filter(
        item =>
          !(item.surahNumber === surahNumber && item.ayahNumber === ayahNumber),
      );
      persistBookmarks(filtered);
    },
    [bookmarks, persistBookmarks],
  );

  const setLastRead = useCallback(
    (surahNumber: number, ayahNumber: number) => {
      // Optimistic update - update UI immediately
      const next: SurahProgressMap = {
        ...progress,
        [surahNumber]: {
          ayahNumber,
          updatedAt: Date.now(),
        },
      };
      // Update state immediately
      setProgress(next);
      // Persist in background
      AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next)).catch(err => {
        console.warn('Failed to persist progress:', err);
      });
    },
    [progress],
  );

  const clearProgress = useCallback(
    (surahNumber: number) => {
      if (!(surahNumber in progress)) {
        return;
      }
      const rest = { ...progress };
      delete rest[surahNumber];
      persistProgress(rest);
    },
    [progress, persistProgress],
  );
  const getBookmarkKey = useCallback(
    (surahNumber: number, ayahNumber: number) => `${surahNumber}-${ayahNumber}`,
    [],
  );

  const bookmarkMap = useMemo(() => {
    return bookmarks.reduce<Record<string, QuranBookmark>>((acc, item) => {
      acc[getBookmarkKey(item.surahNumber, item.ayahNumber)] = item;
      return acc;
    }, {});
  }, [bookmarks, getBookmarkKey]);

  const setLearningProgressForSurah = useCallback(
    async (surahNumber: number, lastAyah: number, completedAyahs: number[]) => {
      const next: LearningProgressMap = {
        ...learningProgress,
        [surahNumber]: {
          lastAyah,
          completedAyahs,
          updatedAt: Date.now(),
        },
      };
      setLearningProgress(next);
      try {
        await AsyncStorage.setItem(LEARNING_PROGRESS_STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        console.warn('Failed to persist learning progress:', error);
      }
    },
    [learningProgress],
  );

  const getLearningProgress = useCallback(
    (surahNumber: number): LearningProgressEntry | null => {
      return learningProgress[surahNumber] || null;
    },
    [learningProgress],
  );

  const clearLearningProgress = useCallback(
    async (surahNumber: number) => {
      if (!(surahNumber in learningProgress)) {
        return;
      }
      const rest = { ...learningProgress };
      delete rest[surahNumber];
      setLearningProgress(rest);
      try {
        await AsyncStorage.setItem(LEARNING_PROGRESS_STORAGE_KEY, JSON.stringify(rest));
      } catch (error) {
        console.warn('Failed to clear learning progress:', error);
      }
    },
    [learningProgress],
  );

  return {
    loading,
    bookmarks,
    bookmarkMap,
    progress,
    learningProgress,
    toggleBookmark,
    removeBookmark,
    setLastRead,
    clearProgress,
    setLearningProgressForSurah,
    getLearningProgress,
    clearLearningProgress,
  };
};
