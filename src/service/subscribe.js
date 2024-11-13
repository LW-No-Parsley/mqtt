// subscribe.js
//订阅内容
const client = require('./mqttClient'); // 引入共享的 MQTT 客户端实例
const config = require('../resources/config'); // 导入配置文件以获取 MQTT 主题和其他配置

const topic = config.topic; // 从配置文件获取要订阅的主题

let latestMessage = ''; // 用于存储最新接收到的消息

// 当客户端成功连接到 MQTT broker 时，打印日志并订阅主题
client.on('connect', () => {
  console.log('Connected to MQTT broker for subscribing');

  // 订阅指定主题
  client.subscribe(topic, (error) => {
    if (error) {
      console.error(`Failed to subscribe to topic '${topic}':`, error); // 订阅失败时输出错误
    } else {
      console.log(`Subscribed to topic '${topic}'`); // 成功订阅时输出信息
    }
  });
});

// 监听消息事件，接收到指定主题的消息时触发
client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString());
  if (topic === config.topic) {
    latestMessage = payload.toString();
  }
});

// 导出 `client` 和获取 `latestMessage` 的函数
module.exports = { 
  client,
  getLatestMessage: () => latestMessage, // 返回最新消息的函数，以保证每次调用时获得最新值
};
