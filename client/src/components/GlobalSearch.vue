<template>
  <div class="global-search" v-if="isOpen">
    <div class="search-overlay" @click="close"></div>
    <div class="search-modal">
      <div class="search-header">
        <input 
          ref="searchInput"
          v-model="query"
          type="text"
          placeholder="Search products, modules, questions..."
          @input="handleSearch"
          @keyup.escape="close"
        />
        <button class="close-btn" @click="close">✕</button>
      </div>
      
      <div class="search-results" v-if="query.length > 1">
        <div v-if="isSearching" class="loading">Searching...</div>
        
        <div v-else-if="results.products.length || results.questions.length">
          <!-- Products -->
          <div class="result-section" v-if="results.products.length">
            <h4 class="section-title">Products</h4>
            <div 
              v-for="product in results.products" 
              :key="product.id"
              class="result-item"
              @click="goToProduct(product)"
            >
              <span class="icon">{{ product.icon }}</span>
              <span class="name">{{ product.name }}</span>
            </div>
          </div>
          
          <!-- Questions -->
          <div class="result-section" v-if="results.questions.length">
            <h4 class="section-title">Questions & Topics</h4>
            <div 
              v-for="item in results.questions" 
              :key="item.question.id"
              class="result-item"
              @click="goToQuestion(item)"
            >
              <span class="icon">💬</span>
              <div class="result-content">
                <span class="name">{{ item.question.title }}</span>
                <span class="meta">{{ item.product.name }} › {{ item.module.name }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="no-results">
          No results found for "{{ query }}"
        </div>
      </div>
      
      <div class="search-hint" v-else>
        <p>Type to search across all products and questions</p>
        <p class="shortcut">Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to open search</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { productsData } from '../data/productsData';

export default {
  name: 'GlobalSearch',
  props: {
    isOpen: Boolean
  },
  emits: ['close'],
  setup(props, { emit }) {
    const router = useRouter();
    const searchInput = ref(null);
    const query = ref('');
    const isSearching = ref(false);
    const results = ref({ products: [], questions: [] });

    function close() {
      query.value = '';
      results.value = { products: [], questions: [] };
      emit('close');
    }

    function handleSearch() {
      if (query.value.length < 2) {
        results.value = { products: [], questions: [] };
        return;
      }

      isSearching.value = true;
      const q = query.value.toLowerCase();
      
      // Search products
      const matchedProducts = productsData.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
      
      // Search questions across all products/modules
      const matchedQuestions = [];
      productsData.forEach(product => {
        product.modules.forEach(module => {
          module.questions.forEach(question => {
            if (question.title.toLowerCase().includes(q) || 
                question.query.toLowerCase().includes(q)) {
              matchedQuestions.push({ product, module, question });
            }
          });
        });
      });

      results.value = {
        products: matchedProducts.slice(0, 5),
        questions: matchedQuestions.slice(0, 10)
      };
      
      isSearching.value = false;
    }

    function goToProduct(product) {
      router.push(`/products/${product.id}`);
      close();
    }

    function goToQuestion(item) {
      router.push({
        path: `/products/${item.product.id}/question`,
        query: { q: item.question.query, title: item.question.title }
      });
      close();
    }

    // Focus input when opened
    onMounted(() => {
      if (props.isOpen) {
        nextTick(() => searchInput.value?.focus());
      }
    });

    return {
      searchInput,
      query,
      isSearching,
      results,
      close,
      handleSearch,
      goToProduct,
      goToQuestion
    };
  }
};
</script>

<style scoped>
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.search-modal {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 600px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  z-index: 1000;
  overflow: hidden;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.search-header input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1.1rem;
  padding: 8px;
}

.close-btn {
  padding: 8px 12px;
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 1rem;
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
}

.loading, .no-results {
  padding: 24px;
  text-align: center;
  color: #6b7280;
}

.result-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  padding: 8px 12px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.result-item:hover {
  background: #f3f4f6;
}

.result-item .icon {
  font-size: 1.2rem;
}

.result-item .name {
  font-weight: 500;
  color: #1f2937;
}

.result-content {
  display: flex;
  flex-direction: column;
}

.result-content .meta {
  font-size: 0.8rem;
  color: #9ca3af;
}

.search-hint {
  padding: 32px;
  text-align: center;
  color: #6b7280;
}

.shortcut {
  margin-top: 8px;
  font-size: 0.85rem;
}

.shortcut kbd {
  padding: 2px 6px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-family: inherit;
}
</style>
