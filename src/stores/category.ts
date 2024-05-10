import { defineStore } from 'pinia'
import { ref } from 'vue'

// Services
import { getCategoryListService } from '@/services/carshenas/category'

// type
import type { Category } from '@/types/dto/category'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>()

  const getCategories = async () => {
    if (categories.value && categories.value?.length) return

    try {
      const { data } = await getCategoryListService()
      categories.value = data
    } catch (e) {
      console.log(e)
    }
  }

  return { categories, getCategories }
})
