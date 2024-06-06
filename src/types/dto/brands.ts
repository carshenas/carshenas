export interface Vehicle {
  id: number
  name: string
  image: string
}

export interface Brand {
  id: number
  image: string
  name: string
  vehicles: Vehicle[]
}
