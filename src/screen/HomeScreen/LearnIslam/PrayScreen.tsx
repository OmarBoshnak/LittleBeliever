import { RootstackParamList, Routes } from '../../../MainNavigation/Routes.tsx';
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
import { useNavigation } from '@react-navigation/core';
import { Progress } from '../../../component/Progress.tsx';
import { HeaderSection } from '../../../component/HeaderSection.tsx';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../../../component/Card.tsx';
import {
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Moon,
  RotateCcw,
  StarIcon,
  Sun,
  Sunrise,
  Sunset,
} from 'lucide-react-native';
import { getPrayImage } from '../../../utils/prayImages.ts';

const INTRO_HEADER_GRADIENT = ['#c8e6f566', '#f5ebe066', '#f9d9a766'];
const INTRO_CARD_GRADIENT = ['#c8e6f533', '#c9b6f033'];
const INTRO_CTA_GRADIENT = ['#c9b6f04d', '#d4c5f94d', '#c9b6f04d'];
const CTA_BUTTON_GRADIENT = ['#c9b6f0', '#d4c5f9'];
const LESSON_HEADER_GRADIENT = ['#c8e6f566', '#f5ebe066', '#f9d9a766'];
const COMPLETION_GRADIENT = ['#b4e4ff33', '#a7d5dd33', '#7ec4cf33'];
const STEP_GRADIENT = ['#ffffff', '#d4c5f91a'];

const PRAYER_TIME_GRADIENTS: Array<[string, string]> = [
  ['#fed7aa', '#fef08a'],
  ['#fef08a', '#fde68a'],
  ['#fde68a', '#fdba74'],
  ['#fdba74', '#fda4af'],
  ['#a5b4fc', '#c4b5fd'],
];

type NavigationProps = NativeStackNavigationProp<RootstackParamList>;

type IconComponent = React.ComponentType<{ color?: string; size?: number }>;

type PrayerTime = {
  name: string;
  Icon: IconComponent;
  rakat: number;
  sujudPerRakat: number;
  totalSujud: number;
  gradient: [string, string];
};

type PraySteps = {
  id: number;
  title: string;
  description: string;
  image: any;
  arabic?: string;
  transliteration?: string;
  translation?: string;
  dua?: string;
  free: boolean;
};

