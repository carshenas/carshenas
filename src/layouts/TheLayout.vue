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
