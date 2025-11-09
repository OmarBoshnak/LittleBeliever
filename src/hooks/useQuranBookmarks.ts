import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKMARK_STORAGE_KEY = '@littlebeliever:quran-bookmarks';
const PROGRESS_STORAGE_KEY = '@littlebeliever:quran-progress';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [bookmarkValue, progressValue] = await Promise.all([
          AsyncStorage.getItem(BOOKMARK_STORAGE_KEY),
          AsyncStorage.getItem(PROGRESS_STORAGE_KEY),
        ]);
        const bookmarkList = parseJson<QuranBookmark[]>(bookmarkValue) ?? [];
        const progressMap = parseJson<SurahProgressMap>(progressValue) ?? {};
        setBookmarks(bookmarkList);
        setProgress(progressMap);
      } catch (error) {
        console.warn("Failed to load Qur'an bookmarks", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const persistBookmarks = useCallback(async (next: QuranBookmark[]) => {
    setBookmarks(next);
    try {
      await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn("Failed to persist Qur'an bookmarks", error);
    }
  }, []);

  const persistProgress = useCallback(async (next: SurahProgressMap) => {
    setProgress(next);
    try {
      await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn("Failed to persist Qur'an progress", error);
    }
  }, []);

  const toggleBookmark = useCallback(
    (bookmark: Omit<QuranBookmark, 'createdAt'>) => {
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
        persistBookmarks(filtered);
        return;
      }

      const next = [
        {
          ...bookmark,
          createdAt: Date.now(),
        },
        ...bookmarks,
      ];
      persistBookmarks(next);
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
      const next: SurahProgressMap = {
        ...progress,
        [surahNumber]: {
          ayahNumber,
          updatedAt: Date.now(),
        },
      };
      persistProgress(next);
    },
    [progress, persistProgress],
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

  return {
    loading,
    bookmarks,
    bookmarkMap,
    progress,
    toggleBookmark,
    removeBookmark,
    setLastRead,
    clearProgress,
  };
};
