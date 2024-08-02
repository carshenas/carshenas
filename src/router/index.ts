import { createRouter, createWebHistory } from 'vue-router'
import i18n from '@/plugins/i18n'

const { t } = i18n.global

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
        layout: false
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
      component: () => import('@/views/product/indexPage.vue')
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
      name: 'UserProfilePage',
      component: () => import('@/views/user/profile/IndexPage.vue'),
      meta: { layout: 'SimpleHeader', title: t('user.title') }
    },
    {
      path: '/user/addresses',
      name: 'UserAddressPage',
      component: () => import('@/views/user/addresses/IndexPage.vue')
    },
    {
      path: '/user/orders',
      name: 'UserOrderPage',
      component: () => import('@/views/user/orders/IndexPage.vue')
    },
    {
      path: '/user/car-support',
      name: 'UserSupportPage',
      component: () => import('@/views/user/support/IndexPage.vue')
    },
    {
      path: '/user/notifications',
      name: 'UserNotificationPage',
      component: () => import('@/views/user/notification/IndexPage.vue')
    }
  ]
})

export default router
