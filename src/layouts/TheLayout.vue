<script setup lang="ts">
import DefaultLayout from './DefaultLayout.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const component = computed(() => (route.meta && route.meta.contentOnly ? undefined : DefaultLayout))
</script>

<template>
  <component :is="component" />
</template>

<style lang="scss" scoped>
.app-bar {
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.1) !important;
}
</style>
