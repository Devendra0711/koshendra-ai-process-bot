<template>
  <header class="main-header">
    <div class="header-left">
      <h1 class="app-title">Koshendra</h1>
      <span class="app-subtitle">Central Command of Your Resources</span>
    </div>
    <div class="header-right">
      <div class="profile-section">
        <div class="profile-avatar">{{ userInitial }}</div>
        <span class="profile-name">{{ userName }}</span>
        <button class="logout-btn" @click="$emit('logout')" title="Logout">
          ⎋
        </button>
      </div>
    </div>
  </header>
</template>

<script src="./app-header.js"></script>
<style src="./app-header.css"></style>
