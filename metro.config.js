// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// @expo/metro-runtime messageSocket.native 버그 패치
//
// 문제: RN 0.81에서 getDevServer.js가 ES module(export default)로 변경됨.
//       @expo/metro-runtime의 messageSocket.native.ts가 require()로 가져온 뒤
//       바로 함수로 호출해서 "getDevServer is not a function (it is Object)" 크래시 발생.
// 수정: effects.native.ts가 ./messageSocket를 require할 때 패치된 버전으로 교체.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    context.originModulePath &&
    context.originModulePath.includes('/node_modules/@expo/metro-runtime/') &&
    (moduleName === './messageSocket' || moduleName === './messageSocket.native')
  ) {
    return {
      filePath: path.resolve(__dirname, 'patches/messageSocket.native.js'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
