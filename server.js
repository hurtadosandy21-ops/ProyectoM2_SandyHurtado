const app = require('./app');
const pool = require('./src/config/db');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo exitosamente en el puerto ${PORT}`);
});

// Prueba rápida de conexión al iniciar
pool
  .query('SELECT 1')
  .then(() => console.log('✅ Conectado exitosamente a la base de datos PostgreSQL'))
  .catch((err) => console.error('❌ Error al conectar a la base de datos PostgreSQL:', err.message));
