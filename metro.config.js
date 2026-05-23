// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// react-native-reanimated@3.x 의 컴파일된 파일이 private class fields (#field) 문법을 사용함.
// Metro는 기본적으로 node_modules 를 Babel 트랜스파일하지 않아서,
// Hermes가 이 문법을 지원하지 않는 구형 Expo Go에서 SyntaxError가 발생함.
// → 아래 목록에 있는 패키지들은 Babel 트랜스파일 대상에 포함시킴.
config.transformer.transformIgnorePatterns = [
  'node_modules/(?!' +
    [
      'react-native',
      '@react-native',
      '@react-native-community',
      'react-native-reanimated',
      'react-native-gesture-handler',
      'react-native-screens',
      'react-native-safe-area-context',
      'react-native-view-shot',
      'expo',
      '@expo',
      'expo-router',
      'expo-status-bar',
      'expo-camera',
      'expo-media-library',
      'expo-sharing',
      'expo-linear-gradient',
      '@react-native-async-storage',
      '@expo/vector-icons',
      'dayjs',
    ].join('|') +
    ')',
];

module.exports = config;
