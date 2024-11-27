// 引入 WebSocket 和发布订阅相关的模块
const WebSocket = require('ws');
const publishMessage = require('../Util/publish'); // 发布模块
require('../Util/subscribe'); // 获取最新的订阅消息
const client = require('../Util/mqttClient'); // MQTT 客户端
const thresholdHandler = require('../Util/thresholdHandler'); // 阈值处理模块

// WebSocket 服务器端口
const PORT = 8080;

// 创建 WebSocket 服务
const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});

// 存储当前连接的 WebSocket 客户端
const wsClients = new Set();

/**
 * 广播消息到所有 WebSocket 客户端
 * @param {string|Object} message 消息内容
 */
function broadcastMessage(message) {
  const messageStr = typeof message === 'string' ? message : JSON.stringify(message);

  wsClients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(messageStr, (err) => {
        if (err) {
          console.error('Error sending message to client:', err);
        }
      });
    }
  });
}

/**
 * 处理 WebSocket 客户端消息
 * @param {WebSocket} ws 客户端连接
 * @param {string} message 消息内容
 */
function handleClientMessage(ws, message) {
  try {
    const payload = JSON.parse(message); // 假设消息是 JSON 格式
    console.log('Received message from WebSocket client:', payload);

    const allowedFields = ['LED', 'IRS', 'FS']; // 允许发布的字段列表
    const filteredPayload = {};
    const unallowedFields = {};

    // 过滤消息，只保留允许的字段
    for (const [key, value] of Object.entries(payload)) {
      if (allowedFields.includes(key)) {
        filteredPayload[key] = value;
      } else {
        unallowedFields[key] = value;
      }
    }

    // 发布允许的字段
    if (Object.keys(filteredPayload).length > 0) {
      publishMessage(filteredPayload);
      console.log('Published filtered message:', filteredPayload);
    }

    // 处理不允许的字段（更新阈值）
    if (Object.keys(unallowedFields).length > 0) {
      console.log('Updating thresholds with:', unallowedFields);
      thresholdHandler.updateThresholds(unallowedFields);
    }
  } catch (error) {
    console.error('Invalid message format:', error.message);
  }
}

/**
 * 处理 WebSocket 客户端连接
 * @param {WebSocket} ws 客户端连接
 */
function handleConnection(ws) {
  console.log('New WebSocket client connected');
  wsClients.add(ws);

  // 监听消息事件
  ws.on('message', (message) => handleClientMessage(ws, message));

  // 监听断开连接事件
  ws.on('close', () => {
    wsClients.delete(ws);
    console.log('WebSocket client disconnected');
  });

  // 监听错误事件
  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
  });
}

// 监听 WebSocket 客户端连接
wss.on('connection', handleConnection);

// 当收到 MQTT 消息时，广播给所有 WebSocket 客户端
client.on('message', (topic, message) => {
  console.log(`Received MQTT message from topic '${topic}':`, message.toString());
  broadcastMessage(message.toString());
});

// 导出广播功能
module.exports = { broadcastMessage };
