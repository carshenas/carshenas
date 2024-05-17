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
      console.log(e)
    }
  }
  const addTestCategories = () => {
    // Sample categories
    const category1: Category = {
      id: 1,
      image: 'https://cdn-icons-png.flaticon.com/512/12124/12124149.png',
      name: 'Category 1',
      children: [
        {
          id: 11,
          image: 'https://cdn-icons-png.flaticon.com/512/12124/12124149.png',
          name: 'Subcategory 1.1'
        },
        {
          id: 12,
          image: 'https://cdn-icons-png.flaticon.com/512/12124/12124149.png',
          name: 'Subcategory 1.2'
        }
      ]
    }

    const category2: Category = {
      id: 2,
      image: 'https://cdn-icons-png.flaticon.com/512/12124/12124149.png',
      name: 'Category 2',
      children: [
        {
          id: 21,
          image: 'https://cdn-icons-png.flaticon.com/512/12124/12124149.png',
          name: 'Subcategory 2.1'
        },
        {
          id: 22,
          image: 'https://cdn-icons-png.flaticon.com/512/12124/12124149.png',
          name: 'Subcategory 2.2'
        }
      ]
    }

    // Push categories to the categories array
    categories.value.push(category1, category2)
  }

  // Initially load test categories when the store is created
  addTestCategories()
  return { categories, getCategories }
})
