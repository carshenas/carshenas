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
      component: () => import('../views/profile/IndexPage.vue')
    },
    {
      path: '/profile/info',
      name: 'userProfileInfo',
      component: () => import('../views/profile/InfoPage.vue')
    },
    {
      path: '/profile/addresses',
      name: 'userProfileAddresses',
      component: () => import('../views/profile/AddressesPage.vue')
    },
    {
      path: '/profile/orders',
      name: 'userProfileOrders',
      component: () => import('../views/profile/OrdersPage.vue')
    },
    {
      path: '/profile/support',
      name: 'userProfileSupport',
      component: () => import('../views/profile/SupportPage.vue')
    },
    {
      path: '/profile/notifications',
      name: 'userProfileSupport',
      component: () => import('../views/profile/NotifPage.vue')
    },
    {
      path: '/',
      name: 'HomePage',
      component: () => import('../views/home/IndexPage.vue')
    }
  ]
})

export default router
