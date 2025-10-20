import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext.tsx';
import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from '../theme/spacing.ts';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Main Card Container
 */
export const Card = ({ children, style }: CardProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        style,
      ]}
    >
      {children}
    </View>
  );
};

/**
 * Card Header
 */
export const CardHeader = ({ children, style }: CardProps) => {
  return <View style={[styles.cardHeader, style]}>{children}</View>;
};

/**
 * Card Title
 */
interface CardTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export const CardTitle = ({ children, style }: CardTitleProps) => {
  const { colors } = useTheme();

  return (
    <Text style={[styles.cardTitle, { color: colors.cardForeground }, style]}>
      {children}
    </Text>
  );
};

/**
 * Card Description
 */
export const CardDescription = ({ children, style }: CardTitleProps) => {
  const { colors } = useTheme();

  return (
    <Text
      style={[styles.cardDescription, { color: colors.mutedForeground }, style]}
    >
      {children}
    </Text>
  );
};

/**
 * Card Content
 */
export const CardContent = ({ children, style }: CardProps) => {
  return <View style={[styles.cardContent, style]}>{children}</View>;
};

/**
 * Card Footer
 */
export const CardFooter = ({ children, style }: CardProps) => {
  return <View style={[styles.cardFooter, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.lg,
  },
  cardHeader: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  cardContent: {},
  cardFooter: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
