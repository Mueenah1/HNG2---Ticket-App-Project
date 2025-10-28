import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '../services/authService'
import LandingView from '../views/LandingView.vue'
import AuthView from '../views/AuthView.vue'
import DashboardView from '../views/DashboardView.vue'
import TicketManagementView from '../views/TicketManagementView.vue'

const routes = [
  { path: '/', name: 'Landing', component: LandingView },
  { path: '/auth', name: 'Auth', component: AuthView, props: route => ({ mode: route.query.mode })},
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: DashboardView,
    meta: { requiresAuth: true } // Mark as protected
  },
  { 
    path: '/tickets', 
    name: 'Tickets', 
    component: TicketManagementView,
    meta: { requiresAuth: true } // Mark as protected
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// --- Navigation Guard for Security ---
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authService.isAuthenticated()) {
    // Redirect to login if not authenticated
    next({ name: 'Auth', query: { mode: 'login' } });
  } else {
    // Otherwise, proceed
    next();
  }
});

export default router