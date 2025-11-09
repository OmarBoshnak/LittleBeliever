import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Mic,
  Repeat,
  Settings,
  Sparkles,
} from 'lucide-react-native';

import { RootstackParamList, Routes } from '../../../MainNavigation/Routes.tsx';
import { useTheme } from '../../../theme/ThemeContext.tsx';
import { useLanguage } from '../../../context/LanguageContext.tsx';
import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from '../../../theme/spacing.ts';
import { Ayah, getSurahFull } from '../../../api/quranApi.ts';
import { useQuranBookmarks } from '../../../hooks/useQuranBookmarks.ts';
import { Card } from '../../../component/Card.tsx';
import { Button } from '../../../component/Button.tsx';
import { Progress } from '../../../component/Progress.tsx';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../../component/QuranComponent/SheetMode.tsx';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AyahMedallion } from '../../../component/QuranComponent/AyahMedallion.tsx';

const HEADER_GRADIENT = ['#c8e6f566', '#fdfcf866', '#f9d9a766'];
const PRACTICE_FEEDBACK = [
  '✨ Beautiful recitation! Keep it up.',
  '🌟 Great effort! Try to stretch the vowel a bit more.',
  '💡 Listen again and focus on the soft "ر" sound.',
];

const FONT_SCALE_MIN = 0.9;
const FONT_SCALE_MAX = 1.3;
const FONT_SCALE_STEP = 0.1;

type NavigationProps = NativeStackNavigationProp<
  RootstackParamList,
  typeof Routes.QuranReaderScreen
>;
type ReaderRoute = RouteProp<
  RootstackParamList,
  typeof Routes.QuranReaderScreen
>;

type Mode = 'reading' | 'learning';
type PracticeState = 'idle' | 'recording' | 'evaluating' | 'feedback';
type RepeatMode = 'none' | 'one' | 'all';

