const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ quiet: true });

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;
const dbUrl =
  process.env.DATABASE_URL ||
  (DB_HOST &&
    `postgresql://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}:${DB_PORT || 5432}/${DB_NAME}`);
const withSeed = process.argv.includes('--seed');
const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;

const readSql = (file) => fs.readFileSync(path.join(__dirname, 'db', file), 'utf8');

async function crearBaseSiNoExiste() {
  // 1. Conectarnos primero a la base de datos por defecto 'postgres'
  const url = new URL(dbUrl);
  const dbName = decodeURIComponent(url.pathname.slice(1));
  url.pathname = '/postgres';

  const client = new Client({ connectionString: url.toString(), ssl });
  await client.connect();
  try {
    // 2. Crear la base de datos si no existe
    const existe = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (existe.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName.replace(/"/g, '""')}"`);
      console.log(`✅ Base de datos "${dbName}" creada.`);
    } else {
      console.log(`ℹ️  La base de datos "${dbName}" ya existía.`);
    }
  } finally {
    await client.end();
  }
}

async function prepararBaseDeDatos() {
  if (!dbUrl) {
    throw new Error('Falta DATABASE_URL (o DB_HOST, DB_USER, DB_PASSWORD y DB_NAME) en el archivo .env');
  }

  await crearBaseSiNoExiste();

  // 3. Conectarnos a la base y crear las tablas desde db/schema.sql
  const client = new Client({ connectionString: dbUrl, ssl });
  await client.connect();
  try {
    await client.query(readSql('schema.sql'));
    console.log('✅ Tablas "authors" y "posts" listas.');

    if (withSeed) {
      await client.query(readSql('seed.sql'));
      console.log('🌱 Datos de ejemplo cargados.');
    }
  } finally {
    await client.end();
  }
  console.log('🚀 ¡Todo listo!');
}

prepararBaseDeDatos().catch((error) => {
  console.error('❌ Error preparando la base de datos:', error.message);
  process.exit(1);
});
