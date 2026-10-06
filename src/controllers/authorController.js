const authorService = require('../services/authorService');

// Formato básico de email: algo@dominio.ext
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Los errores de base de datos (email duplicado, ID inválido, etc.)
// se envían con next(error) y los resuelve middleware/errorHandler.js

const authorController = {
  // GET /authors
  async getAllAuthors(req, res, next) {
    try {
      const authors = await authorService.getAll();
      res.status(200).json(authors);
    } catch (error) {
      next(error);
    }
  },

  // GET /authors/:id
  async getAuthorById(req, res, next) {
    try {
      const { id } = req.params;
      const author = await authorService.getById(id);

      if (!author) {
        return res.status(404).json({ error: 'Autor no encontrado' });
      }

      res.status(200).json(author);
    } catch (error) {
      next(error);
    }
  },

  // POST /authors
  async createAuthor(req, res, next) {
    try {
      const { name, email, bio } = req.body || {};

      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'El nombre no puede estar vacío' });
      }
      if (typeof email !== 'string' || email.trim() === '') {
        return res.status(400).json({ error: 'El campo "email" es obligatorio' });
      }
      if (!EMAIL_REGEX.test(email.trim())) {
        return res.status(400).json({ error: 'El email no tiene un formato válido' });
      }

      // El email se guarda siempre en minúsculas para que "Sandy@..." y "sandy@..." cuenten como el mismo
      const newAuthor = await authorService.create(
        name.trim(),
        email.trim().toLowerCase(),
        bio
      );
      res.status(201).json(newAuthor);
    } catch (error) {
      next(error); // si el email está repetido, errorHandler responde 409
    }
  },

  // PUT /authors/:id
  // name es obligatorio; email y bio son opcionales (si no se envían, se conservan)
  async updateAuthor(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, bio } = req.body || {};

      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'El nombre no puede estar vacío' });
      }
      if (email !== undefined && (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim()))) {
        return res.status(400).json({ error: 'El email no tiene un formato válido' });
      }

      const updatedAuthor = await authorService.update(
        id,
        name.trim(),
        email === undefined ? null : email.trim().toLowerCase(),
        bio ?? null
      );

      if (!updatedAuthor) {
        return res.status(404).json({ error: 'Autor no encontrado para actualizar' });
      }

      res.status(200).json(updatedAuthor);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /authors/:id
  async deleteAuthor(req, res, next) {
    try {
      const { id } = req.params;
      const deletedAuthor = await authorService.remove(id);

      if (!deletedAuthor) {
        return res.status(404).json({ error: 'Autor no encontrado para eliminar' });
      }

      // 204 = éxito sin contenido (una respuesta 204 no puede llevar body)
      res.status(204).send();
    } catch (error) {
      next(error); // si el autor tiene posts y no hay CASCADE, errorHandler responde 409
    }
  },
};

module.exports = authorController;
