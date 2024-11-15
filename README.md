# MQTT

## 安装依赖
```
npm install
```

### 运行脚本
```
npm run start
```
### 端口
```
http://localhost:3001
```

### 获取订阅内容

```
/api/message
```

### 通过post请求发布消息
```
POST http://localhost:3001/api/publish
Content-Type: application/json
{
  "message": {
    "test": "你好",
    "test1": "你好1",
    "test2": "你好",
    "test3": "你好1",
    "test4": "你好",
    "test5": "你好1"
  }

}
```
### 可通过修改package中的启动项修改服务
```
 "start": "nodemon src/service/WebSocket.js"
```
### 其他设置
```
src\resources\config.js
```
