// subscribe.js
//订阅内容
const client = require('./mqttClient'); // 引入共享的 MQTT 客户端实例
const config = require('../resources/config'); // 导入配置文件以获取 MQTT 主题和其他配置
const { SensorData } = require('../Util/mysqlClient'); //导入数据库工具类
const thresholdHandler = require('./thresholdHandler'); //导入阈值模块
const { broadcastMessage } = require('./broadcast')
const topic = config.get_topic; // 从配置文件获取要订阅的主题
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
// 监听消息事件，接收到指定主题的消息时处理并存储
client.on('message', async (topic, payload) => {
  try {
    const payloadStr = payload.toString();
    const message = payloadStr.split(' ') // 按空格分割键值对
      .reduce((acc, pair) => {
        const [key, value] = pair.split(':'); // 按冒号分割键和值
        acc[key] = value; // 将键值对添加到对象中
        return acc;
      }, {});

    console.log('Formatted Message:', message); // 打印格式化后的消息

    console.log('parsed message:',message);

    broadcastMessage(message);

    const data = message;
    thresholdHandler.processMqttMessage(data);

    // 保存到数据库
    await SensorData(message);
    console.log('Message stored successfully');
  } catch (error) {
    console.error('Error processing message:', error);
  }
});
