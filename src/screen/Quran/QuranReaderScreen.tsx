import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Award, Mic, Repeat, Sparkles, Volume2 } from 'lucide-react-native';

import { RootstackParamList, Routes } from '../../MainNavigation/Routes.tsx';
import { useTheme } from '../../theme/ThemeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { borderRadius, fontSize, fontWeight, spacing } from '../../theme/spacing.ts';
import { Card } from '../../component/Card.tsx';
import { Button } from '../../component/Button.tsx';
import { Progress } from '../../component/Progress.tsx';
import { Switch } from '../../component/Switch.tsx';
import { getSurahById, Surah, Verse } from '../../data/quran.ts';
import { LockedModal } from './components/LockedModal.tsx';

const HEADER_GRADIENT = ['#e6f4f966', '#fdfcf866', '#fdebd266'];
const VERSE_CARD_GRADIENT = ['#ffffff', '#f5f1e966'];
const COMPLETION_GRADIENT = ['#e5d1ff55', '#cfc3ff55'];

const AnimatedSparkle = ({ delay = 0, size = 28 }: { delay?: number; size?: number }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -6,
          duration: 900,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [delay, translateY]);

  return (
    <Animated.View
      style={{ transform: [{ translateY }] }}
    >
      <Sparkles size={size} color="#f8b4d9" />
    </Animated.View>
  );
};

type ScreenProps = NativeStackScreenProps<RootstackParamList, 'QuranReaderScreen'>;

type RecordingState = 'idle' | 'recording' | 'analyzing' | 'feedback';

