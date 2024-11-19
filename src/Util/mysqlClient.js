const mysql = require('mysql2');
const config = require('../resources/SQLconfig'); // 引入配置文件

// 使用配置文件中的 MySQL 参数创建连接池
const pool = mysql.createPool(config.mysql);
function SensorData(data){
    const { TS, HS, LS, SMS, LED, IRS } = data;
    const sql = `INSERT INTO sensor_data (TS, HS, LS, SMS, LED, IRS)
    VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [TS, HS, LS, SMS, LED, IRS];
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error inserting sensor data:', error);
            return reject(error);
        }
        console.log('Sensor data inserted successfully:', results.insertId);
        resolve(results.insertId);
        });
    });
}

module.exports = { SensorData };