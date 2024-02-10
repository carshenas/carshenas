import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/search',
      name: 'SearchPage',
      component: () => import('../views/search/IndexPage.vue')
    },
    {
      path: '/product/list',
      name: 'ProductsPage',
      component: () => import('../views/product/ListPage.vue')
    },
    {
      path: '/landing',
      name: 'LandingPage',
      component: () => import('../views/landing/IndexPage.vue')
    }
  ]
})


export default router
