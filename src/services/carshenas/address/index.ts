import carshenasService from '@/services'
import type { LatLngString } from '@/types/dto/the-map'
import type { SendAddress, Address } from '@/types/dto/addresses'

export const getAddressService = (lat: number, lng: number) =>
  carshenasService.get<LatLngString>(`user/location/${lat}/${lng}/`)

export const sendAddressService = (body: SendAddress) => {
  const formData = new FormData()
  formData.append('name', body.name)
  formData.append('address', body.address)
  formData.append('postalCode', body.postalCode)
  formData.append('latitude', body.latitude.toString())
  formData.append('longitude', body.longitude.toString())
  formData.append('isDefault', body.isDefault.toString())

  return carshenasService.post<{
    id: number
    name: string
    address: string
    postalCode: string
    latitude: number
    longitude: number
    isDefault: boolean
  }>('/user/location/', {
    body: formData
  })
}

export const getAddressList = () => carshenasService.get<Address>(`user/location/`)

export const delAddress = (id: number) => carshenasService.delete(`user/location/${id}/`)
