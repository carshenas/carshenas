export interface Address {
  id: number
  name: string
  address: string
  postal_code: string
  latitude: number
  longitude: number
  is_default: boolean
}

export interface SendAddress {
  name: string
  address: string
  latitude: number
  longitude: number
  postal_code: string
  is_default: boolean
}
