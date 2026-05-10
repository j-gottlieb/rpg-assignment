<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
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
  <header class="site-header">
    <div class="header-inner">
      <RouterLink to="/" class="site-title">Blog</RouterLink>
      <nav>
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

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.site-header {
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background);
  position: sticky;
  top: 0;
  z-index: 10;
}
.header-inner {
  max-width: 720px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.site-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-text);
}
nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  font-size: 0.9rem;
}
.username {
  font-weight: 500;
  color: var(--color-text);
}
.logout-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.2rem 0.7rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--color-text);
}
.logout-btn:hover {
  border-color: var(--color-border-hover);
}
main {
  flex: 1;
}
</style>
