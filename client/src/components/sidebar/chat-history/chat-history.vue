<template>
  <div class="chat-history">
    <h3 class="section-title">CHAT HISTORY</h3>
    <div class="chat-list" v-if="chats.length > 0">
      <div 
        v-for="chat in chats" 
        :key="chat._id"
        class="chat-item"
        :class="{ active: currentChat?._id === chat._id }"
        @click="selectChat(chat._id)"
      >
        <span class="chat-title">{{ chat.title }}</span>
        <button class="delete-btn" @click.stop="handleDelete(chat._id)">×</button>
      </div>
    </div>
    <div v-else class="no-chats">
      <p>No chat history yet</p>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useChatStore } from '../../../stores/chatStore';

export default {
  name: 'ChatHistory',
  setup() {
    const chatStore = useChatStore();

    onMounted(() => {
      chatStore.fetchChats();
    });

    async function selectChat(chatId) {
      await chatStore.loadChat(chatId);
    }

    async function handleDelete(chatId) {
      if (confirm('Delete this chat?')) {
        await chatStore.deleteChat(chatId);
      }
    }

    return {
      chats: chatStore.chats,
      currentChat: chatStore.currentChat,
      selectChat,
      handleDelete
    };
  }
};
</script>

<style scoped>
.chat-history {
  padding: 16px 12px;
  flex: 1;
  overflow-y: auto;
}

.section-title {
  font-size: 0.7rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-left: 12px;
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.chat-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.chat-item.active {
  background: rgba(99, 102, 241, 0.3);
}

.chat-title {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.delete-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 4px;
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;
}

.chat-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  color: #ef4444;
}

.no-chats {
  padding: 12px;
  text-align: center;
}

.no-chats p {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
}
</style>