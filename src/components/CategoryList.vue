<script lang="ts" setup>
import CategoryItem from '@/components/CategoryItem.vue'
import type Category from '@/types/dto/category'
import { ref, onMounted } from 'vue'

// Services
import { getCategoryListService } from '@/services/carshenas/products/category'

const loading = ref<boolean>(false)
const categories = ref<Category[]>([])

const getCategories = async () => {
  loading.value = true

  try {
    const response = await getCategoryListService()
    categories.value = response
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => getCategories())
</script>

<template>
  <v-row no-gutters>
    <v-col v-for="category in categories" :key="category.id" cols="3" class="pa-2">
      <CategoryItem v-bind="category" />
    </v-col>
  </v-row>
</template>
