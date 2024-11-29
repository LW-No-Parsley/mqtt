// index.js
require('./src/Util/mqttClient'); // 初始化 MQTT 客户端
require('./src/Util/subscribe'); // 订阅消息
require('./src/service/WebSocket'); // 启动 WebSocket 服务器
