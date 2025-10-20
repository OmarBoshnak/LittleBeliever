// src/theme/spacing.ts

/**
 * Spacing and sizing constants
 * Replaces CSS radius variables
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  sm: 12, // calc(var(--radius) - 4px) → 16 - 4
  md: 14, // calc(var(--radius) - 2px) → 16 - 2
  lg: 16, // var(--radius)
  xl: 20, // calc(var(--radius) + 4px) → 16 + 4
  full: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
