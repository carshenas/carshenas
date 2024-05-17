<!-- ParentComponent.vue -->

<script setup lang="ts">
import { ref } from 'vue'
import MenuFirstLevel from './MenuFirstLevel.vue'
import MenuSecondLevel from './MenuSecondLevel.vue'

const isOpen = defineModel<boolean>()
const firstLevelSelectedId = ref<number | null>(null)
const handleClose = () => {
  firstLevelSelectedId.value = null
}
const handleCategorySelected = (categoryId: number) => {
  firstLevelSelectedId.value = categoryId
}
const handleBack = () => {
  firstLevelSelectedId.value = null
}
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
    @input="handleClose"
  >
    <v-toolbar color="white" height="42px" v-if="firstLevelSelectedId !== null">
      <v-btn
        icon="arrow_forward"
        variant="text"
        size="small"
        color="primary"
        @click="handleBack"
      ></v-btn>
    </v-toolbar>
    <v-list>
      <MenuFirstLevel
        v-if="firstLevelSelectedId === null"
        @category-selected="handleCategorySelected"
      />
      <MenuSecondLevel v-else :selectedCategoryId="firstLevelSelectedId" />
    </v-list>
  </v-navigation-drawer>
</template>
