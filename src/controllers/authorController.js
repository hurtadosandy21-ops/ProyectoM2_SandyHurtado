const authorService = require('../services/authorService');

const authorController = {
  // GET /authors
  async getAllAuthors(req, res) {
    try {
      const authors = await authorService.getAll();
      res.status(200).json(authors);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor al obtener autores' });
    }
  },

  // GET /authors/:id
  async getAuthorById(req, res) {
    try {
      const { id } = req.params;
      const author = await authorService.getById(id);
      
      if (!author) {
        return res.status(404).json({ error: 'Autor no encontrado' });
      }
      
      res.status(200).json(author);
    } catch (error) {
      res.status(500).json({ error: 'Error interno al buscar el autor' });
    }
  },

  // POST /authors
  async createAuthor(req, res) {
    try {
      const { name, email, bio } = req.body;

      // Validación: name no vacío y email presente
      if (!name) {
        return res.status(400).json({ error: "El nombre no puede estar vacío" });
      }
      if (!email || email.trim() === '') {
        return res.status(400).json({ error: 'El campo "email" es obligatorio' });
      }

      const newAuthor = await authorService.create(name, email, bio);
      res.status(201).json(newAuthor);
    } catch (error) {
     console.error('Error en createAuthor:', error); // <- agrega esto
     if (error.code === '23505') {
     return res.status(400).json({ error: 'El email ya está registrado' });
    }
  res.status(500).json({ error: 'Error al crear el autor' });
}
  },

  // PUT /authors/:id
  async updateAuthor(req, res) {
    try {
      const { id } = req.params;
      const { name, email, bio } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'El nombre no puede estar vacío' });
      }

      const updatedAuthor = await authorService.update(id, name, email, bio);

      if (!updatedAuthor) {
        return res.status(404).json({ error: 'Autor no encontrado para actualizar' });
      }

      res.status(200).json(updatedAuthor);
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'El correo electrónico ya está en uso por otro autor' });
      }
      res.status(500).json({ error: 'Error al actualizar el autor' });
    }
  },

  // DELETE /authors/:id
  async deleteAuthor(req, res) {
    try {
      const { id } = req.params;
      const deletedAuthor = await authorService.remove(id);
      if (!deletedAuthor) {
        return res.status(404).json({ error: 'Autor no encontrado para eliminar' });
      }

      // Código 204 (No Content) o un mensaje de éxito limpio
      res.status(204).json({ message: 'Autor eliminado correctamente', deletedAuthor });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el autor' });
    }
  }
};

module.exports = authorController;