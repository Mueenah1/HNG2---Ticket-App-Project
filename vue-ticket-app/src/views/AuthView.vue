<script setup>
import { ref, watch, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authService } from '../services/authService';

const route = useRoute();
const router = useRouter();

const isLoginMode = ref(route.query.mode !== 'signup');
const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
});
const validationErrors = reactive({});
const error = ref(null);
const loading = ref(false);

// Watch for the route query to change and update the mode
watch(() => route.query.mode, (newMode) => {
  isLoginMode.value = newMode !== 'signup';
  error.value = null;
  Object.keys(validationErrors).forEach(key => delete validationErrors[key]);
});

const toggleMode = () => {
  const newMode = isLoginMode.value ? 'signup' : 'login';
  router.push({ name: 'Auth', query: { mode: newMode } });
};

const validate = () => {
  Object.keys(validationErrors).forEach(key => delete validationErrors[key]);
  
  if (!form.email) validationErrors.email = "Email is required.";
  else if (!/\S+@\S+\.\S+/.test(form.email)) validationErrors.email = "Email is invalid.";
  
  if (!form.password) validationErrors.password = "Password is required.";
  else if (form.password.length < 6) validationErrors.password = "Password must be at least 6 characters.";
  
  if (!isLoginMode.value) {
    if (!form.confirmPassword) validationErrors.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) validationErrors.confirmPassword = "Passwords do not match.";
  }
  return Object.keys(validationErrors).length === 0;
};

const handleSubmit = async () => {
  error.value = null;
  if (!validate()) return;

  loading.value = true;
  try {
    if (isLoginMode.value) {
      await authService.login(form.email, form.password);
    } else {
      await authService.signup(form.email, form.password);
    }
    // Auth guard will see we are authenticated, but we need to update
    // App.vue's state. A simple page refresh on redirect does this,
    // or we can push to dashboard.
    router.push('/dashboard');
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="form-container">
    <h2>{{ isLoginMode ? 'Log In' : 'Sign Up' }}</h2>
    <p>
      {{ isLoginMode ? "Don't have an account? " : "Already have an account? " }}
      <a href="#" @click.prevent="toggleMode">
        {{ isLoginMode ? 'Sign up' : 'Log in' }}
      </a>
    </p>

    <div v-if="error" class="toast toast-error" style="position: relative; bottom: auto; right: auto; margin: 1rem 0">
      {{ error }}
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="form.email" />
        <p v-if="validationErrors.email" class="form-error">{{ validationErrors.email }}</p>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="form.password" />
        <p v-if="validationErrors.password" class="form-error">{{ validationErrors.password }}</p>
      </div>
      <div v-if="!isLoginMode" class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" v-model="form.confirmPassword" />
        <p v-if="validationErrors.confirmPassword" class="form-error">{{ validationErrors.confirmPassword }}</p>
      </div>
      <button type="submit" class="btn btn-primary" style="width: 100%" :disabled="loading">
        {{ loading ? 'Submitting...' : (isLoginMode ? 'Login' : 'Create Account') }}
      </button>
    </form>
  </div>
</template>