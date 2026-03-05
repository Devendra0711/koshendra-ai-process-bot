<template>
  <div class="bottom-input-wrapper">
    <div class="bottom-input">
      <input
        ref="inputRef"
        :value="modelValue"
        type="text"
        placeholder="Ask a follow-up question..."
        @input="$emit('update:modelValue', $event.target.value)"
        @keyup.enter="handleSubmit"
      />
      <button 
        class="send-btn" 
        @click="handleSubmit" 
        :disabled="isLoading"
      >
        <span v-if="!isLoading">↑</span>
        <span v-else class="loading-spinner"></span>
      </button>
    </div>
  </div>
</template>
<script src = "./chat-input.js"></script>
<style src="./chat-input.css"></style>

