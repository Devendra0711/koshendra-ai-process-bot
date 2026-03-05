<template>
  <div class="product-detail">
    <div v-if="!product" class="not-found">
      <h2>Product Not Found</h2>
      <router-link to="/products">← Back to Products</router-link>
    </div>
    
    <template v-else>
      <div class="detail-header">
        <button class="back-btn" @click="goBack">← Back to Products</button>
        <div class="product-info">
          <span class="product-icon">{{ product.icon }}</span>
          <div>
            <h1>{{ product.name }}</h1>
            <p>{{ product.description }}</p>
          </div>
        </div>
      </div>
      
      <div class="modules-section">
        <h2 class="section-title">Modules</h2>
        
        <div class="modules-grid">
          <div 
            v-for="module in product.modules" 
            :key="module.id"
            class="module-card"
            :class="{ expanded: expandedModule === module.id }"
            @click="toggleModule(module.id)"
          >
            <div class="module-header">
              <span class="module-icon">{{ module.icon }}</span>
              <span class="module-name">{{ module.name }}</span>
              <span class="question-count">{{ module.questions.length }} questions</span>
            </div>
            
            <div class="questions-list" v-if="expandedModule === module.id" @click.stop>
              <div 
                v-for="question in module.questions" 
                :key="question.id"
                class="question-item"
                @click="askQuestion(question)"
              >
                <span class="question-icon">💬</span>
                <span class="question-title">{{ question.title }}</span>
                <span class="arrow">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script src="./product-detail.js"></script>
<style src="./product-detail.css"></style>
