import carshenasService from '@/services'
import type { Product, ProductFilter } from '@/types/dto/product'

export const getProductListService = (parameters?: ProductFilter) =>
  carshenasService.get<Product[], never>('/product', { parameters })
