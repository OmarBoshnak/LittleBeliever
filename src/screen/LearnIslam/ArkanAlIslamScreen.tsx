import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Lock, Volume2 } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootstackParamList, Routes } from '../../MainNavigation/Routes.tsx';
import { useTheme } from '../../theme/ThemeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { Card } from '../../component/Card.tsx';
import { borderRadius, fontSize, fontWeight, spacing } from '../../theme/spacing.ts';

type ScreenProps = NativeStackScreenProps<
  RootstackParamList,
  'ArkanAlIslamScreen'
>;

interface Pillar {
  id: number;
  title: string;
  description: string;
  arabic: string;
  emoji: string;
  gradient: [string, string];
  free: boolean;
}

const HEADER_GRADIENT = ['#a7d5dd20', '#f5ebe020', '#f9d9a720'];

const AnimatedStar = ({
  size = 24,
  delay = 0,
  style,
}: {
  size?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.15,
          duration: 900,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [delay, scale]);

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      <Text style={{ fontSize: size }}>⭐</Text>
    </Animated.View>
  );
};

export const ArkanAlIslamScreen = ({ navigation, route }: ScreenProps) => {
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [earnedStars, setEarnedStars] = useState<number[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSubscribed = route.params?.isSubscribed ?? false;

  const pillars = useMemo<Pillar[]>(
    () => [
      {
        id: 1,
        title: t.shahadahTitle,
        description: t.shahadahDescription,
        arabic: t.shahadahArabic,
        emoji: '☝️',
        gradient: ['#a7d5dd4d', '#7ec4cf4d'],
        free: true,
      },
      {
        id: 2,
        title: t.salahTitle,
        description: t.salahDescription,
        arabic: 'الصَّلَاةُ',
        emoji: '🤲',
        gradient: ['#b4e4ff4d', '#95d5f84d'],
        free: true,
      },
      {
        id: 3,
        title: t.zakahTitle,
        description: t.zakahDescription,
        arabic: 'الزَّكَاةُ',
        emoji: '💰',
        gradient: ['#f9d9a74d', '#f5c26b4d'],
        free: false,
      },
      {
        id: 4,
        title: t.sawmTitle,
        description: t.sawmDescription,
        arabic: 'الصَّوْمُ',
        emoji: '🌙',
        gradient: ['#d4c5f94d', '#c9b6f04d'],
        free: false,
      },
      {
        id: 5,
        title: t.hajjTitle,
        description: t.hajjDescription,
        arabic: 'الْحَجُّ',
        emoji: '🕋',
        gradient: ['#ffc8dd4d', '#ffafcc4d'],
        free: false,
      },
    ],
    [t],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handlePlayAudio = (pillar: Pillar, index: number) => {
    if (!pillar.free && !isSubscribed) {
      navigation.navigate(Routes.SubscriberScreen);
      return;
    }

    setPlayingIndex(index);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setPlayingIndex(null);
      setEarnedStars((prev) => {
        if (prev.includes(pillar.id)) {
          return prev;
        }
        return [...prev, pillar.id];
      });
    }, 2000);
  };

  const renderButtonIconSpacing = (rtl: boolean) => ({
    marginEnd: rtl ? 0 : spacing.sm,
    marginStart: rtl ? spacing.sm : 0,
  });

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
          <AnimatedStar style={[styles.decorativeStar, { top: spacing.lg, right: spacing.xxl }]} />
          <AnimatedStar
            style={[styles.decorativeStar, { bottom: spacing.xl, left: spacing.xl }]}
            delay={400}
            size={20}
          />

          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: `${colors.card}80` }]}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft color={colors.foreground} size={20} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerEmoji}>🕌</Text>
            <Text
              style={[
                styles.headerTitle,
                { color: colors.foreground, textAlign: isRTL ? 'right' : 'center' },
              ]}
            >
              {t.arkanAlIslam}
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'center' },
              ]}
            >
              {t.arkanAlIslamSubtitle}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.pillarsContainer}>
          {pillars.map((pillar, index) => {
            const isLocked = !pillar.free && !isSubscribed;
            const hasEarnedStar = earnedStars.includes(pillar.id);
            const isPlaying = playingIndex === index;

            return (
              <LinearGradient
                key={pillar.id}
                colors={pillar.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.pillarGradient}
              >
                <Card
                  style={[
                    styles.pillarCard,
                    { borderWidth: 0, backgroundColor: '#ffffffcc' },
                    isLocked && { opacity: 0.85 },
                  ]}
                >
                  <View
                    style={[
                      styles.pillarHeader,
                      isRTL && styles.rowReverse,
                    ]}
                  >
                    <View
                      style={[
                        styles.pillarNumberContainer,
                        { backgroundColor: `${colors.background}aa` },
                      ]}
                    >
                      <Text style={[styles.pillarNumber, { color: colors.primary }]}>{pillar.id}</Text>
                    </View>
                    <Text
                      style={[
                        styles.pillarLabel,
                        { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' },
                      ]}
                    >
                      {t.pillar} {pillar.id}
                    </Text>
                    {hasEarnedStar && (
                      <AnimatedStar size={20} delay={200} style={styles.earnedStar} />
                    )}
                  </View>

                  <View style={[styles.pillarBody, isRTL && styles.rowReverse]}>
                    <Text style={styles.pillarEmoji}>{pillar.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.pillarTitle,
                          { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' },
                        ]}
                      >
                        {pillar.title}
                      </Text>
                      <Text
                        style={[
                          styles.pillarDescription,
                          { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' },
                        ]}
                      >
                        {pillar.description}
                      </Text>
                      {!!pillar.arabic && (
                        <View style={styles.arabicContainer}>
                          <Text
                            style={[
                              styles.arabicText,
                              { writingDirection: 'rtl', color: colors.foreground },
                            ]}
                          >
                            {pillar.arabic}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity
                    disabled={isPlaying}
                    activeOpacity={0.85}
                    onPress={() => handlePlayAudio(pillar, index)}
                    style={[
                      styles.listenButton,
                      { backgroundColor: colors.primary },
                      isRTL && styles.rowReverse,
                      isLocked && {
                        backgroundColor: `${colors.mutedForeground}26`,
                        borderColor: `${colors.muted}80`,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    {isLocked ? (
                      <>
                        <Lock
                          color={colors.foreground}
                          size={18}
                          style={renderButtonIconSpacing(isRTL)}
                        />
                        <Text
                          style={[
                            styles.buttonText,
                            { color: colors.foreground, textAlign: 'center' },
                          ]}
                        >
                          {t.unlockWithPremium}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Volume2
                          color={colors.primaryForeground}
                          size={18}
                          style={renderButtonIconSpacing(isRTL)}
                        />
                        <Text
                          style={[
                            styles.buttonText,
                            { color: colors.primaryForeground, textAlign: 'center' },
                          ]}
                        >
                          {isPlaying ? `${t.play}...` : t.listenToExplanation}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </Card>
              </LinearGradient>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    overflow: 'hidden',
  },
  decorativeStar: {
    position: 'absolute',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.base,
  },
  pillarsContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  pillarGradient: {
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
  },
  pillarCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  pillarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  pillarNumberContainer: {
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
    marginHorizontal: spacing.sm,
  },
  earnedStar: {
    marginStart: spacing.sm,
  },
  pillarBody: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  pillarEmoji: {
    fontSize: fontSize['4xl'],
    marginEnd: spacing.lg,
  },
  pillarTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  pillarDescription: {
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  arabicContainer: {
    backgroundColor: '#ffffff80',
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

export default ArkanAlIslamScreen;
