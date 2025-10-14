import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useThemeStore } from '../store/themeStore';
import { Theme } from './themes';

interface ThemeContextType {
  theme: Theme;
  mode: 'light' | 'dark';
  setTheme: (mode: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme, mode, setTheme, toggleTheme } = useThemeStore();

  // Update status bar style based on theme
  useEffect(() => {
    // Status bar will be handled by the StatusBar component
  }, [mode]);

  const contextValue: ThemeContextType = {
    theme,
    mode,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};



