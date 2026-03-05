<template>
  <div class="question-view">
    <!-- Product not found -->
    <div v-if="!product" class="not-found">
      <h2>Product Not Found</h2>
      <p>The product you're looking for doesn't exist.</p>
      <router-link to="/products" class="back-link">← Back to Products</router-link>
    </div>
    
    <template v-else>
      <div class="question-header">
        <div class="breadcrumb">
          <button class="back-btn" @click="goBack">← Back</button>
          <span class="sep">|</span>
          <router-link to="/products" class="breadcrumb-item">Explore Products</router-link>
          <span class="separator">›</span>
          <router-link :to="`/products/${productId}`" class="breadcrumb-item">{{ product?.name }}</router-link>
          <span class="separator">›</span>
          <span class="breadcrumb-item active">{{ questionTitle }}</span>
        </div>
      </div>
      
      <div class="question-content">
        <div class="question-box">
          <h2 class="question-title">{{ questionTitle }}</h2>
        </div>
        
        <div class="response-box">
          <div v-if="isLoading" class="loading">
            <div class="typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>Generating response...</p>
          </div>
          <div v-else class="response-content" v-html="formattedResponse"></div>
        </div>
        
        <div class="follow-up">
          <input 
            v-model="followUpQuestion"
            type="text" 
            placeholder="Ask a follow-up question..."
            @keyup.enter="askFollowUp"
            :disabled="isLoading"
          />
          <button @click="askFollowUp" :disabled="isLoading || !followUpQuestion.trim()">
            ↑
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { productsData } from '../data/productsData';
import api from '../services/api';

export default {
  name: 'QuestionView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    const response = ref('');
    const followUpQuestion = ref('');
    const isLoading = ref(false);
    const productId = computed(() => route.params.productId);
    const questionTitle = computed(() => route.query.title || 'Question');
    const questionQuery = computed(() => route.query.q || '');
    
    const product = computed(() => {
      return productsData.find(p => p.id === productId.value);
    });
    
    function goBack() {
      if (window.history.length > 2) {
        router.back();
      } else {
        router.push(`/products/${productId.value}`);
      }
    }
    
    function parseMarkdown(text) {
      if (!text) return '';
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^### (.+)$/gm, '<h4>$1</h4>')
        .replace(/^## (.+)$/gm, '<h3>$1</h3>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n/g, '<br>');
    }
    
    const formattedResponse = computed(() => parseMarkdown(response.value));
    
    async function fetchAnswer(question) {
      isLoading.value = true;
      try {
        const { data } = await api.post('/ask', { question });
        response.value = data.answer;
      } catch (error) {
        response.value = '❌ **Error**\n\nSorry, there was an error fetching the response. Please try again.';
      } finally {
        isLoading.value = false;
      }
    }
    
    async function askFollowUp() {
      if (!followUpQuestion.value.trim()) return;
      const question = followUpQuestion.value;
      followUpQuestion.value = '';
      response.value = '';
      await fetchAnswer(question);
    }
    
    onMounted(() => {
      if (questionQuery.value) {
        fetchAnswer(questionQuery.value);
      }
    });
    
    watch(questionQuery, (newQuery) => {
      if (newQuery) {
        response.value = '';
        fetchAnswer(newQuery);
      }
    });
    
    return {
      productId,
      product,
      questionTitle,
      response,
      formattedResponse,
      isLoading,
      followUpQuestion,
      askFollowUp,
      goBack
    };
  }
};
</script>

<style scoped>
.question-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
  overflow: hidden;
}

.question-header {
  padding: 16px 24px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.breadcrumb-item {
  color: #6b7280;
  text-decoration: none;
}

.breadcrumb-item:hover:not(.active) {
  color: #6366f1;
}

.breadcrumb-item.active {
  color: #1f2937;
  font-weight: 500;
}

.back-btn {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
}

.back-btn:hover {
  text-decoration: underline;
}

.sep {
  color: #d1d5db;
  margin: 0 8px;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #6b7280;
  flex: 1;
}

.not-found h2 {
  color: #1f2937;
  margin-bottom: 8px;
}

.back-link {
  margin-top: 16px;
  color: #6366f1;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.separator {
  color: #9ca3af;
}

.question-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow-y: auto;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.question-box {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
}

.question-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.response-box {
  flex: 1;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 16px;
  overflow-y: auto;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #6b7280;
}

.typing {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}

.typing span {
  width: 8px;
  height: 8px;
  background: #6366f1;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.typing span:nth-child(1) { animation-delay: -0.32s; }
.typing span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.response-content {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #374151;
}

.response-content :deep(h3),
.response-content :deep(h4) {
  margin: 16px 0 8px;
  color: #1f2937;
}

.response-content :deep(ul) {
  margin: 8px 0;
  padding-left: 20px;
}

.response-content :deep(li) {
  margin: 4px 0;
}

.response-content :deep(code) {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

.response-content :deep(strong) {
  color: #1f2937;
}

.follow-up {
  display: flex;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 8px 12px;
}

.follow-up input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.95rem;
  padding: 8px;
}

.follow-up button {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #6366f1;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
}

.follow-up button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .question-content {
    padding: 16px;
  }
}
</style>
