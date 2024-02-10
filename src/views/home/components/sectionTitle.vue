<script lang="ts" setup>
defineProps<{
  title: string
  buttonContent?: string
}>()
</script>

<template>
  <div class="d-flex justify-space-between align-center">
    <h2 class="title-sm">
      {{ title }}
    </h2>
    <v-btn variant="text">
      {{ buttonContent }}
    </v-btn>
  </div>
</template>

