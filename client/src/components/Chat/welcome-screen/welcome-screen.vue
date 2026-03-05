<template>
  <div class="welcome-screen">
    <div class="welcome-content">
      <div class="sparkle-icon">✨</div>
      <h1>Welcome, {{ userName }}!</h1>
      <p class="subtitle">How can I help you today?</p>
      
      <div class="search-box">
        <input
          ref="inputRef"
          v-model="question"
          type="text"
          placeholder="Search anything..."
          @keyup.enter="handleSubmit"
          :disabled="isLoading"
        />
        <button 
          class="search-btn" 
          @click="handleSubmit"
          :disabled="isLoading || !question.trim()"
        >
          <span v-if="!isLoading">→</span>
          <span v-else class="loading-spinner"></span>
        </button>
      </div>

      <div class="suggestions">
        <p class="suggestions-title">Try searching these</p>
        <div class="suggestion-chips">
          <button 
            v-for="suggestion in suggestions" 
            :key="suggestion"
            class="chip"
            @click="selectSuggestion(suggestion)"
            :disabled="isLoading"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./welcome-screen.js"></script>
<style src="./welcome-screen.css"></style>