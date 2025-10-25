import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryDark: string;
  primaryLight: string;
  
  // Secondary colors
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;
  
  // Background colors
  background: string;
  backgroundSecondary: string;
  surface: string;
  card: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Border and divider
  border: string;
  divider: string;
  
  // Overlay colors
  overlay: string;
  backdrop: string;
  
  // White and black
  white: string;
  black: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeBorderRadius {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface ThemeTypography {
  fontFamily: {
    regular: string;
    medium: string;
    semiBold: string;
    bold: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  lineHeight: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  fontWeight: {
    normal: string;
    medium: string;
    semiBold: string;
    bold: string;
  };
}

export interface ThemeShadows {
  none: object;
  small: object;
  medium: object;
  large: object;
  xl: object;
}

export interface ThemeAnimations {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}

export interface ThemeComponents {
  button: {
    height: {
      small: number;
      medium: number;
      large: number;
    };
    padding: {
      small: { horizontal: number; vertical: number };
      medium: { horizontal: number; vertical: number };
      large: { horizontal: number; vertical: number };
    };
  };
  input: {
    height: {
      small: number;
      medium: number;
      large: number;
    };
    padding: {
      horizontal: number;
      vertical: number;
    };
  };
  card: {
    padding: number;
    margin: number;
  };
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  typography: ThemeTypography;
  shadows: ThemeShadows;
  animations: ThemeAnimations;
  components: ThemeComponents;
  isDark: boolean;
}

const lightTheme: Theme = {
  colors: {
    // Primary colors (Orange theme)
    primary: '#FF9F43',
    primaryDark: '#E88A2A',
    primaryLight: '#FFB97C',
    
    // Secondary colors
    secondary: '#6C5CE7',
    secondaryDark: '#5A4FCF',
    secondaryLight: '#8B7ED8',
    
    // Background colors
    background: '#FEF6E9',
    backgroundSecondary: '#FFF8F0',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    
    // Text colors
    text: '#2D3436',
    textSecondary: '#636E72',
    textTertiary: '#B2BEC3',
    
    // Status colors
    success: '#00B894',
    warning: '#FDCB6E',
    error: '#E17055',
    info: '#74B9FF',
    
    // Border and divider
    border: '#E0E0E0',
    divider: '#F0F0F0',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.5)',
    backdrop: 'rgba(0, 0, 0, 0.3)',
    
    // White and black
    white: '#FFFFFF',
    black: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    fontFamily: {
      regular: 'Poppins-Regular',
      medium: 'Poppins-Medium',
      semiBold: 'Poppins-SemiBold',
      bold: 'Poppins-Bold',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    lineHeight: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
      xl: 32,
      xxl: 36,
      xxxl: 40,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
    },
  },
  shadows: {
    none: {},
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
  components: {
    button: {
      height: {
        small: 32,
        medium: 40,
        large: 48,
      },
      padding: {
        small: { horizontal: 12, vertical: 6 },
        medium: { horizontal: 16, vertical: 8 },
        large: { horizontal: 20, vertical: 12 },
      },
    },
    input: {
      height: {
        small: 36,
        medium: 44,
        large: 52,
      },
      padding: {
        horizontal: 12,
        vertical: 8,
      },
    },
    card: {
      padding: 16,
      margin: 8,
    },
  },
  isDark: false,
};

const darkTheme: Theme = {
  colors: {
    // Primary colors (Orange theme)
    primary: '#FF9F43',
    primaryDark: '#E88A2A',
    primaryLight: '#FFB97C',
    
    // Secondary colors
    secondary: '#6C5CE7',
    secondaryDark: '#5A4FCF',
    secondaryLight: '#8B7ED8',
    
    // Background colors
    background: '#1A1A1A',
    backgroundSecondary: '#2D2D2D',
    surface: '#333333',
    card: '#2D2D2D',
    
    // Text colors
    text: '#FFFFFF',
    textSecondary: '#B2BEC3',
    textTertiary: '#636E72',
    
    // Status colors
    success: '#00B894',
    warning: '#FDCB6E',
    error: '#E17055',
    info: '#74B9FF',
    
    // Border and divider
    border: '#404040',
    divider: '#333333',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.7)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    
    // White and black
    white: '#FFFFFF',
    black: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    fontFamily: {
      regular: 'Poppins-Regular',
      medium: 'Poppins-Medium',
      semiBold: 'Poppins-SemiBold',
      bold: 'Poppins-Bold',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    lineHeight: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
      xl: 32,
      xxl: 36,
      xxxl: 40,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
    },
  },
  shadows: {
    none: {},
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
  components: {
    button: {
      height: {
        small: 32,
        medium: 40,
        large: 48,
      },
      padding: {
        small: { horizontal: 12, vertical: 6 },
        medium: { horizontal: 16, vertical: 8 },
        large: { horizontal: 20, vertical: 12 },
      },
    },
    input: {
      height: {
        small: 36,
        medium: 44,
        large: 52,
      },
      padding: {
        horizontal: 12,
        vertical: 8,
      },
    },
    card: {
      padding: 16,
      margin: 8,
    },
  },
  isDark: true,
};

interface ThemeStore {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: lightTheme,
      isDark: false,
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
    }
  )
);

// Hook for easy theme access
export const useTheme = () => {
  const { theme, isDark, toggleTheme, setTheme } = useThemeStore();
  return { theme, isDark, toggleTheme, setTheme };
};