<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Log In</h1>
      <form @submit.prevent="submit">
        <div class="field">
          <label>Email</label>
          <input v-model="email" type="email" required autocomplete="email" />
        </div>
        <div class="field">
          <label>Password</label>
          <input v-model="password" type="password" required autocomplete="current-password" />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Logging in…' : 'Log In' }}
        </button>
      </form>
      <p class="switch">Don't have an account? <RouterLink to="/register">Register</RouterLink></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/')
  } catch (e: unknown) {
    error.value = (e as Error).message ?? 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 4rem;
  min-height: 60vh;
}
.auth-card {
  width: 100%;
  max-width: 380px;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
h1 { margin-bottom: 1.5rem; font-size: 1.5rem; }
.field { display: flex; flex-direction: column; margin-bottom: 1rem; }
.field label { margin-bottom: 0.25rem; font-size: 0.875rem; }
.field input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
button {
  width: 100%;
  padding: 0.6rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}
button:disabled { opacity: 0.6; cursor: not-allowed; }
.error { color: #e53e3e; font-size: 0.875rem; margin-bottom: 0.75rem; }
.switch { margin-top: 1rem; font-size: 0.875rem; text-align: center; }
</style>
