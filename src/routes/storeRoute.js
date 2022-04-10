// Modules
const express = require('express');
const router = express.Router();

// Controllers
const StoreController = require('@src/controllers/storeController');

// GET

// POST
router.post('/add', StoreController.add);

module.exports = router;
