const mysql = require('mysql2/promise');
const dotenv = require("dotenv");
dotenv.config();

const config = {
    db: {
        host: "127.0.0.1",
        user: "root",
        password: process.env.SQLSERVERPASS,
        database: "business_quant_assignment",
        connectTimeout: 60000
    },
};


async function query(sql, params) {
  const connection = await mysql.createConnection(config.db);
  const [results] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  query
}