const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

/**
 * @swagger
 * /posts/author/{authorId}:
 *   get:
 *     summary: Obtiene todos los posts de un autor específico
 *     tags: ["Posts"]
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: El ID único del autor
 *     responses:
 *       200:
 *         description: Lista de posts del autor obtenida con éxito.
 *       404:
 *         description: Autor no encontrado.
 */
router.get('/author/:authorId', postController.getPostsByAuthor);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Obtiene la lista de todos los posts
 *     tags: ["Posts"]
 *     responses:
 *       200:
 *         description: Lista de posts obtenida con éxito.
 */
router.get('/', postController.getAllPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Obtiene el detalle de un post por su ID
 *     tags: ["Posts"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Post encontrado.
 *       404:
 *         description: Post no encontrado.
 */
router.get('/:id', postController.getPostById);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crea un nuevo post
 *     tags: ["Posts"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - author_id
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Mi primer post en MiniBlog"
 *               content:
 *                 type: string
 *                 example: "Contenido interesante de desarrollo web."
 *               author_id:
 *                 type: string
 *                 format: uuid
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *     responses:
 *       201:
 *         description: Post creado con éxito.
 *       400:
 *         description: Faltan campos obligatorios.
 */
router.post('/', postController.createPost);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Actualiza un post existente
 *     tags: ["Posts"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               published:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Post actualizado.
 *       404:
 *         description: Post no encontrado.
 */
router.put('/:id', postController.updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Elimina un post
 *     tags: ["Posts"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Post eliminado correctamente.
 *       404:
 *         description: Post no encontrado.
 */
router.delete('/:id', postController.deletePost);

module.exports = router;