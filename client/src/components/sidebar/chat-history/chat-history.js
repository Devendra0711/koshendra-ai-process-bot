import { ref } from 'vue';

// Chat history composable
export function useChatHistory() {
  const chatHistory = ref([]);
  const activeChatIndex = ref(null);

  function addChat(title, messages) {
    chatHistory.value.push({
      id: Date.now(),
      title,
      messages: [...messages],
      createdAt: new Date(),
    });
    activeChatIndex.value = chatHistory.value.length - 1;
  }

  function updateChat(index, messages) {
    if (chatHistory.value[index]) {
      chatHistory.value[index].messages = [...messages];
    }
  }

  function deleteChat(index) {
    chatHistory.value.splice(index, 1);
    if (activeChatIndex.value === index) {
      activeChatIndex.value = null;
    } else if (activeChatIndex.value > index) {
      activeChatIndex.value--;
    }
  }

  function loadChat(index) {
    activeChatIndex.value = index;
    return chatHistory.value[index]?.messages || [];
  }

  function startNewChat() {
    activeChatIndex.value = null;
  }

  return {
    chatHistory,
    activeChatIndex,
    addChat,
    updateChat,
    deleteChat,
    loadChat,
    startNewChat,
  };
}

export default {
  name: 'ChatHistory',
  emits: ['load-chat', 'clear-chat'],
  setup(props, { emit }) {
    const { chatHistory, activeChatIndex, deleteChat, loadChat } = useChatHistory();
    const openMenuIndex = ref(null);

    function toggleMenu(index) {
      openMenuIndex.value = openMenuIndex.value === index ? null : index;
    }

    function handleLoadChat(index) {
      const messages = loadChat(index);
      emit('load-chat', messages);
    }

    function handleDelete(index) {
      deleteChat(index);
      emit('clear-chat');
      openMenuIndex.value = null;
    }

    return {
      chatHistory,
      activeChatIndex,
      openMenuIndex,
      toggleMenu,
      handleLoadChat,
      handleDelete,
    };
  },
};