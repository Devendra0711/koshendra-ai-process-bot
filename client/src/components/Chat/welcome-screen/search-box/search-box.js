export default {
  props: {
    modelValue: String,
    isLoading: Boolean,
  },
  emits: ['update:modelValue', 'submit'],
};