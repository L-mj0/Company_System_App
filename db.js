import mysql from 'mysql2/promise'

// 创建数据库连接
const db = mysql.createPool({
  host: 'localhost',     // 数据库地址
  user: 'root',          // 数据库用户名
  password: 'root',      // 数据库密码
  database: 'ROE21005_Databases', // 数据库名称
  port: 3306             // MySQL 端口号
})

export default db
