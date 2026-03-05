<template>
  <div class="search-wrapper">
    <div class="search-box">
      <input
        :value="modelValue"
        type="text"
        placeholder="Search anything..."
        @input="$emit('update:modelValue', $event.target.value)"
        @keyup.enter="$emit('submit')"
        :disabled="isLoading"
      />
      <button class="search-btn" @click="$emit('submit')" :disabled="isLoading">
        <span v-if="!isLoading">→</span>
        <span v-else class="loading-spinner"></span>
      </button>
    </div>
  </div>
</template>

<script src="./search-box.js"></script>
<style src="./search-box.css"></style>