import { defineStore } from 'pinia'
import { ref } from 'vue'

// Services
import { getCategoryListService } from '@/services/carshenas/category'

// type
import type { Category } from '@/types/dto/category'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])

  const getCategories = async () => {
    if (categories.value && categories.value?.length) return

    try {
      const { data } = await getCategoryListService()

      categories.value = data
    } catch (e) {
      console.error(e)
    }
  }

  const filteredCategories = (categories: Category[], searchTerm: string): Category[] => {
    const results: Category[] = []

    categories.forEach((category) => {
      if (category.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push(category)
      }

      if (category.children) {
        const childResults = filteredCategories(category.children, searchTerm)
        results.push(...childResults)
      }
    })

    return results
  }

  return { categories, getCategories, filteredCategories }
})
