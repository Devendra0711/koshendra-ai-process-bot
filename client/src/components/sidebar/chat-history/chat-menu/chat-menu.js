export default {
  name: 'ChatMenu',
  props: {
    chat: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  emits: ['share', 'rename', 'pin', 'archive', 'delete'],
};