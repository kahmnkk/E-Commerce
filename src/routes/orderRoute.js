// Modules
const express = require('express');
const router = express.Router();

// Controllers
const OrderController = require('@src/controllers/orderController');

// GET
router.get('/', OrderController.history);

// POST
router.post('/purchase', OrderController.purchase);
router.post('/refund', OrderController.refund);

module.exports = router;
