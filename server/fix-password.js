const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({ 
  user: 'postgres', 
  host: 'localhost', 
  database: 'frutella', 
  password: 'Timmy_turn1', 
  port: 5432 
});

async function fixPassword() {
  // Generate fresh hash
  const hashedPassword = await bcrypt.hash('password123', 10);
  console.log('New hash:', hashedPassword);

  // Update in database
  await pool.query(
    "DELETE FROM users WHERE email = 'test@frutella.com'"
  );
  console.log('✅ Old user deleted');

  await pool.query(
    `INSERT INTO users (name, email, password, phone) 
     VALUES ('Test User', 'test@frutella.com', $1, '+234 801 234 5678')`,
    [hashedPassword]
  );
  console.log('✅ New user created with fresh password!');

  // Verify
  const result = await pool.query(
    "SELECT id, email, password FROM users WHERE email = 'test@frutella.com'"
  );
  console.log('User in DB:', result.rows[0]);

  pool.end();
}

fixPassword().catch(console.error);