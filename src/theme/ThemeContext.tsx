// src/contexts/ThemeContext.tsx

/**
 * Theme Context - Manages app theme state
 */

import React, { createContext, ReactNode, useContext, useState } from 'react';
import { getTheme, ThemeColors, ThemeType } from './colors.ts';

interface ThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('light');
  const colors = getTheme(theme);

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use theme in components
 * Usage: const { colors, theme, setTheme } = useTheme();
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