export const PrayScreen = () => {
  const { colors, theme } = useTheme();
  const { t, isRTL, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showComplete, setShowComplete] = useState(false);
  const navigation = useNavigation<NavigationProps>();

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

  const steps = useMemo<PraySteps[]>(
    () => [
      {
        id: 1,
        title: t.intentionPray,
        description: t.intentionDescriptionPray,
        arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ الظُّهْرَ فَرْضًا لِلَّهِ تَعَالَى',
        image: getPrayImage(theme, 0),
        free: true,
      },
      {
        id: 2,
        title: t.takbir,
        description: t.takbirDescription,
        image: getPrayImage(theme, 1),
        arabic: 'اللَّهُ أَكْبَرُ',
        transliteration: 'Allahu Akbar',
        translation: 'Allah is the Greatest',
        free: true,
      },
      {
        id: 3,
        title: t.standing,
        description: t.standingDescription,
        image: getPrayImage(theme, 2),
        arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        transliteration: 'Bismillah ir-Rahman ir-Raheem',
        translation:
          'In the name of Allah, the Most Gracious, the Most Merciful',
        free: true,
      },
      {
        id: 4,
        title: t.bowing,
        description: t.bowingDescription,
        image: getPrayImage(theme, 3),
        arabic: 'سُبْحَانَ رَبِّيَ ٱلْعَظِيمِ',
        transliteration: 'Subhana Rabbiyal Adheem',
        translation: 'Glory to my Lord, the Most Great',
        free: true,
      },
      {
        id: 5,
        title: t.standingAfterBowing,
        description: t.standingAfterBowingDescription,
        image: getPrayImage(theme, 4),
        arabic: 'سَمِعَ ٱللَّهُ لِمَنْ حَمِدَهُ',
        transliteration: 'Sami Allahu liman hamidah',
        translation: 'Allah hears those who praise Him',
        free: false,
      },
      {
        id: 6,
        title: t.prostration,
        description: t.prostrationDescription,
        image: getPrayImage(theme, 5),
        arabic: 'سُبْحَانَ رَبِّيَ ٱلْأَعْلَىٰ',
        transliteration: "Subhana Rabbiyal A'la",
        translation: 'Glory to my Lord, the Most High',
        free: false,
      },
      {
        id: 7,
        title: t.sitting,
        description: t.sittingDescription,
        image: getPrayImage(theme, 6),
        arabic: 'رَبِّ ٱغْفِرْ لِي',
        transliteration: 'Rabbighfir li',
        translation: 'O my Lord, forgive me',
        free: false,
      },
      {
        id: 8,
        title: t.secondProstration,
        description: t.secondProstrationDescription,
        image: getPrayImage(theme, 7),
        arabic: 'سُبْحَانَ رَبِّيَ ٱلْأَعْلَىٰ',
        transliteration: "Subhana Rabbiyal A'la",
        translation: 'Glory to my Lord, the Most High',
        free: false,
      },
      {
        id: 9,
        title: t.tashahhud,
        description: t.tashahhudDescription,
        image: getPrayImage(theme, 8),
        arabic: 'ٱلتَّحِيَّاتُ لِلَّهِ',
        transliteration: 'At-tahiyyatu lillah',
        translation: 'All greetings are for Allah',
        free: false,
      },
      {
        id: 10,
        title: t.salam,
        description: t.salamDescription,
        image: getPrayImage(theme, 9),
        arabic: 'ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّهِ',
        transliteration: 'As-salamu alaykum wa rahmatullah',
        translation: 'Peace and mercy of Allah be upon you',
        free: false,
      },
    ],
    [t, theme],
  );

  const prayerColumnLabel = isRTL ? 'الصلاة' : 'Prayer';
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

  const startLesson = () => {
    setShowIntro(false);
    setShowComplete(false);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  if (showComplete) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <GradientBackground colors={COMPLETION_GRADIENT} />
        <View
          style={[
            styles.completion,
            {
              paddingTop: insets.top + spacing.xl,
            },
          ]}
        >
          <Text style={[styles.completionEmoji, { marginBottom: spacing.lg }]}>
            ⭐
          </Text>
          <Text
            style={[
              styles.completionTitle,
              {
                color: colors.foreground,
                textAlign: isRTL ? 'right' : 'center',
              },
            ]}
          >
            {t.wuduComplete}
          </Text>
          <Text
            style={[
              styles.completionSubtitle,
              {
                color: colors.mutedForeground,
                textAlign: isRTL ? 'right' : 'center',
              },
            ]}
          >
            {t.wuduCompleteMessage}
          </Text>
          <Card
            style={[styles.duaCard, { backgroundColor: `${colors.card}99` }]}
          >
            <Text
              style={[
                styles.duaLabel,
                {
                  color: colors.mutedForeground,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {t.wuduDua}
            </Text>
            <Text style={[styles.duaText, { color: colors.foreground }]}>
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
              <LinearGradient
                colors={['#7ec4cf', '#a7d5dd']}
                style={styles.primaryAction}
              >
                {isRTL ? (
                  <>
                    <Text style={styles.primaryActionText}>{t.restart}</Text>
                    <RotateCcw
                      color="#ffffff"
                      size={18}
                      style={styles.iconEnd}
                    />
                  </>
                ) : (
                  <>
                    <RotateCcw
                      color="#ffffff"
                      size={18}
                      style={styles.iconEnd}
                    />
                    <Text style={styles.primaryActionText}>{t.restart}</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.flexAction}
              onPress={() => navigation.replace(Routes.LearnIslamScreen)}
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
                <Text
                  style={[
                    styles.secondaryActionText,
                    { color: colors.foreground },
                  ]}
                >
                  {t.back}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (showIntro) {
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
          <HeaderSection
            color={INTRO_HEADER_GRADIENT}
            opacity={0.7}
            style={{ height: 320 }}
          >
            <View style={styles.headerContent}>
              <Image
                source={getPrayImage(theme, 10)}
                style={{ height: 100, width: 100 }}
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
                {t.prayerTitle}
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
                {t.prayerOverview}
              </Text>
            </View>
          </HeaderSection>
          <View
            style={{
              paddingHorizontal: spacing.lg,
              marginVertical: spacing.lg,
            }}
          >
            <LinearGradient
              colors={INTRO_CARD_GRADIENT}
              style={styles.descriptionCard}
            >
              <Text
                style={[
                  styles.introText,
                  {
                    color: colors.mutedForeground,
                    textAlign: isRTL ? 'right' : 'center',
                  },
                ]}
              >
                {t.prayerOverviewDescription}
              </Text>
            </LinearGradient>

            <View
              style={[
                styles.prayerTable,
                { backgroundColor: colors.background },
              ]}
            >
              <LinearGradient
                colors={['#c9b6f0', '#d4c5f9']}
                style={styles.tableHeaderGradient}
              >
                <View
                  style={[styles.tableHeaderRow, isRTL && styles.rowReverse]}
                >
                  <View
                    style={[
                      styles.tableHeaderPrayerCell,
                      isRTL && styles.rowReverse,
                    ]}
                  >
                    <Text
                      style={[styles.tableHeaderCellText, { paddingLeft: 7 }]}
                    >
                      🕌
                    </Text>
                    <Text style={styles.tableHeaderCellText}>
                      {prayerColumnLabel}
                    </Text>
                  </View>
                  <View style={styles.tableHeaderCell}>
                    <Text style={styles.tableHeaderCellText}>
                      {t.rakatCount}
                    </Text>
                  </View>
                  <View style={[styles.tableHeaderCell, { paddingRight: 10 }]}>
                    <Text style={styles.tableHeaderCellText}>
                      {t.totalSujud}
                    </Text>
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
                  <View
                    style={[styles.tablePrayerCell, isRTL && styles.rowReverse]}
                  >
                    <LinearGradient
                      colors={prayer.gradient}
                      style={styles.prayerIconBadge}
                    >
                      <prayer.Icon color="#ffffff" size={16} />
                    </LinearGradient>
                    <Text
                      style={[
                        styles.prayerName,
                        {
                          color: colors.foreground,
                          textAlign: isRTL ? 'right' : 'left',
                        },
                      ]}
                    >
                      {prayer.name}
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text
                      style={[styles.prayerStat, { color: colors.foreground }]}
                    >
                      {prayer.rakat}
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text
                      style={[
                        styles.tableHighlight,
                        { color: colors.foreground },
                      ]}
                    >
                      {prayer.totalSujud}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={{ paddingHorizontal: spacing.xs }}>
              <LinearGradient
                colors={INTRO_CTA_GRADIENT}
                style={styles.ctaCard}
              >
                <Text style={styles.ctaEmoji}>📿</Text>
                <Text
                  style={[
                    styles.ctaTitle,
                    {
                      color: colors.foreground,
                      textAlign: isRTL ? 'right' : 'center',
                    },
                  ]}
                >
                  {t.letsLearnPrayer}
                </Text>
                <TouchableOpacity activeOpacity={0.85} onPress={startLesson}>
                  <LinearGradient
                    colors={CTA_BUTTON_GRADIENT}
                    style={styles.ctaButtonGradient}
                  >
                    <Text style={styles.ctaButtonText}>{t.startPrayer}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
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
        <HeaderSection color={['#F9D9A7', '#FFD6E0']}>
          <View style={styles.headerContent}>
            <Image
              source={getPrayImage(theme, 10)}
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
              {t.prayerTitle}
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
              {t.prayerIntro}
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
                  height: 190,
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
            <View
              style={[
                styles.duaContainer,
                { backgroundColor: `${colors.secondary}20` },
              ]}
            >
              <Text
                style={[
                  styles.duaArabic,
                  { color: colors.foreground, writingDirection: 'rtl' },
                ]}
              >
                {step.arabic}
              </Text>
            </View>
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
    marginTop: spacing.sm,
    fontSize: fontSize['3xl'],
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
  descriptionCard: {
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#c9b6f0',
    height: 90,
  },
  introText: {
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  prayerTable: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  tableHeaderGradient: {
    height: 48,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.md,
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
    marginVertical: spacing.xs,
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
    height: 180,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  ctaTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  ctaButtonGradient: {
    borderRadius: borderRadius.xl,
    marginTop: spacing.md,
    height: 40,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
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
  completion: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
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
    alignItems: 'center',
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
