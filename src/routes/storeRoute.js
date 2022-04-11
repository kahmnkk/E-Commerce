// Modules
const express = require('express');
const router = express.Router();

// Controllers
const StoreController = require('@src/controllers/storeController');

// GET
router.get('/', StoreController.get);

// POST
router.post('/add', StoreController.add);
router.post('/update', StoreController.update);

module.exports = router;
