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
      path: '/profile',
      name: 'userProfile',
      component: () => import('../views/profile/indexPage.vue')
    },
    {
      path: '/profile/info',
      name: 'userProfileInfo',
      component: () => import('../views/profile/infoPage.vue')
    },
    {
      path: '/profile/addresses',
      name: 'userProfileAddresses',
      component: () => import('../views/profile/addressesPage.vue')
    },
    {
      path: '/profile/orders',
      name: 'userProfileOrders',
      component: () => import('../views/profile/ordersPage.vue')
    },
    {
      path: '/',
      name: 'HomePage',
      component: () => import('../views/home/IndexPage.vue')
    }
  ]
})

export default router
