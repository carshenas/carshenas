import carshenasService from '@/services'
import type { LatLngString } from '@/types/dto/the-map'
import type { SendAddress, Address } from '@/types/dto/addresses'

export const getAddressService = (lat: number, lng: number) =>
  carshenasService.get<LatLngString>(`user/location/${lat}/${lng}/`)

export const sendAddressService = (body: SendAddress) => {
  const formData = new FormData()
  formData.append('name', body.name)
  formData.append('address', body.address)
  formData.append('postal_code', body.postal_code)
  formData.append('latitude', body.latitude.toString())
  formData.append('longitude', body.longitude.toString())
  formData.append('is_default', body.is_default.toString())

  return carshenasService.post<{
    id: number
    name: string
    address: string
    postal_code: string
    latitude: number
    longitude: number
    is_default: boolean
  }>('/user/location/', {
    body: formData
  })
}

export const getAddressList = () => carshenasService.get<Address>(`user/location/`)

export const delAddress = (id: number) => carshenasService.delete(`user/location/${id}/`)
