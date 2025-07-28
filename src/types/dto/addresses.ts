export interface Address {
  id: number
  name: string
  address: string
  postalCode: string
  latitude: number
  longitude: number
  isDefault: boolean
  receiverName?: string

}

export interface SendAddress {
  name: string
  address: string
  latitude: number
  longitude: number
  postalCode: string
  isDefault: boolean
  receiverName?: string
}
