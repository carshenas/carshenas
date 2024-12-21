<script setup lang="ts">
import { computed } from 'vue'
import EditProfileBottomSheet from './components/EditProfileBottomSheet.vue'
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'
import type { RouteLocationRaw } from 'vue-router'
import { useRouter } from 'vue-router'
import { useSnackbar } from '@/stores/snackbar'

const { user, wipeUserData } = useUserStore()
const { t } = useI18n()
const router = useRouter() // Use Vue Router to navigate

const name = computed(() =>
  user.firstName || user.lastName
    ? `${user.firstName} ${user.lastName}`
    : t('shared.noName')
)

const items: { title: string; 'prepend-icon': string; to: RouteLocationRaw }[] =
  [
    {
      title: t('user.orders'),
      'prepend-icon': 'source',
      to: { name: 'UserOrderPage' }
    },
    {
      title: t('user.addresses'),
      'prepend-icon': 'home',
      to: { name: 'UserAddressPage' }
    },
    {
      title: t('user.support'),
      'prepend-icon': 'support_agent',
      to: { name: 'UserSupportPage' }
    },
    {
      title: t('user.notification'),
      'prepend-icon': 'notifications',
      to: { name: 'UserNotificationPage' }
    }
  ]

const snackbarStore = useSnackbar()

const handleLogout = () => {
  wipeUserData()
  router.push({ name: 'HomePage' })

  snackbarStore.show(t('message.logoutSuccessfully'))
}
</script>

<template>
  <v-container class="h-100 d-flex flex-column">
    <div class="d-flex justify-space-between align-start">
      <div>
        <h1 class="title-md">{{ name }}</h1>
        <p class="label-md" style="letter-spacing: 0.2rem">
          {{ user.phoneNumber }}
        </p>
      </div>

      <EditProfileBottomSheet />
    </div>

    <hr class="my-2" />

    <v-list class="flex-grow-1">
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        v-bind="item"
        append-icon="navigate_before"
      ></v-list-item>
    </v-list>

    <v-btn variant="text" prepend-icon="exit_to_app" @click="handleLogout">
      {{ $t('user.logout') }}
    </v-btn>
  </v-container>
</template>
