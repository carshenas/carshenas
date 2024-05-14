<!-- MenuFirstLevel.vue -->

<script setup lang="ts">
import { useCategoryStore } from '@/stores/category'
import { ref } from 'vue'

const categoriesStore = useCategoryStore()
const selectedCategoryId = ref<number | null>(null)
const emit = defineEmits(['categorySelected'])

const handleCategoryClick = (categoryId: number) => {
  selectedCategoryId.value = categoryId
  emit('categorySelected', categoryId)
}
</script>

<template>
  <v-list>
    <v-list-item

      v-for="category in categoriesStore.categories"
      :key="category.id"
      append-icon="navigate_before"
      @click="handleCategoryClick(category.id)"
      :title="category.name"
    >
      <template v-slot:prepend >
        <v-img :aspect-ratio="1" class="bg-white ml-4" :src="category.image" width="24" cover></v-img>
      </template>

    </v-list-item>
  </v-list>
</template>
