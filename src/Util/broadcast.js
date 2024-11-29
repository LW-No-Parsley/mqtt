// broadcast.js
const WebSocket = require('ws');

// 存储 WebSocket 客户端
const wsClients = new Set();

/**
 * 广播消息到所有 WebSocket 客户端
 * @param {Object} message 消息内容
 */
function broadcastMessage(message) {
  const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
  console.log('Received Message:', messageStr);
  
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

module.exports = { broadcastMessage, wsClients };
