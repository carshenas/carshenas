<script setup lang="ts">
import TheLayout from '@/layouts/TheLayout.vue'
import { RouterView } from 'vue-router'
// import { onMounted } from 'vue'
// import { registerServiceWorker } from '@/composable/notification'
// import useAppConfig from '@/composable/app-config'
import GlobalSnackbar from './components/GlobalSnackbar.vue'

// const { appVersion } = useAppConfig()

// onMounted(() => {
//   console.log(`
// ===============================
// 🌟 Web App Version ${appVersion} 🌟
// ===============================
// `)
//   registerServiceWorker()
// })
</script>

<template>
  <v-app>
    <TheLayout />

    <v-main>
      <RouterView />

      <GlobalSnackbar />
    </v-main>
  </v-app>
</template>
