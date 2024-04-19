import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: () => import('@/views/home/IndexPage.vue')
    },
    {
      path: '/search',
      name: 'SearchPage',
      component: () => import('@/views/search/IndexPage.vue')
    },
    {
      path: '/auth',
      name: 'AuthPage',
      component: () => import('@/views/profile/auth/IndexPage.vue')
    },
    {
      path: '/product',
      name: 'ProductsPage',
      component: () => import('@/views/product/ListPage.vue')
    },
    {
      path: '/product/:id(\\d+)',
      name: 'ProductDetailPage',
      component: () => import('@/views/product/DetailPage.vue')
    }
  ]
})

export default router
