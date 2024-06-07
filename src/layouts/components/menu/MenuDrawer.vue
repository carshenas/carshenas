<!-- ParentComponent.vue -->

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MenuFirstLevel from './MenuFirstLevel.vue'
import MenuSecondLevel from './MenuSecondLevel.vue'
import { useCategoryStore } from '@/stores/category'
import type { Category } from '@/types/dto/category'

const categoryStore = useCategoryStore()

const isOpen = defineModel<boolean>()
const selectedFirstLevel = ref<number>()

const component = computed(() => (selectedFirstLevel.value ? MenuSecondLevel : MenuFirstLevel))

const items = computed((): Category[] => {
  if (!selectedFirstLevel.value) return categoryStore.categories
  else {
    const target = categoryStore.categories.find(
      (category) => category.id === selectedFirstLevel.value
    )!
    return target.children ? target.children : []
  }
})

const onClick = (...args: unknown[]): void => {
  selectedFirstLevel.value = args[0] as number
}

onMounted(() => categoryStore.getCategories())
</script>

<template>
  <v-navigation-drawer
    v-model="isOpen"
    :width="320"
    location="start"
    name="menu"
    mobile-breakpoint="xxl"
    disable-resize-watcher
    disable-route-watcher
    absolute
  >
    <component :is="component" :items @select="onClick" />
  </v-navigation-drawer>
</template>
