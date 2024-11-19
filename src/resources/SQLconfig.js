const { port } = require("./config");

module.exports = {
    mysql: {
        host: 'localhost', 
        port: 3306,       // MySQL地址
        user: 'root',             // 数据库用户名
        password: '123456',     // 数据库密码
        database: 'mqtt_messages', // 数据库名称
        connectionLimit: 10,      // 最大连接数
        waitForConnections: true, // 等待连接可用
        queueLimit: 0             // 队列大小限制
      }
}