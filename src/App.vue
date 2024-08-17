<script setup lang="ts">
import TheLayout from '@/layouts/TheLayout.vue'
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { registerServiceWorker } from '@/composable/notification'

onMounted(() => {
  registerServiceWorker()
})
</script>

<template>
  <v-app>
    <TheLayout />

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
