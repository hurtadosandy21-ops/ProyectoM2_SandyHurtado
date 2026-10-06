const postService = require('../services/postService');
const authorService = require('../services/authorService');

// Los errores de base de datos (ID inválido, etc.) se envían con next(error)
// y los resuelve middleware/errorHandler.js

const isEmpty = (value) => typeof value !== 'string' || value.trim() === '';

const postController = {
  // GET /posts
  async getAllPosts(req, res, next) {
    try {
      const posts = await postService.getAll();
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  },

  // GET /posts/author/:authorId
  async getPostsByAuthor(req, res, next) {
    try {
      const { authorId } = req.params;

      // Primero se comprueba que el autor exista (si no, 404)
      const author = await authorService.getById(authorId);
      if (!author) {
        return res.status(404).json({ error: 'Autor no encontrado' });
      }

      const posts = await postService.getByAuthorId(authorId);
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  },

  // GET /posts/:id
  async getPostById(req, res, next) {
    try {
      const { id } = req.params;
      const post = await postService.getById(id);

      if (!post) {
        return res.status(404).json({ error: 'Post no encontrado' });
      }

      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  },

  // POST /posts
  async createPost(req, res, next) {
    try {
      const { author_id, title, content, published } = req.body || {};

      if (!author_id || isEmpty(title) || isEmpty(content)) {
        return res
          .status(400)
          .json({ error: 'Los campos title, content y author_id son obligatorios' });
      }
      if (published !== undefined && typeof published !== 'boolean') {
        return res.status(400).json({ error: 'El campo published debe ser true o false' });
      }

      // El autor debe existir
      const author = await authorService.getById(author_id);
      if (!author) {
        return res.status(404).json({ error: 'El autor indicado en author_id no existe' });
      }

      const newPost = await postService.create(author_id, title.trim(), content.trim(), published);
      res.status(201).json(newPost);
    } catch (error) {
      next(error);
    }
  },

  // PUT /posts/:id
  // title y content son obligatorios; published es opcional (si no se envía, se conserva)
  async updatePost(req, res, next) {
    try {
      const { id } = req.params;
      const { title, content, published } = req.body || {};

      if (isEmpty(title) || isEmpty(content)) {
        return res.status(400).json({ error: 'Los campos title y content son obligatorios' });
      }
      if (published !== undefined && typeof published !== 'boolean') {
        return res.status(400).json({ error: 'El campo published debe ser true o false' });
      }

      const updatedPost = await postService.update(id, title.trim(), content.trim(), published);

      if (!updatedPost) {
        return res.status(404).json({ error: 'Post no encontrado para actualizar' });
      }

      res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /posts/:id
  async deletePost(req, res, next) {
    try {
      const { id } = req.params;
      const deletedPost = await postService.remove(id);

      if (!deletedPost) {
        return res.status(404).json({ error: 'Post no encontrado' });
      }

      // 204 = éxito sin contenido
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = postController;
