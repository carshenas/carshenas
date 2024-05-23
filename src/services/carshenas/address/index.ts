import carshenasService from '@/services'
import type { LatLng, LatLngString } from '@/types/dto/the-map'

export const getAddressService = (lat: number, lng: number) =>
  carshenasService.get<LatLngString, never>(`user/location/${lat}/${lng}/`)
