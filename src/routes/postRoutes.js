const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// 1. Rutas específicas primero
router.get('/', postController.getAllPosts);
router.get('/author/:authorId', postController.getPostsByAuthor);

// 2. Rutas dinámicas por ID después
router.get('/:id', postController.getPostById);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;