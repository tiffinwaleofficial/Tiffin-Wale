/* eslint-env node */
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions if needed
config.resolver.sourceExts.push('cjs');

// Ensure proper handling of node modules
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add asset extensions
config.resolver.assetExts.push('png', 'jpg', 'jpeg', 'gif', 'svg', 'ico');

module.exports = config;



