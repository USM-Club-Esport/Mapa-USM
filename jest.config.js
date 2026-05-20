module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(\.pnpm/.*/node_modules/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|@react-three/.*|three|pigeon-maps|leaflet|react-leaflet|react-native-maps|react-native-gesture-handler|react-native-reanimated|react-native-worklets))/',
  ],
  setupFiles: ['<rootDir>/jest-setup.js'],
};
