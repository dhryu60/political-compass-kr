const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// ESM 모듈 확장자(mjs, cjs) 지원 추가
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

module.exports = config;
