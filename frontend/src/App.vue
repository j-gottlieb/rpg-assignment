<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const auth = useAuthStore()

function logout() {
  auth.clearAuth()
  router.push('/login')
}
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <template v-if="auth.isAuthenticated">
          <span class="username">{{ auth.user?.username }}</span>
          <button class="logout-btn" @click="logout">Log out</button>
        </template>
        <template v-else>
          <RouterLink to="/login">Log in</RouterLink>
          <RouterLink to="/register">Register</RouterLink>
        </template>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  border-bottom: 1px solid var(--color-border);
  padding: 0.75rem 2rem;
}
.wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.95rem;
}
nav a.router-link-exact-active {
  color: var(--color-text);
  font-weight: 600;
}
.username {
  color: var(--color-text);
  font-weight: 500;
}
.logout-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
}
</style>
