import carshenasService from '@/services'
import type { LatLngString } from '@/types/dto/the-map'
import type { SendAddress, Address } from '@/types/dto/addresses'

export const getAddressService = (lat: number, lng: number) =>
  carshenasService.get<LatLngString, never>(`user/location/${lat}/${lng}/`)

export const sendAddressService = (body: SendAddress) =>
  carshenasService.post<
    {
      id: number
      name: string
      address: string
      postalCode: string
      latitude: number
      longitude: number
      is_default: boolean
    },
    SendAddress
  >('/user/location/', {
    body
  })

export const getAddressList = () => carshenasService.get<Address, never>(`user/location/`)

export const delAddress = (id: number) => carshenasService.del<any, any>(`user/location/${id}/`)