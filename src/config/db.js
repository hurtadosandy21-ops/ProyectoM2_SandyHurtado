const { Pool } = require('pg');
require('dotenv').config();

// Creamos el Pool asegurando que la contraseña sea un string válido
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : '1106',
  database: process.env.DB_NAME || 'blog_db',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

// Prueba rápida de conexión al iniciar
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos PostgreSQL:', err.stack);
  } else {
    console.log('✅ Conectado exitosamente a la base de datos PostgreSQL');
    release();
  }
});

module.exports = pool;