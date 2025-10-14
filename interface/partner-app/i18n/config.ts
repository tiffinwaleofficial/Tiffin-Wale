import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Import translation files
import enCommon from './resources/en/common.json';
import enAuth from './resources/en/auth.json';
import enDashboard from './resources/en/dashboard.json';
import enOrders from './resources/en/orders.json';

import hiCommon from './resources/hi/common.json';
import hiAuth from './resources/hi/auth.json';
import hiDashboard from './resources/hi/dashboard.json';
import hiOrders from './resources/hi/orders.json';

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    orders: enOrders,
  },
  hi: {
    common: hiCommon,
    auth: hiAuth,
    dashboard: hiDashboard,
    orders: hiOrders,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.getLocales()[0]?.languageCode || 'en',
    fallbackLng: 'en',
    debug: __DEV__,
    
    interpolation: {
      escapeValue: false,
    },
    
    defaultNS: 'common',
    
    ns: ['common', 'auth', 'dashboard', 'orders'],
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;



