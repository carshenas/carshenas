import type PopularModel from '@/types/dto/popular-model'
import carshenasService from '@/services'
import type { Brand } from '@/types/dto/brands'

export const getPopularModelsService = () => carshenasService.get<PopularModel[]>('/brand/')

export const getVehicleService = () => carshenasService.get<Brand[]>('/vehicle/')
