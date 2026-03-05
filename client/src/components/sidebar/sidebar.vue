<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Collapsed state - just hamburger -->
    <div class="collapsed-bar" v-if="isCollapsed">
      <button class="icon-btn" @click="$emit('toggle-sidebar')" title="Open sidebar">
        <span>☰</span>
      </button>
    </div>
    
    <!-- Expanded state - full sidebar -->
    <div class="sidebar-content" v-else>
      <div class="sidebar-top">
        <button class="icon-btn" @click="$emit('toggle-sidebar')" title="Close sidebar">
          ☰
        </button>
      </div>
      
      <div class="new-chat-section">
        <button class="new-chat-btn" @click="handleNewChat">
          + New Chat
        </button>
      </div>
      
      <div class="nav-section explore-section">
        <router-link to="/products" class="explore-btn">
          🧭 Explore Products
        </router-link>
      </div>

      <div class="nav-section history-section">
        <h3 class="section-title">CHAT HISTORY</h3>
        <ul class="nav-list">
          <li 
            v-for="chat in chats" 
            :key="chat._id"
            class="nav-item"
            :class="{ active: currentChatId === chat._id }"
          >
            <span class="chat-title" @click="$emit('select-chat', chat._id)">
              {{ chat.title || 'Untitled Chat' }}
            </span>
            <div class="chat-actions">
              <button class="chat-action-btn" @click.stop="$emit('rename-chat', chat._id)" title="Rename">
                ✏️
              </button>
              <button class="chat-action-btn delete" @click.stop="$emit('delete-chat', chat._id)" title="Delete">
                🗑️
              </button>
            </div>
          </li>
          <li v-if="!chats || chats.length === 0" class="nav-item empty">
            No chat history
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script src="./sidebar.js"></script>
<style src="./sidebar.css"></style>
