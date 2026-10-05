const pool = require('../config/db');

const authorService = {
  // Obtener todos los autores
  async getAll() {
    const result = await pool.query('SELECT * FROM authors ORDER BY id ASC');
    return result.rows;
  },

  // Obtener un autor por ID
  async getById(id) {
    const result = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Crear un nuevo autor
  async create(name, email, bio) {
    const query = `
      INSERT INTO authors (name, email, bio) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;
    const values = [name, email, bio || null];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Actualizar un autor
  async update(id, name, email, bio) {
    const query = `
      UPDATE authors 
      SET name = $1, email = $2, bio = $3 
      WHERE id = $4 
      RETURNING *;
    `;
    const values = [name, email, bio || null, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Eliminar un autor
  async remove(id) {
    const result = await pool.query('DELETE FROM authors WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = authorService;