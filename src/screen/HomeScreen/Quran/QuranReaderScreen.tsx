import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootstackParamList } from '../../../MainNavigation/Routes.tsx';
import { useLanguage } from '../../../context/LanguageContext.tsx';
import { useTheme } from '../../../theme/ThemeContext.tsx';
import { Button } from '../../../component/Button.tsx';
import { Progress } from '../../../component/Progress.tsx';
import {
  ArrowLeft,
  Book,
  Check,
  GraduationCap,
  Mic,
  RotateCcw,
  Settings,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react-native';
import {
  type AudioEdition,
  type Ayah,
  getSurahFull,
  type TranslationEdition,
} from '../../../api/quranApi.ts';
import { useQuranBookmarks } from '../../../hooks/useQuranBookmarks.ts';
import { useAudioRecorder } from '../../../hooks/useAudioRecorder.ts';
import { useAudioPlayer } from '../../../hooks/useAudioPlayer.ts';
import { analyzeRecitation } from '../../../api/backendApi.ts';
import TrackPlayer, { Event, State } from 'react-native-track-player';
import { VerseCard } from './components/VerseCard.tsx';
import { SurahHeader } from './components/SurahHeader.tsx';
import {
  type Reciter,
  reciters,
  ReciterSelector,
} from './components/ReciterSelector.tsx';
import { ReadingControls } from './components/ReadingControls.tsx';
import { borderRadius, fontSize, spacing } from '../../../theme/spacing.ts';
import { Card } from '../../../component/Card.tsx';

type NavigationProps = NativeStackNavigationProp<RootstackParamList>;
type RouteProps = RouteProp<RootstackParamList, 'QuranReaderScreen'>;

type ViewMode = 'reading' | 'learning';
type RepeatMode = 'none' | 'one' | 'all';
type RecordingState = 'idle' | 'recording' | 'analyzing' | 'feedback';

interface Verse extends Ayah {
  transliteration?: string;
  tafsir?: string;
}

export const QuranReaderScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const { colors } = useTheme();
  const {
    bookmarks,
    toggleBookmark,
    setLastRead,
    getLearningProgress,
    setLearningProgressForSurah,
  } = useQuranBookmarks();

  const params = route.params;
  const surahNumber = params?.surahNumber || 1;
  const startAyah = params?.startAyah || 0;

  const [viewMode, setViewMode] = useState<ViewMode>('reading');
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(reciters[0]);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(startAyah);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');
  const [showTranslation, setShowTranslation] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showReciterModal, setShowReciterModal] = useState(false);
  const [showAyahSelector, setShowAyahSelector] = useState(false);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [completedVerses, setCompletedVerses] = useState<number[]>([]);
  const [currentLearningVerse, setCurrentLearningVerse] = useState(0);
  const [_analysisResult, setAnalysisResult] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);
  const verseRefs = useRef<{ [key: number]: View | null }>({});

  // Audio recorder hook
  const {
    recordingState: audioRecordingState,
    startRecording: startAudioRecording,
    stopRecording: stopAudioRecording,
    requestPermission: requestAudioPermission,
  } = useAudioRecorder();

  // Audio player hook
  const {
    playbackState: audioPlaybackState,
    play: playAudio,
    pause: pauseAudio,
    stop: stopAudio,
  } = useAudioPlayer();

  // Sync isPlaying with audio player state
  useEffect(() => {
    setIsPlaying(audioPlaybackState.isPlaying);
  }, [audioPlaybackState.isPlaying]);

  const loadSurah = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const audioEdition = selectedReciter.id as AudioEdition;
      const translationEdition: TranslationEdition =
        language === 'ar' ? 'ar.muyassar' : 'en.asad';

      const ayahs = await getSurahFull(surahNumber, {
        audioEdition,
        translationEdition,
      });

      // Convert to Verse format with transliteration and tafsir placeholders
      // Remove Bismillah from first ayah text (except Al-Fatiha)
      // The API should remove it, but we'll do it again to be absolutely sure
      // Optimized Bismillah removal - pre-compile regex patterns
      const removeBismillah = (text: string, surahNum: number): string => {
        if (surahNum === 1 || surahNum === 9) return text;
        
        // Pre-compiled regex patterns for better performance
        const exactBismillah = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
        const BASMALA_RE = /^(?:\uFEFF|\s)*(?:بِ)?سْمِ?\s+ٱ?لل?ه(?:ِ|ّ|ٰ)?\s+ٱ?الرَّ?حْمَ?ٰ?ن(?:ِ|ٍ)?\s+ٱ?الرَّ?حِيم(?:ِ|ٍ)?\s*/u;
        const bismillahPatterns = [
          /بِسْمِ\s*ٱللَّهِ\s*ٱلرَّحْمَٰنِ\s*ٱلرَّحِيمِ/gu,
          /بِسْمِ\s*ٱللَّهِ\s*ٱلرَّحْمَٰنِ\s*ٱلرَّحِيمِ/gu,
          /بِسْمِ\s*اللَّهِ\s*الرَّحْمَٰنِ\s*الرَّحِيمِ/gu,
          /بِسْمِ\s*اللَّهِ\s*الرَّحْمَٰنِ\s*الرَّحِيمِ/gu,
          /بِسْمِٱللَّهِٱلرَّحْمَٰنِٱلرَّحِيمِ/gu,
          /بِسْمِٱللَّهِٱلرَّحْمَٰنِٱلرَّحِيمِ/gu,
          /بِسْمِ[^\u0600-\u06FF]*ٱ?للَّ?ه[^\u0600-\u06FF]*ٱ?الرَّ?حْم[^\u0600-\u06FF]*ٱ?الرَّ?حِيم[^\u0600-\u06FF]*/gu,
          /بِ?سْمِ?[^]*?ٱ?للَّ?ه[^]*?ٱ?الرَّ?حْم[^]*?ٱ?الرَّ?حِيم[^]*?/gu,
        ];
        const bismillahEndPattern = /بِ?سْمِ?[^]*?ٱ?للَّ?ه[^]*?ٱ?الرَّ?حْم[^]*?ٱ?الرَّ?حِيم[^]*?/u;
        const aggressivePattern = /^[\s\uFEFF\u200C\u200D]*بِ?سْمِ?[^]*?ٱ?للَّ?ه[^]*?ٱ?الرَّ?حْم[^]*?ٱ?الرَّ?حِيم[^]*?[\s\uFEFF\u200C\u200D]*/u;

        let processedText = text;

        // Try exact match first (fastest)
        if (processedText.includes(exactBismillah)) {
          processedText = processedText.replace(exactBismillah, '').trim();
        }

        // Try API regex pattern
        processedText = processedText.replace(BASMALA_RE, '').trim();

        // Try pattern matching
        for (const pattern of bismillahPatterns) {
          processedText = processedText.replace(pattern, '').trim();
        }

        // If text starts with Bismillah, find and remove it
        if (processedText.startsWith('بِسْمِ') || processedText.startsWith('بسم')) {
          const match = processedText.match(bismillahEndPattern);
          if (match && match[0]) {
            processedText = processedText.replace(match[0], '').trim();
          }
        }

        // Final aggressive removal if still contains keywords
        if (processedText.includes('بِسْمِ') || processedText.includes('ٱللَّهِ') || processedText.includes('ٱلرَّحْم')) {
          processedText = processedText.replace(aggressivePattern, '').trim();
        }

        // Clean up extra spaces
        return processedText.replace(/\s+/g, ' ').trim();
      };

      const versesData: Verse[] = ayahs.map((ayah, index) => {
        let text = ayah.text;

        // Remove Bismillah from first ayah except for Al-Fatiha and At-Tawbah
        if (index === 0) {
          text = removeBismillah(text, surahNumber);
        }

        return {
          ...ayah,
          text,
          transliteration: '',
          tafsir: `This is a simple explanation for kids about this verse.`,
        };
      });

      setVerses(versesData);
      setCurrentVerseIndex(startAyah);

      // Load learning progress for this surah after verses are loaded
      try {
        const learningProgress = getLearningProgress(surahNumber);
        if (learningProgress) {
          if (learningProgress.completedAyahs && learningProgress.completedAyahs.length > 0) {
            setCompletedVerses(learningProgress.completedAyahs);
          }
          // Set current learning verse to last ayah if valid
          if (
            learningProgress.lastAyah >= 0 &&
            learningProgress.lastAyah < versesData.length
          ) {
            setCurrentLearningVerse(learningProgress.lastAyah);
          }
        }
      } catch (progressError) {
        // If loading progress fails, start from beginning
        console.warn('Failed to load learning progress:', progressError);
      }
    } catch (err: any) {
      setError(err.message || t.networkError);
      Alert.alert(t.networkError || 'Error', err.message);
    } finally {
      setLoading(false);
    }
  }, [surahNumber, selectedReciter.id, language, startAyah, t.networkError, getLearningProgress]);

  useEffect(() => {
    loadSurah();
  }, [loadSurah]);

  useEffect(() => {
    // Scroll to current verse when it changes (only in reading mode)
    if (
      viewMode === 'reading' &&
      currentVerseIndex !== null &&
      flatListRef.current &&
      currentVerseIndex >= 0 &&
      currentVerseIndex < verses.length
    ) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: currentVerseIndex,
          animated: true,
          viewPosition: 0.5,
        });
      }, 100);
    }
  }, [currentVerseIndex, viewMode, verses.length]);

  const handlePlayVerse = useCallback(
    async (index: number) => {
      try {
        const verse = verses[index];
        if (!verse) return;

        setCurrentVerseIndex(index);
        setLastRead(surahNumber, index);

        // If already playing this verse, pause
        if (isPlaying && currentVerseIndex === index) {
          await pauseAudio();
          setIsPlaying(false);
          return;
        }

        // Stop any current playback
        if (isPlaying) {
          await stopAudio();
        }

        // Play the verse
        setIsPlaying(true);
        const ayahNumber = verse.numberInSurah || index + 1;

        // Use verse audio URL as fallback if backend fails
        const fallbackUrl = verse.audio;

        await playAudio(
          surahNumber,
          ayahNumber,
          selectedReciter.id,
          selectedReciter.backendId,
          fallbackUrl,
        );
      } catch (playbackError: any) {
        Alert.alert(
          'Playback Error',
          playbackError.message || 'Failed to play audio',
        );
        setIsPlaying(false);
      }
    },
    [
      verses,
      surahNumber,
      selectedReciter.id,
      selectedReciter.backendId,
      playAudio,
      pauseAudio,
      stopAudio,
      repeatMode,
      viewMode,
      isPlaying,
      currentVerseIndex,
      setLastRead,
    ],
  );

  // Listen for playback end event for auto-advance in reading mode
  useEffect(() => {
    if (viewMode !== 'reading') return;

    const handlePlaybackQueueEnded = () => {
      // Only auto-advance if we're in reading mode and currently playing
      if (
        viewMode === 'reading' &&
        isPlaying &&
        currentVerseIndex !== null &&
        currentVerseIndex !== undefined
      ) {
        const nextIndex = currentVerseIndex + 1;

        if (nextIndex < verses.length) {
          // Auto-advance to next verse
          if (repeatMode === 'one') {
            // Repeat same verse
            setTimeout(() => {
              handlePlayVerse(currentVerseIndex);
            }, 300);
          } else {
            // Auto-advance to next verse
            setCurrentVerseIndex(nextIndex);
            setTimeout(() => {
              handlePlayVerse(nextIndex);
            }, 300);
          }
        } else if (repeatMode === 'all') {
          // Loop back to beginning
          setCurrentVerseIndex(0);
          setTimeout(() => {
            handlePlayVerse(0);
          }, 300);
        } else {
          // End of surah
          setIsPlaying(false);
        }
      }
    };

    const subscription = TrackPlayer.addEventListener(
      Event.PlaybackQueueEnded,
      handlePlaybackQueueEnded,
    );

    return () => {
      subscription.remove();
    };
  }, [
    viewMode,
    isPlaying,
    currentVerseIndex,
    verses.length,
    repeatMode,
    handlePlayVerse,
  ]);

  const handlePlayAll = async () => {
    if (isPlaying) {
      await pauseAudio();
      setIsPlaying(false);
    } else {
      await handlePlayVerse(0);
    }
  };

  const handleBookmark = useCallback((verseIndex: number) => {
    if (!params) return;

    toggleBookmark({
      surahNumber,
      ayahNumber: verseIndex + 1,
      surahName: params.surahName || '',
      surahNameArabic: params.surahNameArabic || '',
    });
  }, [params, surahNumber, toggleBookmark]);

  const handleShare = useCallback(async (verseIndex: number) => {
    const verse = verses[verseIndex];
    if (!verse || !params) return;

    try {
      await Share.share({
        message: `${verse.text}\n\n${verse.translation || ''}\n\n— Surah ${
          params.surahName
        } (${params.surahNameArabic}), Ayah ${verseIndex + 1}`,
      });
    } catch (err) {
      // Error sharing - silently fail
    }
  }, [verses, params]);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'one';
      if (prev === 'one') return 'all';
      return 'none';
    });
  }, []);

  const startRecording = async (verseIndex: number) => {
    try {
      setCurrentLearningVerse(verseIndex);
      const verse = verses[verseIndex];

      if (!verse) {
        Alert.alert('Error', 'Verse not found');
        return;
      }

      // Request audio permission
      const hasPermission = await requestAudioPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Microphone permission is required to record your recitation. Please enable it in your device settings.',
        );
        return;
      }

      // Start recording
      setRecordingState('recording');
      const audioUri = await startAudioRecording();

      if (!audioUri) {
        setRecordingState('idle');
        Alert.alert(
          'Recording Error',
          'Failed to start recording. Please check your microphone permissions and try again.',
        );
        return;
      }

      // Recording started successfully - user can now stop it
    } catch (recordingError: any) {
      setRecordingState('idle');
      const errorMessage = recordingError.message || 'Failed to start recording. Please try again.';
      
      Alert.alert(
        'Recording Error',
        errorMessage,
        [
          {
            text: 'OK',
            style: 'default',
          },
        ],
      );
    }
  };

  const stopRecordingAndAnalyze = async () => {
    try {
      // Stop recording
      setRecordingState('analyzing');
      const audioUri = await stopAudioRecording();

      if (!audioUri) {
        setRecordingState('idle');
        Alert.alert(
          'Recording Error',
          'No recording found. Please try recording again.',
        );
        return;
      }

      const verse = verses[currentLearningVerse];
      if (!verse) {
        setRecordingState('idle');
        Alert.alert('Error', 'Verse not found');
        return;
      }

      // Validate audio URI
      if (!audioUri || audioUri.trim() === '') {
        setRecordingState('idle');
        Alert.alert(
          'Recording Error',
          'Invalid recording file. Please try recording again.',
        );
        return;
      }

      // Call backend API with better error handling
      let result;
      try {
        result = await analyzeRecitation(audioUri, verse.text);
      } catch (apiError: any) {
        // Check if it's a network error
        if (apiError.message?.includes('Network Error') || apiError.message?.includes('timeout')) {
          Alert.alert(
            'Connection Error',
            'Cannot connect to the server. Please check your internet connection and ensure the backend is running.',
            [
              {
                text: 'OK',
                onPress: () => setRecordingState('idle'),
              },
            ],
          );
          return;
        }
        // Check if it's a backend error
        if (apiError.message?.includes('Failed to analyze') || apiError.message?.includes('500')) {
          Alert.alert(
            'Analysis Error',
            'The server encountered an error. Please try again or check if the backend is properly configured.',
            [
              {
                text: 'OK',
                onPress: () => setRecordingState('idle'),
              },
            ],
          );
          return;
        }
        throw apiError;
      }

      setAnalysisResult(result);

      // Process result
      const score = result.score || 0;
      const summary = result.summary || '';

      // Set feedback message
      if (score >= 80) {
        setFeedbackMessage(summary || "✨ Excellent! You've improved 🌙");
        if (!completedVerses.includes(currentLearningVerse)) {
          const updatedCompleted = [...completedVerses, currentLearningVerse];
          setCompletedVerses(updatedCompleted);
          // Save learning progress
          setLearningProgressForSurah(surahNumber, currentLearningVerse, updatedCompleted);
        }
      } else if (score >= 60) {
        setFeedbackMessage(summary || '👍 Good job! Try again to improve!');
      } else {
        setFeedbackMessage(summary || '⚠️ Try again! Focus on pronunciation.');
      }

      // Save current learning position
      setLearningProgressForSurah(surahNumber, currentLearningVerse, completedVerses);

      setRecordingState('feedback');

      // Auto-advance if score is good
      if (score >= 80 && currentLearningVerse < verses.length - 1) {
        const nextVerse = currentLearningVerse + 1;
        setTimeout(() => {
          setRecordingState('idle');
          setCurrentLearningVerse(nextVerse);
          // Save new position
          setLearningProgressForSurah(surahNumber, nextVerse, completedVerses);
        }, 3000);
      } else {
        // Keep feedback visible for user to read
        setTimeout(() => {
          setRecordingState('idle');
        }, 5000);
      }
    } catch (analysisError: any) {
      setRecordingState('idle');
      const errorMessage = analysisError.message || 'Failed to analyze recitation. Please try again.';
      
      Alert.alert(
        'Analysis Error',
        errorMessage,
        [
          {
            text: 'OK',
            style: 'default',
          },
        ],
      );
    }
  };

  // Memoize bookmarked verse indices for faster lookups
  const bookmarkedVerseIndices = useMemo(() => {
    return new Set(
      bookmarks
        .filter(b => b.surahNumber === surahNumber)
        .map(b => b.ayahNumber - 1), // Convert to 0-based index
    );
  }, [bookmarks, surahNumber]);

  const isVerseBookmarked = useCallback((verseIndex: number): boolean => {
    return bookmarkedVerseIndices.has(verseIndex);
  }, [bookmarkedVerseIndices]);

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Loading Surah...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || verses.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.destructive }]}>
            {error || 'Failed to load surah'}
          </Text>
          <Button onPress={loadSurah} style={styles.retryButton}>
            Retry
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const currentVerse = verses[currentVerseIndex];
  const progressPercentage =
    viewMode === 'learning'
      ? (completedVerses.length / verses.length) * 100
      : ((currentVerseIndex + 1) / verses.length) * 100;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: spacing.xl,
        },
      ]}
      edges={['right', 'left']}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
            paddingTop: insets.top + spacing.md,
          },
        ]}
      >
        <Button
          variant="ghost"
          size="icon"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.foreground} />
        </Button>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            {params?.surahNameArabic || 'Surah'}
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.mutedForeground }]}
          >
            {params?.surahName || 'Surah Name'}
          </Text>
        </View>
        <Button
          variant="ghost"
          size="icon"
          onPress={() => setShowSettings(!showSettings)}
          style={styles.settingsButton}
        >
          <Settings size={20} color={colors.foreground} />
        </Button>
      </View>

      {/* Progress Bar */}
      {viewMode === 'learning' && (
        <View
          style={[styles.progressContainer, { backgroundColor: colors.card }]}
        >
          <View style={styles.progressInfo}>
            <Text
              style={[styles.progressText, { color: colors.mutedForeground }]}
            >
              Progress:
            </Text>
            <Text style={[styles.progressText, { color: colors.foreground }]}>
              {completedVerses.length}/{verses.length} verses
            </Text>
          </View>
          <Progress value={progressPercentage} />
        </View>
      )}

      {/* Mode Toggle */}
      <View
        style={[
          styles.modeToggle,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.modeButton,
            viewMode === 'reading' && [
              styles.activeModeButton,
              { backgroundColor: colors.primary },
            ],
          ]}
          onPress={() => setViewMode('reading')}
        >
          <Book
            size={16}
            color={viewMode === 'reading' ? '#fff' : colors.mutedForeground}
          />
          <Text
            style={[
              styles.modeText,
              {
                color: viewMode === 'reading' ? '#fff' : colors.mutedForeground,
              },
            ]}
          >
            {t.readingMode || 'Reading'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            viewMode === 'learning' && [
              styles.activeModeButton,
              { backgroundColor: colors.primary },
            ],
          ]}
          onPress={() => setViewMode('learning')}
        >
          <GraduationCap
            size={16}
            color={viewMode === 'learning' ? '#fff' : colors.mutedForeground}
          />
          <Text
            style={[
              styles.modeText,
              {
                color:
                  viewMode === 'learning' ? '#fff' : colors.mutedForeground,
              },
            ]}
          >
            {t.learningMode || 'Learning'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {viewMode === 'reading' ? (
        <FlatList
          ref={flatListRef}
          data={verses}
          keyExtractor={(_, index) => `verse-${index}`}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          ListHeaderComponent={
            <View>
              {/* Surah Header */}
              <SurahHeader
                surahName={params?.surahName || ''}
                surahNameArabic={params?.surahNameArabic || ''}
                revelationType={verses[0]?.juz ? 'Meccan' : 'Medinan'}
                numberOfAyahs={verses.length}
                juz={params?.juzNumber}
              />

              {/* Basmala (except for Surah 1 and 9) */}
              {surahNumber !== 1 && surahNumber !== 9 && (
                <View style={styles.basmalaContainer}>
                  <Text style={[styles.basmala, { color: colors.foreground }]}>
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </Text>
                </View>
              )}
            </View>
          }
          renderItem={({ item: verse, index }) => {
            const isHighlighted = currentVerseIndex === index;
            const isBookmarked = isVerseBookmarked(index);

            return (
              <VerseCard
                verse={verse}
                verseNumber={index + 1}
                isBookmarked={isBookmarked}
                isHighlighted={isHighlighted}
                isPlaying={isPlaying && isHighlighted}
                onPress={() => handlePlayVerse(index)}
                onBookmark={() => handleBookmark(index)}
                onShare={() => handleShare(index)}
                onPlay={() => handlePlayVerse(index)}
                showTranslation={showTranslation}
              />
            );
          }}
          getItemLayout={(data, index) => ({
            length: 200, // Estimated item height - adjust based on your average verse height
            offset: 200 * index,
            index,
          })}
          initialScrollIndex={startAyah > 0 ? startAyah : undefined}
          onScrollToIndexFailed={(info) => {
            // Fallback if scroll to index fails
            const wait = new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
            });
          }}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          windowSize={10}
          initialNumToRender={10}
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Learning mode - show only the active verse */}
          {(() => {
            const verse = verses[currentLearningVerse];
            if (!verse) return null;

            const isCompleted = completedVerses.includes(currentLearningVerse);
            const isActiveLearning = true;

            return (
              <View style={styles.learningCard}>
                <Card
                  style={[
                    styles.learningCardContent,
                    isActiveLearning && {
                      borderColor: colors.primary,
                      borderWidth: 2,
                    },
                  ]}
                >
                  {/* Verse Number and Navigation */}
                  <View style={styles.learningHeader}>
                    <View style={styles.learningHeaderLeft}>
                      {/* Previous Verse Button */}
                      {currentLearningVerse > 0 && (
                        <TouchableOpacity
                          onPress={() => {
                            const prevVerse = currentLearningVerse - 1;
                            setCurrentLearningVerse(prevVerse);
                            setLearningProgressForSurah(surahNumber, prevVerse, completedVerses);
                          }}
                          style={styles.navButton}
                        >
                          <ArrowLeft size={20} color={colors.primary} />
                        </TouchableOpacity>
                      )}
                      <View
                        style={[
                          styles.verseNumberCircle,
                          {
                            backgroundColor: isCompleted
                              ? '#10b981'
                              : colors.primary,
                          },
                        ]}
                      >
                        {isCompleted ? (
                          <Check size={20} color="#fff" />
                        ) : (
                          <Text style={styles.verseNumberText}>
                            {currentLearningVerse + 1}
                          </Text>
                        )}
                      </View>
                      {/* Next Verse Button */}
                      {currentLearningVerse < verses.length - 1 && (
                        <TouchableOpacity
                          onPress={() => {
                            const nextVerse = currentLearningVerse + 1;
                            setCurrentLearningVerse(nextVerse);
                            setLearningProgressForSurah(surahNumber, nextVerse, completedVerses);
                          }}
                          style={styles.navButton}
                        >
                          <ArrowLeft size={20} color={colors.primary} style={{ transform: [{ rotate: '180deg' }] }} />
                        </TouchableOpacity>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        handlePlayVerse(currentLearningVerse);
                      }}
                      style={styles.repeatButton}
                    >
                      <Volume2 size={18} color={colors.primary} />
                    </TouchableOpacity>
                  </View>

                  {/* Arabic Text */}
                  <Text
                    style={[
                      styles.learningArabic,
                      { color: colors.foreground },
                    ]}
                  >
                    {verse.text}
                  </Text>

                  {/* Transliteration */}
                  {verse.transliteration && (
                    <Text
                      style={[
                        styles.transliteration,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {verse.transliteration}
                    </Text>
                  )}

                  {/* Translation */}
                  {showTranslation && verse.translation && (
                    <View
                      style={[
                        styles.translationContainer,
                        { backgroundColor: colors.muted + '40' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.translation,
                          { color: colors.foreground },
                        ]}
                      >
                        {verse.translation}
                      </Text>
                    </View>
                  )}

                  {/* Recording Button */}
                  {recordingState === 'idle' && (
                    <Button
                      onPress={() => startRecording(currentLearningVerse)}
                      style={styles.recordButton}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: spacing.sm,
                        }}
                      >
                        <Mic size={18} color="#fff" />
                        <Text style={styles.recordButtonText}>
                          {t.startRecording || 'Start Recording'}
                        </Text>
                      </View>
                    </Button>
                  )}

                  {/* Stop Recording Button */}
                  {recordingState === 'recording' && (
                    <View style={styles.recordingContainer}>
                      <Button onPress={stopRecordingAndAnalyze}>
                        <View
                          style={[
                            styles.recordingIndicator,
                            { backgroundColor: '#fff' },
                          ]}
                        />
                        <Text style={styles.recordButtonText}>
                          {t.stopRecording || 'Stop Recording'}
                        </Text>
                      </Button>
                      <Text
                        style={[
                          styles.recordingText,
                          { color: colors.foreground },
                        ]}
                      >
                        {audioRecordingState.recordTime ||
                          t.recording ||
                          'Recording...'}
                      </Text>
                    </View>
                  )}

                  {recordingState === 'analyzing' && isActiveLearning && (
                    <View style={styles.recordingContainer}>
                      <View
                        style={[
                          styles.recordingCircle,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        <Sparkles size={24} color="#fff" />
                      </View>
                      <Text
                        style={[
                          styles.recordingText,
                          { color: colors.foreground },
                        ]}
                      >
                        {t.analyzing || 'Analyzing...'}
                      </Text>
                    </View>
                  )}

                  {recordingState === 'feedback' && isActiveLearning && (
                    <View
                      style={[
                        styles.feedbackContainer,
                        { backgroundColor: colors.primary + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.feedbackText,
                          { color: colors.foreground },
                        ]}
                      >
                        {feedbackMessage}
                      </Text>
                      <Button
                        variant="outline"
                        onPress={() => setRecordingState('idle')}
                        style={styles.tryAgainButton}
                      >
                        <RotateCcw size={16} color={colors.primary} />
                        <Text
                          style={[
                            styles.tryAgainText,
                            { color: colors.primary },
                          ]}
                        >
                          {t.tryAgain || 'Try Again'}
                        </Text>
                      </Button>
                    </View>
                  )}

                  {/* Tafsir */}
                  {verse.tafsir && (
                    <View style={styles.tafsirContainer}>
                      <Text
                        style={[
                          styles.tafsirLabel,
                          { color: colors.primary },
                        ]}
                      >
                        {t.tafsirTitle || 'Meaning for Kids:'}
                      </Text>
                      <Text
                        style={[
                          styles.tafsirText,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {verse.tafsir}
                      </Text>
                    </View>
                  )}
                </Card>
              </View>
            );
          })()}
        </ScrollView>
      )}

      {/* Reading Controls */}
      {viewMode === 'reading' && (
        <ReadingControls
          isPlaying={isPlaying}
          repeatMode={repeatMode}
          isBookmarked={
            currentVerse ? isVerseBookmarked(currentVerseIndex) : false
          }
          onPlayPause={handlePlayAll}
          onRepeat={cycleRepeatMode}
          onBookmark={() => handleBookmark(currentVerseIndex)}
          onReciterSelect={() => setShowReciterModal(true)}
          reciterName={selectedReciter.name}
        />
      )}

      {/* Learning Mode Controls */}
      {viewMode === 'learning' && (
        <View
          style={[
            styles.learningControls,
            { backgroundColor: colors.card, borderTopColor: colors.border },
          ]}
        >
          <TouchableOpacity
            onPress={() => setShowTranslation(!showTranslation)}
            style={[
              styles.translationToggle,
              { backgroundColor: colors.muted },
            ]}
          >
            <Text style={[styles.toggleText, { color: colors.foreground }]}>
              {showTranslation
                ? t.hideTranslation || 'Hide Translation'
                : t.showTranslation || 'Show Translation'}
            </Text>
          </TouchableOpacity>

          {/* Ayah Selector Button */}
          <TouchableOpacity
            onPress={() => setShowAyahSelector(true)}
            style={[styles.ayahSelectorButton, { backgroundColor: colors.muted }]}
          >
            <Text style={[styles.ayahSelectorText, { color: colors.foreground }]}>
              Select Ayah ({currentLearningVerse + 1}/{verses.length})
            </Text>
          </TouchableOpacity>

          {/* Reciter Selector Button - Same style as Reading Mode */}
          <TouchableOpacity
            onPress={() => setShowReciterModal(true)}
            style={[styles.reciterButton, { backgroundColor: colors.muted }]}
          >
            <Volume2 size={16} color={colors.foreground} />
            <View style={styles.reciterInfo}>
              <Text
                style={[styles.reciterText, { color: colors.foreground }]}
                numberOfLines={1}
              >
                {selectedReciter?.name || 'Select Reciter'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Reciter Modal */}
      <Modal
        visible={showReciterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReciterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                Select Reciter
              </Text>
              <TouchableOpacity onPress={() => setShowReciterModal(false)}>
                <X size={24} color={colors.foreground} />
              </TouchableOpacity>
            </View>
            <ReciterSelector
              selectedReciter={selectedReciter}
              onSelect={async reciter => {
                // Stop current playback if playing
                if (isPlaying) {
                  await stopAudio();
                  setIsPlaying(false);
                }
                setSelectedReciter(reciter);
                setShowReciterModal(false);
                loadSurah();
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                Settings
              </Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <X size={24} color={colors.foreground} />
              </TouchableOpacity>
            </View>
            <View style={styles.settingsContent}>
              <TouchableOpacity
                onPress={() => setShowTranslation(!showTranslation)}
                style={styles.settingItem}
              >
                <Text
                  style={[styles.settingLabel, { color: colors.foreground }]}
                >
                  {showTranslation
                    ? t.hideTranslation || 'Hide Translation'
                    : t.showTranslation || 'Show Translation'}
                </Text>
                <Text
                  style={[
                    styles.settingValue,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {showTranslation ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Ayah Selector Modal - Learning Mode */}
      <Modal
        visible={showAyahSelector}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAyahSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, maxHeight: '70%' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                Select Ayah to Practice
              </Text>
              <TouchableOpacity onPress={() => setShowAyahSelector(false)}>
                <X size={24} color={colors.foreground} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.ayahSelectorScroll}
              contentContainerStyle={styles.ayahSelectorContent}
              showsVerticalScrollIndicator={true}
            >
              {verses.map((verse, index) => {
                const isCompleted = completedVerses.includes(index);
                const isCurrent = index === currentLearningVerse;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setCurrentLearningVerse(index);
                      setShowAyahSelector(false);
                      setLearningProgressForSurah(surahNumber, index, completedVerses);
                    }}
                    style={[
                      styles.ayahSelectorItem,
                      {
                        backgroundColor: isCurrent
                          ? colors.primary + '20'
                          : isCompleted
                            ? colors.primary + '10'
                            : colors.muted + '40',
                        borderColor: isCurrent
                          ? colors.primary
                          : colors.border,
                        borderWidth: isCurrent ? 2 : 1,
                      },
                    ]}
                  >
                    <View style={styles.ayahSelectorItemContent}>
                      <View
                        style={[
                          styles.ayahSelectorNumber,
                          {
                            backgroundColor: isCompleted
                              ? '#10b981'
                              : isCurrent
                                ? colors.primary
                                : colors.muted,
                          },
                        ]}
                      >
                        {isCompleted ? (
                          <Check size={16} color="#fff" />
                        ) : (
                          <Text style={styles.ayahSelectorNumberText}>
                            {index + 1}
                          </Text>
                        )}
                      </View>
                      <View style={styles.ayahSelectorTextContainer}>
                        <Text
                          style={[
                            styles.ayahSelectorAyahText,
                            { color: colors.foreground },
                          ]}
                          numberOfLines={2}
                        >
                          {verse.text.substring(0, 100)}
                          {verse.text.length > 100 ? '...' : ''}
                        </Text>
                        <View style={styles.ayahSelectorBadgeContainer}>
                          {isCurrent && (
                            <View style={[styles.ayahSelectorBadge, { backgroundColor: colors.primary + '30' }]}>
                              <Text style={[styles.ayahSelectorBadgeText, { color: colors.primary }]}>
                                Current
                              </Text>
                            </View>
                          )}
                          {isCompleted && !isCurrent && (
                            <View style={[styles.ayahSelectorBadge, { backgroundColor: '#10b98130' }]}>
                              <Text style={[styles.ayahSelectorBadgeText, { color: '#10b981' }]}>
                                Completed
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.sm,
  },
  errorText: {
    fontSize: fontSize.base,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  settingsButton: {
    marginLeft: spacing.md,
  },
  progressContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressText: {
    fontSize: fontSize.sm,
  },
  modeToggle: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    gap: spacing.xs,
  },
  activeModeButton: {
    borderRadius: borderRadius.xl,
  },
  modeText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  basmalaContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  basmala: {
    fontSize: fontSize['2xl'],
    textAlign: 'center',
    fontFamily: 'System',
  },
  learningCard: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  learningCardContent: {
    padding: spacing.lg,
  },
  learningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  learningHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  navButton: {
    padding: spacing.xs,
  },
  verseNumberCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseNumberText: {
    color: '#fff',
    fontSize: fontSize.base,
    fontWeight: '600',
  },
  repeatButton: {
    padding: spacing.sm,
  },
  learningArabic: {
    fontSize: fontSize['2xl'],
    lineHeight: fontSize['2xl'] * 2,
    textAlign: 'right',
    marginBottom: spacing.md,
    fontFamily: 'System',
  },
  transliteration: {
    fontSize: fontSize.sm,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  translationContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  translation: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
  },
  recordButton: {
    height: 48,
  },
  recordButtonText: {
    color: '#fff',
    fontSize: fontSize.base,
    fontWeight: '600',
    textAlign: 'center',
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.xs,
  },
  recordingContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.lg,
  },
  recordingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  recordingText: {
    fontSize: fontSize.sm,
  },
  feedbackContainer: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: fontSize.base,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  tryAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tryAgainText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  tafsirContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E6E8EF',
  },
  tafsirLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  tafsirText: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
  },
  learningControls: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  ayahSelectorButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ayahSelectorText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  ayahSelectorScroll: {
    maxHeight: 400,
  },
  ayahSelectorContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  ayahSelectorItem: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  ayahSelectorItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  ayahSelectorNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ayahSelectorNumberText: {
    color: '#fff',
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  ayahSelectorTextContainer: {
    flex: 1,
  },
  ayahSelectorAyahText: {
    fontSize: fontSize.base,
    marginBottom: spacing.xs,
    textAlign: 'right',
  },
  ayahSelectorCurrentText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  ayahSelectorCompletedText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  ayahSelectorBadgeContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  ayahSelectorBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  ayahSelectorBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  translationToggle: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xs,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  reciterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    minHeight: 40,
  },
  reciterInfo: {
    flex: 1,
  },
  reciterText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.xl * 2,
    borderTopRightRadius: borderRadius.xl * 2,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
  },
  settingsContent: {
    gap: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  settingLabel: {
    fontSize: fontSize.base,
  },
  settingValue: {
    fontSize: fontSize.sm,
  },
});
