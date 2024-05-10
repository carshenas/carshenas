<script lang="ts" setup>
import ImageLoader from '@/components/ImageLoader.vue'
import { useCategoryStore } from '@/stores/category'
import { onMounted } from 'vue'

const categoriesStore = useCategoryStore()

onMounted(() => categoriesStore.getCategories())
</script>

<template>
  <v-list-item
    v-for="category in categoriesStore.categories"
    :key="category.id"
    :title="category.name"
    append-icon="navigate_before"
  >
    <template #prepend>
      <!-- <ImageLoader :width="32" class="ml-2" /> -->
    </template>
  </v-list-item>
</template>
