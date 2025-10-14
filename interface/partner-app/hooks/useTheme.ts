import { useTheme as useThemeStore } from '../store/themeStore';

export const useTheme = () => {
  const { theme, isDark, toggleTheme, setTheme } = useThemeStore();
  return { theme, isDark, toggleTheme, setTheme };
};
