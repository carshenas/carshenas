import type PopularModel from '@/types/dto/popular-model'
import carshenasService from '@/services'

export const getPopularModelsService = () => carshenasService.get<PopularModel[]>('/brand/')
