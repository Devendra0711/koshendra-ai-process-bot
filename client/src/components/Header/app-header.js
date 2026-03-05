
import { computed } from 'vue';

export default {
  name: 'AppHeader',
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  emits: ['logout'],
  setup(props) {
    const userName = computed(() => props.user?.name || 'Guest');
    const userInitial = computed(() => {
      const name = props.user?.name || 'G';
      return name.charAt(0).toUpperCase();
    });

    return {
      userName,
      userInitial
    };
  }
};
