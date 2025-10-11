/**
 * Helper utility to convert old shadow style props to new boxShadow format
 * This helps with the React Native Web deprecation warnings
 */

export interface ShadowConfig {
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number; // Android elevation
}

export const createBoxShadow = (config: ShadowConfig) => {
  const {
    shadowColor = '#000',
    shadowOffset = { width: 0, height: 2 },
    shadowOpacity = 0.1,
    shadowRadius = 4,
    elevation = 0
  } = config;

  // For React Native Web, we can use boxShadow
  const boxShadow = `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px ${shadowColor}${Math.round(shadowOpacity * 255).toString(16).padStart(2, '0')}`;

  return {
    // Keep the old props for React Native compatibility
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    elevation,
    // Add the new boxShadow for React Native Web
    boxShadow,
  };
};

// Common shadow presets
export const shadowPresets = {
  small: createBoxShadow({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  }),
  medium: createBoxShadow({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  }),
  large: createBoxShadow({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  }),
  card: createBoxShadow({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  }),
};
