<template>
  <div class="products-view">
    <div class="products-header">
      <h1>Explore Products</h1>
      <p class="subtitle">Select a product to explore its modules and documentation</p>
    </div>
    
    <div class="products-grid">
      <div 
        v-for="product in products" 
        :key="product.id"
        class="product-card"
        @click="goToProduct(product.id)"
      >
        <span class="product-icon">{{ product.icon }}</span>
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-description">{{ product.description }}</p>
        <span class="module-count">{{ product.modules.length }} modules</span>
      </div>
    </div>
  </div>
</template>

<script src="./products-view.js"></script>
<style src="./products-view.css"></style>