export const QuranReaderScreen = ({ navigation, route }: ScreenProps) => {
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();

  const surahId = route.params?.surahId ?? 1;
  const isSubscribed = route.params?.isSubscribed ?? false;
  const surah = useMemo<Surah | undefined>(() => getSurahById(surahId), [surahId]);

  const [currentVerse, setCurrentVerse] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [activeAudioVerse, setActiveAudioVerse] = useState<number | null>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [showTafsirVerse, setShowTafsirVerse] = useState<number | null>(null);
  const [lockedModalVisible, setLockedModalVisible] = useState(false);

  const audioTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const analyzingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rewardTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!surah || (surah.locked && !isSubscribed)) {
      setLockedModalVisible(true);
    }
  }, [surah, isSubscribed]);

  useEffect(() => {
    return () => {
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
      }
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
      if (analyzingTimeoutRef.current) {
        clearTimeout(analyzingTimeoutRef.current);
      }
      if (rewardTimeoutRef.current) {
        clearTimeout(rewardTimeoutRef.current);
      }
    };
  }, []);

  if (!surah || (surah.locked && !isSubscribed)) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}
      >
        <LockedModal
          visible={lockedModalVisible}
          onClose={() => {
            setLockedModalVisible(false);
            navigation.goBack();
          }}
          onUpgrade={() => {
            setLockedModalVisible(false);
            navigation.navigate(Routes.SubscriberScreen);
          }}
        />
      </SafeAreaView>
    );
  }

  const verseCount = surah.verses.length;
  const progress = ((currentVerse + 1) / verseCount) * 100;

  const playVerseAudio = (index: number) => {
    if (audioTimeoutRef.current) {
      clearTimeout(audioTimeoutRef.current);
    }

    setActiveAudioVerse(index);

    audioTimeoutRef.current = setTimeout(() => {
      setActiveAudioVerse(null);
      if (repeatEnabled) {
        playVerseAudio(index);
      }
    }, 2500);
  };

  const handleRecording = () => {
    if (recordingState === 'idle') {
      setRecordingState('recording');
      recordingTimeoutRef.current = setTimeout(() => {
        setRecordingState('analyzing');
        analyzingTimeoutRef.current = setTimeout(() => {
          setRecordingState('feedback');
          const options = [
            t.excellentRecitation,
            t.goodJob,
            `${t.tryAgain} ${surah.verses[currentVerse]?.arabic} — ${t.makeSoundSoft}`,
          ];
          const feedback = options[Math.floor(Math.random() * options.length)];
          setFeedbackMessage(feedback);

          if (feedback === t.excellentRecitation) {
            setShowReward(true);
            rewardTimeoutRef.current = setTimeout(() => setShowReward(false), 3000);
          }
        }, 2000);
      }, 3000);
      return;
    }

    if (recordingState === 'recording') {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
      setRecordingState('idle');
    }
  };

  const handleTryAnother = () => {
    setRecordingState('idle');
    setFeedbackMessage('');
  };

  const handleAiHelper = async () => {
    try {
      await Linking.openURL('https://www.tarteel.ai');
    } catch (error) {
      console.warn('Failed to open Tarteel website', error);
    }
  };

  const renderVerse = (verse: Verse, index: number) => {
    const isActive = index === activeAudioVerse;
    const isDisabled = !!activeAudioVerse && activeAudioVerse !== index;

    return (
      <TouchableOpacity
        key={`${surah.id}-${index}`}
        activeOpacity={0.8}
        onPress={() => setCurrentVerse(index)}
        onLongPress={() => setShowTafsirVerse(index)}
      >
        <LinearGradient
          colors={VERSE_CARD_GRADIENT}
          style={[styles.verseCard, isActive && { borderColor: colors.primary }]}
        >
          <View style={styles.verseHeader}>
            <View
              style={[
                styles.verseBadge,
                { backgroundColor: `${colors.primary}20` },
              ]}
            >
              <Text style={[styles.verseBadgeText, { color: colors.primary }]}
              >
                {index + 1}
              </Text>
            </View>
            <Text
              style={[styles.verseMeta, { color: colors.mutedForeground }]}
            >
              {t.longPressTafsir}
            </Text>
          </View>

          <Text
            style={[
              styles.verseArabic,
              { color: colors.foreground },
              isRTL && styles.rtlText,
            ]}
          >
            {verse.arabic}
          </Text>

          <Text
            style={[styles.verseTransliteration, { color: colors.mutedForeground }]}
          >
            {verse.transliteration}
          </Text>

          {showTranslation && (
            <Text style={[styles.verseTranslation, { color: colors.foreground }]}
            >
              {verse.translation}
            </Text>
          )}

          <View style={styles.verseActions}>
            <TouchableOpacity
              onPress={() => playVerseAudio(index)}
              activeOpacity={0.8}
              style={[
                styles.audioButton,
                {
                  borderColor: isActive ? colors.primary : 'transparent',
                  backgroundColor: `${colors.primary}10`,
                },
                isDisabled && styles.disabledTouchable,
              ]}
              disabled={isDisabled}
            >
              <Volume2
                size={18}
                color={colors.primary}
                style={isRTL ? styles.iconFlipped : undefined}
              />
              <Text style={[styles.audioButtonLabel, { color: colors.primary }]}
              >
                {isActive ? `${t.play}...` : t.playAudio}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRepeatEnabled(prev => !prev)}
              style={[
                styles.repeatToggle,
                {
                  backgroundColor: repeatEnabled
                    ? `${colors.primary}20`
                    : `${colors.border}40`,
                },
              ]}
            >
              <Repeat
                size={18}
                color={repeatEnabled ? colors.primary : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.repeatText,
                  {
                    color: repeatEnabled
                      ? colors.primary
                      : colors.mutedForeground,
                  },
                ]}
              >
                {t.repeatAyah}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl * 4 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={HEADER_GRADIENT}
          style={[styles.headerGradient, { paddingTop: insets.top + spacing.xl }]}
        >
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              style={[styles.backButton, { backgroundColor: `${colors.card}90` }]}
            >
              <ArrowLeft
                size={20}
                color={colors.primary}
                style={isRTL ? styles.iconFlipped : undefined}
              />
            </TouchableOpacity>
            <View style={[styles.headerTextWrapper, isRTL && { alignItems: 'flex-end' }]}
            >
              <Text style={[styles.headerTitle, { color: colors.primary }]}
              >
                {isRTL ? surah.nameArabic : surah.name}
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}
              >
                {t.surahDetails}
              </Text>
            </View>
          </View>

          <View
            style={[styles.progressCard, { backgroundColor: `${colors.card}F5` }]}
          >
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}
              >
                {t.verseProgress} {currentVerse + 1}/{verseCount}
              </Text>
              <Text style={[styles.progressValue, { color: colors.primary }]}
              >
                {Math.round(progress)}%
              </Text>
            </View>
            <Progress value={progress} />
            <View style={styles.toggleRow}>
              <View style={styles.toggleItem}>
                <Text style={[styles.toggleLabel, { color: colors.foreground }]}
                >
                  {showTranslation ? t.hideTranslation : t.showTranslation}
                </Text>
                <Switch value={showTranslation} onValueChange={setShowTranslation} />
              </View>
              <View style={styles.toggleItem}>
                <Text style={[styles.toggleLabel, { color: colors.foreground }]}
                >
                  {t.autoRepeat}
                </Text>
                <Switch value={repeatEnabled} onValueChange={setRepeatEnabled} />
              </View>
            </View>
          </View>

          <View style={styles.sparkleRow}>
            <AnimatedSparkle size={24} />
            <AnimatedSparkle size={32} delay={300} />
            <AnimatedSparkle size={26} delay={600} />
          </View>
        </LinearGradient>

        <View style={styles.contentWrapper}>
          <Card style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <Sparkles size={24} color={colors.primary} />
              <Text style={[styles.aiTitle, { color: colors.primary }]}
              >
                {t.aiHelperTitle}
              </Text>
            </View>
            <Text style={[styles.aiDescription, { color: colors.mutedForeground }]}
            >
              {t.aiHelperDescription}
            </Text>
            <Button
              onPress={handleAiHelper}
              style={{ backgroundColor: colors.primary }}
              textStyle={{ color: colors.primaryForeground }}
            >
              {t.connectTarteel}
            </Button>
          </Card>

          {surah.verses.map((verse, index) => renderVerse(verse, index))}
        </View>
      </ScrollView>

      <View style={[styles.micContainer, { bottom: insets.bottom + spacing.xl }]}
      >
        <TouchableOpacity
          onPress={handleRecording}
          activeOpacity={0.9}
          style={[
            styles.micButton,
            {
              backgroundColor:
                recordingState === 'recording'
                  ? colors.destructive
                  : recordingState === 'analyzing'
                  ? `${colors.secondary}80`
                  : colors.primary,
            },
          ]}
          disabled={recordingState === 'analyzing'}
        >
          <Mic size={32} color={colors.primaryForeground} />
        </TouchableOpacity>
        <Text style={[styles.micStatus, { color: colors.mutedForeground }]}>
          {recordingState === 'idle' && t.startRecording}
          {recordingState === 'recording' && t.recording}
          {recordingState === 'analyzing' && t.analyzing}
          {recordingState === 'feedback' && feedbackMessage}
        </Text>
      </View>

      {recordingState === 'feedback' && feedbackMessage ? (
        <View style={[styles.feedbackCard, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.feedbackText, { color: colors.foreground }]}
          >
            {feedbackMessage}
          </Text>
          <Button onPress={handleTryAnother} style={styles.feedbackButton}>
            {t.tryAnotherVerse}
          </Button>
        </View>
      ) : null}

      <Modal
        transparent
        visible={showTafsirVerse !== null}
        animationType="fade"
        onRequestClose={() => setShowTafsirVerse(null)}
      >
        <View style={styles.tafsirBackdrop}>
          <View style={[styles.tafsirCard, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.tafsirTitle, { color: colors.primary }]}
            >
              {t.tafsirTitle}
            </Text>
            {showTafsirVerse !== null && (
              <>
                <Text style={[styles.tafsirAyah, { color: colors.foreground }]}
                >
                  {surah.verses[showTafsirVerse].arabic}
                </Text>
                <ScrollView>
                  <Text
                    style={[styles.tafsirBody, { color: colors.mutedForeground }]}
                  >
                    {surah.verses[showTafsirVerse].tafsir}
                  </Text>
                </ScrollView>
              </>
            )}
            <Button onPress={() => setShowTafsirVerse(null)} style={styles.closeTafsirButton}>
              {t.close}
            </Button>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={showReward} animationType="fade">
        <View style={styles.rewardBackdrop}>
          <LinearGradient colors={COMPLETION_GRADIENT} style={styles.rewardCard}>
            <Award size={48} color={colors.primary} />
            <Text style={[styles.rewardText, { color: colors.primary }]}
            >
              {t.rewardMessage}
            </Text>
          </LinearGradient>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrapper: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  progressCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: fontSize.xs,
  },
  progressValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  toggleItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: fontSize.sm,
  },
  sparkleRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  contentWrapper: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.lg,
  },
  aiCard: {
    gap: spacing.md,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  aiTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  aiDescription: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  verseCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: spacing.sm,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verseBadge: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseBadgeText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  verseMeta: {
    fontSize: fontSize.xs,
  },
  verseArabic: {
    fontSize: fontSize['3xl'],
    lineHeight: 42,
    textAlign: 'center',
  },
  verseTransliteration: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  verseTranslation: {
    fontSize: fontSize.base,
    textAlign: 'center',
  },
  verseActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  audioButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  disabledTouchable: {
    opacity: 0.5,
  },
  audioButtonLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  repeatToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  repeatText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  micContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: spacing.sm,
  },
  micButton: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  micStatus: {
    fontSize: fontSize.sm,
  },
  feedbackCard: {
    position: 'absolute',
    bottom: spacing.xxl * 3,
    left: spacing.xl,
    right: spacing.xl,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  feedbackText: {
    fontSize: fontSize.base,
    textAlign: 'center',
  },
  feedbackButton: {
    marginTop: spacing.sm,
  },
  tafsirBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    padding: spacing.xl,
    justifyContent: 'center',
  },
  tafsirCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    maxHeight: '80%',
  },
  tafsirTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
  tafsirAyah: {
    fontSize: fontSize.lg,
    lineHeight: 28,
    textAlign: 'center',
  },
  tafsirBody: {
    fontSize: fontSize.sm,
    lineHeight: 22,
  },
  closeTafsirButton: {
    marginTop: spacing.sm,
  },
  rewardBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  rewardText: {
    fontSize: fontSize.lg,
    textAlign: 'center',
  },
  rtlText: {
    textAlign: 'right',
  },
  iconFlipped: {
    transform: [{ rotate: '180deg' }],
  },
});
