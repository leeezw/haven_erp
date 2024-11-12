import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: '113.44.75.36',
  user: 'next',
  password: 'MGSjAHym4wsCEPys',
  database: 'next',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4',
  rowsAsArray: false,
  typeCast: true,
  supportBigNumbers: true,
  bigNumberStrings: true,
  dateStrings: true
})

// 测试连接
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully')
    connection.release()
  })
  .catch(err => {
    console.error('Error connecting to the database:', err)
  })

export default pool 