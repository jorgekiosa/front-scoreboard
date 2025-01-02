import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import ScoreBoardLayout from '@/layouts/ScoreBoardLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import HomeView from '../views/HomeView.vue'
import WelcomeView from '../views/WelcomeView.vue'
import Dashboard from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import Broadcast from '@/components/broadcast.vue'
import Teste from '@/components/Teste.vue'
import Teste1 from '@/components/Teste1.vue'
import Teste2 from '@/components/Teste2.vue'
import Boards from '@/components/scoreboard/Boards.vue'
import Users from '@/components/users/Users.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes:[
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: '',
          name: 'auth',
          component: LoginView,
        }
      ],
    },
    {
      path: '/broadcast',
      component: ScoreBoardLayout,
      children: [
        {
          path: '',
          name: 'broadcast',
          component: Broadcast ,
        },
        {
          path: '/board',
          name: 'board',
          component: HomeView,
        },
      ],
    },
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: Dashboard,
        },
        {
          path: '/user',
          name: 'user',
          component: Users,
        },
        {
          path: '/boards',
          name: 'boards',
          component: Boards ,
        },
      ],
    },
  ]
})

export default router
