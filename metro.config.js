const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force Metro to resolve CommonJS/Require paths instead of ESM (import) to avoid import.meta crashes in browser
config.resolver.unstable_conditionNames = ['react-native', 'require', 'default'];

module.exports = config;
