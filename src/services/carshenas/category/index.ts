import carshenasService from '@/services'
import type { Category, CategoryFilter } from '@/types/dto/category'

export const getCategoryListService = (parameters?: CategoryFilter) =>
  carshenasService.get<Category[]>('/category', { parameters })

export const getMostViewedCategoriesService = () =>
  carshenasService.get<Category[]>('/category/most-viewed/')
