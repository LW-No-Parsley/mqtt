// 引入 WebSocket 和发布订阅相关的模块
const WebSocket = require('ws');
const  publishMessage  = require('../Util/publish'); // 导入发布模块
const  client  = require('../Util/mqttClient'); // 引入 MQTT 客户端
const { getLatestMessage } = require('../Util/subscribe'); // 获取最新的订阅消息
const config = require('../resources/config')
// 创建 WebSocket 服务，监听 8081 端口
const wss = new WebSocket.Server({ port: 8080 });
wss.on('listening', () => {
  console.log('WebSocket server is running on ws://localhost:8080');
});
// 存储当前连接的 WebSocket 客户端
let wsClients = [];
// 处理 WebSocket 客户端连接
wss.on('connection', (ws) => {
  // 将连接的 WebSocket 客户端添加到列表中
  wsClients.push(ws);
  console.log('New WebSocket client connected');
  // 监听 WebSocket 客户端发送的消息
  ws.on('message', (message) => {
    console.log('Received message from WebSocket client:', message);
    // 将 WebSocket 消息发布到 MQTT 主题
    try {
      const payload = JSON.parse(message); // 假设消息是 JSON 格式
      publishMessage(payload); // 发布消息到 MQTT 主题
    } catch (error) {
      console.error('Invalid message format', error); // 如果消息不是 JSON 格式
    }
  });
  // 监听 WebSocket 客户端断开连接
  ws.on('close', () => {
    // 从客户端列表中移除断开连接的客户端
    wsClients = wsClients.filter(client => client !== ws);
    console.log('WebSocket client disconnected');
  });
  // 监听 WebSocket 错误
  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});
// 广播消息到所有 WebSocket 客户端
function broadcastMessage(message) {
  wsClients.forEach(ws => {
    ws.send(message, (err) => {
      if (err) {
        console.error('Error sending message to client:', err);
      }
    });
  });
}
//订阅 MQTT 主题，并在收到消息时广播给所有 WebSocket 客户端
// client.on('connect', () => {
//   console.log('Connected to MQTT broker');
//   // 订阅指定的 MQTT 主题
//   client.subscribe(config.get_topic, (err) => {
//     if (err) {
//       console.error('Failed to subscribe to topic:', err);
//     } else {
//       console.log(`Subscribed to topic `);
//     }
//   });
// });
//当收到 MQTT 消息时，广播给所有 WebSocket 客户端
client.on('message', (topic, message) => {
  console.log(`Received message from MQTT topic '${topic}': ${message.toString()}`);
  broadcastMessage(message.toString()); // 广播 MQTT 消息到 WebSocket 客户端
});
module.exports = { broadcastMessage };
