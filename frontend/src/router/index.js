import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import NewTripView from '@/views/NewTripView.vue'
import MyTripsView from '@/views/MyTripsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/newTrip',
      name: 'newTrip',
      component: NewTripView
    },
    {
      path: '/myTrips',
      name: 'myTrips',
      component: MyTripsView
    },
  ]
})

export default router
