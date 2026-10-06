const express = require('express');
const cors = require('cors');
const { swaggerUi, specs } = require('./desarrollo/src/config/swagger');
const authorRoutes = require('./desarrollo/src/routes/authorRoutes');
const postRoutes = require('./desarrollo/src/routes/postRoutes');

// Importar el middleware de errores
const errorHandler = require('./desarrollo/src/middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Bienvenido a la API de MiniBlog - DevSpark',
    status: 'Activa y funcionando correctamente'
  });
});

app.use('/authors', authorRoutes);
app.use('/posts', postRoutes);

// Ruta 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use(errorHandler); // siempre al final

module.exports = app;