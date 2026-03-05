import { ref, nextTick, onMounted } from 'vue';

export default {
  name: 'ChatInput',
  props: {
    modelValue: String,
    isLoading: Boolean,
  },
  emits: ['update:modelValue', 'submit', 'new-chat'],
  setup(props, { emit }) {
    const inputRef = ref(null);

    // Auto-focus on mount
    onMounted(() => {
      if (inputRef.value) {
        inputRef.value.focus();
      }
    });

    function handleSubmit() {
      if (props.modelValue?.trim() && !props.isLoading) {
        emit('submit');
        // Keep focus on input after submit
        nextTick(() => {
          if (inputRef.value) {
            inputRef.value.focus();
          }
        });
      }
    }

    return {
      inputRef,
      handleSubmit,
    };
  },
};