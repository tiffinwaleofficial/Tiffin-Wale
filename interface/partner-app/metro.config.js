/* eslint-env node */
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions if needed
config.resolver.sourceExts.push('cjs');

// Ensure proper handling of node modules
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add asset extensions
config.resolver.assetExts.push('png', 'jpg', 'jpeg', 'gif', 'svg', 'ico');

// Configure transformer for SDK 54
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Enable symlinks for Bun compatibility
config.resolver.unstable_enableSymlinks = true;

// Fix source map issues
config.symbolicator = {
  customizeFrame: (frame) => {
    if (frame.file && frame.file.includes('<anonymous>')) {
      return null; // Skip anonymous frames
    }
    return frame;
  },
};

// Disable source maps in development to avoid path issues
config.transformer.enableBabelRCLookup = false;

module.exports = config;