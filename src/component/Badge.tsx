import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext.tsx';
import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from '../theme/spacing.ts';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge = ({
  children,
  variant = 'default',
  style,
  textStyle,
}: BadgeProps) => {
  const { colors } = useTheme();

  /**
   * Get badge background and border colors based on variant
   */

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'default':
        return {
          backgroundColor: colors.primary,
          borderColor: 'transparent',
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          borderColor: 'transparent',
        };
      case 'destructive':
        return {
          backgroundColor: colors.destructive,
          borderColor: 'transparent',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.border,
          borderWidth: 1,
        };
      default:
        return {
          backgroundColor: colors.primary,
          borderColor: 'transparent',
        };
    }
  };

  /**
   * Get text color based on variant
   */
  const getTextColor = (): string => {
    switch (variant) {
      case 'default':
        return colors.primaryForeground;
      case 'secondary':
        return colors.secondaryForeground;
      case 'destructive':
        return colors.destructiveForeground;
      case 'outline':
        return colors.foreground;
      default:
        return colors.primaryForeground;
    }
  };
  return (
    <View style={[styles.badge, getVariantStyle(), style]}>
      <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
});
