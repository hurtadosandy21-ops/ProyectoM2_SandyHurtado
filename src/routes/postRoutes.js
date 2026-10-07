const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Orden pensado para el flujo lógico en Swagger:
// crear → listar → posts de un autor → ver uno → actualizar → eliminar
//
// IMPORTANTE: '/author/:authorId' debe ir ANTES de '/:id'.
// Si fuera después, Express tomaría la palabra "author" como si fuera un id.

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crea un nuevo post
 *     tags: ["Posts"]
 *     description: Crea un post asociado a un autor que ya exista.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       201:
 *         description: Post creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         description: El autor indicado en author_id no existe.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', postController.createPost);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Obtiene la lista de todos los posts
 *     tags: ["Posts"]
 *     responses:
 *       200:
 *         description: Lista de posts obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', postController.getAllPosts);

/**
 * @swagger
 * /posts/author/{authorId}:
 *   get:
 *     summary: Obtiene todos los posts de un autor específico
 *     tags: ["Posts"]
 *     parameters:
 *       - $ref: '#/components/parameters/PostAuthorId'
 *     responses:
 *       200:
 *         description: Lista de posts del autor obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostWithAuthor'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         description: Autor no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/author/:authorId', postController.getPostsByAuthor);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Obtiene el detalle de un post por su ID
 *     tags: ["Posts"]
 *     parameters:
 *       - $ref: '#/components/parameters/PostId'
 *     responses:
 *       200:
 *         description: Post encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', postController.getPostById);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Actualiza un post existente
 *     tags: ["Posts"]
 *     description: Envía solo los campos que quieras cambiar (title, content y/o published).
 *     parameters:
 *       - $ref: '#/components/parameters/PostId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostUpdate'
 *     responses:
 *       200:
 *         description: Post actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', postController.updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Elimina un post
 *     tags: ["Posts"]
 *     parameters:
 *       - $ref: '#/components/parameters/PostId'
 *     responses:
 *       204:
 *         description: Post eliminado correctamente (sin contenido).
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', postController.deletePost);

module.exports = router;
