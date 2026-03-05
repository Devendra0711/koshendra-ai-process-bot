export default {
  props: {
    suggestions: {
      type: Array,
      required: true,
    },
  },
  emits: ['select'],
};