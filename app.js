const express = require('express');
const cors = require('cors');

// Importar las rutas de autores y posts (las crearemos en el siguiente paso)
const authorRoutes = require('./src/routes/authorRoutes');
const postRoutes = require('./src/routes/postRoutes');

const app = express();

// --- Middlewares esenciales ---
app.use(cors());
app.use(express.json());

// --- Ruta raíz de bienvenida ---
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Bienvenido a la API de MiniBlog - DevSpark',
    status: 'Activa y funcionando correctamente'
  });
});

// --- Registrar las rutas de la API ---
app.use('/authors', authorRoutes);
app.use('/posts', postRoutes);

// --- Manejo de rutas no encontradas (404) ---
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;