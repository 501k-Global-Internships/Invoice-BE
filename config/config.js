require('dotenv').config();

module.exports = {
  development: {
    username: 'chizoba',
    password: 'onah2020',
    database: 'invoice',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    username: 'chizoba',
    password: 'onah2020',
    database: 'invoice',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
    },
  },
};
