const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerComponents = require('./swaggerComponents'); // 👈 nuevo

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
        description: 'Servidor actual',
      },
    ],
    ...swaggerComponents, // 👈 nuevo: agrega tags y components
  },
  apis: [path.join(__dirname, '..', 'routes', '*.js')],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};