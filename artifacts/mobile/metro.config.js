const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// expo-notifications@0.32.17 pulls in @ide/backoff which imports Node's
// `assert` stdlib. React Native's runtime doesn't ship assert, so we shim it.
config.resolver = config.resolver || {};
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  assert: path.resolve(__dirname, 'shims/assert.js'),
};

module.exports = config;
