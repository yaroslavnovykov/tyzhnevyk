import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import WelcomeView from '@/views/WelcomeView.vue';
import PhoneView from '@/views/auth/PhoneView.vue';
import VerifyView from '@/views/auth/VerifyView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import AppointmentsView from '@/views/AppointmentsView.vue';
import ServicesView from '@/views/ServicesView.vue';
import CalendarView from '@/views/CalendarView.vue';
import ConfirmView from '@/views/ConfirmView.vue';

// Provider routes
import ProviderLoginView from '@/views/provider/LoginView.vue';
import ProviderVerifyView from '@/views/provider/VerifyView.vue';
import ProviderDashboardView from '@/views/provider/DashboardView.vue';
import ProviderScheduleView from '@/views/provider/ScheduleView.vue';
import ProviderServicesView from '@/views/provider/ServicesView.vue';
import ProviderSettingsView from '@/views/provider/SettingsView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView
    },
    {
      path: '/phone',
      name: 'phone',
      component: PhoneView
    },
    {
      path: '/verify',
      name: 'verify',
      component: VerifyView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (!authStore.phoneNumber) {
          next('/phone');
        } else {
          next();
        }
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (!authStore.phoneNumber) {
          next('/phone');
        } else {
          next();
        }
      }
    },
    {
      path: '/appointments',
      name: 'appointments',
      component: AppointmentsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/services',
      name: 'services',
      component: ServicesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/calendar/:serviceId',
      name: 'calendar',
      component: CalendarView,
      meta: { requiresAuth: true }
    },
    {
      path: '/confirm',
      name: 'confirm',
      component: ConfirmView,
      meta: { requiresAuth: true }
    },

    // Provider routes
    {
      path: '/provider/login',
      name: 'provider-login',
      component: ProviderLoginView
    },
    {
      path: '/provider/verify',
      name: 'provider-verify',
      component: ProviderVerifyView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (!authStore.phoneNumber) {
          next('/provider/login');
        } else {
          next();
        }
      }
    },
    {
      path: '/provider/dashboard',
      name: 'provider-dashboard',
      component: ProviderDashboardView,
      meta: { requiresProviderAuth: true }
    },
    {
      path: '/provider/schedule',
      name: 'provider-schedule',
      component: ProviderScheduleView,
      meta: { requiresProviderAuth: true }
    },
    {
      path: '/provider/services',
      name: 'provider-services',
      component: ProviderServicesView,
      meta: { requiresProviderAuth: true }
    },
    {
      path: '/provider/settings',
      name: 'provider-settings',
      component: ProviderSettingsView,
      meta: { requiresProviderAuth: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/phone');
  } else if (to.meta.requiresProviderAuth && (!authStore.isAuthenticated || authStore.user?.role !== 'provider')) {
    next('/provider/login');
  } else {
    next();
  }
});

export default router;