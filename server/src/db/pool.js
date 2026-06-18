// server/src/db/pool.js
// Works for both local (no SSL) and Render production (SSL required)

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(process.env.NODE_ENV === "production" && {
    ssl: { rejectUnauthorized: false },
  }),
});

pool.on("error", (err) => {
  console.error("Unexpected DB pool error:", err.message);
});

module.exports = pool;
