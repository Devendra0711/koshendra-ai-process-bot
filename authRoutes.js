const express = require('express');
const router = express.Router();
const { register, login, getMe, authMiddleware } = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, getMe);

module.exports = router;
