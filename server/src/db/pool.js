const { Pool } = require('pg');

const pool = new Pool({
  user:     'postgres',
  host:     'localhost',
  database: 'frutella',
  password: 'Timmy_turn1',
  port:     5432,
});

pool.connect()
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch(err => console.error('❌ DB connection error:', err.message));

module.exports = pool;