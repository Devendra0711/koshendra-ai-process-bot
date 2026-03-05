<template>
  <header class="header">
    <div class="header-left">
      <h1 class="logo">Koshendra</h1>
      <span class="tagline">Central Command of Your Resources</span>
    </div>
    
    <div class="header-center">
      <button class="search-trigger" @click="openSearch">
        <span class="search-icon">🔍</span>
        <span class="search-text">Search...</span>
        <span class="search-shortcut">Ctrl+K</span>
      </button>
    </div>
    
    <div class="header-right">
      <div class="user-info">
        <div class="user-avatar">{{ userInitials }}</div>
        <span class="user-name">{{ userName }}</span>
      </div>
    </div>
    
    <!-- Global Search Modal -->
    <GlobalSearch :isOpen="isSearchOpen" @close="closeSearch" />
  </header>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import GlobalSearch from '../GlobalSearch.vue';

export default {
  name: 'Header',
  components: {
    GlobalSearch
  },
  setup() {
    const userName = ref('Devendra jha');
    const isSearchOpen = ref(false);
    
    const userInitials = ref(
      userName.value.split(' ').map(n => n[0]).join('').toUpperCase()
    );

    function openSearch() {
      isSearchOpen.value = true;
    }

    function closeSearch() {
      isSearchOpen.value = false;
    }

    // Keyboard shortcut
    function handleKeydown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isSearchOpen.value = !isSearchOpen.value;
      }
    }

    onMounted(() => {
      window.addEventListener('keydown', handleKeydown);
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeydown);
    });

    return {
      userName,
      userInitials,
      isSearchOpen,
      openSearch,
      closeSearch
    };
  }
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.tagline {
  font-size: 0.85rem;
  color: #6b7280;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 24px;
}

.search-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  min-width: 240px;
  transition: all 0.15s;
}

.search-trigger:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.search-icon {
  font-size: 0.9rem;
}

.search-text {
  flex: 1;
  text-align: left;
  color: #9ca3af;
  font-size: 0.9rem;
}

.search-shortcut {
  font-size: 0.75rem;
  color: #9ca3af;
  background: #ffffff;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #6366f1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
}

.user-name {
  font-size: 0.9rem;
  color: #374151;
}

@media (max-width: 768px) {
  .header-center {
    display: none;
  }
  
  .tagline {
    display: none;
  }
}
</style>
