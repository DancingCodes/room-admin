import { createRouter, createWebHistory } from 'vue-router'
import { hasToken } from './services/auth'
import DashboardView from './views/DashboardView.vue'
import LoginView from './views/LoginView.vue'
import RoomsView from './views/RoomsView.vue'
import VersionsView from './views/VersionsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView, meta: { public: true } },
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: DashboardView },
    { path: '/rooms', component: RoomsView },
    { path: '/versions', component: VersionsView },
  ],
})

router.beforeEach((to) => {
  if (!to.meta.public && !hasToken()) return '/login'
  if (to.meta.public && hasToken()) return '/dashboard'
})

export default router
