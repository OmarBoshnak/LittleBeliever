import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Star as StarIcon,
  Volume2,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  CloudSun,
} from 'lucide-react-native';

import { RootstackParamList, Routes } from '../../MainNavigation/Routes.tsx';
import { useTheme } from '../../theme/ThemeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { Card } from '../../component/Card.tsx';
import { Progress } from '../../component/Progress.tsx';
import { borderRadius, fontSize, fontWeight, spacing } from '../../theme/spacing.ts';

const INTRO_HEADER_GRADIENT = ['#c8e6f566', '#f5ebe066', '#f9d9a766'];
const INTRO_CARD_GRADIENT = ['#c8e6f533', '#c9b6f033'];
const INTRO_CTA_GRADIENT = ['#c9b6f04d', '#d4c5f94d', '#c9b6f04d'];
const CTA_BUTTON_GRADIENT = ['#c9b6f0', '#d4c5f9'];
const LESSON_HEADER_GRADIENT = ['#c8e6f566', '#f5ebe066', '#f9d9a766'];
const STEP_GRADIENT = ['#ffffff', '#d4c5f91a'];
const COMPLETION_GRADIENT = ['#d4c5f933', '#c9b6f033', '#b4a5e033'];

const PRAYER_TIME_GRADIENTS: Array<[string, string]> = [
  ['#fed7aa', '#fef08a'],
  ['#fef08a', '#fde68a'],
  ['#fde68a', '#fdba74'],
  ['#fdba74', '#fda4af'],
  ['#a5b4fc', '#c4b5fd'],
];

