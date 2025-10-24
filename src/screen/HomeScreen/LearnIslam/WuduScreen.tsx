import { RootstackParamList } from '../../../MainNavigation/Routes.tsx';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../theme/ThemeContext.tsx';
import { useLanguage } from '../../../context/LanguageContext.tsx';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from '../../../theme/spacing.ts';
import GradientBackground from '../../../component/GradientBackground.tsx';
import { getWuduImage } from '../../../utils/wuduImages.ts';
import { useNavigation } from '@react-navigation/core';
import { Progress } from '../../../component/Progress.tsx';
import { HeaderSection } from '../../../component/HeaderSection.tsx';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../../../component/Card.tsx';
import { ChevronLeft, ChevronRight, StarIcon } from 'lucide-react-native';

const COMPLETION_GRADIENT = ['#b4e4ff33', '#a7d5dd33', '#7ec4cf33'];
const STEP_GRADIENT = ['#ffffff', '#ccedff'];

type NavigationProps = NativeStackNavigationProp<RootstackParamList>;

type WuduSteps = {
  id: number;
  title: string;
  description: string;
  image: any;
  dua?: string;
  free: boolean;
};

export const WuduScreen = () => {
  const { colors, theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showComplete, setShowComplete] = useState(false);
  const navigation = useNavigation<NavigationProps>();

  const steps = useMemo<WuduSteps[]>(
    () => [
      {
        id: 1,
        title: t.intention,
        description: t.intentionDescription,
        image: getWuduImage(theme, 1),
        free: true,
      },
      {
        id: 2,
        title: t.washHands,
        description: t.washHandsDescription,
        image: getWuduImage(theme, 2),
        dua: 'بِسْمِ اللَّهِ',
        free: true,
      },
      {
        id: 3,
        title: t.rinseMouth,
        description: t.rinseMouthDescription,
        image: getWuduImage(theme, 3),
        free: true,
      },
      {
        id: 4,
        title: t.rinseNose,
        description: t.rinseNoseDescription,
        image: getWuduImage(theme, 4),
        free: false,
      },
      {
        id: 5,
        title: t.washFace,
        description: t.washFaceDescription,
        image: getWuduImage(theme, 5),
        free: false,
      },
      {
        id: 6,
        title: t.washArms,
        description: t.washArmsDescription,
        image: getWuduImage(theme, 6),
        free: false,
      },
      {
        id: 7,
        title: t.wipeHead,
        description: t.wipeHeadDescription,
        image: getWuduImage(theme, 7),
        free: false,
      },
      {
        id: 8,
        title: t.wipeEars,
        description: t.wipeEarsDescription,
        image: getWuduImage(theme, 8),
        free: false,
      },
      {
        id: 9,
        title: t.washFeet,
        description: t.washFeetDescription,
        image: getWuduImage(theme, 9),
        free: false,
      },
    ],
    [t, theme],
  );

  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];

  const handleNext = () => {
    setCompletedSteps(prev =>
      prev.includes(step.id) ? prev : [...prev, step.id],
    );

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setShowComplete(false);
  };

  return (
    <SafeAreaView
      edges={['right', 'left']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <GradientBackground colors={colors.gradient} />
      <ScrollView
        contentInset={{ bottom: 50 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header Section with Gradient Background */}
        <HeaderSection color={colors.HEADER_GRADIENT}>
          <View style={styles.headerContent}>
            <Image
              source={getWuduImage(theme, 0)}
              style={{
                width: 100,
                height: 100,
              }}
              resizeMode={'contain'}
            />
            <Text
              style={[
                styles.headerTitle,
                {
                  color: colors.foreground,
                  textAlign: isRTL ? 'right' : 'center',
                },
              ]}
            >
              {t.wuduTitle}
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                {
                  color: colors.mutedForeground,
                  textAlign: isRTL ? 'right' : 'center',
                },
              ]}
            >
              {t.wuduIntro}
            </Text>
          </View>
          {/* Progress Bar */}
          <View
            style={[
              styles.progressContainer,
              { backgroundColor: `${colors.card}88` },
            ]}
          >
            <View style={styles.progressHeader}>
              <Text
                style={[
                  styles.progressLabel,
                  { color: colors.mutedForeground },
                ]}
              >
                {t.stepNumber} {currentStep + 1} / {steps.length}
              </Text>
              <Text
                style={[
                  styles.progressLabel,
                  { color: colors.mutedForeground },
                ]}
              >
                {Math.round(progress)}%
              </Text>
            </View>
            <Progress value={progress} />
          </View>
        </HeaderSection>

        <LinearGradient
          colors={STEP_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.stepGradient}
        >
          <Card
            style={[
              styles.stepCard,
              { borderWidth: 0, backgroundColor: 'transparent' },
            ]}
          >
            <View style={[styles.stepCard, isRTL && styles.rowReverse]}>
              <View style={styles.stepHeader}>
                <View
                  style={[
                    styles.stepNumberContainer,
                    { backgroundColor: `${colors.primary}1a` },
                  ]}
                >
                  <Text
                    style={[
                      styles.stepMeta,
                      {
                        color: colors.foreground,
                        textAlign: isRTL ? 'right' : 'left',
                      },
                    ]}
                  >
                    {t.stepNumber} {step.id}
                  </Text>
                </View>
                {completedSteps.includes(step.id) && (
                  <StarIcon color="#f9d9a7" fill="#f9d9a7" size={20} />
                )}
              </View>
            </View>
            <View style={[styles.stepImageWrapper, isRTL && styles.alignEnd]}>
              <Image
                source={step.image}
                style={{
                  width: 180,
                  height: 200,
                  borderRadius: 60,
                }}
                resizeMode={'contain'}
              />
            </View>
            <Text
              style={[
                styles.stepTitle,
                {
                  color: colors.foreground,
                  textAlign: isRTL ? 'right' : 'center',
                },
              ]}
            >
              {step.title}
            </Text>
            <Text
              style={[
                styles.stepDescription,
                {
                  color: colors.mutedForeground,
                  textAlign: isRTL ? 'right' : 'center',
                },
              ]}
            >
              {step.description}
            </Text>
            {!!step.dua && (
              <View
                style={[styles.duaContainer, { backgroundColor: colors.card }]}
              >
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
                    <Text
                      style={[
                        styles.secondaryActionText,
                        { color: colors.foreground },
                      ]}
                    >
                      {t.previousStep}
                    </Text>
                    <ChevronLeft
                      color={colors.foreground}
                      size={18}
                      style={styles.iconStart}
                    />
                  </>
                ) : (
                  <>
                    <ChevronLeft
                      color={colors.foreground}
                      size={18}
                      style={styles.iconEnd}
                    />
                    <Text
                      style={[
                        styles.secondaryActionText,
                        { color: colors.foreground },
                      ]}
                    >
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
                  style={[styles.primaryAction]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {isRTL ? (
                    <>
                      <ChevronRight
                        color="#ffffff"
                        size={18}
                        style={styles.iconEnd}
                      />
                      <Text style={styles.primaryActionText}>
                        {currentStep === steps.length - 1
                          ? t.completed
                          : t.nextStep}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.primaryActionText}>
                        {currentStep === steps.length - 1
                          ? t.completed
                          : t.nextStep}
                      </Text>
                      <ChevronRight
                        color="#ffffff"
                        size={18}
                        style={styles.iconStart}
                      />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
  content: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    lineHeight: 22,
  },
  progressContainer: {
    marginTop: spacing.md,
    padding: spacing.lg,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
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
    marginTop: -spacing.xl * 2,
    marginHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
  },
  stepCard: {
    borderRadius: borderRadius.xl,
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
    width: 70,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: spacing.sm,
  },
  stepMeta: {
    fontSize: fontSize.base,
  },
  stepImageWrapper: {
    alignItems: 'center',
    marginVertical: spacing.lg,
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
