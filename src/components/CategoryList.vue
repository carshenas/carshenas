<script lang="ts" setup>
import CategoryItem from '@/components/CategoryItem.vue'
import type { Category } from '@/types/dto/category'
import { ref, onMounted } from 'vue'

// Services
import { getCategoryListService } from '@/services/carshenas/category'

const props = defineProps<{
  items?: Category[]
}>()
const loading = ref<boolean>(false)
const categories = ref<Category[]>(props.items || [])

const getCategories = async () => {
  loading.value = true

  try {
    const response = await getCategoryListService()
    categories.value = response
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => (!categories.value ? getCategories() : undefined))
</script>

<template>
  <v-row no-gutters>
    <v-col v-for="category in categories" :key="category.id" cols="3" class="pa-2">
      <CategoryItem v-bind="category" />
    </v-col>
  </v-row>
</template>
