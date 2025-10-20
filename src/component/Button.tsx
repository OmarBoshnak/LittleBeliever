import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import { borderRadius, fontSize, fontWeight, spacing } from '../theme/spacing';

/**
 * Button Variants
 */
type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = ({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) => {
  const { colors } = useTheme();

  /**
   * Get button styles based on variant
   */
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'default':
        return {
          backgroundColor: colors.primary,
        };
      case 'destructive':
        return {
          backgroundColor: colors.destructive,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      case 'link':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {
          backgroundColor: colors.primary,
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
      case 'destructive':
        return colors.destructiveForeground;
      case 'outline':
        return colors.foreground;
      case 'secondary':
        return colors.secondaryForeground;
      case 'ghost':
        return colors.foreground;
      case 'link':
        return colors.primary;
      default:
        return colors.primaryForeground;
    }
  };

  /**
   * Get size styles
   */
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          height: 32,
          paddingHorizontal: spacing.sm,
        };
      case 'lg':
        return {
          height: 56,
          paddingHorizontal: spacing.lg,
        };
      case 'icon':
        return {
          width: 36,
          height: 36,
          paddingHorizontal: 0,
        };
      case 'default':
      default:
        return {
          height: 36,
          paddingHorizontal: spacing.lg,
        };
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.text,
            { color: getTextColor() },
            variant === 'link' && styles.linkText,
            textStyle,
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 50,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  linkText: {
    textDecorationLine: 'underline',
  },
});
