const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../controllers/authController');
const {
  createChat,
  getUserChats,
  getChat,
  addMessage,
  deleteChat
} = require('../controllers/chatController');

// All routes require authentication
router.use(authMiddleware);

// Chat routes
router.post('/', createChat);           // Create new chat
router.get('/', getUserChats);          // Get all user's chats
router.get('/:chatId', getChat);        // Get single chat
router.post('/:chatId/messages', addMessage);  // Add message to chat
router.delete('/:chatId', deleteChat);  // Delete chat

module.exports = router;
