const pool = require('../config/db');

const postService = {
  // Obtener todos los posts
  async getAll() {
    const result = await pool.query('SELECT * FROM posts ORDER BY created_at ASC');
    return result.rows;
  },

  // Obtener un post por ID
  async getById(id) {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Obtener posts de un autor específico con información del autor
  async getByAuthorId(authorId) {
    const query = `
      SELECT p.*, json_build_object('id', a.id, 'name', a.name, 'email', a.email) AS author
      FROM posts p
      JOIN authors a ON p.author_id = a.id
      WHERE p.author_id = $1
      ORDER BY p.created_at ASC;
    `;
    const result = await pool.query(query, [authorId]);
    return result.rows;
  },

  // Crear un nuevo post
  async create(author_id, title, content, published) {
    // Sin try/catch aquí para que el error original de Postgres suba intacto
    const query =
      'INSERT INTO posts (author_id, title, content, published) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [author_id, title, content, published ?? false];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Actualizar un post
  // COALESCE: si published llega como null, se conserva el valor que ya tenía
  async update(id, title, content, published) {
    const query = `
      UPDATE posts
      SET title = $1,
          content = $2,
          published = COALESCE($3, published)
      WHERE id = $4
      RETURNING *;
    `;
    const values = [title, content, published ?? null, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Eliminar un post
  async remove(id) {
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

module.exports = postService;
