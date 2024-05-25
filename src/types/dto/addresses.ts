export interface Address {
  id: number
  name: string
  address: string
  postal_code: string
  latitude: number
  longitude: number
  is_default: boolean
}

export interface SendAddress extends FormData {
  name: string
  address: string
  postalCode: string
  latitude: number
  longitude: number
  is_default: boolean
}
