const pool = require('../config/db');

const authorService = {
  // Obtener todos los autores
  async getAll() {
    const result = await pool.query('SELECT * FROM authors ORDER BY created_at ASC');
    return result.rows;
  },

  // Obtener un autor por ID
  async getById(id) {
    const result = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Crear un nuevo autor
  async create(name, email, bio) {
    const result = await pool.query(
      `INSERT INTO authors (name, email, bio)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, bio ?? null]
    );
    return result.rows[0];
  },

  // Actualizar un autor
  // COALESCE: si email o bio llegan como null, se conserva el valor que ya tenía
  async update(id, name, email, bio) {
    const query = `
      UPDATE authors
      SET name = $1,
          email = COALESCE($2, email),
          bio = COALESCE($3, bio)
      WHERE id = $4
      RETURNING *;
    `;
    const result = await pool.query(query, [name, email, bio, id]);
    return result.rows[0];
  },

  // Eliminar un autor
  async remove(id) {
    const result = await pool.query('DELETE FROM authors WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

module.exports = authorService;