const BouncingEmoji = ({
  emoji,
  size = 28,
  delay = 0,
  style,
}: {
  emoji: string;
  size?: number;
  delay?: number;
  style?: StyleProp<TextStyle>;
}) => {
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
    <Animated.Text
      style={[
        {
          fontSize: size,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      {emoji}
    </Animated.Text>
  );
};

type IconComponent = React.ComponentType<{ color?: string; size?: number }>;

type PrayerTime = {
  name: string;
  Icon: IconComponent;
  rakat: number;
  sujudPerRakat: number;
  totalSujud: number;
  gradient: [string, string];
};

type PrayerStep = {
  id: number;
  title: string;
  description: string;
  emoji: string;
  arabic: string;
  transliteration: string;
  translation: string;
  free: boolean;
};

type ScreenProps = NativeStackScreenProps<RootstackParamList, 'PrayerScreen'>;

export const PrayerScreen = ({ navigation, route }: ScreenProps) => {
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showComplete, setShowComplete] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);
  const audioTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSubscribed = route.params?.isSubscribed ?? false;

  const prayerTimes = useMemo<PrayerTime[]>(
    () => [
      {
        name: t.fajrPrayer,
        Icon: Sunrise,
        rakat: 2,
        sujudPerRakat: 2,
        totalSujud: 4,
        gradient: PRAYER_TIME_GRADIENTS[0],
      },
      {
        name: t.dhuhrPrayer,
        Icon: Sun,
        rakat: 4,
        sujudPerRakat: 2,
        totalSujud: 8,
        gradient: PRAYER_TIME_GRADIENTS[1],
      },
      {
        name: t.asrPrayer,
        Icon: CloudSun,
        rakat: 4,
        sujudPerRakat: 2,
        totalSujud: 8,
        gradient: PRAYER_TIME_GRADIENTS[2],
      },
      {
        name: t.maghribPrayer,
        Icon: Sunset,
        rakat: 3,
        sujudPerRakat: 2,
        totalSujud: 6,
        gradient: PRAYER_TIME_GRADIENTS[3],
      },
      {
        name: t.ishaPrayer,
        Icon: Moon,
        rakat: 4,
        sujudPerRakat: 2,
        totalSujud: 8,
        gradient: PRAYER_TIME_GRADIENTS[4],
      },
    ],
    [t],
  );

  const steps = useMemo<PrayerStep[]>(
    () => [
      {
        id: 1,
        title: t.takbir,
        description: t.takbirDescription,
        emoji: '🙌',
        arabic: 'اللَّهُ أَكْبَرُ',
        transliteration: 'Allahu Akbar',
        translation: 'Allah is the Greatest',
        free: true,
      },
      {
        id: 2,
        title: t.standing,
        description: t.standingDescription,
        emoji: '🧍',
        arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        transliteration: 'Bismillah ir-Rahman ir-Raheem',
        translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
        free: true,
      },
      {
        id: 3,
        title: t.bowing,
        description: t.bowingDescription,
        emoji: '🙇',
        arabic: 'سُبْحَانَ رَبِّيَ ٱلْعَظِيمِ',
        transliteration: 'Subhana Rabbiyal Adheem',
        translation: 'Glory to my Lord, the Most Great',
        free: true,
      },
      {
        id: 4,
        title: t.standingAfterBowing,
        description: t.standingAfterBowingDescription,
        emoji: '🧍',
        arabic: 'سَمِعَ ٱللَّهُ لِمَنْ حَمِدَهُ',
        transliteration: 'Sami Allahu liman hamidah',
        translation: 'Allah hears those who praise Him',
        free: false,
      },
      {
        id: 5,
        title: t.prostration,
        description: t.prostrationDescription,
        emoji: '🧎',
        arabic: 'سُبْحَانَ رَبِّيَ ٱلْأَعْلَىٰ',
        transliteration: "Subhana Rabbiyal A'la",
        translation: 'Glory to my Lord, the Most High',
        free: false,
      },
      {
        id: 6,
        title: t.sitting,
        description: t.sittingDescription,
        emoji: '🪑',
        arabic: 'رَبِّ ٱغْفِرْ لِي',
        transliteration: 'Rabbighfir li',
        translation: 'O my Lord, forgive me',
        free: false,
      },
      {
        id: 7,
        title: t.secondProstration,
        description: t.secondProstrationDescription,
        emoji: '🧎',
        arabic: 'سُبْحَانَ رَبِّيَ ٱلْأَعْلَىٰ',
        transliteration: "Subhana Rabbiyal A'la",
        translation: 'Glory to my Lord, the Most High',
        free: false,
      },
      {
        id: 8,
        title: t.tashahhud,
        description: t.tashahhudDescription,
        emoji: '☝️',
        arabic: 'ٱلتَّحِيَّاتُ لِلَّهِ',
        transliteration: 'At-tahiyyatu lillah',
        translation: 'All greetings are for Allah',
        free: false,
      },
      {
        id: 9,
        title: t.salam,
        description: t.salamDescription,
        emoji: '👋',
        arabic: 'ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّهِ',
        transliteration: 'As-salamu alaykum wa rahmatullah',
        translation: 'Peace and mercy of Allah be upon you',
        free: false,
      },
    ],
    [t],
  );

  const prayerColumnLabel = isRTL ? 'الصلاة' : 'Prayer';

  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];

  const stopAudio = useCallback(() => {
    if (audioTimeoutRef.current) {
      clearTimeout(audioTimeoutRef.current);
      audioTimeoutRef.current = null;
    }
    setPlayingAudio(false);
  }, []);

  useEffect(() => () => stopAudio(), [stopAudio]);

  const navigateToSubscription = useCallback(() => {
    navigation.navigate(Routes.SubscriberScreen);
  }, [navigation]);

  const handleNext = () => {
    if (!step.free && !isSubscribed) {
      navigateToSubscription();
      return;
    }

    stopAudio();

    setCompletedSteps((prev) =>
      prev.includes(step.id) ? prev : [...prev, step.id],
    );

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      stopAudio();
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    stopAudio();
    setCurrentStep(0);
    setCompletedSteps([]);
    setShowComplete(false);
    setShowIntro(true);
  };

  const handlePlayAudio = () => {
    if (playingAudio) {
      return;
    }

    if (!step.free && !isSubscribed) {
      navigateToSubscription();
      return;
    }

    stopAudio();
    setPlayingAudio(true);
    audioTimeoutRef.current = setTimeout(() => {
      setPlayingAudio(false);
      audioTimeoutRef.current = null;
    }, 2000);
  };

  const startLesson = () => {
    stopAudio();
    setShowIntro(false);
    setShowComplete(false);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  if (showComplete) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.completionScroll, { paddingTop: insets.top + spacing.xl }]}
        >
          <LinearGradient colors={COMPLETION_GRADIENT} style={styles.completionCard}>
            <Text style={[styles.completionEmoji, { marginBottom: spacing.lg }]}>⭐</Text>
            <Text
              style={[
                styles.completionTitle,
                { color: colors.foreground, textAlign: isRTL ? 'right' : 'center' },
              ]}
            >
              {t.prayerComplete}
            </Text>
            <Text
              style={[
                styles.completionSubtitle,
                { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'center' },
              ]}
            >
              {t.prayerCompleteMessage}
            </Text>

            <Card style={[styles.statsCard, { backgroundColor: `${colors.card}99` }]}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statEmoji}>✅</Text>
                  <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                    {completedSteps.length} / {steps.length}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statEmoji}>⭐</Text>
                  <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                    {completedSteps.length} {t.earnedBadges}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statEmoji}>🤲</Text>
                  <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>1 {t.rakat}</Text>
                </View>
              </View>
            </Card>

            <View style={styles.completionActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.flexAction}
                onPress={handleRestart}
              >
                <LinearGradient colors={CTA_BUTTON_GRADIENT} style={styles.primaryAction}>
                  {isRTL ? (
                    <>
                      <Text style={styles.primaryActionText}>{t.restart}</Text>
                      <RotateCcw color="#ffffff" size={18} style={styles.iconEnd} />
                    </>
                  ) : (
                    <>
                      <RotateCcw color="#ffffff" size={18} style={styles.iconEnd} />
                      <Text style={styles.primaryActionText}>{t.restart}</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.flexAction}
                onPress={() => navigation.navigate(Routes.LearnIslamScreen)}
              >
                <View
                  style={[
                    styles.secondaryAction,
                    isRTL && styles.rowReverse,
                    {
                      borderColor: colors.border,
                      backgroundColor: `${colors.card}bb`,
                    },
                  ]}
                >
                  <Text style={[styles.secondaryActionText, { color: colors.foreground }]}>
                    {t.back}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (showIntro) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.introScrollContent, { paddingBottom: spacing.xxl }]}
        >
          <LinearGradient
            colors={INTRO_HEADER_GRADIENT}
            style={[styles.introHeader, { paddingTop: insets.top + spacing.xxl }]}
          >
            <BouncingEmoji emoji="🕌" size={36} style={[styles.introDecorative, { top: spacing.lg, right: spacing.xl }]} />
            <BouncingEmoji
              emoji="🌙"
              size={30}
              delay={400}
              style={[styles.introDecorative, { bottom: spacing.lg, left: spacing.xl }]}
            />
            <BouncingEmoji
              emoji="⭐"
              size={24}
              delay={800}
              style={[styles.introDecorative, { top: spacing.xl * 1.6, left: spacing.xl * 1.2 }]}
            />

            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: `${colors.card}80` }]}
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft color={colors.foreground} size={20} />
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <Text style={styles.headerEmoji}>🤲</Text>
              <Text
                style={[
                  styles.headerTitle,
                  { color: colors.foreground, textAlign: isRTL ? 'right' : 'center' },
                ]}
              >
                {t.prayerTitle}
              </Text>
              <Text
                style={[
                  styles.headerSubtitle,
                  { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'center' },
                ]}
              >
                {t.prayerOverview}
              </Text>
            </View>
          </LinearGradient>

          <LinearGradient colors={INTRO_CARD_GRADIENT} style={styles.descriptionCard}>
            <Text
              style={[
                styles.introText,
                { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'center' },
              ]}
            >
              {t.prayerOverviewDescription}
            </Text>
          </LinearGradient>

          <Card style={[styles.prayerTable, { backgroundColor: `${colors.card}cc` }]}>
            <LinearGradient colors={['#c9b6f0', '#d4c5f9']} style={styles.tableHeaderGradient}>
              <View style={[styles.tableHeaderRow, isRTL && styles.rowReverse]}>
                <View style={[styles.tableHeaderPrayerCell, isRTL && styles.rowReverse]}>
                  <Text style={styles.tableHeaderCellText}>🕌</Text>
                  <Text style={styles.tableHeaderCellText}>{prayerColumnLabel}</Text>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderCellText}>{t.rakatCount}</Text>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderCellText}>{t.sujudPerRakat}</Text>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderCellText}>{t.totalSujud}</Text>
                </View>
              </View>
            </LinearGradient>

            {prayerTimes.map((prayer, index) => (
              <View
                key={prayer.name}
                style={[
                  styles.tableRow,
                  isRTL && styles.rowReverse,
                  index !== prayerTimes.length - 1 && {
                    borderBottomColor: `${colors.border}33`,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                  },
                ]}
              >
                <View style={[styles.tablePrayerCell, isRTL && styles.rowReverse]}>
                  <LinearGradient colors={prayer.gradient} style={styles.prayerIconBadge}>
                    <prayer.Icon color="#ffffff" size={16} />
                  </LinearGradient>
                  <Text
                    style={[
                      styles.prayerName,
                      { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' },
                    ]}
                  >
                    {prayer.name}
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={[styles.prayerStat, { color: colors.foreground }]}>{prayer.rakat}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={[styles.prayerStat, { color: colors.foreground }]}>
                    {prayer.sujudPerRakat}
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={[styles.tableHighlight, { color: colors.foreground }]}>
                    {prayer.totalSujud}
                  </Text>
                </View>
              </View>
            ))}
          </Card>

          <View style={styles.prayerCardGrid}>
            {prayerTimes.map((prayer) => (
              <View key={prayer.name} style={styles.prayerCardWrapper}>
                <LinearGradient colors={prayer.gradient} style={styles.prayerCardGradient}>
                  <prayer.Icon color="#ffffff" size={28} style={styles.prayerCardIcon} />
                  <Text
                    style={[
                      styles.prayerCardName,
                      { color: '#ffffff', textAlign: isRTL ? 'right' : 'center' },
                    ]}
                  >
                    {prayer.name}
                  </Text>
                  <Text
                    style={[
                      styles.prayerCardMeta,
                      { textAlign: isRTL ? 'right' : 'center' },
                    ]}
                  >
                    {prayer.rakat} {t.rakat}
                  </Text>
                </LinearGradient>
              </View>
            ))}
          </View>

          <LinearGradient colors={INTRO_CTA_GRADIENT} style={styles.ctaCard}>
            <Text style={styles.ctaEmoji}>📿</Text>
            <Text
              style={[
                styles.ctaTitle,
                { color: colors.foreground, textAlign: isRTL ? 'right' : 'center' },
              ]}
            >
              {t.letsLearnPrayer}
            </Text>
            <TouchableOpacity activeOpacity={0.85} onPress={startLesson}>
              <LinearGradient colors={CTA_BUTTON_GRADIENT} style={styles.ctaButtonGradient}>
                <Text style={styles.ctaButtonText}>{t.startPrayer}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
      >
        <LinearGradient
          colors={LESSON_HEADER_GRADIENT}
          style={[styles.header, { paddingTop: insets.top + spacing.xxl }]}
        >
          <BouncingEmoji emoji="🕌" size={32} style={[styles.decorativeEmoji, { top: spacing.lg, right: spacing.xl }]} />
          <BouncingEmoji
            emoji="🌙"
            size={26}
            delay={400}
            style={[styles.decorativeEmoji, { bottom: spacing.lg, left: spacing.xl }]}
          />

          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: `${colors.card}80` }]}
            activeOpacity={0.8}
            onPress={() => {
              stopAudio();
              setShowIntro(true);
            }}
          >
            <ArrowLeft color={colors.foreground} size={20} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerEmoji}>🤲</Text>
            <Text
              style={[
                styles.headerTitle,
                { color: colors.foreground, textAlign: isRTL ? 'right' : 'center' },
              ]}
            >
              {t.prayerTitle}
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'center' },
              ]}
            >
              {t.prayerIntro}
            </Text>
          </View>

          <View style={[styles.progressContainer, { backgroundColor: `${colors.card}88` }]}>
            <View style={[styles.progressHeader, isRTL && styles.rowReverse]}>
              <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>
                {t.stepNumber} {currentStep + 1} / {steps.length}
              </Text>
              <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>
                {Math.round(progress)}%
              </Text>
            </View>
            <Progress value={progress} />
          </View>
        </LinearGradient>

        <LinearGradient colors={STEP_GRADIENT} style={styles.stepGradient}>
          <Card style={[styles.stepCard, { borderWidth: 0, backgroundColor: '#ffffffee' }]}>
            <View style={[styles.stepHeader, isRTL && styles.rowReverse]}>
              <View style={[styles.stepNumberContainer, { backgroundColor: `${colors.secondary}26` }]}>
                <Text style={[styles.stepNumberText, { color: colors.secondary }]}>{step.id}</Text>
              </View>
              <Text
                style={[
                  styles.stepMeta,
                  { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' },
                ]}
              >
                {t.stepNumber} {step.id}
              </Text>
              {completedSteps.includes(step.id) && (
                <StarIcon color="#f9d9a7" fill="#f9d9a7" size={20} />
              )}
            </View>

            <View style={[styles.stepEmojiWrapper, isRTL && styles.alignEnd]}>
              <BouncingEmoji emoji={step.emoji} size={72} />
            </View>

            <Text
              style={[
                styles.stepTitle,
                { color: colors.foreground, textAlign: isRTL ? 'right' : 'center' },
              ]}
            >
              {step.title}
            </Text>
            <Text
              style={[
                styles.stepDescription,
                { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'center' },
              ]}
            >
              {step.description}
            </Text>

            <View style={[styles.duaContainer, { backgroundColor: `${colors.secondary}20` }]}>
              <Text
                style={[
                  styles.duaArabic,
                  { color: colors.foreground, writingDirection: 'rtl' },
                ]}
              >
                {step.arabic}
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handlePlayAudio}
                disabled={playingAudio || (!step.free && !isSubscribed)}
                style={[
                  styles.audioButton,
                  {
                    borderColor: playingAudio ? colors.primary : colors.border,
                    opacity: !step.free && !isSubscribed ? 0.5 : 1,
                  },
                ]}
              >
                {isRTL ? (
                  <>
                    <Text style={[styles.audioText, { color: colors.foreground }]}>
                      {playingAudio ? `${t.play}ing...` : t.playAudio}
                    </Text>
                    <Volume2 color={colors.foreground} size={18} style={styles.iconStart} />
                  </>
                ) : (
                  <>
                    <Volume2 color={colors.foreground} size={18} style={styles.iconStart} />
                    <Text style={[styles.audioText, { color: colors.foreground }]}>
                      {playingAudio ? `${t.play}ing...` : t.playAudio}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <Text
                style={[
                  styles.duaTransliteration,
                  { color: colors.primary, textAlign: isRTL ? 'right' : 'center' },
                ]}
              >
                {step.transliteration}
              </Text>
              <Text
                style={[
                  styles.duaTranslation,
                  { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'center' },
                ]}
              >
                {step.translation}
              </Text>
            </View>

            <View style={styles.navigationRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handlePrevious}
                disabled={currentStep === 0}
                style={[
                  styles.flexAction,
                  currentStep === 0 && { opacity: 0.5 },
                ]}
              >
                <View
                  style={[
                    styles.secondaryAction,
                    isRTL && styles.rowReverse,
                    { borderColor: colors.border },
                  ]}
                >
                  {isRTL ? (
                    <>
                      <Text style={[styles.secondaryActionText, { color: colors.foreground }]}>
                        {t.previousStep}
                      </Text>
                      <ChevronLeft color={colors.foreground} size={18} style={styles.iconEnd} />
                    </>
                  ) : (
                    <>
                      <ChevronLeft color={colors.foreground} size={18} style={styles.iconEnd} />
                      <Text style={[styles.secondaryActionText, { color: colors.foreground }]}>
                        {t.previousStep}
                      </Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.85} onPress={handleNext} style={styles.flexAction}>
                <LinearGradient colors={CTA_BUTTON_GRADIENT} style={styles.primaryAction}>
                  {isRTL ? (
                    <>
                      <Text style={styles.primaryActionText}>
                        {currentStep === steps.length - 1 ? t.completed : t.nextStep}
                      </Text>
                      <ChevronRight color="#ffffff" size={18} style={styles.iconEnd} />
                    </>
                  ) : (
                    <>
                      <ChevronRight color="#ffffff" size={18} style={styles.iconEnd} />
                      <Text style={styles.primaryActionText}>
                        {currentStep === steps.length - 1 ? t.completed : t.nextStep}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {!step.free && !isSubscribed && (
              <Text style={[styles.lockedNotice, { color: colors.mutedForeground, textAlign: 'center' }]}>
                🔒 {t.unlockFullLessons}
              </Text>
            )}
          </Card>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  introScrollContent: {
    paddingHorizontal: spacing.xl,
  },
  introHeader: {
    borderBottomLeftRadius: borderRadius['3xl'],
    borderBottomRightRadius: borderRadius['3xl'],
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  introDecorative: {
    position: 'absolute',
  },
  descriptionCard: {
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  introText: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  prayerTable: {
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  tableHeaderGradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  tableHeaderCell: {
    flex: 1,
    alignItems: 'center',
  },
  tableHeaderPrayerCell: {
    flex: 1.6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tableHeaderCellText: {
    color: '#ffffff',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  tablePrayerCell: {
    flex: 1.6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  prayerIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerName: {
    fontSize: fontSize.sm,
  },
  tableCell: {
    flex: 1,
    alignItems: 'center',
  },
  prayerStat: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  tableHighlight: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    backgroundColor: '#f9d9a74d',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    minWidth: 48,
    textAlign: 'center',
  },
  prayerCardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.xl,
  },
  prayerCardWrapper: {
    width: '50%',
    padding: spacing.xs,
  },
  prayerCardGradient: {
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  prayerCardIcon: {
    marginBottom: spacing.xs,
  },
  prayerCardName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  prayerCardMeta: {
    fontSize: fontSize.xs,
    color: '#ffffffcc',
  },
  ctaCard: {
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  ctaEmoji: {
    fontSize: 48,
  },
  ctaTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  ctaButtonGradient: {
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
  header: {
    borderBottomLeftRadius: borderRadius['3xl'],
    borderBottomRightRadius: borderRadius['3xl'],
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  decorativeEmoji: {
    position: 'absolute',
  },
  backButton: {
    alignSelf: 'flex-start',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  headerEmoji: {
    fontSize: 60,
  },
  headerTitle: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  progressContainer: {
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    gap: spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: fontSize.xs,
  },
  stepGradient: {
    paddingHorizontal: spacing.xl,
  },
  stepCard: {
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    gap: spacing.md,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepNumberContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  stepMeta: {
    flex: 1,
    fontSize: fontSize.sm,
  },
  stepEmojiWrapper: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  stepTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
  },
  stepDescription: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  duaContainer: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  duaArabic: {
    fontSize: fontSize['2xl'],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  audioButton: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  audioText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  duaTransliteration: {
    fontSize: fontSize.sm,
    fontStyle: 'italic',
  },
  duaTranslation: {
    fontSize: fontSize.xs,
    lineHeight: 18,
  },
  navigationRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  flexAction: {
    flex: 1,
  },
  primaryAction: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primaryActionText: {
    color: '#ffffff',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  secondaryAction: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  secondaryActionText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  lockedNotice: {
    fontSize: fontSize.xs,
    marginTop: spacing.md,
  },
  completionScroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  completionCard: {
    borderRadius: borderRadius['2xl'],
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
  },
  completionEmoji: {
    fontSize: 64,
  },
  completionTitle: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
  },
  completionSubtitle: {
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  statsCard: {
    width: '100%',
    padding: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  statEmoji: {
    fontSize: 28,
  },
  statLabel: {
    fontSize: fontSize.xs,
  },
  completionActions: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  iconStart: {
    marginRight: spacing.xs,
  },
  iconEnd: {
    marginLeft: spacing.xs,
  },
});

export default PrayerScreen;
