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

/**
 * Light Spacing (Default)
 */
export const lightTheme: ThemeColors = {
  background: '#fdfcf8',
  foreground: '#4a5568',
  card: '#ffffff',
  cardForeground: '#4a5568',
  primary: '#7ec4cf',
  primaryForeground: '#ffffff',
  secondary: '#f9d9a7',
  secondaryForeground: '#4a5568',
  muted: '#f7f3ed',
  mutedForeground: '#9ca3af',
  accent: '#ffc9d4',
  accentForeground: '#4a5568',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  border: 'rgba(126, 196, 207, 0.2)',
  input: 'transparent',
  inputBackground: '#f9f5f0',
  chart1: '#7ec4cf',
  chart2: '#f9d9a7',
  chart3: '#ffc9d4',
  chart4: '#b4e4ed',
  chart5: '#fde7c7',
  sidebar: '#ffffff',
  sidebarForeground: '#4a5568',
  sidebarPrimary: '#7ec4cf',
  sidebarPrimaryForeground: '#ffffff',
  sidebarAccent: '#f7f3ed',
  sidebarAccentForeground: '#4a5568',
  sidebarBorder: 'rgba(126, 196, 207, 0.2)',

  gradient: ['#7EC4CF', '#F9D9A7', '#FFC9D4'],
  HEADER_GRADIENT: ['#B4E4FF', '#A7D5DD', '#7EC4CF'],
};

/**
 * Girl Spacing
 * Replaces .girl-theme CSS class variables
 * Extends light theme with pink/purple colors
 */
export const girlTheme: ThemeColors = {
  ...lightTheme, // Inherit base light theme
  primary: '#FF66B3',
  primaryForeground: '#ffffff',
  secondary: '#C77DFF',
  secondaryForeground: '#4a5568',
  accent: '#FFD6E0',
  accentForeground: '#4a5568',
  chart1: '#ffc9d4',
  chart2: '#e8b4d9',
  chart3: '#f9a8d4',
  chart4: '#fde2ec',
  chart5: '#f3d4e8',

  gradient: ['#FFE6F7', '#FFB3C6', '#C77DFF'],
  HEADER_GRADIENT: ['#B4E4FF', '#A7D5DD', '#7EC4CF'],
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
