import { createRouter, createWebHistory } from 'vue-router'
import product from './product'
import checkout from './checkout'
import user from './user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'HomePage',
      path: '/',
      component: () => import('@/views/home/IndexPage.vue')
    },
    {
      name: 'SearchPage',
      path: '/search',
      component: () => import('../views/search/IndexPage.vue'),
      meta: {
        layout: false
      }
    },
    product,
    checkout,
    user
  ]
})

export default router
