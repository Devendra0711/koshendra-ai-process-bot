<template>
  <div class="messages-container" ref="messagesContainer">
    <MessageItem 
      v-for="(msg, index) in messages" 
      :key="index"
      :message="msg"
    />

    <!-- Typing Indicator -->
    <div v-if="isLoading" class="message assistant">
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <div class="message-bubble typing">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script src = "./message-list.js"></script>
<style src = "./message-list.css"></style>
