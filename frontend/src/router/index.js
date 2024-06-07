import { createRouter, createWebHistory } from 'vue-router'
import { isAdmin, isTokenExpired } from '@/services/helpers';
import SignInView from '@/views/SignInView.vue';
import HomeView from '@/views/HomeView.vue'
import NewTripView from '@/views/NewTripView.vue'
import MyTripsView from '@/views/MyTripsView.vue'
import userAdministrationView from '@/views/UserAdministrationView.vue';
import SetPasswordView from '@/views/SetPasswordView.vue';
import FinanceAdministrationView from '@/views/FinanceAdministrationView.vue';
import ClosingAdministrationView from '@/views/ClosingAdministrationView.vue';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useMyTripsStore } from '@/stores/myTripsStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUserStore } from '@/stores/userStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signIn',
      name: 'signIn',
      component: SignInView
    },
    {
      path: '/setPassword',
      name: 'setPassword',
      component: SetPasswordView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/newTrip',
      name: 'newTrip',
      component: NewTripView,
      meta: {
        requiresAuth: true
      },
      props: route => ({ transport: route.query.transport, start: route.query.start, destination: route.query.destination, costs: route.query.costs, distance: route.query.distance, singleTrip: route.query.singleTrip, date: route.query.date, edit: Boolean(route.query.edit), favorite: Boolean(route.query.favorite), favoriteId: route.query.favoriteId, tripId: route.query.tripId })
    },
    {
      path: '/myTrips',
      name: 'myTrips',
      component: MyTripsView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/userAdministration',
      name: 'userAdministration',
      component: userAdministrationView,
      meta: {
        requiresAuth: true,
        requiresAdminRole: true
      }
    },
    {
      path: '/financeAdministration',
      name: 'financeAdministration',
      component: FinanceAdministrationView,
      meta: {
        requiresAuth: true,
        requiresAdminRole: true
      }
    },
    {
      path: '/closingAdministration',
      name: 'closingAdministration',
      component: ClosingAdministrationView,
      meta: {
        requiresAuth: true,
        requiresAdminRole: true
      }
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  if(to.meta.requiresAuth) {
    if(isTokenExpired()) {
      useUserStore().resetStore();
      useSettingsStore().resetStore();
      useFavoritesStore().resetStore();
      useMyTripsStore().resetStore();
      localStorage.removeItem('jwt');
      console.error('Session expired');
      return next('/signIn');
    }
  }
  if(to.meta.requiresAuth && to.meta.requiresAdminRole) {
    if(!isAdmin()) {
      console.error('Not authorized');
      return next('/');
    }
  }
  next();
})

export default router
