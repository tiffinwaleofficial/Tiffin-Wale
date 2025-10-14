import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useCallback } from 'react';

export const useTranslation = (namespace?: string) => {
  const { t, i18n } = useI18nTranslation(namespace);
  
  const changeLanguage = useCallback(
    (language: 'en' | 'hi') => {
      i18n.changeLanguage(language);
    },
    [i18n]
  );
  
  const currentLanguage = i18n.language as 'en' | 'hi';
  
  return {
    t,
    changeLanguage,
    currentLanguage,
    isRTL: currentLanguage === 'hi', // Hindi is RTL
  };
};

// Helper function for common translations
export const useCommonTranslation = () => useTranslation('common');
export const useAuthTranslation = () => useTranslation('auth');
export const useDashboardTranslation = () => useTranslation('dashboard');
export const useOrdersTranslation = () => useTranslation('orders');



