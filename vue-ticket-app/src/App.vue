<script setup>
import { ref, watch } from 'vue';
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router';
import { authService } from './services/authService';

const router = useRouter();
const route = useRoute();
const isAuthenticated = ref(authService.isAuthenticated());

// Watch for route changes to update auth state (e.g., after login)
watch(() => route.path, () => {
  isAuthenticated.value = authService.isAuthenticated();
});

const handleLogout = () => {
  authService.logout();
  isAuthenticated.value = false;
  router.push('/');
};
</script>

<template>
  <header class="main-header">
    <div class="app-container">
      <RouterLink to="/" class="logo">TicketApp</RouterLink>
      <nav class="main-nav">
        <div class="auth-links">
          <template v-if="isAuthenticated">
            <RouterLink to="/dashboard">Dashboard</RouterLink>
            <RouterLink to="/tickets">Tickets</RouterLink>
            <button @click="handleLogout" class="btn btn-secondary">Logout</button>
          </template>
          <template v-else>
            <RouterLink to="/auth?mode=login">Login</RouterLink>
            <RouterLink to="/auth?mode=signup" class="btn btn-primary">Get Started</RouterLink>
          </template>
        </div>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>

  <footer v-if="route.path !== '/auth'" class="main-footer">
    <div class="app-container">
      &copy; {{ new Date().getFullYear() }} TicketApp. All rights reserved.
    </div>
  </footer>
</template>