// Main chat composable for API calls
import { ref } from 'vue';
import api from '../services/api';

const MAX_MESSAGE_LENGTH = 2000;

// Singleton state
const messages = ref([]);
const isLoading = ref(false);
const error = ref(null);
const currentChatId = ref(null);

export function useChat() {
  function clearMessages() {
    messages.value = [];
    error.value = null;
    currentChatId.value = null;
  }

  function addMessage(role, content) {
    messages.value.push({
      _id: Date.now().toString(),
      role,
      content,
      timestamp: new Date().toISOString()
    });
  }

  // Create a new chat in backend
  async function createChat(title) {
    try {
      console.log('Creating chat with title:', title);
      const { data } = await api.post('/chats', { title });
      console.log('Created chat:', data);
      currentChatId.value = data._id;
      return data;
    } catch (err) {
      console.error('Failed to create chat:', err);
    }
    return null;
  }

  // Save messages to chat in backend
  async function saveMessagesToChat(chatId) {
    try {
      await api.post(`/chats/${chatId}/messages`, {
        messages: messages.value.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp
        }))
      });
    } catch (err) {
      console.error('Failed to save messages:', err);
    }
  }

  async function sendMessage(text) {
    // Validate input
    if (!text || typeof text !== 'string') {
      error.value = 'Please enter a message';
      return;
    }
    
    const trimmedText = text.trim();
    
    // Check for empty or whitespace only
    if (!trimmedText) {
      error.value = 'Message cannot be empty';
      return;
    }
    
    // Check for very long messages
    if (trimmedText.length > MAX_MESSAGE_LENGTH) {
      error.value = `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.`;
      return;
    }
    
    // Check for only special characters
    if (!/[a-zA-Z0-9]/.test(trimmedText)) {
      error.value = 'Please enter a valid message with some text';
      return;
    }

    error.value = null;
    isLoading.value = true;

    // Create chat if first message
    if (!currentChatId.value && messages.value.length === 0) {
      // Use first 50 chars of question as chat title
      const chatTitle = trimmedText.length > 50 
        ? trimmedText.substring(0, 50) + '...' 
        : trimmedText;
      console.log('Creating chat with title:', chatTitle);
      await createChat(chatTitle);
    }

    // Add user message
    addMessage('user', trimmedText);

    try {
      // Build conversation history from existing messages
      const conversationHistory = messages.value.slice(0, -1).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data } = await api.post('/ask', {
        question: trimmedText,
        conversationHistory: conversationHistory
      });

      console.log('Response data:', data);

      // Add AI response
      addMessage('assistant', data.answer);
      
      // Save messages to chat in backend
      if (currentChatId.value) {
        await saveMessagesToChat(currentChatId.value);
      }
      
      return data;
    } catch (err) {
      console.error('API Error:', err);
      error.value = err.message || 'Failed to get response. Please try again.';
      // Remove user message on error
      messages.value.pop();
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    messages,
    isLoading,
    error,
    currentChatId,
    sendMessage,
    clearMessages,
    addMessage,
    createChat
  };
}
