/**
 * Firebase reCAPTCHA Container
 * Injects the required div for Firebase Phone Auth on web
 */

import React, { useEffect } from 'react';
import { Platform } from 'react-native';

export const FirebaseRecaptchaContainer: React.FC = () => {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Check if container already exists
      let container = document.getElementById('recaptcha-container');
      
      if (!container) {
        // Create and inject the reCAPTCHA container
        container = document.createElement('div');
        container.id = 'recaptcha-container';
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        container.style.left = '-9999px';
        container.style.visibility = 'hidden';
        document.body.appendChild(container);
        
        if (__DEV__) console.log('✅ FirebaseRecaptchaContainer: Injected recaptcha-container div');
      }
      
      // Cleanup on unmount
      return () => {
        const existingContainer = document.getElementById('recaptcha-container');
        if (existingContainer && existingContainer.parentNode) {
          existingContainer.parentNode.removeChild(existingContainer);
          if (__DEV__) console.log('🧹 FirebaseRecaptchaContainer: Removed recaptcha-container div');
        }
      };
    }
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default FirebaseRecaptchaContainer;

