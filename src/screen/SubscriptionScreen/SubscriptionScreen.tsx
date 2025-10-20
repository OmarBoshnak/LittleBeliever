/**
 * SubscriptionScreen Component (Redux Version)
 */
import { useTheme } from '../../theme/ThemeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAppDispatch, useAppSelector } from '../../redux/hooks.ts';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { subscribeToPlan } from '../../redux/slices/subscriptionSlice.ts';
import { Card, CardContent } from '../../component/Card.tsx';
import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from '../../theme/spacing.ts';
import { Badge } from '../../component/Badge.tsx';
import { Button } from '../../component/Button.tsx';
import { Moon, Sparkles, Star } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTwinkleAnimation } from '../../hooks/useAnimatedValue.ts';
import Animated from 'react-native-reanimated';
import GradientBackground from '../../component/GradientBackground.tsx';

interface Plan {
  id: string;
  name: string;
  price: string;
  priceDetail: string;
  savings?: string;
  features: string[];
  badge: string | null;
  isPopular?: boolean;
}

export const SubscriptionScreen = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const sparklesStyle = useTwinkleAnimation(800);

  const dispatch = useAppDispatch();

  // ✅ Get auth state from Redux
  const user = useAppSelector(state => state.auth.user);
  const loading = useAppSelector(state => state.subscription.loading);
  const [selectedPlan, setSelectedPlan] = useState<string>('free');

  /**
   * Plan configurations
   * Define all available subscription plans with their features
   */
  const plans: Plan[] = [
    {
      id: 'free',
      name: t.freePlan,
      price: 'Free',
      priceDetail: 'Forever',
      features: t.freePlanFeatures,
      badge: null,
    },
    {
      id: 'monthly',
      name: t.monthlyPlan,
      price: t.monthlyPlanPrice,
      priceDetail: '',
      features: t.monthlyPlanFeatures,
      badge: t.mostPopular,
      isPopular: true,
    },
    {
      id: 'yearly',
      name: t.yearlyPlan,
      price: t.yearlyPlanPrice,
      priceDetail: '',
      savings: t.yearlyPlanSavings,
      features: t.yearlyPlanFeatures,
      badge: t.bestValue,
    },
  ];

  const handleContinue = async () => {
    if (!user) {
      Alert.alert('Error', 'Please login first');
      return;
    }
    try {
      // ✅ Dispatch Redux action
      await dispatch(subscribeToPlan(user.uid, selectedPlan as any));
      Alert.alert(
        'Success',
        `You are now subscribed to the ${selectedPlan} plan!`,
      );
      console.log('navigate to home ');
    } catch (error: any) {
      Alert.alert('Subscription Failed', error.message);
    }
  };

  const handleSkip = async () => {
    if (user) {
      await dispatch(subscribeToPlan(user.uid, 'free'));
    }
    console.log('navigate to home ');
  };
  /**
   * Render individual plan card
   */
  const renderPlanCard = (plan: Plan) => {
    const isSelected = selectedPlan === plan.id;

    return (
      <TouchableOpacity
        key={plan.id}
        activeOpacity={0.8}
        onPress={() => setSelectedPlan(plan.id)}
      >
        <Card
          style={[
            styles.planCard,
            {
              borderColor: isSelected ? colors.primary : colors.border,
              backgroundColor: isSelected ? `${colors.primary}15` : colors.card,
              borderWidth: isSelected ? 2 : 1,
            },
          ]}
        >
          {/* Badge for Popular/Best Value */}
          {plan.badge && (
            <View style={styles.badgeContainer}>
              <Badge variant={plan.isPopular ? 'default' : 'secondary'}>
                {plan.badge}
              </Badge>
            </View>
          )}

          {/* Selection Indicator */}
          {isSelected && (
            <View
              style={[
                styles.selectionIndicator,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={styles.checkmark}>✓</Text>
            </View>
          )}
          <CardContent>
            {/* Plan Name */}
            <Text style={[styles.planName, { color: colors.foreground }]}>
              {plan.name}
            </Text>

            {/* Price */}
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: colors.primary }]}>
                {plan.price}
              </Text>
              {plan.priceDetail && (
                <Text
                  style={[
                    styles.priceDetail,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {plan.priceDetail}
                </Text>
              )}
            </View>

            {/* Savings */}
            {plan.savings && (
              <Text style={[styles.savings, { color: colors.secondary }]}>
                {plan.savings}
              </Text>
            )}

            {/* Features List */}
            <View>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Text style={[styles.checkIcon, { color: colors.primary }]}>
                    ✓
                  </Text>
                  <Text
                    style={[
                      styles.featureText,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <GradientBackground colors={colors.gradient} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.starIcon, sparklesStyle]}>
          <Star fill={`${colors.primary}30`} color={colors.primary} size={24} />
        </Animated.View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Animated.View style={[styles.sparklesIcon, sparklesStyle]}>
              <Sparkles
                fill={colors.secondary}
                size={24}
                color={colors.secondary}
              />
            </Animated.View>
            <Moon size={64} color={colors.primary} />
          </View>

          <Text style={[styles.title, { color: colors.primary }]}>
            {t.chooseYourPlan}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {t.planSubtitle}
          </Text>
        </View>

        {/* Plans List */}
        <View style={styles.plansContainer}>
          {plans.map(plan => renderPlanCard(plan))}
        </View>

        {/* Continue Button */}
        <View style={styles.buttonsContainer}>
          <Button onPress={handleContinue} style={styles.continueButton}>
            {selectedPlan === 'free' ? t.continue : t.selectPlan}
          </Button>

          {/* Skip Button (shown for paid plans) */}
          {selectedPlan !== 'free' && (
            <Button
              variant="ghost"
              onPress={handleSkip}
              style={styles.skipButton}
            >
              Start with {t.freePlan}
            </Button>
          )}
        </View>

        {/* Support Message */}
        <Card
          style={[
            styles.supportCard,
            {
              backgroundColor: `${colors.primary}10`,
              borderColor: colors.primary,
            },
          ]}
        >
          <CardContent>
            <Text
              style={[styles.supportText, { color: colors.mutedForeground }]}
            >
              💛 Every subscription helps us create {'\n'} more content and
              reach more children
            </Text>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  planCard: {
    marginBottom: spacing.md,
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -10,
    right: spacing.md,
    zIndex: 10,
  },
  selectionIndicator: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  checkmark: {
    color: 'white',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  planName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
    paddingLeft: spacing.xxl,
  },
  priceContainer: {
    paddingLeft: spacing.xxl,
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.medium,
    marginRight: spacing.xs,
  },
  priceDetail: {
    fontSize: fontSize.sm,
  },
  savings: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.md,
    paddingLeft: spacing.xxl,
  },
  featuresContainer: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    paddingLeft: spacing.xxl,
  },
  checkIcon: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    marginRight: spacing.sm,
    width: 20,
  },
  featureText: {
    fontSize: fontSize.sm,
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  moonIcon: {
    fontSize: 64,
  },
  starIcon: {
    fontSize: 24,
    position: 'absolute',
    top: 16,
    left: 15,
  },

  sparklesIcon: {
    fontSize: 24,
    position: 'absolute',
    top: -8,
    right: -8,
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.xs,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  plansContainer: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  buttonsContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  continueButton: {
    height: 56,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  skipButton: {
    height: 48,
    borderRadius: borderRadius.lg,
  },
  supportCard: {
    borderWidth: 1,
    marginTop: spacing.md,
  },
  supportText: {
    textAlign: 'center',
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  decorativeStars: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  star: {
    fontSize: 16,
    opacity: 0.3,
  },
  star2: {
    fontSize: 12,
  },
  star3: {
    fontSize: 16,
  },
});
