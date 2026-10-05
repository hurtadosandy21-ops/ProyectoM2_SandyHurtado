const postService = require('../services/postService');

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

  // GET /posts/author/:authorId
  async getPostsByAuthor(req, res, next) {
    try {
      const { authorId } = req.params;
      const posts = await postService.getByAuthorId(authorId);
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  },

  // POST /posts
  async createPost(req, res, next) {
    try {
      const { author_id, title, content, published } = req.body;

      // Validaciones requeridas (400)
      if (!author_id || !title || title.trim() === '' || !content || content.trim() === '') {
        return res.status(400).json({ error: 'Los campos title, content y author_id son obligatorios' });
      }

      const newPost = await postService.create(author_id, title, content, published);
      res.status(201).json(newPost);
    } catch (error) {
      // 🚀 AQUÍ ESTÁ EL SECRETO: Al usar next(error), enviamos el error 
      // directamente al middleware errorHandler.js donde Postgres procesará el '23503'
      next(error);
    }
  },
  
  // PUT /posts/:id
  async updatePost(req, res, next) {
    try {
      const { id } = req.params;
      const { title, content, published } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: "Los campos title y content son obligatorios" });
      }

      const updatedPost = await postService.update(id, title, content, published);

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

      // Éxito de eliminación: Código 204 sin contenido
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = postController;