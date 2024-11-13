// publish.js
//主题发布
const client = require('./mqttClient'); // 引入共享的 MQTT 客户端实例
const config = require('../resources/config'); // 导入配置文件以获取 MQTT 主题和其他配置

const topic = config.topic; // 从配置文件获取要发布的主题

// 监听连接成功事件，仅在客户端首次连接时打印日志
client.on('connect', () => {
  console.log('Connected to MQTT broker for publishing'); // 确认成功连接到 MQTT broker
});

// 定义并导出发布消息的函数
function publishMessage(payload) {
  const message = JSON.stringify(payload);
  // 使用客户端发布消息到指定主题
  client.publish(topic, message, config.publishOptions, (error) => {
    if (error) {
      console.error('Publish error:', error); // 发布失败时打印错误信息
    } else {
      console.log(`Message published to topic '${topic}':`,message); // 成功发布消息时打印信息
    }
  });
}

module.exports = publishMessage; // 导出发布消息的函数，以便其他模块可以调用此函数
