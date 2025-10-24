import React, { useMemo } from 'react';
import {
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
import { ArrowLeft, Book, Droplets, HandHeart } from 'lucide-react-native';

import { RootstackParamList, Routes } from '../../../MainNavigation/Routes.tsx';
import { useTheme } from '../../../theme/ThemeContext.tsx';
import { useLanguage } from '../../../context/LanguageContext.tsx';
import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from '../../../theme/spacing.ts';
import { useNavigation } from '@react-navigation/core';
import GradientBackground from '../../../component/GradientBackground.tsx';
import Animated from 'react-native-reanimated';
import { useFloatAnimation } from '../../../hooks/useAnimatedValue.ts';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../../../component/Card.tsx';

type ScreenProps = NativeStackNavigationProp<RootstackParamList>;

type Section = {
  id: 'arkan-islam' | 'wudu' | 'prayer';
  title: string;
  subtitle: string;
  emoji: string;
  gradient: [string, string];
  iconColor: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
};

export const LearnIslamScreen = () => {
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const floatTranslateY = useFloatAnimation();
  const navigation = useNavigation<ScreenProps>();

  const INFO_GRADIENT = ['#f9d9a733', '#f5ebe033'];

  const sections = useMemo<Section[]>(
    () => [
      {
        id: 'arkan-islam',
        title: t.arkanAlIslam,
        subtitle: t.arkanAlIslamSubtitle,
        emoji: '🕌',
        gradient: ['#A0E7E5', '#B4F8C8'],
        iconColor: '#7ec4cf',
        Icon: Book,
      },
      {
        id: 'wudu',
        title: t.wuduTitle,
        subtitle: t.wuduSubtitle,
        emoji: '💧',
        gradient: ['#B4E4FF', '#4CC9F0'],
        iconColor: '#95d5f8',
        Icon: Droplets,
      },
      {
        id: 'prayer',
        title: t.prayerTitle,
        subtitle: t.prayerSubtitle,
        emoji: '🤲',
        gradient: ['#F9D9A7', '#FFD6E0'],
        iconColor: '#c9b6f0',
        Icon: HandHeart,
      },
    ],
    [t],
  );

  const handleSectionPress = (sectionId: Section['id']) => {
    if (sectionId === 'arkan-islam') {
      navigation.navigate(Routes.ArkanAlIslamScreen);
    } else if (sectionId === 'wudu') {
      navigation.navigate(Routes.WuduScreen);
    }
  };

  const renderCard = (card: Section) => {
    const IconComponent = card.Icon;
    return (
      <TouchableOpacity
        key={card.id}
        activeOpacity={0.85}
        onPress={() => handleSectionPress(card.id)}
        style={styles.sectionTouchable}
      >
        <LinearGradient
          colors={card.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 120,
            borderRadius: 20,
            justifyContent: 'center',
          }}
        >
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
                <Text style={styles.sectionEmoji}>{card.emoji}</Text>
              </View>
              <View
                style={[
                  styles.sectionTextContainer,
                  { alignItems: isRTL ? 'flex-end' : 'flex-start' },
                ]}
              >
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: colors.secondaryForeground,
                      textAlign: isRTL ? 'right' : 'left',
                    },
                  ]}
                >
                  {card.title}
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
                  {card.subtitle}
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
                <IconComponent size={24} color={card.iconColor} />
              </View>
            </View>
          </Card>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <GradientBackground colors={colors.gradient} />
      <ScrollView
        contentInset={{ bottom: 100 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + spacing.md,
            },
          ]}
        >
          <GradientBackground
            colors={colors.gradient}
            style={[StyleSheet.absoluteFillObject, , styles.gradientStyle]}
          />
          <Animated.Text style={[styles.stars1, floatTranslateY]}>
            <Text style={{ fontSize: 30 }}>🌟</Text>
          </Animated.Text>
          <Animated.Text style={[styles.stars2, floatTranslateY]}>
            <Text style={{ fontSize: 20 }}>✨</Text>
          </Animated.Text>
          <TouchableOpacity
            accessibilityRole={'button'}
            accessibilityLabel={t.back ?? 'Go Back'}
            style={[styles.backButton, { backgroundColor: `${colors.card}80` }]}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={20} color={colors.foreground} />
          </TouchableOpacity>

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
              {t.learnIslam}
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
              {t.learnIslamDescription}
            </Text>
            <Animated.Text style={[styles.stars3, floatTranslateY]}>
              <Text style={{ fontSize: 30 }}>⭐</Text>
            </Animated.Text>
          </View>
        </View>

        <View style={styles.sectionList}>
          {sections.map(section => renderCard(section))}
        </View>

        <View style={styles.infoContainer}>
          <LinearGradient colors={INFO_GRADIENT} style={styles.infoGradient}>
            <Text
              style={[
                styles.infoText,
                { color: colors.mutedForeground, textAlign: 'center' },
              ]}
            >
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
  gradientStyle: {
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
    fontSize: 60,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize['3xl'],
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    fontSize: fontSize.base,
    lineHeight: 20,
  },
  stars3: {
    position: 'absolute',
    bottom: 0,
    left: 20,
  },
  sectionList: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm, // Pull cards up over header
    gap: spacing.md,
  },
  sectionTouchable: {
    marginBottom: 20,
    // iOS shadow (bottom only)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    // Android shadow
    elevation: 6,
  },
  sectionCard: {
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
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
    paddingHorizontal: spacing.sm,
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  infoGradient: {
    height: 82,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#f9d9a74d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: fontSize.sm,
    paddingHorizontal: spacing.xxl,
  },
});

export default LearnIslamScreen;
