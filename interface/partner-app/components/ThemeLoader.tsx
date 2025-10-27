import React from 'react';
import { useTheme } from '../store/themeStore';

interface ThemeLoaderProps {
  children: React.ReactNode;
}

export const ThemeLoader: React.FC<ThemeLoaderProps> = ({ children }) => {
  // We still call useTheme() to ensure the store is initialized.
  useTheme();
  return <>{children}</>;
};

