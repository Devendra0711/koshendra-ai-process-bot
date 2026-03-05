import { ref } from 'vue';
import MessageList from './message-list/message-list.vue';
import ChatInput from './chat-input/chat-input.vue';

export default {
  components: {
    MessageList,
    ChatInput,
  },
  props: {
    messages: {
      type: Array,
      required: true,
    },
    isLoading: Boolean,
  },
  emits: ['submit', 'new-chat'],
  setup(props, { emit }) {
    const question = ref('');

    function handleSubmit() {
      if (question.value.trim()) {
        emit('submit', question.value.trim());
        question.value = '';
      }
    }

    return {
      question,
      handleSubmit,
    };
  },
};