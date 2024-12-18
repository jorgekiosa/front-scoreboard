import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WelcomeView from '../views/WelcomeView.vue'
import StartServing from '@/components/StartServing.vue'
import Teste from '@/components/Teste.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/start-serving',
      name: 'StartServing',
      component: StartServing ,
    },
    {
      path: '/teste',
      name: 'teste',
      component: Teste ,
    },
  ],
})

export default router
