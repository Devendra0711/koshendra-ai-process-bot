// Sidebar component logic
import { useRouter } from 'vue-router';
import { useChat } from '../../composables/useChat';

export default {
  name: 'Sidebar',
  props: {
    chats: {
      type: Array,
      default: () => []
    },
    currentChatId: {
      type: String,
      default: ''
    },
    isCollapsed: {
      type: Boolean,
      default: false
    }
  },
  emits: ['new-chat', 'select-chat', 'toggle-sidebar', 'delete-chat', 'rename-chat'],
  setup(props, { emit }) {
    const router = useRouter();
    const { clearMessages } = useChat();
    
    function handleNewChat() {
      clearMessages();
      emit('new-chat');
      router.push('/');
    }

    function handleSelectChat(chatId) {
      emit('select-chat', chatId);
    }

    function handleDeleteChat(chatId) {
      emit('delete-chat', chatId);
    }

    function handleRenameChat(chatId) {
      emit('rename-chat', chatId);
    }

    function handleToggleSidebar() {
      emit('toggle-sidebar');
    }

    function goToProducts() {
      router.push('/products');
    }
    
    return {
      handleNewChat,
      handleSelectChat,
      handleDeleteChat,
      handleRenameChat,
      handleToggleSidebar,
      goToProducts
    };
  }
};