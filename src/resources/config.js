// config.js

const host = 'broker.emqx.io';  // MQTT 服务器的地址
const port = '1883';       // MQTT 服务器监听的端口
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`; // 生成一个唯一的客户端 ID
const connectUrl = `mqtt://${host}:${port}`; // 拼接 MQTT 连接 URL
const clean = true; // 设置为 true 时，表示为"clean session"连接，断开后服务器不会保留该客户端的订阅
const connectTimeout = 4000; // 连接超时时间，单位为毫秒
const username = 'admin'; // MQTT 服务器的用户名
const password = '123456'; // MQTT 服务器的密码
const reconnectPeriod = 1000; // 重连时间间隔，单位为毫秒// 要订阅或发布的主题名称
const get_topic = 'get-message'; 
const post_topic = 'pot-message'
const PORT = 3001;
// 发布消息时的选项
const publishOptions = {
  qos: 1, // 服务质量级别，1 表示确保消息至少送达一次
  retain: false // 设置为 false 表示消息不会被保留，客户端订阅后不会收到历史消息
};

// 导出配置项，供其他模块使用
module.exports = {
  host,
  port,
  clientId,
  connectUrl,
  clean,
  connectTimeout,
  username,
  password,
  reconnectPeriod,
  get_topic,
  post_topic,
  publishOptions,
  PORT
};
