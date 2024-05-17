<script setup lang="ts">
import { useCategoryStore } from '@/stores/category'
import { defineProps, computed, ref } from 'vue'

// Define props
const props = defineProps<{ selectedCategoryId: number | null }>()

// Access the store
const categoriesStore = useCategoryStore()

// Reactive object to track the expanded/collapsed state of each subcategory
const expandedSubcategories = ref({})

// Computed property for subcategories
const subcategories = computed(() => {
  const selectedCategory = categoriesStore.categories.find(
    (category) => category.id === props.selectedCategoryId
  )
  return selectedCategory ? selectedCategory.children || [] : []
})
</script>

<template>
  <v-list-item-group>
    <v-list-group
      v-for="subcategory in subcategories"
      :key="subcategory.id"
      :value="subcategory.id"
    >
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" :title="subcategory.name">
          <template v-slot:prepend>
            <v-img
              :aspect-ratio="1"
              class="bg-white ml-4"
              :src="subcategory.image"
              width="24"
              cover
            ></v-img> </template
        ></v-list-item>
      </template>

      <v-list-item
        v-for="(child, index) in subcategory.children"
        :key="index"
        :title="child.name"
        :value="child.id"
      ></v-list-item>
    </v-list-group>
  </v-list-item-group>
</template>
