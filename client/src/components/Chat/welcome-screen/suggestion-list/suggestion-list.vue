<template>
  <div class="suggestions-section">
    <div class="suggestions-label">Try searching these</div>
    <div class="suggestion-tags">
      <button
        v-for="(suggestion, index) in suggestions"
        :key="index"
        class="suggestion-tag"
        @click="$emit('select', suggestion)"
      >
        {{ suggestion }}
      </button>
    </div>
  </div>
</template>

<script src="./suggestion-list.js"></script>
<style src="./suggestion-list.css"></style>
