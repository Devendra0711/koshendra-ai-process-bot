<template>
  <div class="chat-menu">
    <button class="menu-item" @click="$emit('share', chat, index)">
      <span class="menu-icon">↗</span>
      <span>Share</span>
    </button>
    <button class="menu-item" @click="$emit('rename', chat, index)">
      <span class="menu-icon">✎</span>
      <span>Rename</span>
    </button>
    <button class="menu-item" @click="$emit('pin', chat, index)">
      <span class="menu-icon">📌</span>
      <span>{{ chat.pinned ? 'Unpin' : 'Pin' }}</span>
    </button>
    <button class="menu-item" @click="$emit('archive', chat, index)">
      <span class="menu-icon">📁</span>
      <span>Archive</span>
    </button>
    <button class="menu-item delete" @click="$emit('delete', chat, index)">
      <span class="menu-icon">🗑</span>
      <span>Delete</span>
    </button>
  </div>
</template>

<script src="./chat-menu.js"></script>
<style src="./chat-menu.css"></style>
