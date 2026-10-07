const { Pool } = require('pg');
require('dotenv').config({ quiet: true });

const connection = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    };

const pool = new Pool({
  ...connection,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el Pool de PostgreSQL:', err.message);
});

module.exports = pool;
