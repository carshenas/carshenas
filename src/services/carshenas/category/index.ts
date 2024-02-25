import carshenasService from '@/services'

export const getCategoryListService = () => carshenasService.get('/categories')
