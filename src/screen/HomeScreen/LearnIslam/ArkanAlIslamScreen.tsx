import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  Image,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {
  useFloatAnimation,
  useTwinkleAnimation,
} from '../../../hooks/useAnimatedValue.ts';
import Animated from 'react-native-reanimated';
import { useTheme } from '../../../theme/ThemeContext.tsx';
import { useLanguage } from '../../../context/LanguageContext.tsx';
import React, { useMemo, useRef, useState } from 'react';
import GradientBackground from '../../../component/GradientBackground.tsx';
import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from '../../../theme/spacing.ts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootstackParamList } from '../../../MainNavigation/Routes.tsx';
import { useNavigation } from '@react-navigation/core';
import { ArrowLeft } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const AnimatedStar = ({
  size = 24,
  delay = 0,
  style,
}: {
  size?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) => {
  const animatedStar = useTwinkleAnimation(delay);
  return (
    <Animated.View style={[style, animatedStar]}>
      <Text style={{ fontSize: size }}>⭐</Text>
    </Animated.View>
  );
};

interface Pillar {
  id: number;
  title: string;
  description: string;
  arabic: string;
  image: ReturnType<typeof require>;
  gradient: [string, string];
  free: boolean;
}

type NavigationProps = NativeStackNavigationProp<RootstackParamList>;

export const ArkanAlIslamScreen = () => {
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [earnedStars, setEarnedStars] = useState<number[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const floatTranslateY = useFloatAnimation();
  const navigation = useNavigation<NavigationProps>();

  const pillars = useMemo<Pillar[]>(
    () => [
      {
        id: 1,
        title: t.shahadahTitle,
        description: t.shahadahDescription,
        arabic: t.shahadahArabic,
        image: require('../../../../assets/images/arkan-islam/Al-shada.png'),
        gradient: ['#a7d5dd4d', '#7ec4cf4d'],
        free: true,
      },
      {
        id: 2,
        title: t.salahTitle,
        description: t.salahDescription,
        arabic: 'الصَّلَاةُ',
        image: require('../../../../assets/images/arkan-islam/pray.png'),
        gradient: ['#b4e4ff4d', '#95d5f84d'],
        free: true,
      },
      {
        id: 3,
        title: t.zakahTitle,
        description: t.zakahDescription,
        arabic: 'الزَّكَاةُ',
        image: require('../../../../assets/images/arkan-islam/Charity.png'),
        gradient: ['#f9d9a74d', '#f5c26b4d'],
        free: false,
      },
      {
        id: 4,
        title: t.sawmTitle,
        description: t.sawmDescription,
        arabic: 'الصَّوْمُ',
        image: require('../../../../assets/images/arkan-islam/fasting.png'),
        gradient: ['#d4c5f94d', '#c9b6f04d'],
        free: false,
      },
      {
        id: 5,
        title: t.hajjTitle,
        description: t.hajjDescription,
        arabic: 'الْحَجُّ',
        image: require('../../../../assets/images/arkan-islam/Hajj.png'),
        gradient: ['#ffc8dd4d', '#ffafcc4d'],
        free: false,
      },
    ],
    [t],
  );

  const renderCard = (pillar: Pillar) => {
    const hasEarnedStar = earnedStars.includes(pillar.id);

    return (
      <LinearGradient
        key={pillar.id}
        colors={pillar.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.pillarGradient}
      >
        <View style={[styles.pillarHeader, isRTL && styles.rowReverse]}>
          <View
            style={[
              styles.pillarNumberContainer,
              { backgroundColor: `${colors.background}aa` },
            ]}
          >
            <Text style={[styles.pillarNumber, { color: colors.primary }]}>
              {pillar.id}
            </Text>
          </View>
          <Text
            style={[
              styles.pillarLabel,
              {
                color: colors.mutedForeground,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
          >
            {t.pillar} {pillar.id}
          </Text>
          {hasEarnedStar && (
            <AnimatedStar size={20} delay={200} style={styles.earnedStar} />
          )}
        </View>
        <View style={[styles.pillarBody]}>
          <Image
            source={pillar.image}
            style={styles.pillarImage}
            resizeMode={'cover'}
          />

          <Text
            style={[
              styles.pillarTitle,
              { color: colors.foreground, textAlign: 'center' },
            ]}
          >
            {pillar.title}
          </Text>
          <Text
            style={[
              styles.pillarDescription,
              {
                color: colors.mutedForeground,
                textAlign: 'center',
              },
            ]}
          >
            {pillar.description}
          </Text>
          {!pillar.arabic && (
            <View style={styles.arabicContainer}>
              <Text
                style={[
                  styles.arabicText,
                  {
                    writingDirection: 'rtl',
                    color: colors.foreground,
                    textAlign: 'center',
                  },
                ]}
              >
                {pillar.arabic}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    );
  };

  return (
    <SafeAreaView
      edges={['right', 'left']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <GradientBackground colors={colors.gradient} />
      <ScrollView
        contentInset={{ bottom: 100 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section with Gradient Background */}
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <GradientBackground
            colors={colors.gradient}
            style={[StyleSheet.absoluteFillObject, styles.gradient]}
          />

          {/* Decorative Stars */}
          <Animated.Text style={[styles.stars1, floatTranslateY]}>
            <Text style={{ fontSize: 30 }}>🌟</Text>
          </Animated.Text>
          <Animated.Text style={[styles.stars2, floatTranslateY]}>
            <Text style={{ fontSize: 20 }}>✨</Text>
          </Animated.Text>

          {/* Top Bar back button */}
          <TouchableOpacity
            accessibilityRole={'header'}
            accessibilityLabel={t.back ?? 'Go Back'}
            style={[styles.backButton, { backgroundColor: `${colors.card}80` }]}
            activeOpacity={0.85}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={20} color={colors.foreground} />
          </TouchableOpacity>

          {/* Main */}
          <View style={styles.headerContent}>
            <Text style={styles.headerEmoji}>🕌</Text>
            <Text
              style={[
                styles.headerTitle,
                {
                  color: colors.foreground,
                  textAlign: isRTL ? 'right' : 'center',
                },
              ]}
            >
              {t.arkanAlIslam}
            </Text>
            <Text
              style={[
                styles.headerSubTitle,
                {
                  color: colors.foreground,
                  textAlign: isRTL ? 'right' : 'center',
                },
              ]}
            >
              {t.arkanAlIslamSubtitle}
            </Text>
          </View>
        </View>

        <View style={styles.pillarsContainer}>
          {pillars.map(pillar => renderCard(pillar))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  header: {
    paddingBottom: spacing.xxl * 2,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    marginBottom: 10,
  },
  gradient: {
    top: 0,
    height: 325,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  stars1: {
    position: 'absolute',
    marginTop: 30,
    top: 40,
    right: 20,
  },
  stars2: {
    position: 'absolute',
    marginTop: 30,
    top: 40,
    left: 80,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    alignSelf: 'flex-start',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 60,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize['3xl'],
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  headerSubTitle: {
    fontSize: fontSize.base,
    lineHeight: 20,
  },
  pillarsContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm, // Pull cards up over header
    gap: spacing.sm,
  },
  pillarGradient: {
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    height: 550,
  },
  pillarCard: {
    borderRadius: borderRadius.xl,
    width: 48,
    height: 48,
  },
  pillarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxl * 3,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  pillarNumberContainer: {
    margin: spacing.md,
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarNumber: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  pillarLabel: {
    flex: 1,
    fontSize: fontSize.sm,
  },
  earnedStar: {
    marginStart: spacing.sm,
  },
  pillarBody: {
    width: '100%',
    height: 250,
    borderRadius: borderRadius.full,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  pillarImage: {
    width: '100%',
    height: 250,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  pillarTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.lg,
  },
  pillarDescription: {
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: 20,
  },
  arabicContainer: {
    marginTop: spacing.xl,
    backgroundColor: '#ffffff80',
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  arabicText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
  },
  listenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
  },
  buttonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
});
