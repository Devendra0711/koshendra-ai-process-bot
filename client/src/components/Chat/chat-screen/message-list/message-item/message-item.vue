<template>
  <div class="message-item" :class="message.role">
    <!-- User Avatar -->
    <div class="message-avatar" v-if="message.role === 'user'">👤</div>
    
    <!-- AI Avatar -->
    <div class="message-avatar" v-if="message.role === 'assistant'">🤖</div>
    
    <div class="message-bubble" ref="bubbleRef">
      <div class="message-content" v-html="formattedContent"></div>
      
      <!-- Action buttons for AI responses -->
      <div class="message-actions" v-if="message.role === 'assistant'">
        <button class="action-btn" @click="copyResponse" :title="copied ? 'Copied!' : 'Copy'">
          {{ copied ? '✓' : '📋' }}
        </button>
        <button class="action-btn" @click="shareMessage" title="Share">
          🔗
        </button>
        <button 
          class="action-btn" 
          :class="{ active: feedback === 'up' }"
          @click="sendFeedback('up')"
          title="Helpful"
        >
          👍
        </button>
        <button 
          class="action-btn"
          :class="{ active: feedback === 'down' }"
          @click="sendFeedback('down')"
          title="Not helpful"
        >
          👎
        </button>
      </div>
    </div>
  </div>
</template>

<script src="./message-item.js"></script>
<style src="./message-item.css"></style>