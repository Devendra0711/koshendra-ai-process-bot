import { ref, reactive } from 'vue';
import { useAuthStore } from '../../stores/authStore';

export default {
  name: 'AuthModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'authenticated'],
  setup(props, { emit }) {
    const authStore = useAuthStore();
    const isLogin = ref(true);
    const isSubmitting = ref(false);
    const showPassword = ref(false);
    const error = ref('');

    const form = reactive({
      name: '',
      email: '',
      password: ''
    });

    function toggleMode() {
      isLogin.value = !isLogin.value;
      error.value = '';
      showPassword.value = false;
      form.name = '';
      form.email = '';
      form.password = '';
    }

    async function handleSubmit() {
      error.value = '';
      isSubmitting.value = true;

      try {
        if (isLogin.value) {
          // Login
          const result = await authStore.login(form.email, form.password);
          if (result.success) {
            emit('authenticated', result.user);
            emit('close');
          } else {
            error.value = result.message;
          }
        } else {
          // Register
          if (!form.name.trim()) {
            error.value = 'Please enter your name';
            isSubmitting.value = false;
            return;
          }
          const result = await authStore.register(form.name, form.email, form.password);
          if (result.success) {
            emit('authenticated', result.user);
            emit('close');
          } else {
            error.value = result.message;
          }
        }
      } catch (err) {
        error.value = 'An error occurred. Please try again.';
      }

      isSubmitting.value = false;
    }

    return {
      isLogin,
      isSubmitting,
      showPassword,
      error,
      form,
      toggleMode,
      handleSubmit
    };
  }
};
