import MessageItem from './message-item/message-item.vue';
import { ref, watch, nextTick } from 'vue';

export default {
  components: {
    MessageItem,
  },
  props: {
    messages: {
      type: Array,
      required: true,
    },
    isLoading: Boolean,
  },
  setup(props) {
    const messagesContainer = ref(null);

    // Auto-scroll to bottom when messages change
    watch(
      () => props.messages.length,
      async () => {
        await nextTick();
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      }
    );

    // Also scroll when loading state changes
    watch(
      () => props.isLoading,
      async () => {
        await nextTick();
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      }
    );

    return {
      messagesContainer,
    };
  },
};