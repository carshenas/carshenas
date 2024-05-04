<script setup lang="ts">
import TheLayout from '@/layouts/TheLayout.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <TheLayout />

    <v-main >
      <RouterView />
    </v-main>
  </v-app>
</template>
