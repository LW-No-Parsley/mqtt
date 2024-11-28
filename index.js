// index.js
const { broadcastMessage } = require('./src/Util/broadcast'); // 导入广播功能
require('./src/Util/mqttClient'); // 初始化 MQTT 客户端
require('./src/Util/subscribe'); // 订阅消息
require('./src/service/WebSocket'); // 启动 WebSocket 服务器

// 监听 MQTT 消息并广播给 WebSocket 客户端
const client = require('./src/Util/mqttClient'); // 引入共享的 MQTT 客户端实例

client.on('message', (topic, message) => {
  console.log(`Received MQTT message from topic '${topic}':`, message.toString());
  broadcastMessage(message.toString()); // 将 MQTT 消息广播到 WebSocket 客户端
});
