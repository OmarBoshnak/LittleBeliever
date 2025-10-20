import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { ChevronRight, Heart, Moon, Users } from 'lucide-react-native';

import { Button } from '../../component/Button'; // Assuming Button.tsx is in the same folder
import { useTheme } from '../../theme/ThemeContext'; // Assuming you have a ThemeContext
import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from '../../theme/spacing';
import { useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootstackParamList, Routes } from '../../MainNavigation/Routes.tsx';
import { useNavigation } from '@react-navigation/core';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
type NavigationProps = NativeStackNavigationProp<RootstackParamList>;

export const OnBoardingScreen = () => {
  const { colors } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<any>(null);
  const { t } = useLanguage();

  const navigation = useNavigation<NavigationProps>();
  // Note: I'm assuming your theme context provides muted colors.
  // If not, you can define them here or adjust as needed.
  const slides = [
    {
      icon: Moon,
      title: t.onboarding1Title,
      description: t.onboarding1Description,
      color: colors.primary,
      bgColor: `${colors.primary}1A`, // Example: primary color with 20% opacity
    },
    {
      icon: Users,
      title: t.onboarding2Title,
      description: t.onboarding2Description,
      color: colors.secondary,
      bgColor: `${colors.secondary}1A`,
    },
    {
      icon: Heart,
      title: t.onboarding3Title,
      description: t.onboarding3Description,
      color: colors.accent, // Assuming an accent color in your theme
      bgColor: `${colors.accent}1A`,
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      carouselRef.current?.next();
    } else {
      navigation.replace(Routes.AuthScreen);
    }
  };

  const renderItem = ({ item }: { item: (typeof slides)[0] }) => {
    const Icon = item.icon;
    return (
      <View style={styles.slideContainer}>
        <View style={[styles.iconCircle, { backgroundColor: item.bgColor }]}>
          <Icon color={item.color} size={80} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {item.title}
        </Text>
        <Text style={[styles.description, { color: colors.mutedForeground }]}>
          {item.description}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      {/* Skip Button */}
      <View style={styles.skipButtonContainer}>
        <Button
          variant="ghost"
          onPress={() => navigation.replace(Routes.AuthScreen)}
        >
          {t.skip}
        </Button>
      </View>

      <View style={{ justifyContent: 'center', marginTop: 80 }}>
        {/* Carousel */}
        <Carousel
          ref={carouselRef}
          loop={false}
          width={SCREEN_WIDTH}
          height={SCREEN_WIDTH * 1.2} // Adjust height as needed
          data={slides}
          renderItem={renderItem}
          onSnapToItem={index => setCurrentSlide(index)}
        />
        {/* Footer: Dots and Next Button */}
        <View style={styles.footer}>
          <View style={styles.dotsContainer}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === currentSlide ? colors.primary : colors.muted,
                    width: index === currentSlide ? spacing.xl : spacing.sm,
                  },
                ]}
              />
            ))}
          </View>
          <Button onPress={handleNext} size="lg" style={styles.nextButton}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>
                {currentSlide === slides.length - 1
                  ? t.getStarted // Last slide: "Get Started"
                  : t.next}{' '}
              </Text>
              <ChevronRight size={20} color={colors.primaryForeground} />
            </View>
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ====================================
  // CONTAINER
  // ====================================
  container: {
    flex: 1,
  },
  // ====================================
  // SKIP BUTTON (Top Section)
  // ====================================
  skipButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl + 40,
  },
  // ====================================
  // SLIDE CONTAINER (Each individual slide)
  // ====================================
  slideContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl * 2,
    paddingBottom: 80,
  },
  // ====================================
  // ICON CIRCLE (Colored background for icon)
  // ====================================
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: 100, // Perfect circle (width/2)
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl * 2, // 48px space below
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,

    // Shadow for Android
    elevation: 5,
  },

  // ====================================
  // TEXT STYLES
  // ====================================

  title: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.medium,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  description: {
    fontSize: fontSize.base,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.lg, // 16px
    maxWidth: 400, // Max width for better readability
  },

  // ====================================
  // BOTTOM SECTION (Dots + Button)
  // ====================================

  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },

  // ====================================
  // PROGRESS DOTS
  // ====================================
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  dot: {
    height: 8, // Fixed height
    borderRadius: 4, // Rounded ends
  },
  nextButton: {
    borderRadius: borderRadius.xl,
    marginVertical: 50,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm, // 8px between text and icon
  },
  buttonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: '#ffffff', // White text (or use colors.primaryForeground)
  },
});
