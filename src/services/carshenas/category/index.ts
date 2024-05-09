import carshenasService from '@/services'
import type { Category, CategoryFilter } from '@/types/dto/category'

export const getCategoryListService = (parameters?: CategoryFilter) =>
  carshenasService.get<Category[], never>('/category', { parameters })
