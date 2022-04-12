// Modules
const express = require('express');
const router = express.Router();

// Controllers
const CustomerController = require('@src/controllers/customerController');

// GET
router.get('/check-duplicate-email', CustomerController.checkDuplicateEmail);

// POST
router.post('/sign-in', CustomerController.signIn);
router.post('/sign-out', CustomerController.signOut);
router.post('/sign-up', CustomerController.signUp);

module.exports = router;
