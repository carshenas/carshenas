<script setup lang="ts">
import { computed, ref } from 'vue'
import MenuFirstLevel from './MenuFirstLevel.vue'

const isOpen = defineModel<boolean>()
const firstLevelSelectedId = ref<number>()

const component = computed(() => (firstLevelSelectedId.value ? 'MenuSecondLevel' : MenuFirstLevel))
</script>

<template>
  <v-navigation-drawer
    v-model="isOpen"
    location="start"
    name="menu"
    mobile-breakpoint="xxl"
    disable-resize-watcher
    disable-route-watcher
    absolute
  >
    <v-list>
      <component :is="component" />
    </v-list>
  </v-navigation-drawer>
</template>
