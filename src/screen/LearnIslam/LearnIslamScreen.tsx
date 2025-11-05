import React, { useMemo, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Book, Droplets, HandHeart } from 'lucide-react-native';

import { RootstackParamList, Routes } from '../../MainNavigation/Routes.tsx';
import { useTheme } from '../../theme/ThemeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { Card } from '../../component/Card.tsx';
import { borderRadius, fontSize, fontWeight, spacing } from '../../theme/spacing.ts';

const HEADER_GRADIENT = ['#a7d5dd33', '#f5ebe033', '#f9d9a733'];
const INFO_GRADIENT = ['#f9d9a733', '#f5ebe033'];

const AnimatedEmoji = ({
  emoji,
  size = 32,
  delay = 0,
  top,
  right,
  bottom,
  left,
}: {
  emoji: string;
  size?: number;
  delay?: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}) => {
  const translateY = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
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
        styles.decorativeEmoji,
        {
          top,
          right,
          bottom,
          left,
          fontSize: size,
          transform: [{ translateY }],
        },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
};

type ScreenProps = NativeStackScreenProps<RootstackParamList, 'LearnIslamScreen'>;

type Section = {
  id: 'arkan-islam' | 'wudu' | 'prayer';
  title: string;
  subtitle: string;
  emoji: string;
  gradient: [string, string];
  iconColor: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
};

export const LearnIslamScreen = ({ navigation, route }: ScreenProps) => {
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();

  const isSubscribed = route.params?.isSubscribed ?? false;

  const sections = useMemo<Section[]>(
    () => [
      {
        id: 'arkan-islam',
        title: t.arkanAlIslam,
        subtitle: t.arkanAlIslamSubtitle,
        emoji: '🕌',
        gradient: ['#a7d5dd33', '#7ec4cf33'],
        iconColor: '#7ec4cf',
        Icon: Book,
      },
      {
        id: 'wudu',
        title: t.wuduTitle,
        subtitle: t.wuduSubtitle,
        emoji: '💧',
        gradient: ['#b4e4ff33', '#95d5f833'],
        iconColor: '#95d5f8',
        Icon: Droplets,
      },
      {
        id: 'prayer',
        title: t.prayerTitle,
        subtitle: t.prayerSubtitle,
        emoji: '🤲',
        gradient: ['#d4c5f933', '#c9b6f033'],
        iconColor: '#c9b6f0',
        Icon: HandHeart,
      },
    ],
    [t],
  );

  const handleSectionPress = (sectionId: Section['id']) => {
    if (sectionId === 'arkan-islam') {
      navigation.navigate(Routes.ArkanAlIslamScreen, { isSubscribed });
    } else if (sectionId === 'wudu') {
      navigation.navigate(Routes.WuduScreen, { isSubscribed });
    } else if (sectionId === 'prayer') {
      navigation.navigate(Routes.PrayerScreen, { isSubscribed });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
      >
        <LinearGradient
          colors={HEADER_GRADIENT}
          style={[
            styles.header,
            {
              paddingTop: insets.top + spacing.xxl,
            },
          ]}
        >
          <AnimatedEmoji emoji="🌟" size={36} top={spacing.lg} right={spacing.xl} />
          <AnimatedEmoji emoji="⭐" size={30} bottom={spacing.xl} left={spacing.lg} delay={400} />
          <AnimatedEmoji emoji="✨" size={28} top={spacing.xl} left={spacing.xl} delay={700} />

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t.goBack ?? 'Go back'}
            style={[styles.backButton, { backgroundColor: `${colors.card}80` }]}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft color={colors.foreground} size={20} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={[styles.headerEmoji, { marginBottom: spacing.sm }]}>🕌</Text>
            <Text
              style={[
                styles.headerTitle,
                { color: colors.secondaryForeground, textAlign: isRTL ? 'right' : 'center' },
              ]}
            >
              {t.learnIslam}
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'center' },
              ]}
            >
              {t.learnIslamDescription}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.sectionList}>
          {sections.map(({ id, title, subtitle, emoji, gradient, iconColor, Icon }) => (
            <TouchableOpacity
              key={id}
              activeOpacity={0.85}
              onPress={() => handleSectionPress(id)}
              style={styles.sectionTouchable}
            >
              <LinearGradient colors={gradient} style={styles.sectionGradient}>
                <Card
                  style={[
                    styles.sectionCard,
                    {
                      borderWidth: 0,
                      backgroundColor: 'transparent',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.sectionContent,
                      { flexDirection: isRTL ? 'row-reverse' : 'row' },
                    ]}
                  >
                    <View
                      style={[
                        styles.sectionEmojiContainer,
                        isRTL
                          ? { marginLeft: spacing.md, marginRight: 0 }
                          : { marginRight: spacing.md, marginLeft: 0 },
                      ]}
                    >
                      <Text style={styles.sectionEmoji}>{emoji}</Text>
                    </View>
                    <View style={[styles.sectionTextContainer, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                      <Text
                        style={[
                          styles.sectionTitle,
                          {
                            color: colors.secondaryForeground,
                            textAlign: isRTL ? 'right' : 'left',
                          },
                        ]}
                      >
                        {title}
                      </Text>
                      <Text
                        style={[
                          styles.sectionSubtitle,
                          {
                            color: colors.mutedForeground,
                            textAlign: isRTL ? 'right' : 'left',
                          },
                        ]}
                      >
                        {subtitle}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.sectionIconContainer,
                        isRTL
                          ? { marginRight: spacing.md, marginLeft: 0 }
                          : { marginLeft: spacing.md, marginRight: 0 },
                      ]}
                    >
                      <Icon size={24} color={iconColor} />
                    </View>
                  </View>
                </Card>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoContainer}>
          <LinearGradient colors={INFO_GRADIENT} style={styles.infoGradient}>
            <Text style={[styles.infoText, { color: colors.mutedForeground, textAlign: 'center' }]}>
              {t.unlockFullLessons}
            </Text>
          </LinearGradient>
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
    borderBottomLeftRadius: borderRadius.full,
    borderBottomRightRadius: borderRadius.full,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    marginBottom: -spacing.xl,
  },
  decorativeEmoji: {
    position: 'absolute',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    alignSelf: 'flex-start',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 56,
  },
  headerTitle: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.base,
    lineHeight: 20,
  },
  sectionList: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  sectionTouchable: {
    marginBottom: spacing.md,
  },
  sectionGradient: {
    borderRadius: borderRadius.xl,
  },
  sectionCard: {
    padding: spacing.lg,
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionEmojiContainer: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  sectionEmoji: {
    fontSize: fontSize['3xl'],
  },
  sectionTextContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  sectionIconContainer: {},
  infoContainer: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
  },
  infoGradient: {
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: '#f9d9a74d',
  },
  infoText: {
    fontSize: fontSize.sm,
  },
});

export default LearnIslamScreen;
