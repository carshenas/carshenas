<!-- MenuSecondLevel.vue -->
<script setup lang="ts">
import { useCategoryStore } from '@/stores/category'
import { defineProps, computed } from 'vue'

const props = defineProps<{ selectedCategoryId: number | null }>()
const categoriesStore = useCategoryStore()

const subcategories = computed(() => {
  const selectedCategory = categoriesStore.categories.find(
    (category) => category.id === props.selectedCategoryId
  )
  return selectedCategory ? selectedCategory.children || [] : []
})
</script>

<template>
  <v-list v-if="props.selectedCategoryId">
    <v-list-item v-for="subcategory in subcategories" :key="subcategory.id">
      <template v-slot:prepend>
        <v-img
          :aspect-ratio="1"
          class="bg-white ml-4"
          :src="subcategory.image"
          width="24"
          cover
        ></v-img>
      </template>
      {{ subcategory.name }}
    </v-list-item>
  </v-list>
</template>
