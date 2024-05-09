import carshenasService from '@/services'

export const getPopularModelsService = () => carshenasService.get('/vehicle')
