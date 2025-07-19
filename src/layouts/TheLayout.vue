<script setup lang="ts">
import DefaultLayout from './DefaultLayout.vue'
import SimpleHeader from './SimpleHeader.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const component = computed(() => {
  if (route.meta && route.meta.layout === 'SimpleHeader') return SimpleHeader
  if (route.meta && route.meta.layout === false) return undefined
  else return DefaultLayout
})
</script>

<template>
  <teleport to="head">
    <link rel="manifest" href="/manifest.json">
  </teleport>
  <button id="install-button" style="display: none;
           position: fixed;
           bottom: 1rem;
           right: 1rem;
           padding: 0.5rem 1rem;
           background: #fb4847;
           color: white;
           border: none;
           border-radius: 4px;
           cursor: pointer;
               z-index: 10;">
    نصب اپلیکشن
  </button>
  <component :is="component" />
</template>
