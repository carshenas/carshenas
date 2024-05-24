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
      component: () => import('../views/search/IndexPage.vue'),
      meta: {
        contentOnly: true
      }
    },
    {
      path: '/product',
      name: 'ProductsPage',
      component: () => import('@/views/product/list/IndexPage.vue')
    },
    {
      path: '/product/:id(\\d+)',
      name: 'ProductDetailPage',
      component: () => import('@/views/product/DetailPage.vue')
    },
    {
      name: 'CartPage',
      path: '/cart',
      component: () => import('@/views/cart/IndexPage.vue')
    },
    {
      path: '/user/authentication',
      name: 'AuthPage',
      component: () => import('@/views/user/auth/IndexPage.vue')
    },
    {
      path: '/user',
      name: 'UserProfile',
      component: () => import('../views/user/IndexPage.vue')
    },
    {
      path: '/user/info',
      name: 'UserProfileInfo',
      component: () => import('../views/user/InfoPage.vue')
    },
    {
      path: '/user/addresses',
      name: 'UserProfileAddresses',
      component: () => import('../views/user/AddressesPage.vue')
    },
    {
      path: '/user/orders',
      name: 'UserProfileOrders',
      component: () => import('../views/user/OrdersPage.vue')
    },
    {
      path: '/user/car-support',
      name: 'UserProfileSupport',
      component: () => import('../views/user/SupportPage.vue')
    },
    {
      path: '/user/notifications',
      name: 'UserNotifications',
      component: () => import('../views/user/NotifPage.vue')
    }
  ]
})

export default router
