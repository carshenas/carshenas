import carshenasService from '@/services'
import type { CategoryFilter } from '@/types/dto/category'

export const getCategoryListService = (parameters?: Record<string, string>) =>
  carshenasService.get('/categories', { parameters })
