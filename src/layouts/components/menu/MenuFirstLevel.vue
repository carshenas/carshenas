<script lang="ts" setup>
import ImageLoader from '@/components/ImageLoader.vue'
</script>

<template>
  <v-list-item v-for="n in 10" :key="n" append-icon="navigate_before" title="Users">
    <template #prepend>
      <!-- <ImageLoader :width="32" class="ml-2" /> -->
    </template>
  </v-list-item>
</template>
