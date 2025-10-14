import 'dotenv/config';

// Ensure we can access process.env in TypeScript
declare const process: {
  env: {
    API_BASE_URL?: string;
    CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
    CLOUDINARY_UPLOAD_PRESET?: string;
    [key: string]: string | undefined;
  };
};

export default {
  expo: {
    name: "TiffinWale Partner",
    slug: "tiffinwale-partner",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "tiffinwale-partner",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    web: {
      bundler: "metro",
      output: "single",
      favicon: "./assets/images/favicon.png",
      name: "TiffinWale Partner - Restaurant Management",
      shortName: "TiffinWale Partner",
      description: "TiffinWale Partner App - Manage your restaurant",
      lang: "en",
      scope: "/",
      themeColor: "#FF9B42",
      backgroundColor: "#FFFAF0"
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-web-browser"
    ],
    experiments: {
      typedRoutes: true
    },
    android: {
      package: "com.tiffinwale_official.tiffinwalepartner",
      usesCleartextTraffic: true,
      permissions: [
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE"
      ]
    },
    extra: {
      apiBaseUrl: process.env.API_BASE_URL,
      cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
      },
    }
  }
};