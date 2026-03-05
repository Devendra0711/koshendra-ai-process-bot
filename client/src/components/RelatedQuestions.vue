<template>
  <div class="related-questions" v-if="questions.length > 0">
    <h4 class="related-title">{{ title }}</h4>
    <div class="questions-list">
      <button 
        v-for="question in questions" 
        :key="question"
        class="question-chip"
        @click="$emit('ask', question)"
      >
        {{ question }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RelatedQuestions',
  props: {
    questions: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: 'Related Questions'
    }
  },
  emits: ['ask']
};
</script>

<style scoped>
.related-questions {
  margin-top: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.related-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 12px;
}

.questions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.question-chip {
  padding: 8px 14px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
}

.question-chip:hover {
  border-color: #6366f1;
  color: #6366f1;
  background: #eef2ff;
}
</style>
