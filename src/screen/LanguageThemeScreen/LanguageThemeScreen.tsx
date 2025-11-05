import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import React, { useState } from 'react';
import { girlTheme, lightTheme } from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';
import { Check, Moon, Star } from 'lucide-react-native';
import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from '../../theme/spacing';
import Animated, { FadeInDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../../component/Card';
import { Button } from '../../component/Button';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootstackParamList, Routes } from '../../MainNavigation/Routes';
import { useNavigation } from '@react-navigation/core';
import GradientBackground from '../../component/GradientBackground.tsx';

type NavigationProps = NativeStackNavigationProp<RootstackParamList>;

interface LanguageOption {
  id: 'en' | 'ar';
  title: string;
  subtitle: string;
  emoji: string;
  gradient: [string, string];
  isRTL?: boolean;
}

interface Theme {
  id: 'boy' | 'girl';
  labelEn: string;
  labelAr: string;
  emoji: string;
  colors: string[];
  descriptionEn: string;
  descriptionAr: string;
}

export const LanguageThemeScreen = () => {
  const { colors, setTheme } = useTheme();
  const { setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar'>('en');
  const [selectedTheme, setSelectedTheme] = useState<'boy' | 'girl'>('boy');

  const navigation = useNavigation<NavigationProps>();

  // ✅ Determine if layout should be RTL
  const isRTL = selectedLanguage === 'ar';

  const languages: LanguageOption[] = [
    {
      id: 'ar',
      title: 'العربية',
      subtitle: 'اختر اللغة العربية',
      emoji: '🇸🇦',
      gradient: ['#f5ebe033', '#f9d9a733'],
      isRTL: true,
    },
    {
      id: 'en',
      title: 'English',
      subtitle: 'Select English language',
      emoji: '🇬🇧',
      gradient: ['#a7d5dd33', '#7ec4cf33'],
      isRTL: false,
    },
  ];

  const themes: Theme[] = [
    {
      id: 'boy',
      labelEn: 'Boy Theme',
      labelAr: 'مظهر الأولاد',
      emoji: '💙',
      colors: [lightTheme.primary, lightTheme.chart4, '#a0d8e8'],
      descriptionEn: 'Light blue & turquoise',
      descriptionAr: 'أزرق فاتح وفيروزي',
    },
    {
      id: 'girl',
      labelEn: 'Girl Theme',
      labelAr: 'مظهر البنات',
      emoji: '💖',
      colors: [girlTheme.primary, girlTheme.secondary, girlTheme.chart3],
      descriptionEn: 'Pink & lilac',
      descriptionAr: 'وردي وأرجواني',
    },
  ];

  const handleContinue = async () => {
    try {
      await setLanguage(selectedLanguage);
      setTheme(selectedTheme === 'boy' ? 'light' : 'girl');
      navigation.replace(Routes.OnBoardingScreen);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />

      {/* Background Gradient */}
      <GradientBackground colors={colors.gradient} />

      {/* Decorative Elements */}
      <View style={[styles.decorativeMoon, { top: 48, right: 32 }]}>
        <Moon size={64} color={`${colors.secondary}33`} />
      </View>
      <View style={[styles.decorativeStar, { top: 96, left: 48 }]}>
        <Star
          size={24}
          color={`${colors.primary}4D`}
          fill={`${colors.primary}4D`}
        />
      </View>
      <View style={[styles.decorativeStar, { bottom: 128, right: 64 }]}>
        <Star
          size={20}
          color={`${colors.accent}4D`}
          fill={`${colors.accent}4D`}
        />
      </View>

      <View style={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primary }]}>
            {selectedLanguage === 'ar'
              ? 'اختر إعداداتك'
              : 'Choose Your Settings'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {selectedLanguage === 'ar'
              ? 'اختر لغتك والمظهر المفضل'
              : 'Pick your language and favorite theme'}
          </Text>
        </View>

        {/* Language Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Language / اللغة
          </Text>
          <View style={styles.languageGrid}>
            {languages.map((lang, index) => {
              const isSelected = selectedLanguage === lang.id;
              const cardIsRTL = Boolean(lang.isRTL);

              return (
                <Animated.View
                  key={lang.id}
                  entering={FadeInDown.delay(index * 100).springify()}
                  style={styles.languageColumn}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedLanguage(lang.id)}
                    activeOpacity={0.85}
                    style={styles.languageTouchable}
                  >
                    <LinearGradient
                      colors={lang.gradient}
                      style={[
                        styles.languageGradient,
                        isSelected && { transform: [{ scale: 1.02 }] },
                      ]}
                    >
                      <Card
                        style={[
                          styles.languageCard,
                          {
                            backgroundColor: 'transparent',
                            borderWidth: isSelected ? 2 : 0,
                            borderColor: isSelected
                              ? colors.primary
                              : 'transparent',
                          },
                        ]}
                      >
                        {isSelected && (
                          <View
                            style={[
                              styles.checkMark,
                              { backgroundColor: colors.primary },
                              cardIsRTL
                                ? { left: 12, right: undefined }
                                : { right: 12 },
                            ]}
                          >
                            <Check size={16} color={colors.primaryForeground} />
                          </View>
                        )}

                        <View
                          style={[
                            styles.languageContent,
                            cardIsRTL && { flexDirection: 'row-reverse' },
                          ]}
                        >
                          <View
                            style={[
                              styles.languageEmojiContainer,
                              cardIsRTL
                                ? { marginLeft: spacing.md, marginRight: 0 }
                                : { marginRight: spacing.md, marginLeft: 0 },
                            ]}
                          >
                            <Text style={styles.languageEmoji}>{lang.emoji}</Text>
                          </View>

                          <View
                            style={[
                              styles.languageTextContainer,
                              cardIsRTL
                                ? { alignItems: 'flex-end' }
                                : { alignItems: 'flex-start' },
                            ]}
                          >
                            <Text
                              style={[
                                styles.languageTitle,
                                {
                                  color: colors.secondaryForeground,
                                  textAlign: cardIsRTL ? 'right' : 'left',
                                },
                              ]}
                            >
                              {lang.title}
                            </Text>
                            <Text
                              style={[
                                styles.languageSubtitle,
                                {
                                  color: colors.mutedForeground,
                                  textAlign: cardIsRTL ? 'right' : 'left',
                                },
                              ]}
                            >
                              {lang.subtitle}
                            </Text>
                          </View>
                        </View>
                      </Card>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>

        {/* Theme Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            {selectedLanguage === 'ar' ? 'اختر المظهر' : 'Choose Your Theme'}
          </Text>
          <View style={styles.themeList}>
            {themes.map((theme, index) => (
              <Animated.View
                key={theme.id}
                entering={FadeInDown.delay(200 + index * 100).springify()}
              >
                <TouchableOpacity
                  onPress={() => setSelectedTheme(theme.id)}
                  activeOpacity={0.7}
                >
                  <Card
                    style={
                      selectedTheme === theme.id
                        ? [
                            styles.themeCard,
                            {
                              backgroundColor: `${colors.primary}33`,
                              borderColor: colors.primary,
                              borderWidth: 2,
                              transform: [{ scale: 1.05 }],
                            },
                          ]
                        : styles.themeCard
                    }
                  >
                    {/* ✅ Check Mark - Position based on language */}
                    {selectedTheme === theme.id && (
                      <View
                        style={[
                          styles.checkMarkLarge,
                          { backgroundColor: colors.primary },
                          isRTL
                            ? { left: 16, right: undefined }
                            : { right: 16 },
                        ]}
                      >
                        <Check size={20} color={colors.primaryForeground} />
                      </View>
                    )}

                    {/* ✅ Theme Content */}
                    <View
                      style={[
                        styles.themeContent,
                        isRTL && { flexDirection: 'row-reverse' },
                      ]}
                    >
                      <Text style={styles.themeEmoji}>{theme.emoji}</Text>

                      <View
                        style={[
                          styles.themeInfo,
                          isRTL && { alignItems: 'flex-end' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.themeTitle,
                            { color: colors.foreground },
                            isRTL && { textAlign: 'right' },
                          ]}
                        >
                          {selectedLanguage === 'ar'
                            ? theme.labelAr
                            : theme.labelEn}
                        </Text>
                        <Text
                          style={[
                            styles.themeDescription,
                            { color: colors.mutedForeground },
                            isRTL && { textAlign: 'right' },
                          ]}
                        >
                          {selectedLanguage === 'ar'
                            ? theme.descriptionAr
                            : theme.descriptionEn}
                        </Text>

                        {/* Color Preview */}
                        <View
                          style={[
                            styles.colorPreview,
                            isRTL && { flexDirection: 'row-reverse' },
                          ]}
                        >
                          {theme.colors.map((color, colorIndex) => (
                            <View
                              key={colorIndex}
                              style={[
                                styles.colorCircle,
                                { backgroundColor: color },
                              ]}
                            />
                          ))}
                        </View>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        <Button
          size={'lg'}
          onPress={handleContinue}
          style={styles.continueButton}
        >
          {selectedLanguage === 'ar' ? 'متابعة إلى التطبيق' : 'Continue to App'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorativeMoon: {
    position: 'absolute',
    opacity: 0.9,
  },
  decorativeStar: {
    position: 'absolute',
    opacity: 0.3,
  },
  scrollContent: {
    paddingTop: 80,
    paddingHorizontal: spacing.xl,
    paddingBottom: 50,
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.medium,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.base,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  languageGrid: {
    flexDirection: 'row',
    gap: spacing.lg,
    flexWrap: 'wrap',
  },
  languageColumn: {
    flex: 1,
    minWidth: '48%',
  },
  languageTouchable: {
    flex: 1,
  },
  languageGradient: {
    borderRadius: borderRadius.xl,
    padding: 1,
    overflow: 'hidden',
  },
  languageCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    position: 'relative',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  languageEmojiContainer: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  languageEmoji: {
    fontSize: fontSize['3xl'],
  },
  languageTextContainer: {
    flex: 1,
  },
  languageTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
  },
  languageSubtitle: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  checkMark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeList: {
    gap: spacing.lg,
  },
  themeCard: {
    padding: spacing.xl,
    position: 'relative',
  },
  themeContent: {
    flexDirection: 'row', // ✅ Default LTR
    alignItems: 'center',
    gap: spacing.lg,
  },
  themeEmoji: {
    fontSize: 50,
  },
  themeInfo: {
    flex: 1,
    alignItems: 'flex-start', // ✅ Default LTR
  },
  themeTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs,
    textAlign: 'left', // ✅ Default LTR
  },
  themeDescription: {
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
    textAlign: 'left', // ✅ Default LTR
  },
  colorPreview: {
    flexDirection: 'row', // ✅ Default LTR
    gap: spacing.sm,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkMarkLarge: {
    position: 'absolute',
    top: 16,
    right: 16, // ✅ Default LTR (overridden inline for RTL)
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButton: {
    marginTop: spacing.xl,
    borderRadius: borderRadius.xl,
  },
});
