//env
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// const pool = new Pool ({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'walled_db',
//     password: '123456',
//     port: 5432
// })

module.exports = pool;
