const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Dodaj rozszerzenie .pte do asset extensions
config.resolver.assetExts.push('pte');

module.exports = config;
