// websocketConnection.js
const WebSocket = require('ws');
const { wsClients } = require('../Util/broadcast'); // 引入广播客户端
const { handleClientMessage } = require('../Util/dataFilter'); // 引入数据处理模块

// WebSocket 服务器端口
const PORT = 8080;

class WebSocketServer {
  constructor() {
    this.wss = new WebSocket.Server({ port: PORT }, () => {
      console.log(`WebSocket server is running on ws://localhost:${PORT}`);
    });

    this.wss.on('connection', this.handleConnection.bind(this));
  }

  // 处理 WebSocket 客户端连接
  handleConnection(ws) {
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
}

module.exports = new WebSocketServer(); // 使用单例模式导出 WebSocket 服务器实例
