const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Obtiene la lista de todos los autores
 *     tags: ["Autores"]
 *     responses:
 *       200:
 *         description: Lista de autores obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', authorController.getAllAuthors);

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Obtiene el detalle de un autor por su ID
 *     tags: ["Autores"]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorId'
 *     responses:
 *       200:
 *         description: Autor encontrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', authorController.getAuthorById);

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Crea un nuevo autor
 *     tags: ["Autores"]
 *     description: Registra un autor validando que el nombre no esté vacío y que el email tenga formato válido y sea único. El email se guarda en minúsculas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorInput'
 *     responses:
 *       201:
 *         description: Autor creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', authorController.createAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Actualiza un autor existente
 *     tags: ["Autores"]
 *     description: name es obligatorio; email y bio son opcionales (si no se envían, se conservan).
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorUpdate'
 *     responses:
 *       200:
 *         description: Autor actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', authorController.updateAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Elimina un autor
 *     tags: ["Autores"]
 *     description: Elimina el autor y, por ON DELETE CASCADE, también todos sus posts.
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorId'
 *     responses:
 *       204:
 *         description: Autor eliminado correctamente (sin contenido).
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', authorController.deleteAuthor);

module.exports = router;
