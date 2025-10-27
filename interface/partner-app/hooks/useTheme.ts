import { useTheme as useThemeStore } from '../store/themeStore';
import { lightTheme } from '../theme/themes';

export const useTheme = () => {
  const { theme, isDark, hasHydrated, toggleTheme, setTheme } = useThemeStore();
  
  // Ensure theme is always valid with safe fallback
  const safeTheme = theme || lightTheme;
  
  return { 
    theme: safeTheme, 
    isDark, 
    hasHydrated, 
    toggleTheme, 
    setTheme 
  };
};
