// Modules
const express = require('express');
const router = express.Router();

// Controllers
const CustomerController = require('@src/controllers/customerController');

// GET

// POST
router.post('/sign-in', CustomerController.signIn);
router.post('/sign-up', CustomerController.signUp);
router.post('/check-duplicate-email', CustomerController.checkDuplicateEmail);

module.exports = router;
