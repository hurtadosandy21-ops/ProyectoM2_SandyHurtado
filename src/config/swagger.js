const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MiniBlog API',
      version: '1.0.0',
      description: 'API desarrollada con Node.js, Express y PostgreSQL',
    },
    servers: [
     {
      url: '/',
     description: 'Servidor actual'
     },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

// ¡CRÍTICO!: Asegúrate de exportar ambos objetos aquí
module.exports = {
  swaggerUi,
  specs,
};