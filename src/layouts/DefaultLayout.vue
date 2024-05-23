<script setup lang="ts">
import ImageLoader from '@/components/ImageLoader.vue'
import MenuDrawer from './components/menu/MenuDrawer.vue'
import { ref } from 'vue'

const isMenuOpen = ref<boolean>(false)
const isBasketOpen = ref<boolean>(false)

const openMenu = () => {
  isMenuOpen.value = !isMenuOpen.value

  if (isMenuOpen.value && isBasketOpen.value) isBasketOpen.value = false
}
</script>

<template>
  <div>
    <v-app-bar class="app-bar">
      <v-app-bar-nav-icon :icon="isMenuOpen ? 'close' : 'menu'" @click="openMenu" />

      <v-app-bar-title class="font-weight-bold">
        <router-link class="d-flex align-center" to="/">
          <ImageLoader
            src="@/assets/images/app/logo.svg"
            width="32"
            alt="carshenas logo"
            :types="['webp']"
          />

          <span class="title-md text-secondary">
            {{ $t('app.name') }}
          </span>
        </router-link>
      </v-app-bar-title>

      <template #append>
        <v-btn icon :to="{ name: 'CartPage' }">
          <v-icon icon="local_mall" />
        </v-btn>

        <v-btn variant="text" class="text-primary title-md" :to="{ name: 'AuthPage' }">
          {{ $t('auth.login') }}
        </v-btn>
      </template>
    </v-app-bar>

    <MenuDrawer v-model="isMenuOpen" />
  </div>
</template>
