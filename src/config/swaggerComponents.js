// Piezas reutilizables de la documentación Swagger.
// Se importan en tu configuración de swagger-jsdoc (ver instrucciones abajo).

const errorContent = {
  'application/json': {
    schema: { $ref: '#/components/schemas/Error' },
  },
};

module.exports = {
  // El orden de esta lista es el orden en que Swagger muestra las secciones
  tags: [
    { name: 'Autores', description: 'Gestión de autores' },
    { name: 'Posts', description: 'Gestión de posts' },
  ],

  components: {
    schemas: {
      Author: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
          name: { type: 'string', example: 'Sandy Hurtado' },
          email: { type: 'string', format: 'email', example: 'sandy@example.com' },
          bio: { type: 'string', example: 'Desarrolladora Full Stack' },
        },
      },
      AuthorInput: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', example: 'Sandy Hurtado' },
          email: { type: 'string', format: 'email', example: 'sandy@example.com' },
          bio: { type: 'string', example: 'Desarrolladora Full Stack' },
        },
      },
      AuthorUpdate: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Sandy Hurtado' },
          email: { type: 'string', format: 'email', example: 'sandy@example.com' },
          bio: { type: 'string', example: 'Desarrolladora Full Stack' },
        },
      },
      Post: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'b7c9e2a1-3d4f-4a6b-8c5d-1e2f3a4b5c6d' },
          title: { type: 'string', example: 'Mi primer post en MiniBlog' },
          content: { type: 'string', example: 'Contenido interesante de desarrollo web.' },
          author_id: { type: 'string', format: 'uuid', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
          published: { type: 'boolean', example: false },
        },
      },
      PostInput: {
        type: 'object',
        required: ['title', 'content', 'author_id'],
        properties: {
          title: { type: 'string', example: 'Mi primer post en MiniBlog' },
          content: { type: 'string', example: 'Contenido interesante de desarrollo web.' },
          author_id: { type: 'string', format: 'uuid', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
        },
      },
      PostUpdate: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Título actualizado' },
          content: { type: 'string', example: 'Contenido actualizado.' },
          published: { type: 'boolean', example: true },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Descripción del error' },
        },
      },
    },

    parameters: {
      AuthorId: {
        in: 'path',
        name: 'id',
        required: true,
        schema: { type: 'string', format: 'uuid' },
        description: 'ID único del autor',
      },
      PostId: {
        in: 'path',
        name: 'id',
        required: true,
        schema: { type: 'string', format: 'uuid' },
        description: 'ID único del post',
      },
      PostAuthorId: {
        in: 'path',
        name: 'authorId',
        required: true,
        schema: { type: 'string', format: 'uuid' },
        description: 'ID único del autor',
      },
    },

    responses: {
      BadRequest: {
        description: 'Datos inválidos, campos obligatorios faltantes o ID con formato incorrecto.',
        content: errorContent,
      },
      NotFound: {
        description: 'Recurso no encontrado.',
        content: errorContent,
      },
      Conflict: {
        description: 'Ya existe un autor con ese email.',
        content: errorContent,
      },
      ServerError: {
        description: 'Error interno del servidor.',
        content: errorContent,
      },
    },
  },
};
