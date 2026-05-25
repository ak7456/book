// @expo/metro-runtime messageSocket.native 패치
//
// 원인: RN 0.81에서 getDevServer.js가 ES module(export default)로 변경됨.
//       require()로 가져오면 함수 자체가 아닌 { default: fn } 객체가 반환됨.
//       @expo/metro-runtime은 이를 함수로 호출해서 크래시 발생.
// 수정: default export를 꺼내서 실제 함수를 가져오도록 처리.

function createWebSocketConnection(path = '/message') {
  const getDevServerModule = require('react-native/Libraries/Core/Devtools/getDevServer');
  // ES module interop: export default → { default: fn }, CommonJS → fn
  const getDevServer =
    typeof getDevServerModule === 'function'
      ? getDevServerModule
      : getDevServerModule.default ?? getDevServerModule;

  const devServer = getDevServer();
  if (!devServer.bundleLoadedFromServer) {
    throw new Error('Cannot create devtools websocket connections in embedded environments.');
  }

  const devServerUrl = new URL(devServer.url);
  const serverScheme = devServerUrl.protocol === 'https:' ? 'wss' : 'ws';
  const WebSocket = require('react-native/Libraries/WebSocket/WebSocket');
  return new WebSocket(`${serverScheme}://${devServerUrl.host}${path}`);
}

createWebSocketConnection().onmessage = (message) => {
  const data = JSON.parse(String(message.data));
  switch (data.method) {
    case 'sendDevCommand':
      switch (data.params.name) {
        case 'rsc-reload':
          if (data.params.platform && data.params.platform !== process.env.EXPO_OS) {
            return;
          }
          console.log(
            'HMR(Client): Reload received from server. Sending to listeners:',
            globalThis.__EXPO_RSC_RELOAD_LISTENERS__?.length
          );
          if (!globalThis.__EXPO_RSC_RELOAD_LISTENERS__) {
            // server function-only mode
          } else {
            globalThis.__EXPO_RSC_RELOAD_LISTENERS__?.forEach((l) => l());
          }
          break;
      }
      break;
    // NOTE: All other cases are handled in the native runtime.
  }
};
