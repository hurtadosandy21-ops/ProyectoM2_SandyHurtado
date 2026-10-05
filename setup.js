const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

async function prepararBaseDeDatos() {
  try {
    // 1. Conectarnos primero a la base de datos por defecto 'postgres'
    const urlDefault = dbUrl.replace('/blog_db', '/postgres');
    const clientBase = new Client({ connectionString: urlDefault });
    await clientBase.connect();

    // 2. Crear la base de datos blog_db si no existe
    const existe = await clientBase.query("SELECT 1 FROM pg_database WHERE datname='blog_db'");
    if (existe.rowCount === 0) {
      await clientBase.query('CREATE DATABASE blog_db;');
      console.log('✅ Base de datos "blog_db" creada con éxito.');
    } else {
      console.log('ℹ️ La base de datos "blog_db" ya existía.');
    }
    await clientBase.end();

    // 3. Conectarnos a 'blog_db' y crear las tablas desde init.sql
    const clientBlog = new Client({ connectionString: dbUrl });
    await clientBlog.connect();

    const scriptSQL = fs.readFileSync('./init.sql', 'utf8');
    await clientBlog.query(scriptSQL);
    console.log('✅ Tablas "authors" y "posts" creadas con éxito.');

   await clientBlog.end();
    console.log('🚀 ¡Todo listo para continuar!');
  } catch (error) {
    console.error('❌ ERROR COMPLETO:', error); // <-- Cambiamos esto para ver todo el detalle
  }
}

prepararBaseDeDatos();