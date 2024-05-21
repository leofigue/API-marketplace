const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  allowExitOnIdle: true,
  port: 5432
});

try {
  pool.query("SELECT NOW()");
  console.log("Database connected!!!!");
} catch (error) {
  console.log(error);
}

module.exports = { pool }