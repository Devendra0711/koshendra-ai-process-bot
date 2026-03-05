import { ref } from 'vue';
import api from '../services/api';

// Singleton state - shared across all components
const chats = ref([]);
const currentChat = ref(null);
const isLoading = ref(false);

export function useChatStore() {
  async function fetchChats() {
    try {
      isLoading.value = true;
      const { data } = await api.get('/chats');
      // Handle both { chats: [...] } and direct array response
      chats.value = data.chats || data;
    } catch (err) {
      console.error('Failed to fetch chats:', err);
    } finally {
      isLoading.value = false;
    }
  }

  // Load a specific chat
  async function selectChat(chatId) {
    try {
      const {data} = await api.get(`/chats/${chatId}`);
      currentChat.value = data;
    } catch (err) {
      console.error('Failed to select chat:', err);
    }
  }

  // Create new chat
  async function createChat(title = 'New Chat') {
    try {
      const { data } = await api.post('/chats', { title });
      chats.value.unshift(data);
      currentChat.value = data;
      return data;
    } catch (err) {
      console.error('Failed to create chat:', err);
    }
  }

  // Delete chat
  async function deleteChat(chatId) {
    try {
      await api.delete(`/chats/${chatId}`);
      chats.value = chats.value.filter(c => c._id !== chatId);
      if (currentChat.value?._id === chatId) {
        currentChat.value = null;
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  }

  // Rename chat
  async function renameChat(chatId, newTitle) {
    // try {
    //   const { data } = await api.put(`/chats/${chatId}`, { title: newTitle });
    //   const index = chats.value.findIndex(c => c._id === chatId);
    //   if(index !== -1){
    //     chats.value[index] = data;
    //   }
    //   if(currentChat.value?._id === chatId){
    //     currentChat.value = data;
    //   }
    // } catch (err) {
    //   console.error('Failed to rename chat:', err);
    // }
    console.log('Rename chat not yet supported')
  }

  return {
    chats,
    currentChat,
    isLoading,
    fetchChats,
    selectChat,
    createChat,
    deleteChat,
    renameChat
  };
}
