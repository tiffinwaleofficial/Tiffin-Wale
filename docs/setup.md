# TiffinWale Student App - Developer Setup Guide

This guide provides step-by-step instructions for setting up the TiffinWale Student App development environment and running the application on different platforms.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended, v18+ required)
- [npm](https://www.npmjs.com/) (v7+ recommended) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- IDE/Code Editor (VS Code recommended)

For mobile development:
- iOS development: Mac with Xcode (for iOS simulator)
- Android development: Android Studio with an emulator set up

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-organization/tiffin-wale.git
cd tiffin-wale
```

### 2. Install Dependencies

The TiffinWale project uses a monorepo structure. To install all dependencies:

```bash
# Install root dependencies
npm install

# Install student app specific dependencies
cd interface/student-app
npm install
```

Alternatively, you can use the script in the root package.json:

```bash
# From the root directory
npm run install:mobile
```

### 3. Running the App

#### Development Mode

To start the app in development mode:

```bash
# From the root directory
npm run mobile

# Or from the student-app directory
cd interface/student-app
npx expo start
```

This will start the Expo development server and display a QR code. You can then:

- Scan the QR code with Expo Go app on your physical device
- Press 'a' to open on an Android emulator
- Press 'i' to open on an iOS simulator (Mac only)
- Press 'w' to open in a web browser

#### Web Development

To start the app in web mode:

```bash
# From the student-app directory
cd interface/student-app
npx expo start --web
```

### 4. Building for Production

#### Web Build

To build the app for web deployment:

```bash
# From the root directory
npm run mobile:build:web

# Or from the student-app directory
cd interface/student-app
npm run build:web
```

This generates optimized web files in the `web-build` directory.

#### Native App Builds

For native app builds (iOS/Android), we use EAS Build:

```bash
# From the student-app directory
cd interface/student-app

# Android build
npm run mobile:build:android
# or: npx eas build -p android

# iOS build (requires Apple Developer account)
npm run mobile:build:ios
# or: npx eas build -p ios
```

## Google Cloud Deployment

The app is configured for Google Cloud App Engine deployment:

```bash
# From the student-app directory
cd interface/student-app

# Build and deploy (requires gcloud CLI setup)
npm run deploy:gcloud
```

## Environment Configuration

The app doesn't currently use environment-specific variables, but when needed, you'll create a `.env` file in the `interface/student-app` directory with the required configuration.

Example `.env` file (future implementation):

```
API_URL=https://api.tiffinwale.com
STRIPE_PUBLIC_KEY=pk_test_example
```

## Development Tools & Workflows

### Code Formatting

The project uses Prettier for code formatting. The configuration is defined in `.prettierrc`.

To format code:

```bash
# From the student-app directory
cd interface/student-app
npx prettier --write .
```

### Linting

To run the linter:

```bash
# From the root directory
npm run mobile:lint

# Or from the student-app directory
cd interface/student-app
expo lint
```

### TypeScript Type Checking

To check TypeScript types:

```bash
# From the student-app directory
cd interface/student-app
npx tsc --noEmit
```

## Debugging Tips

### Expo Dev Tools

Access the Expo Developer Tools by opening the Expo CLI output URL in your browser.

### React DevTools

For React component debugging:

1. Install React DevTools: `npm install -g react-devtools`
2. Run React DevTools: `react-devtools`
3. Connect to your running Expo app

### Debugging on Device

- Shake your device to open the developer menu
- Enable "Debug Remote JS" to use Chrome's DevTools
- Use "Toggle Inspector" to inspect UI elements

### Common Issues & Solutions

- **Metro bundler port already in use**: Kill the process using `npx kill-port 8081` or change the port with `npx expo start --port 8082`
- **Expo Go connection issues**: Ensure your device is on the same network as your development machine
- **Missing dependencies**: Verify all dependencies are installed with `npm install` in the student-app directory
- **TypeScript errors**: Run `npx tsc --noEmit` to identify type issues
- **Expo build errors**: Check Expo documentation or forums for specific error messages

## Project Structure Guidelines

When adding new features:

1. Place screens in the appropriate directory under `app/`
2. Create reusable components in `components/`
3. Define types in `types/index.ts`
4. Add state management logic in `store/`
5. Place utility functions in `utils/`

Follow existing naming conventions and code style for consistency. 