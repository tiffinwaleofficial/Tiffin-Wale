import 'dotenv/config';

// Ensure we can access process.env in TypeScript
declare const process: {
  env: {
    API_BASE_URL?: string;
    [key: string]: string | undefined;
  };
};

console.log('🔍 Reading .env file...');
console.log('📁 Current API_BASE_URL from .env:', process.env.API_BASE_URL);

export default {
  expo: {
    name: "TiffinWale",
    slug: "tiffinwale-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "tiffinwale",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    web: {
      bundler: "metro",
      output: "single",
      favicon: "./assets/images/favicon.png",
      name: "TiffinWale - Food Delivery",
      shortName: "TiffinWale",
      description: "TiffinWale - Delicious meals for bachelors",
      lang: "en",
      scope: "/",
      themeColor: "#FF9B42",
      backgroundColor: "#FFFAF0"
    },
    plugins: [
      "expo-router"
    ],
    experiments: {
      typedRoutes: true
    },
    android: {
      package: "com.tiffinwale_official.tiffinwalemobile"
    },
    extra: {
      // Pass the .env variable to the app
      apiBaseUrl: process.env.API_BASE_URL,
    }
  }
}; 