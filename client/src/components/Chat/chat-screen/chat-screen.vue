<template>
  <div class="chat-screen">
    <!-- Messages -->
    <MessageList 
      :messages="messages"
      :isLoading="isLoading"
    />

    <!-- Bottom Input -->
    <ChatInput 
      v-model="question"
      :isLoading="isLoading"
      @submit="handleSubmit"
      @new-chat="$emit('new-chat')"
    />
  </div>
</template>

<script src="./chat-screen.js"></script>
<style src="./chat-screen.css"></style>