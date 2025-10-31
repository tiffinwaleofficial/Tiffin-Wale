export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  // Background colors
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceSecondary: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  
  // Status colors
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  info: string;
  infoLight: string;
  
  // Border colors
  border: string;
  borderLight: string;
  borderDark: string;
  
  // Overlay colors
  overlay: string;
  backdrop: string;
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
    '2xl': number;
    '3xl': number;
    '4xl': number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
  };
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeBorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
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
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  shadows: ThemeShadows;
  borderRadius: ThemeBorderRadius;
  components: ThemeComponents;
}

export const lightTheme: Theme = {
  colors: {
    // Primary colors (Orange theme)
    primary: '#FF9B42',
    primaryLight: '#FFB366',
    primaryDark: '#E8852A',
    
    // Secondary colors
    secondary: '#FFFAF0',
    secondaryLight: '#FFF8F0',
    secondaryDark: '#F5F0E8',
    
    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F3F4',
    
    // Text colors
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',
    
    // Status colors
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
    
    // Border colors
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    borderDark: '#D1D5DB',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.5)',
    backdrop: 'rgba(0, 0, 0, 0.3)',
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
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
      xl: 32,
      '2xl': 36,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 96,
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
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
};

export const darkTheme: Theme = {
  colors: {
    // Primary colors (Orange theme - same as light)
    primary: '#FF9B42',
    primaryLight: '#FFB366',
    primaryDark: '#E8852A',
    
    // Secondary colors
    secondary: '#2D1B00',
    secondaryLight: '#3D2B00',
    secondaryDark: '#1D0B00',
    
    // Background colors
    background: '#121212',
    backgroundSecondary: '#1E1E1E',
    surface: '#1E1E1E',
    surfaceSecondary: '#2A2A2A',
    
    // Text colors
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textTertiary: '#808080',
    textInverse: '#1A1A1A',
    
    // Status colors
    success: '#10B981',
    successLight: '#064E3B',
    warning: '#F59E0B',
    warningLight: '#451A03',
    error: '#EF4444',
    errorLight: '#450A0A',
    info: '#3B82F6',
    infoLight: '#1E3A8A',
    
    // Border colors
    border: '#404040',
    borderLight: '#2A2A2A',
    borderDark: '#525252',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.7)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
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
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
      xl: 32,
      '2xl': 36,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 96,
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
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
};

export type ThemeMode = 'light' | 'dark';

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};



