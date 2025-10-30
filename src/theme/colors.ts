// src/theme/colors.ts

/**
 * Spacing Colors Configuration
 * This replaces CSS :root variables with TypeScript objects
 * Each theme has its own color palette
 */

export type ThemeType = 'light' | 'girl';

export interface ThemeColors {
  // Background colors
  background: string;
  foreground: string;

  // Card colors
  card: string;
  cardForeground: string;

  // Primary colors
  primary: string;
  primaryForeground: string;

  // Secondary colors
  secondary: string;
  secondaryForeground: string;

  // Muted colors
  muted: string;
  mutedForeground: string;

  // Accent colors
  accent: string;
  accentForeground: string;

  // Destructive colors
  destructive: string;
  destructiveForeground: string;

  // Border and input
  border: string;
  input: string;
  inputBackground: string;

  // Chart colors
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;

  // Sidebar colors
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;

  gradient: string[];
  HEADER_GRADIENT: string[];
}

export const opacity = (hex: string, alpha: number) => {
  // alpha: 0..1
  const a = Math.max(0, Math.min(1, alpha));
  const bigint = parseInt(hex.replace('#', ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/**
 * Light Spacing (Default)
 */
export const lightTheme: ThemeColors = {
  background: '#FAFAFE',
  foreground: '#1C1C28',
  card: '#ffffff',
  cardForeground: '#1C1C28',
  primary: '#2CB3BF',
  primaryForeground: '#ffffff',
  secondary: '#7AA8FF',
  secondaryForeground: '#4a5568',
  muted: '#F2F3F7',
  mutedForeground: '#6B7280',
  accent: '#F6B74A',
  accentForeground: '#4a5568',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  border: '#E6E8EF',
  input: 'transparent',
  inputBackground: '#f9f5f0',
  chart1: '#7EC4CF',
  chart2: '#A7D5DD',
  chart3: '#F9D9A7',
  chart4: '#95D5F8',
  chart5: '#D4E6A5',
  sidebar: '#ffffff',
  sidebarForeground: '#4a5568',
  sidebarPrimary: '#7ec4cf',
  sidebarPrimaryForeground: '#ffffff',
  sidebarAccent: '#f7f3ed',
  sidebarAccentForeground: '#4a5568',
  sidebarBorder: 'rgba(126, 196, 207, 0.2)',

  gradient: [
    opacity('#A7D5DD', 0.8),
    opacity('#F5EBE0', 0.8),
    opacity('#F9D9A7', 0.8),
  ],
  HEADER_GRADIENT: ['#A7D5DD', '#7EC4CF'],
};

/**
 * Girl Spacing
 * Replaces .girl-theme CSS class variables
 * Extends light theme with pink/purple colors
 */
export const girlTheme: ThemeColors = {
  ...lightTheme, // Inherit base light theme
  primary: '#FF74A6',
  primaryForeground: '#ffffff',
  secondary: '#C9B6F0',
  secondaryForeground: '#4a5568',
  accent: '#FFC36A',
  accentForeground: '#4a5568',
  chart1: '#FFC8DD',
  chart2: '#FFAFCC',
  chart3: '#C9B6F0',
  chart4: '#BDE0FE',
  chart5: '#B8E1DD',

  gradient: [
    opacity('#FFC8DD', 0.6),
    opacity('#EDE7F6', 0.6),
    opacity('#FFAFCC', 0.6),
  ],
  HEADER_GRADIENT: [opacity('#FFC8DD', 0.8), opacity('#FFAFCC', 0.8)],
};

/**
 * Get theme by type
 */
export const getTheme = (theme: ThemeType): ThemeColors => {
  switch (theme) {
    case 'girl':
      return girlTheme;
    case 'light':
    default:
      return lightTheme;
  }
};
