//env
const { Pool } = require("pg");
const pool = new Pool({
  // user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  // database: process.env.DB_NAME,
  // password: process.env.DB_PASSWORD,
  // port: process.env.DB_PORT,
  connectionString: process.env.DB_URL,
});

// const pool = new Pool ({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'walled_db',
//     password: '123456',
//     port: 5432
// })

module.exports = pool;
