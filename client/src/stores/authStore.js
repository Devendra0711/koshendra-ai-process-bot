import { reactive, computed } from 'vue';
import api from '../services/api';

// Current user state
const state = reactive({
  currentUser: null,
  token: null,
  isAuthenticated: false
});

// Check localStorage for existing session
function initAuth() {
  const savedToken = localStorage.getItem('token');
  const savedUser = localStorage.getItem('currentUser');
  if (savedToken && savedUser) {
    try {
      state.token = savedToken;
      state.currentUser = JSON.parse(savedUser);
      state.isAuthenticated = true;
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
  }
}

// Initialize on load
initAuth();

export function useAuthStore() {
  const currentUser = computed(() => state.currentUser);
  const isAuthenticated = computed(() => state.isAuthenticated);
  const token = computed(() => state.token);
  const isAdmin = computed(() => state.currentUser?.role === 'admin');

  async function login(email, password) {
    try {
      const { data } = await api.post('/auth/login', { email, password });

      if (data.success) {
        state.currentUser = data.user;
        state.token = data.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }

      return { success: false, message: data.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.response?.data?.message || 'Network error. Please try again.' };
    }
  }

  async function register(name, email, password) {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });

      if (data.success) {
        state.currentUser = data.user;
        state.token = data.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }

      return { success: false, message: data.message };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: error.response?.data?.message || 'Network error. Please try again.' };
    }
  }

  function logout() {
    state.currentUser = null;
    state.token = null;
    state.isAuthenticated = false;
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  // Verify token with backend
  async function verifyToken() {
    if (!state.token) return false;

    try {
      const { data } = await api.get('/auth/me');

      if (data.success) {
        state.currentUser = data.user;
        state.isAuthenticated = true;
        return true;
      }

      logout();
      return false;
    } catch (error) {
      logout();
      return false;
    }
  }

  return {
    currentUser,
    isAuthenticated,
    token,
    isAdmin,
    login,
    register,
    logout,
    verifyToken
  };
}
