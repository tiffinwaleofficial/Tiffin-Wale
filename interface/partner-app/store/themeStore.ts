import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme } from '../theme/themes';

interface ThemeStore {
  theme: Theme;
  isDark: boolean;
  hasHydrated: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: lightTheme,
      isDark: false,
      hasHydrated: false,
      toggleTheme: () => {
        const { isDark } = get();
        const newIsDark = !isDark;
        set({
          isDark: newIsDark,
          theme: newIsDark ? darkTheme : lightTheme,
        });
      },
      setTheme: (themeType: 'light' | 'dark') => {
        const isDark = themeType === 'dark';
        set({
          isDark,
          theme: isDark ? darkTheme : lightTheme,
        });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the isDark preference, not the entire theme object
      // This ensures fresh theme is always loaded from themes.ts on app start
      partialize: (state) => ({ isDark: state.isDark }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Always load fresh theme from themes.ts based on isDark preference
          // This guarantees theme is complete and up-to-date
          state.theme = state.isDark ? darkTheme : lightTheme;
          state.hasHydrated = true;
        }
      },
    }
  )
);

// Hook for easy theme access with guaranteed valid theme
export const useTheme = () => {
  const { theme, isDark, hasHydrated, toggleTheme, setTheme } = useThemeStore();
  
  // CRITICAL: Always ensure theme is valid, never undefined
  // If store hasn't initialized yet, return lightTheme as fallback
  const safeTheme = theme || lightTheme;
  
  return { 
    theme: safeTheme, 
    isDark, 
    hasHydrated, 
    toggleTheme, 
    setTheme 
  };
};