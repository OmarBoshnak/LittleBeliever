import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { Card } from '../../component/Card.tsx';
import { borderRadius, fontSize, fontWeight, spacing } from '../../theme/spacing.ts';
import GradientBackground from '../../component/GradientBackground.tsx';
import { BookOpen, Heart, Moon, Settings, Sparkles, Star, User, Users } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTwinkleAnimation } from '../../hooks/useAnimatedValue.ts';
import Animated from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootstackParamList, Routes } from '../../MainNavigation/Routes.tsx';
import { useNavigation } from '@react-navigation/core';
import React from 'react';

/**
 * HomeScreen Component
 */
const HEADER_GRADIENT = ['#a7d5dd33', '#f5ebe033', '#f9d9a733'];

type NavigationProps = NativeStackNavigationProp<RootstackParamList>;

const AnimatedStar = ({
  size,
  color,
  top,
  left,
  right,
  bottom,
  delay,
}: {
  size: number;
  color: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  delay: number;
}) => {
  const animatedStar = useTwinkleAnimation(delay);

  return (
    <Animated.View
      style={[{ position: 'absolute', top, left, right, bottom }, animatedStar]}
    >
      <Star size={size} color={color} fill={color} />
    </Animated.View>
  );
};

interface HomeScreenProps {
  userName: string;
}

interface MainCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color?: string;
  gradientColors?: string[];
  iconBg: string;
  iconColor: string;
}

export const HomeScreen = () => {
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const navigation = useNavigation<NavigationProps>();
  const insets = useSafeAreaInsets();
  /**
   * Main navigation cards
   * Each card leads to a major section of the app
   */

  const mainCards: MainCard[] = [
    {
      id: 'learn-islam',
      title: t.learnIslam,
      description: t.learnIslamDescription,
      icon: Sparkles,
      color: `${colors.chart5}20`,
      iconBg: `${colors.primaryForeground}60`,
      iconColor: colors.secondary,
    },
    {
      id: 'quran-reading',
      title: t.quranReading,
      description: t.quranPractice,
      icon: BookOpen, // Book for Quran
      color: `${colors.chart4}20`,
      iconBg: `${colors.primaryForeground}60`,
      iconColor: colors.primary,
    },
    {
      id: 'prophets',
      title: t.prophetsTitle,
      description: t.prophetsDescription,
      icon: Moon, // Moon for prophets
      color: `${colors.primary}20`,
      iconBg: `${colors.primaryForeground}60`,
      iconColor: colors.primary,
    },
    {
      id: 'companions',
      title: t.companionsTitle,
      description: t.companionsDescription,
      icon: Users, // Users for companions
      color: `${colors.secondary}20`,
      iconBg: `${colors.primaryForeground}60`,
      iconColor: colors.secondary,
    },
    {
      id: 'azkar',
      title: t.azkarTitle,
      description: t.azkarDescription,
      icon: Heart, // Heart for azkar
      color: `${colors.accent}20`,
      iconBg: `${colors.primaryForeground}60`,
      iconColor: colors.chart3,
    },
  ];

  const handleCardPress = (cardId: string) => {
    switch (cardId) {
      case 'learn-islam':
        return navigation.navigate(Routes.LearnIslamScreen);
      case 'quran-reading':
        return navigation.navigate(Routes.QuranIndexScreen);
      default:
        break;
    }
  };

  /**
   * Render individual navigation card
   */

  const renderCard = (card: MainCard) => {
    const IconComponent = card.icon;
    return (
      <TouchableOpacity
        key={card.id}
        activeOpacity={0.7}
        onPress={() => handleCardPress(card.id)}
        style={styles.cardTouchable}
      >
        <Card style={[styles.card, { backgroundColor: card.color }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Icon Container */}
            <View
              style={[styles.iconContainer, { backgroundColor: card.iconBg }]}
            >
              <IconComponent size={32} color={card.iconColor} />
            </View>

            {/* Text Content */}
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.cardTitle,
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
                  styles.cardDescription,
                  {
                    color: colors.mutedForeground,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
              >
                {card.description}
              </Text>
            </View>
          </View>
        </Card>
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
        {/* Header Section with Gradient Background */}
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
            style={[StyleSheet.absoluteFillObject, styles.gradient]}
          />

          {/* Decorative Stars */}

          <AnimatedStar
            size={15}
            color={colors.secondary}
            delay={1000}
            top={55}
            right={30}
          />
          <AnimatedStar
            size={15}
            color={colors.primary}
            delay={500}
            top={110}
            right={80}
          />

          {/* Top Bar with Profile & Settings */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.muted }]}
            >
              <User size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.muted }]}
            >
              <Settings size={20} />
            </TouchableOpacity>
          </View>

          {/* Greeting */}
          <View style={styles.greetingContainer}>
            <Text
              style={[
                styles.greeting,
                {
                  color: colors.foreground,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {t.greeting},
            </Text>
            <Text
              style={[
                styles.userName,
                { color: colors.primary, textAlign: isRTL ? 'right' : 'left' },
              ]}
            >
              {}!
            </Text>
          </View>
        </View>

        {/* Main Navigation Cards */}
        <View style={styles.cardsContainer}>
          <AnimatedStar
            size={15}
            color={colors.accent}
            delay={1000}
            top={-8}
            left={30}
          />

          {mainCards.map(card => renderCard(card))}
        </View>

        {/* Bottom Spacing for Safe Area */}
        <View style={styles.bottomSpacing} />
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
    overflow: 'hidden',
    marginBottom: 70,
  },
  gradient: {
    top: 0,
    height: 250,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  // Decorative Stars (animated in real app)
  star: {
    position: 'absolute',
  },
  star1: {
    top: spacing.xl,
    right: spacing.xl,
  },
  star2: {
    top: spacing.xxl + 20,
    right: spacing.xxl + 20,
  },
  star3: {
    bottom: spacing.xl,
    left: spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greetingContainer: {
    marginTop: spacing.md,
  },
  greeting: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  userName: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
  },
  cardsContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.xxl - 20, // Pull cards up over header
    gap: spacing.md,
  },
  cardTouchable: {
    marginBottom: spacing.md,
    // iOS shadow (bottom only)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    // Android shadow
    elevation: 6,
  },
  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconEmoji: {
    fontSize: 40,
  },
  textContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    fontSize: fontSize.base,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: spacing.xxl,
  },
});
