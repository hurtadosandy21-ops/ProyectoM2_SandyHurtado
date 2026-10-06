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
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                   name:
 *                     type: string
 *                     example: "Sandy Hurtado"
 *                   email:
 *                     type: string
 *                     example: "sandy@example.com"
 *                   bio:
 *                     type: string
 *                     example: "Desarrolladora Full Stack"
 */
router.get('/', authorController.getAllAuthors);


/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Obtiene el detalle de un autor por su ID
 *     tags: ["Autores"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del autor
 *     responses:
 *       200:
 *         description: Autor encontrado exitosamente.
 *       404:
 *         description: Autor no encontrado.
 */
router.get('/:id', authorController.getAuthorById);

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Crea un nuevo autor
 *     tags: ["Autores"]
 *     description: Registra un autor validando que el nombre no esté vacío y el email sea único.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sandy Hurtado"
 *               email:
 *                 type: string
 *                 example: "Sandy@example.com"
 *               bio:
 *                 type: string
 *                 example: "Desarrolladora Full Stack 79"
 *     responses:
 *       201:
 *         description: Autor creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
 *                 name:
 *                   type: string
 *                   example: "Sandy Hurtado"
 *                 email:
 *                   type: string
 *                   example: "Sandy@example.com"
 *                 bio:
 *                   type: string
 *                   example: "Desarrolladora Full Stack 79"
 *       400:
 *         description: Datos inválidos o email duplicado.
 */
router.post('/', authorController.createAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Actualiza un autor existente
 *     tags: ["Autores"]
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autor actualizado correctamente.
 *       404:
 *         description: Autor no encontrado.
 */
router.put('/:id', authorController.updateAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Elimina un autor
 *     tags: ["Autores"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Autor eliminado correctamente.
 *       404:
 *         description: Autor no encontrado.
 */
router.delete('/:id', authorController.deleteAuthor);

module.exports = router;