export const QuranReaderScreen = () => {
  const { colors } = useTheme();
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<ReaderRoute>();
  const scrollRef = useRef<ScrollView>(null);

  const { bookmarkMap, toggleBookmark, setLastRead } = useQuranBookmarks();

  const surahNumber = route.params?.surahNumber ?? 1;
  const surahName = route.params?.surahName ?? t.quranReading;
  const surahNameArabic = route.params?.surahNameArabic ?? '';
  const startAyah = route.params?.startAyah ?? 0;
  const juzNumber = route.params?.juzNumber;

  const [mode, setMode] = useState<Mode>('reading');
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [fontScale, setFontScale] = useState(1);
  const [activeAyah, setActiveAyah] = useState<number | null>(null);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');
  const [autoPlay, setAutoPlay] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(startAyah);
  const [practiceState, setPracticeState] = useState<PracticeState>('idle');
  const [practiceMessage, setPracticeMessage] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pressedAyah, setPressedAyah] = useState<number | null>(null);
  const [ayahPositions, setAyahPositions] = useState<Record<number, { x: number; y: number; width: number; height: number }>>({});
  const ayahRefs = useRef<Record<number, View | null>>({});

  useEffect(() => {
    let isMounted = true;
    const loadSurah = async () => {
      try {
        setLoading(true);
        setError(null);
        const translationEdition =
          language === 'ar' ? 'ar.muyassar' : 'en.asad';
        const verses = await getSurahFull(surahNumber, {
          translationEdition,
        });
        if (!isMounted) {
          return;
        }
        setAyahs(verses);
        setActiveAyah(startAyah < verses.length ? startAyah : null);
        setPracticeIndex(startAyah < verses.length ? startAyah : 0);
      } catch (err) {
        console.warn('Failed to load surah', err);
        if (isMounted) {
          setError(t.networkError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSurah();
    return () => {
      isMounted = false;
    };
  }, [language, startAyah, surahNumber, t.networkError]);

  useEffect(() => {
    if (!autoPlay || activeAyah === null) {
      return;
    }

    const timer = setTimeout(() => {
      const nextIndex = activeAyah + 1;
      if (repeatMode === 'one') {
        handlePlayAyah(activeAyah);
        return;
      }

      if (nextIndex < ayahs.length) {
        handlePlayAyah(nextIndex);
      } else if (repeatMode === 'all') {
        handlePlayAyah(0);
      } else {
        setAutoPlay(false);
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, [activeAyah, autoPlay, ayahs.length, repeatMode]);

  const surahBookmarkKey = useMemo(
    () => `${surahNumber}-${activeAyah ?? -1}`,
    [activeAyah, surahNumber],
  );
  const isCurrentBookmarked = bookmarkMap[surahBookmarkKey] != null;

  const toggleCurrentBookmark = () => {
    if (activeAyah === null) {
      Alert.alert(t.bookmarkFirstAyah, t.bookmarkFirstAyahDescription);
      return;
    }

    toggleBookmark({
      surahNumber,
      ayahNumber: activeAyah,
      surahName,
      surahNameArabic,
    });
  };

  const handlePlayAyah = async (index: number) => {
    const ayah = ayahs[index];
    if (!ayah?.audio) {
      Alert.alert(t.audioUnavailable);
      return;
    }

    setActiveAyah(index);
    setLastRead(surahNumber, index);
    setPressedAyah(null);

    try {
      await Linking.openURL(ayah.audio);
    } catch (err) {
      console.warn('Failed to open audio link', err);
      Alert.alert(t.audioUnavailable);
    }
  };

  const handleAyahPress = (index: number) => {
    setPressedAyah(pressedAyah === index ? null : index);
    setActiveAyah(index);
  };

  const handleAyahLayout = (index: number, event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    const viewRef = ayahRefs.current[index];
    if (viewRef) {
      viewRef.measureInWindow((pageX: number, pageY: number, pageWidth: number, pageHeight: number) => {
        setAyahPositions(prev => ({
          ...prev,
          [index]: { x: pageX, y: pageY, width: pageWidth, height: pageHeight },
        }));
      });
    } else {
      // Fallback to layout coordinates if measureInWindow fails
      setAyahPositions(prev => ({
        ...prev,
        [index]: { x, y, width, height },
      }));
    }
  };

  const handleAyahBookmark = (index: number) => {
    toggleBookmark({
      surahNumber,
      ayahNumber: index,
      surahName,
      surahNameArabic,
    });
    setPressedAyah(null);
  };

  const handlePlayAll = () => {
    if (!ayahs.length) {
      return;
    }
    setAutoPlay(true);
    handlePlayAyah(activeAyah ?? 0);
  };

  const handlePractice = () => {
    if (practiceState !== 'idle') {
      return;
    }

    setPracticeState('recording');
    setPracticeMessage(null);

    setTimeout(() => {
      setPracticeState('evaluating');
      setTimeout(() => {
        const feedback =
          PRACTICE_FEEDBACK[
            Math.floor(Math.random() * PRACTICE_FEEDBACK.length)
          ];
        setPracticeMessage(feedback);
        setPracticeState('feedback');
        setTimeout(() => {
          setPracticeState('idle');
        }, 2500);
      }, 1600);
    }, 2200);
  };

  const handleOpenAiHelper = async () => {
    try {
      await Linking.openURL('https://www.tarteel.ai');
    } catch (err) {
      Alert.alert(t.unableToOpen);
    }
  };

  const handlePrevPractice = () => {
    setPracticeIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextPractice = () => {
    setPracticeIndex(prev => (prev < ayahs.length - 1 ? prev + 1 : prev));
  };

  const arabicFontSize = fontSize['3xl'] * fontScale;
  const currentJuz = juzNumber ?? ayahs[0]?.juz;

  const renderReading = () => (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={styles.mushafContent}
      showsVerticalScrollIndicator={false}
      style={styles.mushafScrollView}
    >
      {/* Top Meta Row - Surah name and Juz */}
      <View style={styles.topMetaRow}>
        <Text style={styles.metaName}>{surahName}</Text>
        {currentJuz && <Text style={styles.metaJuz}>Part {currentJuz}</Text>}
      </View>

      {/* Decorative plaque (surah name) */}
      {surahNameArabic ? (
        <View style={styles.plaqueWrap}>
          <View style={styles.plaqueSideLeft} />
          <View style={styles.plaqueCore}>
            <Text style={[styles.plaqueTitle, { fontSize: arabicFontSize * 1.1 }]}>
              سُورَةُ {surahNameArabic}
            </Text>
          </View>
          <View style={styles.plaqueSideRight} />
        </View>
      ) : null}

      {/* Basmala (not for Surah 9) */}
      {surahNumber !== 9 && (
        <Text style={[styles.basmalaMushaf, { fontSize: arabicFontSize }]}>
          بِسْمِ ٱللّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </Text>
      )}

      {/* Flowing Qur'an text – Mushaf style with inline ayahs */}
      <View 
        style={styles.mushafTextContainer}
        onStartShouldSetResponder={() => true}
      >
        <View style={styles.mushafTextFlow}>
        {ayahs.map((ayah, index) => {
          const key = `${surahNumber}-${index}`;
          const isActive = activeAyah === index;
          const bookmarked = bookmarkMap[key] != null;

          return (
              <TouchableOpacity
              key={key}
                activeOpacity={0.9}
                onPress={() => handleAyahPress(index)}
                style={styles.ayahInlineWrapper}
              >
                <View
                  ref={(ref) => {
                    if (ref) ayahRefs.current[index] = ref;
                  }}
                  onLayout={(e) => handleAyahLayout(index, e)}
              style={[
                    styles.ayahInlineContainer,
                    isActive && styles.ayahInlineActive,
              ]}
            >
              <Text
                style={[
                      styles.ayahInlineText,
                      { fontSize: arabicFontSize },
                      isActive && styles.ayahInlineTextActive,
                ]}
              >
                    {ayah.text}
              </Text>
                  <View style={styles.medallionInlineWrapper}>
                <AyahMedallion
                  number={index + 1}
                  color={'#c9a961'}
                      bg={'#F6F3EC'}
                  active={isActive}
                />
                    {bookmarked && <View style={styles.bookmarkDotInline} />}
              </View>
            </View>
              </TouchableOpacity>
          );
        })}
        </View>
      </View>

      {/* Floating Action Menu - rendered outside ScrollView */}

      {/* Controls */}
      <View style={styles.readingActions}>
        <Button onPress={handlePlayAll} style={styles.playAllButton}>
          <Headphones size={16} color={colors.primaryForeground} />
          {` ${t.playAll}`}
        </Button>
      </View>
    </ScrollView>
  );

  const currentPracticeAyah = ayahs[practiceIndex];

  const renderLearning = () => (
    <View style={styles.learningContainer}>
      {currentPracticeAyah ? (
        <Card
          style={[styles.practiceCard, { backgroundColor: `${colors.card}F5` }]}
        >
          <View style={styles.practiceHeader}>
            <Text style={[styles.practiceTitle, { color: colors.primary }]}>
              {t.practiceAyah} {practiceIndex + 1}
            </Text>
            <Progress
              value={((practiceIndex + 1) / Math.max(1, ayahs.length)) * 100}
              style={styles.practiceProgress}
            />
          </View>

          <Text
            style={[
              styles.practiceArabic,
              { color: colors.foreground, fontSize: arabicFontSize },
            ]}
          >
            {currentPracticeAyah.text}
          </Text>

          {showTranslation && currentPracticeAyah.translation && (
            <Text
              style={[
                styles.practiceTranslation,
                { color: colors.mutedForeground },
              ]}
            >
              {currentPracticeAyah.translation}
            </Text>
          )}

          <View style={styles.practiceNavRow}>
            <Button
              onPress={handlePrevPractice}
              variant="outline"
              size="sm"
              disabled={practiceIndex === 0}
              style={styles.practiceNavButton}
            >
              <ChevronLeft size={16} color={colors.foreground} />
            </Button>
            <Button
              onPress={handleNextPractice}
              variant="outline"
              size="sm"
              disabled={practiceIndex >= ayahs.length - 1}
              style={styles.practiceNavButton}
            >
              <ChevronRight size={16} color={colors.foreground} />
            </Button>
          </View>

          <View style={styles.practiceActions}>
            <Button
              onPress={() => handlePlayAyah(practiceIndex)}
              variant="secondary"
              size="lg"
              style={styles.practiceButton}
            >
              <Headphones size={18} color={colors.secondaryForeground} />
              {` ${t.listen}`}
            </Button>
            <Button
              onPress={handlePractice}
              size="lg"
              style={styles.practiceButton}
              loading={practiceState === 'evaluating'}
            >
              <Mic size={18} color={colors.primaryForeground} />
              {` ${t.startPractice}`}
            </Button>
          </View>

          {practiceState === 'recording' && (
            <Text
              style={[styles.practiceHint, { color: colors.mutedForeground }]}
            >
              {t.recording}
            </Text>
          )}
          {practiceState === 'feedback' && practiceMessage && (
            <Text style={[styles.practiceFeedback, { color: colors.primary }]}>
              {practiceMessage}
            </Text>
          )}

          <Button
            onPress={handleOpenAiHelper}
            variant="outline"
            style={styles.aiButton}
          >
            <Sparkles size={16} color={colors.primary} />
            {` ${t.aiHelper}`}
          </Button>
        </Card>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )}
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            {t.loading}
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={[styles.errorText, { color: colors.destructive }]}>
            {error}
          </Text>
        </View>
      );
    }

    if (!ayahs.length) {
      return null;
    }

    return mode === 'reading' ? renderReading() : renderLearning();
  };

  const increaseFont = () => {
    setFontScale(prev =>
      Math.min(FONT_SCALE_MAX, parseFloat((prev + FONT_SCALE_STEP).toFixed(2))),
    );
  };

  const decreaseFont = () => {
    setFontScale(prev =>
      Math.max(FONT_SCALE_MIN, parseFloat((prev - FONT_SCALE_STEP).toFixed(2))),
    );
  };

  const cycleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'one';
      if (prev === 'one') return 'all';
      return 'none';
    });
  };

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[
        styles.container,
        { backgroundColor: mode === 'reading' ? '#F6F3EC' : colors.background },
      ]}
    >
      {mode === 'reading' ? (
        <View style={styles.readingModeContainer}>
          {/* Minimal header for reading mode */}
          <View
            style={[
              styles.readingHeader,
              {
                paddingTop: insets.top + spacing.sm,
                backgroundColor: '#F6F3EC',
              },
            ]}
          >
            <View style={styles.readingHeaderRow}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.readingBackButton}
              >
                <ArrowLeft size={20} color="#8B7355" />
              </TouchableOpacity>
              <View style={styles.readingHeaderActions}>
                <TouchableOpacity
                  onPress={toggleCurrentBookmark}
                  style={styles.readingIconButton}
                >
                  <Bookmark
                    size={18}
                    color={isCurrentBookmarked ? '#c9a961' : '#8B7355'}
                    fill={isCurrentBookmarked ? '#c9a961' : 'transparent'}
                  />
                </TouchableOpacity>
                <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
                  <SheetTrigger>
                    <TouchableOpacity style={styles.readingIconButton}>
                      <Settings size={18} color="#8B7355" />
                    </TouchableOpacity>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>
                        {t.readerSettings ?? 'Reading settings'}
                      </SheetTitle>
                    </SheetHeader>
                    <View style={styles.sheetSection}>
                      <Text
                        style={[
                          styles.sheetLabel,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {t.fontSizeLabel}
                      </Text>
                      <View style={styles.fontRow}>
                        <Button
                          onPress={decreaseFont}
                          size="sm"
                          variant="outline"
                        >
                          A-
                        </Button>
                        <Text
                          style={[
                            styles.fontValue,
                            { color: colors.foreground },
                          ]}
                        >
                          {fontScale.toFixed(1)}x
                        </Text>
                        <Button
                          onPress={increaseFont}
                          size="sm"
                          variant="outline"
                        >
                          A+
                        </Button>
                      </View>
                    </View>
                    <View style={styles.sheetSection}>
                      <Text
                        style={[
                          styles.sheetLabel,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {t.showTranslation}
                      </Text>
                      <View style={styles.toggleRow}>
                        <Button
                          onPress={() => setShowTranslation(true)}
                          variant={showTranslation ? 'default' : 'outline'}
                          size="sm"
                          style={styles.toggleButton}
                        >
                          {t.on}
                        </Button>
                        <Button
                          onPress={() => setShowTranslation(false)}
                          variant={!showTranslation ? 'default' : 'outline'}
                          size="sm"
                          style={styles.toggleButton}
                        >
                          {t.off}
                        </Button>
                      </View>
                    </View>
                    <View style={styles.sheetSection}>
                      <Text
                        style={[
                          styles.sheetLabel,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {t.repeatMode}
                      </Text>
                      <View style={styles.toggleRow}>
                        <Button
                          onPress={cycleRepeat}
                          variant="outline"
                          size="sm"
                          style={styles.toggleButton}
                        >
                          <Repeat size={16} color={colors.primary} />
                          {` ${repeatMode.toUpperCase()}`}
                        </Button>
                      </View>
                    </View>
                    <SheetFooter>
                      <Button onPress={() => setSettingsOpen(false)}>
                        {t.close}
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </View>
            </View>
          </View>
          <View style={styles.readingContentWrapper}>{renderContent()}</View>
          
          {/* Floating Action Menu */}
          {pressedAyah !== null && ayahPositions[pressedAyah] && mode === 'reading' && (
            <>
              <View
                style={[
                  styles.ayahMenu,
                  {
                    left: ayahPositions[pressedAyah].x + ayahPositions[pressedAyah].width / 2 - 50,
                    top: Math.max(insets.top + 60, ayahPositions[pressedAyah].y - 70),
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.ayahMenuButton}
                  onPress={() => handlePlayAyah(pressedAyah)}
                >
                  <Headphones size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.ayahMenuButton}
                  onPress={() => handleAyahBookmark(pressedAyah)}
                >
                  <Bookmark
                    size={20}
                    color="#FFFFFF"
                    fill={
                      bookmarkMap[`${surahNumber}-${pressedAyah}`] != null
                        ? '#FFFFFF'
                        : 'transparent'
                    }
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.menuOverlay}
                activeOpacity={1}
                onPress={() => setPressedAyah(null)}
              />
            </>
          )}
          
          {/* Floating mode toggle */}
          <View
            style={[
              styles.readingModeToggle,
              { bottom: insets.bottom + spacing.lg },
            ]}
          >
            <View style={styles.modeToggleContainer}>
              <TouchableOpacity
                onPress={() => setMode('reading')}
                style={[
                  styles.modeToggleButton,
                  mode === 'reading' && styles.modeToggleButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.modeToggleText,
                    mode === 'reading' && styles.modeToggleTextActive,
                  ]}
                >
                  {t.readingMode}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMode('learning')}
                style={[
                  styles.modeToggleButton,
                  mode !== 'reading' && styles.modeToggleButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.modeToggleText,
                    mode !== 'reading' && styles.modeToggleTextActive,
                  ]}
                >
                  {t.learningMode}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + spacing.md,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
                style={[
                  styles.backButton,
                  { backgroundColor: `${colors.card}AA` },
                ]}
          >
            <ArrowLeft size={20} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.headerTitle, { color: colors.primary }]}>
              {surahName}
            </Text>
            {surahNameArabic ? (
              <Text
                style={[
                  styles.headerSubtitle,
                  { color: colors.mutedForeground },
                ]}
              >
                {surahNameArabic}
              </Text>
            ) : null}
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={toggleCurrentBookmark}
              style={[
                styles.iconButton,
                { backgroundColor: `${colors.primary}22` },
              ]}
            >
              <Bookmark
                size={18}
                color={
                      isCurrentBookmarked
                        ? colors.primary
                        : colors.mutedForeground
                }
                fill={isCurrentBookmarked ? colors.primary : 'transparent'}
              />
            </TouchableOpacity>

            <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
              <SheetTrigger>
                <TouchableOpacity
                  style={[
                    styles.iconButton,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Settings size={18} color={colors.primaryForeground} />
                </TouchableOpacity>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>
                    {t.readerSettings ?? 'Reading settings'}
                  </SheetTitle>
                </SheetHeader>
                <View style={styles.sheetSection}>
                  <Text
                    style={[
                      styles.sheetLabel,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {t.fontSizeLabel}
                  </Text>
                  <View style={styles.fontRow}>
                        <Button
                          onPress={decreaseFont}
                          size="sm"
                          variant="outline"
                        >
                      A-
                    </Button>
                    <Text
                          style={[
                            styles.fontValue,
                            { color: colors.foreground },
                          ]}
                    >
                      {fontScale.toFixed(1)}x
                    </Text>
                        <Button
                          onPress={increaseFont}
                          size="sm"
                          variant="outline"
                        >
                      A+
                    </Button>
                  </View>
                </View>
                <View style={styles.sheetSection}>
                  <Text
                    style={[
                      styles.sheetLabel,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {t.showTranslation}
                  </Text>
                  <View style={styles.toggleRow}>
                    <Button
                      onPress={() => setShowTranslation(true)}
                      variant={showTranslation ? 'default' : 'outline'}
                      size="sm"
                      style={styles.toggleButton}
                    >
                      {t.on}
                    </Button>
                    <Button
                      onPress={() => setShowTranslation(false)}
                      variant={!showTranslation ? 'default' : 'outline'}
                      size="sm"
                      style={styles.toggleButton}
                    >
                      {t.off}
                    </Button>
                  </View>
                </View>
                <View style={styles.sheetSection}>
                  <Text
                    style={[
                      styles.sheetLabel,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {t.repeatMode}
                  </Text>
                  <View style={styles.toggleRow}>
                    <Button
                      onPress={cycleRepeat}
                      variant="outline"
                      size="sm"
                      style={styles.toggleButton}
                    >
                      <Repeat size={16} color={colors.primary} />
                      {` ${repeatMode.toUpperCase()}`}
                    </Button>
                  </View>
                </View>
                <SheetFooter>
                  <Button onPress={() => setSettingsOpen(false)}>
                    {t.close}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </View>
        </View>

        <View style={styles.modeSwitch}>
          <Button
            onPress={() => setMode('reading')}
                variant="outline"
            style={styles.modeButton}
          >
            {t.readingMode}
          </Button>
          <Button
            onPress={() => setMode('learning')}
                variant="default"
            style={styles.modeButton}
          >
            {t.learningMode}
          </Button>
        </View>
      </View>
      {renderContent()}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl * 3,
    borderBottomRightRadius: borderRadius.xl * 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    rowGap: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
  },
  headerActions: {
    flexDirection: 'row',
    columnGap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeSwitch: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    columnGap: spacing.sm,
  },
  modeButton: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    rowGap: spacing.md,
    paddingBottom: spacing.xl * 3,
  },
  surahHeading: {
    alignItems: 'center',
    rowGap: spacing.xs,
  },
  headingArabic: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
  },
  headingEnglish: {
    fontSize: fontSize.sm,
  },
  basmala: {
    textAlign: 'center',
    marginVertical: spacing.md,
    fontFamily: 'ScheherazadeNew-Regular',
  },
  ayahCard: {
    padding: spacing.lg,
    borderWidth: 1,
  },
  ayahHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  ayahNumberBadge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ayahNumberText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  ayahHeaderActions: {
    flexDirection: 'row',
    columnGap: spacing.sm,
  },
  ayahTranslation: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.6,
  },
  readingActions: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  playAllButton: {
    paddingHorizontal: spacing.lg,
  },
  learningContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  practiceCard: {
    padding: spacing.lg,
    borderWidth: 0,
  },
  practiceHeader: {
    rowGap: spacing.sm,
  },
  practiceTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  practiceProgress: {
    height: 6,
  },
  practiceArabic: {
    marginTop: spacing.lg,
    fontFamily: 'ScheherazadeNew-Regular',
    textAlign: 'center',
    lineHeight: fontSize['3xl'] * 1.7,
  },
  practiceTranslation: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  practiceNavRow: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    columnGap: spacing.sm,
    justifyContent: 'center',
  },
  practiceNavButton: {
    width: 64,
  },
  practiceActions: {
    marginTop: spacing.lg,
    rowGap: spacing.sm,
  },
  practiceButton: {
    width: '100%',
  },
  practiceHint: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  practiceFeedback: {
    marginTop: spacing.sm,
    textAlign: 'center',
    fontWeight: fontWeight.semibold,
  },
  aiButton: {
    marginTop: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: spacing.md,
  },
  loadingText: {
    fontSize: fontSize.sm,
  },
  errorText: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  sheetSection: {
    rowGap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sheetLabel: {
    fontSize: fontSize.sm,
  },
  fontRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.sm,
  },
  fontValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  toggleRow: {
    flexDirection: 'row',
    columnGap: spacing.sm,
  },
  toggleButton: {
    flex: 1,
  },
  topMetaRow: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: '#8B7355',
  },
  metaJuz: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: '#8B7355',
  },

  mushafScrollView: {
    backgroundColor: '#F6F3EC',
  },
  readingModeContainer: {
    flex: 1,
    backgroundColor: '#F6F3EC',
  },
  readingContentWrapper: {
    flex: 1,
  },
  mushafContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl * 4,
    backgroundColor: '#F6F3EC',
  },

  /* Plaque */
  plaqueWrap: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plaqueSides: {
    flex: 1,
    height: 2,
    backgroundColor: '#c9a961',
    opacity: 0.6,
    maxWidth: 60,
  },
  plaqueSideLeft: {
    flex: 1,
    height: 2,
    backgroundColor: '#c9a961',
    opacity: 0.5,
    maxWidth: 80,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  plaqueSideRight: {
    flex: 1,
    height: 2,
    backgroundColor: '#c9a961',
    opacity: 0.5,
    maxWidth: 80,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  plaqueCore: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    marginHorizontal: spacing.md,
    borderWidth: 2,
    borderColor: '#c9a961',
    borderRadius: borderRadius.md,
    backgroundColor: '#fdfbf8',
    minWidth: 200,
  },
  plaqueTitle: {
    fontFamily: 'KFGQPC Uthmanic Script HAFS',
    fontSize: fontSize['2xl'],
    textAlign: 'center',
    color: '#000000',
  },

  basmalaMushaf: {
    textAlign: 'center',
    marginVertical: spacing.lg,
    fontFamily: 'KFGQPC Uthmanic Script HAFS',
    color: '#000000',
    lineHeight: fontSize['3xl'] * 2.2,
  },

  /* Flowing text - Mushaf style */
  mushafTextContainer: {
    marginTop: spacing.md,
    width: '100%',
  },
  mushafTextFlow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    width: '100%',
    textAlign: 'right',
  },
  ayahInlineWrapper: {
    marginBottom: spacing.xs,
    marginRight: spacing.xs,
  },
  ayahInlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  ayahInlineActive: {
    backgroundColor: '#fdeaae55',
    borderColor: '#e7c15a',
    borderWidth: 1,
    borderRadius: 4,
  },
  ayahInlineText: {
    writingDirection: 'rtl',
    textAlign: 'right',
    lineHeight: fontSize['3xl'] * 2.15,
    fontFamily: 'KFGQPC Uthmanic Script HAFS',
    color: '#000000',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  ayahInlineTextActive: {
    // Active state handled by container background
  },
  medallionInlineWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginLeft: 4,
    marginRight: 2,
  },
  bookmarkDotInline: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#c9a961',
    borderWidth: 1.5,
    borderColor: '#F6F3EC',
    zIndex: 1,
  },
  ayahMenu: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: '#c9a961',
    borderRadius: borderRadius.full,
    padding: spacing.xs,
    gap: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  ayahMenuButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 998,
  },
  readingHeader: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#c9a96120',
  },
  readingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readingBackButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 115, 85, 0.1)',
  },
  readingHeaderActions: {
    flexDirection: 'row',
    columnGap: spacing.sm,
  },
  readingIconButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 115, 85, 0.1)',
  },
  readingModeToggle: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'box-none',
  },
  modeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: '#c9a961',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    gap: spacing.xs,
  },
  modeToggleButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: 'transparent',
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeToggleButtonActive: {
    backgroundColor: '#c9a961',
  },
  modeToggleText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: '#8B7355',
  },
  modeToggleTextActive: {
    color: '#FFFFFF',
    fontWeight: fontWeight.semibold,
  },
});
