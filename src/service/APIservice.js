// APIservice.js
const PORT = require('../resources/config').PORT;
const express = require('express'); // 引入 Express 框架，用于创建服务器和处理请求
const { getLatestMessage } = require('./subscribe'); // 从订阅模块导入最新消息的获取函数
const publishMessage = require('./publish'); // 导入发布模块中的发布消息函数

const app = express(); // 创建 Express 应用实例
app.use(express.json()); // 使用 JSON 中间件来解析 JSON 格式的请求体

// 定义 GET 路由用于获取最新的订阅消息
app.get('/api/message', (req, res) => {
  const latestMessage = getLatestMessage(); // 调用函数动态获取最新消息
  if (latestMessage) {
    res.json({ latestMessage }); // 返回包含最新消息的 JSON 响应
  } else {
    res.status(404).json({ error: 'No message received yet' }); // 如果没有消息，返回 404 状态和错误信息
  }
});

// 定义 POST 路由用于通过 API 发布新消息
app.post('/api/publish', (req, res) => {
  const { message } = req.body; // 从请求体中提取 `message` 字段
  if (message) {
    publishMessage(message); // 调用发布函数，发布消息到 MQTT 主题
    res.json({ status: 'Message sent', message }); // 成功发布后，返回确认信息和发送的消息
  } else {
    res.status(400).json({ error: 'Message content is missing' }); // 如果没有提供消息，返回 400 状态和错误信息
  }
});

// 启动服务器并监听指定端口 // 定义 API 服务器的端口
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`); // 服务器启动成功后，打印确认信息
});
