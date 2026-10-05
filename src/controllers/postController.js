const postService = require('../services/postService');

const postController = {
  // GET /posts
  async getAllPosts(req, res) {
    try {
      const posts = await postService.getAll();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los posts' });
    }
  },

  // GET /posts/:id
  async getPostById(req, res) {
    try {
      const { id } = req.params;
      const post = await postService.getById(id);
      
      if (!post) {
        return res.status(404).json({ error: 'Post no encontrado' });
      }
      
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar el post' });
    }
  },

  // GET /posts/author/:authorId
  async getPostsByAuthor(req, res) {
    try {
      const { authorId } = req.params;
      const posts = await postService.getByAuthorId(authorId);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los posts del autor' });
    }
  },

  // POST /posts
  async createPost(req, res) {
    try {
      const { author_id, title, content, published } = req.body;

      // Validaciones requeridas
      if (!author_id || !title || title.trim() === '' || !content || content.trim() === '') {
        return res.status(400).json({ error: 'Los campos author_id, title y content son obligatorios' });
      }

      const newPost = await postService.create(author_id, title, content, published);
      res.status(201).json(newPost);
    } catch (error) {
      // Código PostgreSQL si el autor no existe (Violación de Llave Foránea)
      if (error.code === '23503') {
        return res.status(400).json({ error: 'El author_id especificado no existe en la base de datos' });
      }
      res.status(500).json({ error: 'Error al crear el post' });
    }
  },

  // PUT /posts/:id
  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { title, content, published } = req.body;

      if (!title || title.trim() === '' || !content || content.trim() === '') {
        return res.status(400).json({ error: 'Los campos title y content son obligatorios' });
      }

      const updatedPost = await postService.update(id, title, content, published);

      if (!updatedPost) {
        return res.status(404).json({ error: 'Post no encontrado para actualizar' });
      }

      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el post' });
    }
  },

  // DELETE /posts/:id
  async deletePost(req, res) {
    try {
      const { id } = req.params;
      const deletedPost = await postService.remove(id);

      if (!deletedPost) {
        return res.status(404).json({ error: 'Post no encontrado para eliminar' });
      }

      res.status(200).json({ message: 'Post eliminado correctamente', deletedPost });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el post' });
    }
  }
};

module.exports = postController;