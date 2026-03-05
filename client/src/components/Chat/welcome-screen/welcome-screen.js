import { ref, computed, nextTick, onMounted } from 'vue';
import { useAuthStore } from '../../../stores/authStore';

export default {
  name: 'WelcomeScreen',
  props: {
    isLoading: Boolean,
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const authStore = useAuthStore();
    const question = ref('');
    const inputRef = ref(null);

    const userName = computed(() => {
      return authStore.currentUser.value?.name || 'Guest';
    });

    const suggestions = [
      'What happens when an order is created?',
      'How does shipment work?',
      'When is billing triggered?',
      'What if payment fails?',
    ];

    // Auto-focus on mount
    onMounted(() => {
      nextTick(() => {
        if (inputRef.value) {
          inputRef.value.focus();
        }
      });
    });

    function handleSubmit() {
      if (question.value.trim() && !props.isLoading) {
        emit('submit', question.value.trim());
        question.value = '';
      }
    }

    function selectSuggestion(text) {
      if (!props.isLoading) {
        emit('submit', text);
      }
    }

    return {
      question,
      inputRef,
      userName,
      suggestions,
      handleSubmit,
      selectSuggestion,
    };
  },
};