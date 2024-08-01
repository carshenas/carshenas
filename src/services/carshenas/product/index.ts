import carshenasService from '@/services'
import type { Product, ProductFilter } from '@/types/dto/product'

export const getProductListService = (parameters?: ProductFilter) =>
  carshenasService.get<Product[]>('/product', { parameters })

export const getProductDetailsService = (id: number) =>
  carshenasService.get<Product[]>(`/product/${id}`, {})
