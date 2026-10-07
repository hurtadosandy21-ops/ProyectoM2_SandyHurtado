const request = require('supertest');
const app = require('../app');
const pool = require('../src/config/db');

const UUID_INEXISTENTE = '00000000-0000-4000-8000-000000000000';
const emailUnico = (prefijo) => `${prefijo}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@example.com`;

describe('API MiniBlog', () => {
  let authorId;
  let postId;

  afterAll(async () => {
    await pool.query("DELETE FROM authors WHERE email LIKE '%\\_test\\_%@example.com'");
    await pool.end();
  });

  describe('Authors', () => {
    it('POST /authors crea un autor (201) y guarda el email en minúsculas', async () => {
      const email = emailUnico('Autor_test_');
      const res = await request(app)
        .post('/authors')
        .send({ name: 'Test Author', email, bio: 'Bio generada por el test' });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ name: 'Test Author', email: email.toLowerCase() });
      expect(res.body).toHaveProperty('id');
      authorId = res.body.id;
    });

    it('POST /authors falla si falta el nombre (400)', async () => {
      const res = await request(app).post('/authors').send({ email: emailUnico('sin_nombre_test_') });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('El nombre no puede estar vacío');
    });

    it('POST /authors falla si el email no tiene formato válido (400)', async () => {
      const res = await request(app).post('/authors').send({ name: 'Sin arroba', email: 'correo-invalido' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('El email no tiene un formato válido');
    });

    it('POST /authors falla si el email ya está registrado (409)', async () => {
      const email = emailUnico('dup_test_');
      await request(app).post('/authors').send({ name: 'Original', email });

      const res = await request(app).post('/authors').send({ name: 'Copia', email: email.toUpperCase() });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe('El email ya está registrado');
    });

    it('GET /authors lista los autores (200) e incluye el creado', async () => {
      const res = await request(app).get('/authors');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some((a) => a.id === authorId)).toBe(true);
    });

    it('GET /authors/:id devuelve el autor (200)', async () => {
      const res = await request(app).get(`/authors/${authorId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(authorId);
    });

    it('GET /authors/:id responde 404 si el autor no existe', async () => {
      const res = await request(app).get(`/authors/${UUID_INEXISTENTE}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Autor no encontrado');
    });

    it('GET /authors/:id responde 400 si el ID no es un UUID', async () => {
      const res = await request(app).get('/authors/abc');

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('El ID tiene un formato inválido');
    });

    it('PUT /authors/:id actualiza el autor y conserva el email si no se envía (200)', async () => {
      const antes = await request(app).get(`/authors/${authorId}`);
      const res = await request(app).put(`/authors/${authorId}`).send({ name: 'Autor Editado', bio: 'Nueva bio' });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: 'Autor Editado', bio: 'Nueva bio', email: antes.body.email });
    });

    it('PUT /authors/:id falla si el nombre está vacío (400)', async () => {
      const res = await request(app).put(`/authors/${authorId}`).send({ name: '   ' });

      expect(res.status).toBe(400);
    });

    it('PUT /authors/:id responde 404 si el autor no existe', async () => {
      const res = await request(app).put(`/authors/${UUID_INEXISTENTE}`).send({ name: 'Nadie' });

      expect(res.status).toBe(404);
    });
  });

  describe('Posts', () => {
    it('POST /posts crea un post del autor (201) con published=false por defecto', async () => {
      const res = await request(app)
        .post('/posts')
        .send({ title: 'Título de prueba', content: 'Contenido del test', author_id: authorId });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ author_id: authorId, title: 'Título de prueba', published: false });
      postId = res.body.id;
    });

    it('POST /posts falla si faltan campos obligatorios (400)', async () => {
      const res = await request(app).post('/posts').send({ title: 'Falta contenido y autor' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Los campos title, content y author_id son obligatorios');
    });

    it('POST /posts falla si published no es booleano (400)', async () => {
      const res = await request(app)
        .post('/posts')
        .send({ title: 'T', content: 'C', author_id: authorId, published: 'si' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('El campo published debe ser true o false');
    });

    it('POST /posts responde 404 si el author_id no existe', async () => {
      const res = await request(app)
        .post('/posts')
        .send({ title: 'Post fantasma', content: 'Este autor no existe', author_id: UUID_INEXISTENTE });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('El autor indicado en author_id no existe');
    });

    it('GET /posts lista los posts (200)', async () => {
      const res = await request(app).get('/posts');

      expect(res.status).toBe(200);
      expect(res.body.some((p) => p.id === postId)).toBe(true);
    });

    it('GET /posts/:id devuelve el post (200)', async () => {
      const res = await request(app).get(`/posts/${postId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(postId);
    });

    it('GET /posts/author/:authorId lista los posts del autor con sus datos (200)', async () => {
      const res = await request(app).get(`/posts/author/${authorId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].author_id).toBe(authorId);
      expect(res.body[0].author.id).toBe(authorId);
    });

    it('GET /posts/author/:authorId responde 404 si el autor no existe', async () => {
      const res = await request(app).get(`/posts/author/${UUID_INEXISTENTE}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Autor no encontrado');
    });

    it('PUT /posts/:id actualiza el post (200)', async () => {
      const res = await request(app)
        .put(`/posts/${postId}`)
        .send({ title: 'Título editado', content: 'Contenido editado', published: true });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ title: 'Título editado', content: 'Contenido editado', published: true });
    });

    it('PUT /posts/:id falla si falta el content (400)', async () => {
      const res = await request(app).put(`/posts/${postId}`).send({ title: 'Solo título' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Los campos title y content son obligatorios');
    });

    it('DELETE /posts/:id elimina el post (204) y luego responde 404', async () => {
      const del = await request(app).delete(`/posts/${postId}`);
      expect(del.status).toBe(204);

      const get = await request(app).get(`/posts/${postId}`);
      expect(get.status).toBe(404);
      expect(get.body.error).toBe('Post no encontrado');
    });
  });

  describe('Eliminación de autores y errores generales', () => {
    it('DELETE /authors/:id elimina el autor y sus posts por CASCADE (204)', async () => {
      const post = await request(app)
        .post('/posts')
        .send({ title: 'Post huérfano', content: 'Se borra con el autor', author_id: authorId });

      const res = await request(app).delete(`/authors/${authorId}`);
      expect(res.status).toBe(204);

      const author = await request(app).get(`/authors/${authorId}`);
      expect(author.status).toBe(404);
      const postBorrado = await request(app).get(`/posts/${post.body.id}`);
      expect(postBorrado.status).toBe(404);
    });

    it('DELETE /authors/:id responde 404 si el autor no existe', async () => {
      const res = await request(app).delete(`/authors/${UUID_INEXISTENTE}`);

      expect(res.status).toBe(404);
    });

    it('responde 400 si el JSON del body está mal formado', async () => {
      const res = await request(app)
        .post('/authors')
        .set('Content-Type', 'application/json')
        .send('{"name": "Roto",}');

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('El JSON enviado no es válido');
    });

    it('responde 404 en una ruta que no existe', async () => {
      const res = await request(app).get('/ruta-inexistente');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Ruta no encontrada');
    });
  });
});
