// index.js

// 引入必要的模块
const mqttClient = require('./src/Util/mqttClient'); // MQTT 客户端实例
const websocket = require('./src/service/websocket'); // WebSocket 服务
require('./src/Util/subscribe'); // 订阅模块，自动处理消息接收和存储
require('./src/Util/thresholdHandler'); // 阈值处理模块（自动处理阈值更新）

// 启动应用
function start() {
  // 监听 MQTT 连接成功事件
  mqttClient.on('connect', () => {
    console.log('MQTT client connected successfully.');

    // WebSocket 服务已经在 websocket.js 中启动
    // MQTT 客户端自动订阅了主题，在 subscribe.js 中处理消息接收和存储
  });

  // 监听 MQTT 连接错误
  mqttClient.on('error', (err) => {
    console.error('Error connecting to MQTT broker:', err.message);
  });
}

// 启动应用
start();
