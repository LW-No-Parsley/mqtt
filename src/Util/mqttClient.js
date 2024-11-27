// mqttClient.js
const mqtt = require('mqtt');
const config = require('../resources/config');

// 创建共享的 MQTT 客户端实例
const client = mqtt.connect(config.connectUrl, {
  clientId: config.clientId,
  clean: config.clean,
  connectTimeout: config.connectTimeout,
  username: config.username,
  password: config.password,
  reconnectPeriod: config.reconnectPeriod,
});
// 监听连接成功事件
client.on('connect', () => {
  console.log('Connected to MQTT broker');
});
module.exports = client;
