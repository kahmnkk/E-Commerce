// Modules
const express = require('express');
const router = express.Router();

// Controllers
const ProductController = require('@src/controllers/productController');

// GET

// POST
router.post('/add', ProductController.add);
router.post('/update', ProductController.update);

module.exports = router;
