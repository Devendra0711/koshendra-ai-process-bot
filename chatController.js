const Chat = require('../models/Chat');

// Create new chat
async function createChat(req, res) {
  try {
    const chat = new Chat({
      userId: req.userId,
      title: 'New Chat',
      messages: []
    });
    await chat.save();
    
    res.status(201).json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create chat'
    });
  }
}

// Get all chats for user
async function getUserChats(req, res) {
  try {
    const chats = await Chat.find({ userId: req.userId })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 });
    
    res.json({
      success: true,
      chats
    });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chats'
    });
  }
}

// Get single chat with messages
async function getChat(req, res) {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      userId: req.userId
    });
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    res.json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat'
    });
  }
}

// Add message to chat
async function addMessage(req, res) {
  try {
    const { type, content } = req.body;
    
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      userId: req.userId
    });
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    chat.messages.push({ type, content });
    
    // Auto-generate title from first user message
    if (chat.messages.length === 1 && type === 'user') {
      chat.generateTitle();
    }
    
    await chat.save();
    
    res.json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add message'
    });
  }
}

// Delete chat
async function deleteChat(req, res) {
  try {
    const result = await Chat.deleteOne({
      _id: req.params.chatId,
      userId: req.userId
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Chat deleted'
    });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete chat'
    });
  }
}

module.exports = {
  createChat,
  getUserChats,
  getChat,
  addMessage,
  deleteChat
};
