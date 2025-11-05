import React, { useEffect, useMemo, useRef, useState } from 'react';
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
} from 'lucide-react-native';

import { RootstackParamList, Routes } from '../../MainNavigation/Routes.tsx';
import { useTheme } from '../../theme/ThemeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { Card } from '../../component/Card.tsx';
import { Progress } from '../../component/Progress.tsx';
import { borderRadius, fontSize, fontWeight, spacing } from '../../theme/spacing.ts';

const HEADER_GRADIENT = ['#b4e4ff33', '#a7d5dd33', '#7ec4cf33'];
const COMPLETION_GRADIENT = ['#b4e4ff33', '#a7d5dd33', '#7ec4cf33'];
const STEP_GRADIENT = ['#ffffff', '#b4e4ff1a'];

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

type ScreenProps = NativeStackScreenProps<RootstackParamList, 'WuduScreen'>;

type WuduStep = {
  id: number;
  title: string;
  description: string;
  emoji: string;
  dua?: string;
  free: boolean;
};

export const WuduScreen = ({ navigation, route }: ScreenProps) => {
  const { colors } = useTheme();
  const { t, isRTL, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showComplete, setShowComplete] = useState(false);

  const isSubscribed = route.params?.isSubscribed ?? false;

  const steps = useMemo<WuduStep[]>(
    () => [
      {
        id: 1,
        title: t.intention,
        description: t.intentionDescription,
        emoji: '🤲',
        free: true,
      },
      {
        id: 2,
        title: t.washHands,
        description: t.washHandsDescription,
        emoji: '👐',
        dua: 'بِسْمِ اللَّهِ',
        free: true,
      },
      {
        id: 3,
        title: t.rinseMouth,
        description: t.rinseMouthDescription,
        emoji: '👄',
        free: true,
      },
      {
        id: 4,
        title: t.rinseNose,
        description: t.rinseNoseDescription,
        emoji: '👃',
        free: false,
      },
      {
        id: 5,
        title: t.washFace,
        description: t.washFaceDescription,
        emoji: '😊',
        free: false,
      },
      {
        id: 6,
        title: t.washArms,
        description: t.washArmsDescription,
        emoji: '💪',
        free: false,
      },
      {
        id: 7,
        title: t.wipeHead,
        description: t.wipeHeadDescription,
        emoji: '🙋',
        free: false,
      },
      {
        id: 8,
        title: t.wipeEars,
        description: t.wipeEarsDescription,
        emoji: '👂',
        free: false,
      },
      {
        id: 9,
        title: t.washFeet,
        description: t.washFeetDescription,
        emoji: '🦶',
        free: false,
      },
    ],
    [t],
  );

  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];

  const handleNext = () => {
    if (!step.free && !isSubscribed) {
      navigation.navigate(Routes.SubscriberScreen);
      return;
    }

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
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setShowComplete(false);
  };

  if (showComplete) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={[styles.completionScroll, { paddingTop: insets.top + spacing.xl }]}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient colors={COMPLETION_GRADIENT} style={styles.completionCard}>
            <Text style={[styles.completionEmoji, { marginBottom: spacing.lg }]}>⭐</Text>
            <Text
              style={[
                styles.completionTitle,
                { color: colors.foreground, textAlign: isRTL ? 'right' : 'center' },
              ]}
            >
              {t.wuduComplete}
            </Text>
            <Text
              style={[
                styles.completionSubtitle,
                { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'center' },
              ]}
            >
              {t.wuduCompleteMessage}
            </Text>

            <Card style={[styles.duaCard, { backgroundColor: `${colors.card}99` }]}>
              <Text
                style={[styles.duaLabel, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}
              >
                {t.wuduDua}
              </Text>
              <Text
                style={[styles.duaText, { color: colors.foreground }]}
              >
                {language === 'ar'
                  ? 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ'
                  : 'I bear witness that there is no deity but Allah, alone without partner, and I bear witness that Muhammad is His servant and Messenger'}
              </Text>
            </Card>

            <View style={styles.completionActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.flexAction}
                onPress={handleRestart}
              >
                <LinearGradient colors={['#7ec4cf', '#a7d5dd']} style={styles.primaryAction}>
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
      >
        <LinearGradient
          colors={HEADER_GRADIENT}
          style={[styles.header, { paddingTop: insets.top + spacing.xxl }]}
        >
          <BouncingEmoji emoji="💧" size={32} style={[styles.decorativeEmoji, { top: spacing.lg, right: spacing.xl }]} />
          <BouncingEmoji
            emoji="💦"
            size={26}
            delay={400}
            style={[styles.decorativeEmoji, { bottom: spacing.lg, left: spacing.xl }]}
          />

          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: `${colors.card}80` }]}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft color={colors.foreground} size={20} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerEmoji}>💧</Text>
            <Text
              style={[
                styles.headerTitle,
                { color: colors.foreground, textAlign: isRTL ? 'right' : 'center' },
              ]}
            >
              {t.wuduTitle}
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'center' },
              ]}
            >
              {t.wuduIntro}
            </Text>
          </View>

          <View style={[styles.progressContainer, { backgroundColor: `${colors.card}88` }]}>
            <View style={styles.progressHeader}>
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
              <View style={[styles.stepNumberContainer, { backgroundColor: `${colors.primary}1a` }]}>
                <Text style={[styles.stepNumberText, { color: colors.primary }]}>{step.id}</Text>
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

            {!!step.dua && (
              <View style={[styles.duaContainer, { backgroundColor: `${colors.secondary}26` }]}>
                <Text
                  style={[
                    styles.duaArabic,
                    { color: colors.foreground, writingDirection: 'rtl' },
                  ]}
                >
                  {step.dua}
                </Text>
              </View>
            )}

            <View style={[styles.actionRow, isRTL && styles.rowReverse]}>
              <TouchableOpacity
                onPress={handlePrevious}
                disabled={currentStep === 0}
                activeOpacity={0.85}
                style={[
                  styles.secondaryAction,
                  {
                    flex: 1,
                    borderColor: colors.border,
                    opacity: currentStep === 0 ? 0.6 : 1,
                    backgroundColor: `${colors.card}bb`,
                  },
                ]}
              >
                {isRTL ? (
                  <>
                    <Text style={[styles.secondaryActionText, { color: colors.foreground }]}>
                      {t.previousStep}
                    </Text>
                    <ChevronLeft color={colors.foreground} size={18} style={styles.iconStart} />
                  </>
                ) : (
                  <>
                    <ChevronLeft color={colors.foreground} size={18} style={styles.iconEnd} />
                    <Text style={[styles.secondaryActionText, { color: colors.foreground }]}>
                      {t.previousStep}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNext}
                activeOpacity={0.9}
                style={{ flex: 1 }}
              >
                <LinearGradient
                  colors={['#7ec4cf', '#a7d5dd']}
                  style={[styles.primaryAction, { height: 52 }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {isRTL ? (
                    <>
                      <ChevronRight color="#ffffff" size={18} style={styles.iconEnd} />
                      <Text style={styles.primaryActionText}>
                        {currentStep === steps.length - 1 ? t.completed : t.nextStep}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.primaryActionText}>
                        {currentStep === steps.length - 1 ? t.completed : t.nextStep}
                      </Text>
                      <ChevronRight color="#ffffff" size={18} style={styles.iconStart} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {!step.free && !isSubscribed && (
              <Text
                style={[
                  styles.lockedNote,
                  { color: colors.mutedForeground, textAlign: 'center' },
                ]}
              >
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
  header: {
    borderBottomLeftRadius: borderRadius.xl * 1.5,
    borderBottomRightRadius: borderRadius.xl * 1.5,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  decorativeEmoji: {
    position: 'absolute',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerEmoji: {
    fontSize: 64,
  },
  headerTitle: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.semibold,
  },
  headerSubtitle: {
    fontSize: fontSize.base,
    lineHeight: 22,
  },
  progressContainer: {
    marginTop: spacing.xl,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    fontSize: fontSize.xs,
  },
  stepGradient: {
    marginTop: -spacing.lg,
    marginHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    padding: 1,
  },
  stepCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  stepNumberContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: spacing.sm,
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
  stepTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  stepDescription: {
    fontSize: fontSize.base,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  duaContainer: {
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  duaArabic: {
    fontSize: fontSize.lg,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  primaryAction: {
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.xl,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryActionText: {
    color: '#ffffff',
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  secondaryAction: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
  },
  secondaryActionText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  lockedNote: {
    marginTop: spacing.lg,
    fontSize: fontSize.sm,
  },
  completionScroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  completionCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    shadowColor: '#00000033',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  completionEmoji: {
    fontSize: 96,
  },
  completionTitle: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  completionSubtitle: {
    fontSize: fontSize.base,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  duaCard: {
    width: '100%',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  duaLabel: {
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  duaText: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    textAlign: 'center',
  },
  completionActions: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  flexAction: {
    flex: 1,
  },
  iconStart: {
    marginStart: spacing.sm,
  },
  iconEnd: {
    marginEnd: spacing.sm,
  },
});

