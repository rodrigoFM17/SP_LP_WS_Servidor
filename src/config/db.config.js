const mysql = require('mysql2/promise')
require('dotenv').config()

const config = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: process.env.CONNECTION_LIMIT,
}

const createConnection = async () => await mysql.createPool(config)

module.exports = {
    createConnection
}


