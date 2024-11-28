const publishMessage = require('./publish'); // 发布模块
const { broadcastMessage } = require('./broadcast')
// 全局存储 WebSocket 的阈值
let thresholds = {
  aout : false,
  soilMoisture: null,
  lightIntensity: null,
  FSYZ: null,
  TS:null,
  SMS:null,
  LS:null
};
module.exports = {
  // 更新 WebSocket 阈值
  updateThresholds: (data) => {
    if (data.aout !== undefined) {
      thresholds.aout = data.aout;
      console.log(`Updated soilMoisture threshold: ${data.aout}`);
    }
    if (data.soilMoisture !== undefined) {
      thresholds.soilMoisture = data.soilMoisture;
      console.log(`Updated soilMoisture threshold: ${data.soilMoisture}`);
    }
    if (data.lightIntensity !== undefined) {
      thresholds.lightIntensity = data.lightIntensity;
      console.log(`Updated lightIntensity threshold: ${data.lightIntensity}`);
    }
    if (data.FSYZ !== undefined) {
      thresholds.FSYZ = data.FSYZ;
      console.log(`Updated lightIntensity threshold: ${data.FSYZ}`);
    }
  },

  // 处理 MQTT 消息并进行判断
  processMqttMessage: (data) => {
    thresholds.SMS = data.SMS;
    thresholds.LS = data.LS;
    thresholds.TS = data.TS;
    if (thresholds.aout === true) { 
    if (thresholds.soilMoisture !== null && data.SMS !== undefined) {
      if (data.SMS < thresholds.soilMoisture) {
        console.log('Threshold met: Turning IRS on');
        const message = {"IRS": "on"}
        setTimeout(() => {
          publishMessage(message); // 发布 {"IRS": "on"}
          broadcastMessage(message)
        },2000)

      }
    }

    if (thresholds.lightIntensity !== null && data.LS !== undefined) {
      if (data.LS < thresholds.lightIntensity) {
        console.log('Threshold met: Turning LED on');
        const message = { LED: 'on' }
        setTimeout(() => {
          publishMessage(message); // 发布 {"LED": "LED"}
          broadcastMessage(message)
        },2000)
      }
    }

    if (thresholds.FSYZ !== null && data.TS !== undefined) {
      if (data.FS > thresholds.FSYZ) {
        console.log('Threshold met: Turning LED on');
        const message = { FS: 'on' };
        setTimeout(() => {
          publishMessage(message); // 发布 {"FS": "on"}
          broadcastMessage(message)
        },2000)
      }
    }
  }
},
};
 