import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native';
import {
  useFloatAnimation,
  useTwinkleAnimation,
} from '../../hooks/useAnimatedValue.ts';
import { Moon, Sparkles, Star } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { useTheme } from '../../theme/ThemeContext.tsx';
import { fontSize, fontWeight } from '../../theme/spacing.ts';
import { RootstackParamList, Routes } from '../../MainNavigation/Routes.tsx';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useNavigation } from '@react-navigation/core';
import Animated from 'react-native-reanimated';
import GradientBackground from '../../component/GradientBackground.tsx';

const { width, height } = Dimensions.get('window');

type NavigationProps = NativeStackNavigationProp<RootstackParamList>;

const AnimatedStar: React.FC<{
  size: number;
  color: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  delay: number;
}> = ({ size, color, top, left, right, bottom, delay }) => {
  const animatedStyle = useTwinkleAnimation(delay);
  return (
    <Animated.View
      style={[
        styles.absoluteIcon,
        { top, left, right, bottom },
        animatedStyle, // ✅ apply animated style
      ]}
    >
      <Star size={size} color={color} fill={color} />
    </Animated.View>
  );
};

const SplashScreen = () => {
  const { colors } = useTheme();
  const t = useLanguage();
  const floatTranslateY = useFloatAnimation();
  const sparklesStyle = useTwinkleAnimation(800);
  const navigation = useNavigation<NavigationProps>();

  // Auto-complete after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(Routes.LanguageThemeScreen);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />

      {/* Gradient Background Layer */}
      <GradientBackground colors={colors.gradient} />
      {/* Floating Stars - Replaces: star-animate divs */}
      <AnimatedStar
        size={24}
        color={colors.secondary}
        top={80}
        left={40}
        delay={0}
      />
      <AnimatedStar
        size={16}
        color={colors.primary}
        top={128}
        right={64}
        delay={500}
      />
      <AnimatedStar
        size={20}
        color={colors.accent}
        bottom={160}
        left={80}
        delay={1000}
      />
      <AnimatedStar
        size={16}
        color={colors.secondary}
        bottom={208}
        right={96}
        delay={1500}
      />
      {/* Sparkles Icon */}
      <Animated.View
        style={[
          styles.absoluteIcon,
          {
            top: height * 0.25,
            right: width * 0.33,
          },
          sparklesStyle,
        ]}
      >
        <Sparkles size={20} color={colors.primary} />
      </Animated.View>

      {/* Main Content - Replaces: float-animate div */}
      <Animated.View style={[styles.mainContent, floatTranslateY]}>
        {/* Moon with Star - Replaces: moon-glow effect */}

        <View style={styles.moonContainer}>
          <View style={styles.moonWrapper}>
            {/* Moon glow effect (shadow) */}
            <View
              style={[
                styles.moonGlow,
                {
                  shadowColor: colors.secondary,
                },
              ]}
            >
              <Moon size={96} color={colors.secondary} />
            </View>
            {/* Small star on top */}
            <View style={styles.smallStar}>
              <Star size={32} color={colors.primary} fill={colors.primary} />
            </View>
          </View>
        </View>
        <Text
          style={[
            styles.appName,
            {
              color: colors.primary,
              // Note: textShadow not fully supported in RN, using elevation instead
            },
          ]}
        >
          {t.t.appName}
        </Text>

        {/* Tagline */}
        <Text
          style={[
            styles.tagline,
            {
              color: colors.mutedForeground,
            },
          ]}
        >
          {t.t.tagline}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // Main content container
  mainContent: {
    alignItems: 'center',
    zIndex: 10,
  },

  // Moon container
  moonContainer: {
    marginBottom: 24,
  },
  moonWrapper: {
    position: 'relative',
  },
  moonGlow: {
    // Moon glow effect using shadow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10, // Android shadow
  },
  smallStar: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  absoluteIcon: {
    position: 'absolute',
  },

  // Text styles
  appName: {
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.medium,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    textAlign: 'center',
  },
});
export default SplashScreen;
