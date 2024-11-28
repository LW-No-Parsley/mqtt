// dataFilter.js
const publishMessage = require('./publish'); // 发布模块
const thresholdHandler = require('./thresholdHandler'); // 阈值处理模块

const allowedFields = ['LED', 'IRS', 'FS']; // 允许发布的字段列表

/**
 * 处理 WebSocket 客户端消息
 * @param {WebSocket} ws 客户端连接
 * @param {string} message 消息内容
 */
function handleClientMessage(ws, message) {
  try {
    const payload = JSON.parse(message); // 假设消息是 JSON 格式
    console.log('Received message from WebSocket client:', payload);

    const filteredPayload = filterAllowedFields(payload);
    const unallowedFields = filterUnallowedFields(payload);

    // 发布允许的字段
    if (Object.keys(filteredPayload).length > 0) {
      publishMessage(filteredPayload);
      console.log('Published filtered message:', filteredPayload);
    }

    // 处理不允许的字段（更新阈值）
    if (Object.keys(unallowedFields).length > 0) {
      console.log('Updating thresholds with:', unallowedFields);
      thresholdHandler.updateThresholds(unallowedFields);
    }
  } catch (error) {
    console.error('Invalid message format:', error.message);
  }
}

/**
 * 过滤允许的字段
 * @param {Object} payload 输入的消息对象
 * @returns {Object} 只包含允许字段的消息
 */
function filterAllowedFields(payload) {
  const filteredPayload = {};
  for (const [key, value] of Object.entries(payload)) {
    if (allowedFields.includes(key)) {
      filteredPayload[key] = value;
    }
  }
  return filteredPayload;
}

/**
 * 过滤不允许的字段
 * @param {Object} payload 输入的消息对象
 * @returns {Object} 只包含不允许字段的消息
 */
function filterUnallowedFields(payload) {
  const unallowedFields = {};
  for (const [key, value] of Object.entries(payload)) {
    if (!allowedFields.includes(key)) {
      unallowedFields[key] = value;
    }
  }
  return unallowedFields;
}

module.exports = { handleClientMessage }; // 导出处理消息函数
