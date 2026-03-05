<template>
  <teleport to="body">
    <div class="auth-overlay" v-if="isOpen">
      <div class="auth-modal">
        <button class="close-btn" @click="$emit('close')">×</button>
      
      <div class="auth-header">
        <h2>{{ isLogin ? 'Welcome Back' : 'Create Account' }}</h2>
        <p>{{ isLogin ? 'Sign in to continue' : 'Register to get started' }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <!-- Name field (Register only) -->
        <div class="form-group" v-if="!isLogin">
          <label for="name">Full Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Enter your name"
            required
          />
        </div>

        <!-- Email field -->
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <!-- Password field -->
        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input-wrapper">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              required
            />
            <button 
              type="button" 
              class="toggle-password-btn"
              @click="showPassword = !showPassword"
            >
              <span v-if="showPassword">Hide</span>
              <span v-else>Show</span>
            </button>
          </div>
        </div>

        <!-- Error message -->
        <div class="error-message" v-if="error">
          {{ error }}
        </div>

        <!-- Submit button -->
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          {{ isSubmitting ? 'Please wait...' : (isLogin ? 'Sign In' : 'Register') }}
        </button>
      </form>

      <!-- Toggle between login/register -->
      <div class="auth-footer">
        <p v-if="isLogin">
          Don't have an account? 
          <button class="toggle-btn" @click="toggleMode">Register</button>
        </p>
        <p v-else>
          Already have an account? 
          <button class="toggle-btn" @click="toggleMode">Sign In</button>
        </p>
      </div>
      </div>
    </div>
  </teleport>
</template><script src="./auth-modal.js"></script>
<style src="./auth-modal.css"></style>
