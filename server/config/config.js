require('dotenv').config()
module.exports = {
  port: 3000,
  jwtSecret: '!!CryptoCat@!!',
  jwtExpirationInSeconds: 60 * 60, // 1 hour   

  'development': {
    'username': process.env.DB_USER,
    'password': process.env.DB_PASS,
    'database': process.env.DB_NAME,
    'host': process.env.DB_HOST,
    'dialect': process.env.DB_DIALECT
  },
  'test': {
    'username': process.env.DB_USER,
    'password': process.env.DB_PASS,
    'database': process.env.DB_NAME,
    'host': process.env.DB_HOST,
    'dialect': process.env.DB_DIALECT
  },
  'production': {
    'use_env_variable': 'MYSQL_URL',
    'dialect': 'mysql'
  }
}