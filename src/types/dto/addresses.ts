export default interface Address {
  id: number
  address: string
  postalCode: string
  unit: number
  plaque: number
  position: {
    lat: number
    lng: number
  } | null
}
