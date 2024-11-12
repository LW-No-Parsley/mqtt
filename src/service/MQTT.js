// mqtt.js

const publishMessage = require('./publish'); // 引入发布模块
require('./subscribe'); // 直接引入订阅模块

// 示例：调用发布函数
publishMessage('This is a test message from publish.js');
