<script setup lang="ts">
import DefaultLayout from './DefaultLayout.vue'
import SimpleHeader from './SimpleHeader.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const component = computed(() => {
  if (route.meta && route.meta.layout === 'SimpleHeader') return SimpleHeader
  else return DefaultLayout
})
</script>

<template>
  <component :is="component" />
</template>
